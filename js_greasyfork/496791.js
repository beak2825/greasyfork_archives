// ==UserScript==
// @name        WME WazeMY
// @namespace   https://www.github.com/junyian/
// @version     2026.01.29.1
// @author      junyianl <junyian@gmail.com>
// @source      https://github.com/junyian/wme-wazemy
// @license     MIT
// @match       *://www.waze.com/editor*
// @match       *://www.waze.com/*/editor*
// @require     https://greasyfork.org/scripts/24851-wazewrap/code/WazeWrap.js
// @require     https://greasyfork.org/scripts/449165-wme-wazemy-trafcamlist/code/wme-wazemy-trafcamlist.js
// @grant       GM_xmlhttpRequest
// @grant       GM.xmlHttpRequest
// @grant       unsafeWindow
// @connect     p3.fgies.com
// @connect     p4.fgies.com
// @connect     t2.fgies.com
// @connect     jalanow.com
// @connect     llm.gov.my
// @connect     venue-image.waze.com
// @connect     generativelanguage.googleapis.com
// @run-at      document-end
// @description WazeMY beta
// @downloadURL https://update.greasyfork.org/scripts/496791/WME%20WazeMY.user.js
// @updateURL https://update.greasyfork.org/scripts/496791/WME%20WazeMY.meta.js
// ==/UserScript==

/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/css-loader/dist/cjs.js!./node_modules/less-loader/dist/cjs.js!./src/style/main.less"
(module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/css-loader/dist/runtime/noSourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `.wazemySettings {
  border: 1px solid;
  padding: 8px;
  border-radius: 4px;
}
.wazemySettings legend {
  margin-bottom: 0px;
  border-bottom-style: none;
  width: auto;
}
.wazemySettings h6 {
  margin-bottom: 0px;
}
.wazemySettings input {
  margin-top: 0px;
}
#wazemyTooltip {
  height: auto;
  width: auto;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  border-radius: 4px;
  padding: 4px;
  position: absolute;
  top: 0px;
  left: 0px;
  visibility: hidden;
  z-index: 10000;
}
#wazemyPlaces_table {
  overflow-x: scroll;
}
#wazemyPlaces_venues {
  width: 95%;
  border: 1px solid;
}
#wazemyPlaces_venues th {
  border: 1px solid;
  background-color: #ccc;
}
#wazemyPlaces_venues td {
  border: 1px solid;
}
#wazemyURs_table {
  overflow-x: scroll;
}
#wazemyURs_list {
  width: 95%;
  border: 1px solid;
}
#wazemyURs_list th {
  border: 1px solid;
  background-color: #ccc;
}
#wazemyURs_list td {
  border: 1px solid;
}
.wazemyURs_row {
  cursor: pointer;
}
.wazemyURs_row:hover {
  background-color: #e8f4fc;
}
.wazemyURs_severity_low {
  background-color: #90EE90;
  text-align: center;
}
.wazemyURs_severity_medium {
  background-color: #FFD700;
  text-align: center;
}
.wazemyURs_severity_high {
  background-color: #FF6B6B;
  text-align: center;
}
`, ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ },

/***/ "./node_modules/css-loader/dist/runtime/api.js"
(module) {



/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
module.exports = function (cssWithMappingToString) {
  var list = [];

  // return the list of modules as css string
  list.toString = function toString() {
    return this.map(function (item) {
      var content = "";
      var needLayer = typeof item[5] !== "undefined";
      if (item[4]) {
        content += "@supports (".concat(item[4], ") {");
      }
      if (item[2]) {
        content += "@media ".concat(item[2], " {");
      }
      if (needLayer) {
        content += "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {");
      }
      content += cssWithMappingToString(item);
      if (needLayer) {
        content += "}";
      }
      if (item[2]) {
        content += "}";
      }
      if (item[4]) {
        content += "}";
      }
      return content;
    }).join("");
  };

  // import a list of modules into the list
  list.i = function i(modules, media, dedupe, supports, layer) {
    if (typeof modules === "string") {
      modules = [[null, modules, undefined]];
    }
    var alreadyImportedModules = {};
    if (dedupe) {
      for (var k = 0; k < this.length; k++) {
        var id = this[k][0];
        if (id != null) {
          alreadyImportedModules[id] = true;
        }
      }
    }
    for (var _k = 0; _k < modules.length; _k++) {
      var item = [].concat(modules[_k]);
      if (dedupe && alreadyImportedModules[item[0]]) {
        continue;
      }
      if (typeof layer !== "undefined") {
        if (typeof item[5] === "undefined") {
          item[5] = layer;
        } else {
          item[1] = "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {").concat(item[1], "}");
          item[5] = layer;
        }
      }
      if (media) {
        if (!item[2]) {
          item[2] = media;
        } else {
          item[1] = "@media ".concat(item[2], " {").concat(item[1], "}");
          item[2] = media;
        }
      }
      if (supports) {
        if (!item[4]) {
          item[4] = "".concat(supports);
        } else {
          item[1] = "@supports (".concat(item[4], ") {").concat(item[1], "}");
          item[4] = supports;
        }
      }
      list.push(item);
    }
  };
  return list;
};

/***/ },

/***/ "./node_modules/css-loader/dist/runtime/noSourceMaps.js"
(module) {



module.exports = function (i) {
  return i[1];
};

/***/ },

/***/ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js"
(module) {



var stylesInDOM = [];
function getIndexByIdentifier(identifier) {
  var result = -1;
  for (var i = 0; i < stylesInDOM.length; i++) {
    if (stylesInDOM[i].identifier === identifier) {
      result = i;
      break;
    }
  }
  return result;
}
function modulesToDom(list, options) {
  var idCountMap = {};
  var identifiers = [];
  for (var i = 0; i < list.length; i++) {
    var item = list[i];
    var id = options.base ? item[0] + options.base : item[0];
    var count = idCountMap[id] || 0;
    var identifier = "".concat(id, " ").concat(count);
    idCountMap[id] = count + 1;
    var indexByIdentifier = getIndexByIdentifier(identifier);
    var obj = {
      css: item[1],
      media: item[2],
      sourceMap: item[3],
      supports: item[4],
      layer: item[5]
    };
    if (indexByIdentifier !== -1) {
      stylesInDOM[indexByIdentifier].references++;
      stylesInDOM[indexByIdentifier].updater(obj);
    } else {
      var updater = addElementStyle(obj, options);
      options.byIndex = i;
      stylesInDOM.splice(i, 0, {
        identifier: identifier,
        updater: updater,
        references: 1
      });
    }
    identifiers.push(identifier);
  }
  return identifiers;
}
function addElementStyle(obj, options) {
  var api = options.domAPI(options);
  api.update(obj);
  var updater = function updater(newObj) {
    if (newObj) {
      if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap && newObj.supports === obj.supports && newObj.layer === obj.layer) {
        return;
      }
      api.update(obj = newObj);
    } else {
      api.remove();
    }
  };
  return updater;
}
module.exports = function (list, options) {
  options = options || {};
  list = list || [];
  var lastIdentifiers = modulesToDom(list, options);
  return function update(newList) {
    newList = newList || [];
    for (var i = 0; i < lastIdentifiers.length; i++) {
      var identifier = lastIdentifiers[i];
      var index = getIndexByIdentifier(identifier);
      stylesInDOM[index].references--;
    }
    var newLastIdentifiers = modulesToDom(newList, options);
    for (var _i = 0; _i < lastIdentifiers.length; _i++) {
      var _identifier = lastIdentifiers[_i];
      var _index = getIndexByIdentifier(_identifier);
      if (stylesInDOM[_index].references === 0) {
        stylesInDOM[_index].updater();
        stylesInDOM.splice(_index, 1);
      }
    }
    lastIdentifiers = newLastIdentifiers;
  };
};

/***/ },

/***/ "./node_modules/style-loader/dist/runtime/insertBySelector.js"
(module) {



var memo = {};

/* istanbul ignore next  */
function getTarget(target) {
  if (typeof memo[target] === "undefined") {
    var styleTarget = document.querySelector(target);

    // Special case to return head of iframe instead of iframe itself
    if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
      try {
        // This will throw an exception if access to iframe is blocked
        // due to cross-origin restrictions
        styleTarget = styleTarget.contentDocument.head;
      } catch (e) {
        // istanbul ignore next
        styleTarget = null;
      }
    }
    memo[target] = styleTarget;
  }
  return memo[target];
}

/* istanbul ignore next  */
function insertBySelector(insert, style) {
  var target = getTarget(insert);
  if (!target) {
    throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");
  }
  target.appendChild(style);
}
module.exports = insertBySelector;

/***/ },

/***/ "./node_modules/style-loader/dist/runtime/insertStyleElement.js"
(module) {



/* istanbul ignore next  */
function insertStyleElement(options) {
  var element = document.createElement("style");
  options.setAttributes(element, options.attributes);
  options.insert(element, options.options);
  return element;
}
module.exports = insertStyleElement;

/***/ },

/***/ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js"
(module, __unused_webpack_exports, __webpack_require__) {



/* istanbul ignore next  */
function setAttributesWithoutAttributes(styleElement) {
  var nonce =  true ? __webpack_require__.nc : 0;
  if (nonce) {
    styleElement.setAttribute("nonce", nonce);
  }
}
module.exports = setAttributesWithoutAttributes;

/***/ },

/***/ "./node_modules/style-loader/dist/runtime/styleDomAPI.js"
(module) {



/* istanbul ignore next  */
function apply(styleElement, options, obj) {
  var css = "";
  if (obj.supports) {
    css += "@supports (".concat(obj.supports, ") {");
  }
  if (obj.media) {
    css += "@media ".concat(obj.media, " {");
  }
  var needLayer = typeof obj.layer !== "undefined";
  if (needLayer) {
    css += "@layer".concat(obj.layer.length > 0 ? " ".concat(obj.layer) : "", " {");
  }
  css += obj.css;
  if (needLayer) {
    css += "}";
  }
  if (obj.media) {
    css += "}";
  }
  if (obj.supports) {
    css += "}";
  }
  var sourceMap = obj.sourceMap;
  if (sourceMap && typeof btoa !== "undefined") {
    css += "\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))), " */");
  }

  // For old IE
  /* istanbul ignore if  */
  options.styleTagTransform(css, styleElement, options.options);
}
function removeStyleElement(styleElement) {
  // istanbul ignore if
  if (styleElement.parentNode === null) {
    return false;
  }
  styleElement.parentNode.removeChild(styleElement);
}

/* istanbul ignore next  */
function domAPI(options) {
  if (typeof document === "undefined") {
    return {
      update: function update() {},
      remove: function remove() {}
    };
  }
  var styleElement = options.insertStyleElement(options);
  return {
    update: function update(obj) {
      apply(styleElement, options, obj);
    },
    remove: function remove() {
      removeStyleElement(styleElement);
    }
  };
}
module.exports = domAPI;

/***/ },

/***/ "./node_modules/style-loader/dist/runtime/styleTagTransform.js"
(module) {



/* istanbul ignore next  */
function styleTagTransform(css, styleElement) {
  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = css;
  } else {
    while (styleElement.firstChild) {
      styleElement.removeChild(styleElement.firstChild);
    }
    styleElement.appendChild(document.createTextNode(css));
  }
}
module.exports = styleTagTransform;

/***/ }

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/nonce */
/******/ 	(() => {
/******/ 		__webpack_require__.nc = undefined;
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};

// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js
var injectStylesIntoStyleTag = __webpack_require__("./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
var injectStylesIntoStyleTag_default = /*#__PURE__*/__webpack_require__.n(injectStylesIntoStyleTag);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/styleDomAPI.js
var styleDomAPI = __webpack_require__("./node_modules/style-loader/dist/runtime/styleDomAPI.js");
var styleDomAPI_default = /*#__PURE__*/__webpack_require__.n(styleDomAPI);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/insertBySelector.js
var insertBySelector = __webpack_require__("./node_modules/style-loader/dist/runtime/insertBySelector.js");
var insertBySelector_default = /*#__PURE__*/__webpack_require__.n(insertBySelector);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js
var setAttributesWithoutAttributes = __webpack_require__("./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js");
var setAttributesWithoutAttributes_default = /*#__PURE__*/__webpack_require__.n(setAttributesWithoutAttributes);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/insertStyleElement.js
var insertStyleElement = __webpack_require__("./node_modules/style-loader/dist/runtime/insertStyleElement.js");
var insertStyleElement_default = /*#__PURE__*/__webpack_require__.n(insertStyleElement);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/styleTagTransform.js
var styleTagTransform = __webpack_require__("./node_modules/style-loader/dist/runtime/styleTagTransform.js");
var styleTagTransform_default = /*#__PURE__*/__webpack_require__.n(styleTagTransform);
// EXTERNAL MODULE: ./node_modules/css-loader/dist/cjs.js!./node_modules/less-loader/dist/cjs.js!./src/style/main.less
var main = __webpack_require__("./node_modules/css-loader/dist/cjs.js!./node_modules/less-loader/dist/cjs.js!./src/style/main.less");
;// ./src/style/main.less

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (styleTagTransform_default());
options.setAttributes = (setAttributesWithoutAttributes_default());
options.insert = insertBySelector_default().bind(null, "head");
options.domAPI = (styleDomAPI_default());
options.insertStyleElement = (insertStyleElement_default());

var update = injectStylesIntoStyleTag_default()(main/* default */.A, options);




       /* harmony default export */ const style_main = (main/* default */.A && main/* default */.A.locals ? main/* default */.A.locals : undefined);

;// ./src/SettingsStorage.ts
class SettingsStorage {
    /**
     * Initializes a new instance of the SettingsStorage class with the specified storage key.
     *
     * @param {string} storageKey - The key used to store the settings in the local storage.
     */
    constructor(storageKey) {
        this.storageKey = storageKey;
    }
    /**
     * Saves the given settings to the local storage.
     *
     * @param {any} settings - The settings to be saved.
     * @return {void} This function does not return anything.
     */
    saveSettings(settings) {
        localStorage.setItem(this.storageKey, JSON.stringify(settings));
    }
    /**
     * Loads the settings from the local storage.
     *
     * @return {any} The loaded settings, or null if no settings are found.
     */
    loadSettings() {
        const settings = localStorage.getItem(this.storageKey);
        return settings ? JSON.parse(settings) : null;
    }
    /**
     * Updates a specific setting in the local storage.
     *
     * @param {string} key - The key of the setting to update.
     * @param {any} value - The new value for the setting.
     * @return {void} This function does not return anything.
     */
    updateSetting(key, value) {
        const settings = this.loadSettings() || {};
        settings[key] = { ...(settings[key] || {}), ...value };
        this.saveSettings(settings);
    }
    /**
     * Retrieves a specific setting from the local storage.
     *
     * @param {string} key - The key of the setting to retrieve.
     * @return {any} The value of the setting, or null if the setting is not found.
     */
    getSetting(key) {
        const settings = this.loadSettings();
        return settings ? settings[key] : null;
    }
    /**
     * Removes a specific setting from the local storage.
     *
     * @param {string} key - The key of the setting to remove.
     * @return {void} This function does not return anything.
     */
    removeSetting(key) {
        const settings = this.loadSettings();
        if (settings && key in settings) {
            delete settings[key];
            this.saveSettings(settings);
        }
    }
}
SettingsStorage.instance = new SettingsStorage("WME_wazemySettings");

;// ./src/plugins/PluginTooltip.ts


class PluginTooltip {
    constructor() {
        this.currentFeatureId = null;
        this.currentLayerName = null;
        this.sdk = unsafeWindow.getWmeSdk({
            scriptId: "wme-wazemy-tooltip",
            scriptName: "WazeMY",
        });
        this.initialize();
    }
    /**
     * Initializes the plugin by adding settings into the tab pane, setting the initial state of the settings based on the last stored value, and adding a hidden tooltip window.
     *
     * @return {void} This function does not return anything.
     */
    initialize() {
        // Add settings into tab pane.
        const settingsHTML = `<input type="checkbox" id="wazemySettings_tooltip_enable"/>
<label for="wazemySettings_tooltip_enable">Enable map tooltip</label>`;
        $("#wazemySettings_settings").append(settingsHTML);
        $("#wazemySettings_tooltip_enable").on("change", () => {
            PluginManager.instance.updatePluginSettings("tooltip", {
                enable: $("#wazemySettings_tooltip_enable").prop("checked"),
            });
        });
        // Set settings according to last stored value.
        const savedSettings = SettingsStorage.instance.getSetting("tooltip");
        if (savedSettings?.enable === true) {
            $("#wazemySettings_tooltip_enable").prop("checked", true);
        }
        else {
            $("#wazemySettings_tooltip_enable").prop("checked", false);
        }
        // Add hidden tooltip window.
        const tooltipHTML = `<div id="wazemyTooltip"></div>`;
        $(document.body).append(tooltipHTML);
        console.log("[WazeMY] PluginTooltip initialized.");
    }
    /**
     * Enables the PluginTooltip by registering the "mousemove" event, showing the tooltip, and logging a message.
     *
     * @return {void} This function does not return anything.
     */
    enable() {
        // Track layer events for segments and venues
        this.sdk.Events.trackLayerEvents({
            layerName: "segments",
        });
        this.sdk.Events.trackLayerEvents({
            layerName: "venues",
        });
        // Register handlers for mouse enter/leave events
        this.sdk.Events.on({
            eventName: "wme-layer-feature-mouse-enter",
            eventHandler: this.onFeatureMouseEnter.bind(this),
        });
        this.sdk.Events.on({
            eventName: "wme-layer-feature-mouse-leave",
            eventHandler: this.onFeatureMouseLeave.bind(this),
        });
        // Keep mouse move for positioning updates
        this.sdk.Events.on({
            eventName: "wme-map-mouse-move",
            eventHandler: this.updateTooltipPosition.bind(this),
        });
        $("#wazemyTooltip").show();
        console.log("[WazeMY] PluginTooltip enabled.");
    }
    /**
     * Disables the PluginTooltip by unregistering the "mousemove" event, hiding the tooltip, and logging a message.
     *
     * @return {void} This function does not return anything.
     */
    disable() {
        // Stop tracking layer events
        this.sdk.Events.stopLayerEventsTracking({
            layerName: "segments",
        });
        this.sdk.Events.stopLayerEventsTracking({
            layerName: "venues",
        });
        // Unregister event handlers
        this.sdk.Events.off({
            eventName: "wme-layer-feature-mouse-enter",
            eventHandler: this.onFeatureMouseEnter.bind(this),
        });
        this.sdk.Events.off({
            eventName: "wme-layer-feature-mouse-leave",
            eventHandler: this.onFeatureMouseLeave.bind(this),
        });
        this.sdk.Events.off({
            eventName: "wme-map-mouse-move",
            eventHandler: this.updateTooltipPosition.bind(this),
        });
        // Clear current feature state
        this.currentFeatureId = null;
        this.currentLayerName = null;
        $("#wazemyTooltip").hide();
        console.log("[WazeMY] PluginTooltip disabled.");
    }
    /**
     * Updates the settings of the PluginTooltip based on the provided settings object.
     *
     * @param {any} settings - The new settings object.
     * @return {void} This function does not return anything.
     */
    updateSettings(settings) {
        if (settings.enable === true) {
            this.enable();
        }
        else {
            this.disable();
        }
        console.log("[WazeMY] PluginTooltip settings updated.", settings);
    }
    /**
     * Handles mouse enter event on a feature.
     * Stores the feature ID and layer name for tooltip display.
     *
     * @param {Object} event - The event object containing featureId and layerName.
     * @return {void}
     */
    onFeatureMouseEnter(event) {
        this.currentFeatureId = event.featureId;
        this.currentLayerName = event.layerName;
    }
    /**
     * Handles mouse leave event on a feature.
     * Clears the stored feature information and hides the tooltip.
     *
     * @return {void}
     */
    onFeatureMouseLeave() {
        this.currentFeatureId = null;
        this.currentLayerName = null;
        $("#wazemyTooltip").css("visibility", "hidden");
    }
    /**
     * Updates the tooltip position and content based on the current hovered feature.
     *
     * @return {void} This function does not return anything.
     */
    updateTooltipPosition() {
        // If no feature is currently hovered, hide tooltip
        if (!this.currentFeatureId || !this.currentLayerName) {
            $("#wazemyTooltip").css("visibility", "hidden");
            return;
        }
        let output = "";
        // Build tooltip content based on layer type
        if (this.currentLayerName === "venues") {
            const venue = this.sdk.DataModel.Venues.getById({
                venueId: String(this.currentFeatureId),
            });
            output = venue.name ? `<b>${venue.name}</b><br>` : "";
            output += `<i>[${venue.categories.join(", ")}]</i><br>`;
            const venueAddress = this.sdk.DataModel.Venues.getAddress({
                venueId: String(this.currentFeatureId),
            });
            output += venueAddress.houseNumber ? `${venueAddress.houseNumber}, ` : "";
            output += venueAddress.street?.name
                ? `${venueAddress.street.name}<br>`
                : "";
            if (venueAddress.city?.name && venueAddress.state?.name) {
                output += `${venueAddress.city.name}, ${venueAddress.state.name}<br>`;
            }
            output += `<b>Lock:</b> ${venue.lockRank + 1}`;
        }
        else if (this.currentLayerName === "segments") {
            const segmentData = this.sdk.DataModel.Segments.getById({
                segmentId: Number(this.currentFeatureId),
            });
            const address = this.sdk.DataModel.Segments.getAddress({
                segmentId: Number(this.currentFeatureId),
            });
            output = address.street?.name ? `<b>${address.street.name}</b><br>` : "";
            const altStreets = address.altStreets;
            for (let i = 0; i < altStreets.length; i++) {
                const altStreetName = altStreets[i].street?.name;
                if (altStreetName) {
                    output += `Alt: ${altStreetName}<br>`;
                }
            }
            if (address.city?.name && address.state?.name) {
                output += `${address.city.name}, ${address.state.name}<br>`;
            }
            output += `<b>ID:</b> ${this.currentFeatureId}<br>`;
            if (segmentData.isTwoWay) {
                output += `<b>Direction:</b> Two way<br>`;
            }
            else if (segmentData.isAtoB) {
                output += `<b>Direction:</b> A -> B<br>`;
            }
            else if (segmentData.isBtoA) {
                output += `<b>Direction:</b> B -> A<br>`;
            }
            output += `<b>Lock:</b> ${segmentData.lockRank + 1}`;
        }
        // Update tooltip position based on mouse coordinates
        const tooltipDiv = $("#wazemyTooltip");
        const positions = document
            .querySelector(".wz-map-ol-control-span-mouse-position")
            .innerHTML.split(" ");
        const lat = parseFloat(positions[0]);
        const lon = parseFloat(positions[1]);
        if (lat >= 0 && lon >= 0) {
            const pixel = this.sdk.Map.getPixelFromLonLat({
                lonLat: {
                    lat: parseFloat(positions[0]),
                    lon: parseFloat(positions[1]),
                },
            });
            const tw = tooltipDiv.innerWidth();
            const th = tooltipDiv.innerHeight();
            let tooltipX = pixel.x + window.scrollX + 15;
            let tooltipY = pixel.y + window.scrollY + 15;
            // Handle cases where tooltip is too near the edge
            const mapElement = this.sdk.Map.getMapViewportElement();
            if (tooltipX + tw > mapElement.offsetWidth) {
                tooltipX -= tw + 20; // 20 = scroll bar size
                if (tooltipX < 0) {
                    tooltipX = 0;
                }
            }
            if (tooltipY + th > mapElement.offsetHeight) {
                tooltipY -= th + 20;
                if (tooltipY < 0) {
                    tooltipY = 0;
                }
            }
            tooltipDiv.html(output);
            tooltipDiv.css("top", `${tooltipY}px`);
            tooltipDiv.css("left", `${tooltipX}px`);
            tooltipDiv.css("visibility", "visible");
        }
    }
}

;// ./src/plugins/PluginCopyLatLon.ts
class PluginCopyLatLon {
    constructor() {
        this.sdk = unsafeWindow.getWmeSdk({
            scriptId: "wme-wazemy-copylatlon",
            scriptName: "WazeMY",
        });
        this.initialize();
    }
    /**
     * Initialize plugin.
     *
     * @return {void} This function does not return anything.
     */
    initialize() {
        const settingsHTML = `<div>Ctrl+Alt+C: <i>Copy lat/lon of mouse position to clipboard.</i></div>`;
        $("#wazemySettings_shortcuts").append(settingsHTML);
        this.enable(); // Manually enable plugin since there is no settings to trigger this.
        console.log("[WazeMY] PluginCopyLatLon initialized.");
    }
    /**
     * Enable plugin.
     *
     * @return {void} This function does not return anything.
     */
    enable() {
        const shortcut = {
            callback: this.copyLatLon,
            description: "Copy lat/lon of mouse position to clipboard.",
            shortcutId: "WazeMY_latloncopy",
            shortcutKeys: "CA+c",
        };
        this.sdk.Shortcuts.createShortcut(shortcut);
        console.log("[WazeMY] PluginCopyLatLon enabled.");
    }
    /**
     * Disable plugin.
     *
     * @return {void} This function does not return anything.
     */
    disable() {
        console.log("[WazeMY] PluginCopyLatLon disabled.");
    }
    /**
     * Updates the settings of the PluginCopyLatLon based on the provided settings object.
     *
     * @return {void} This function does not return anything.
     */
    updateSettings(settings) {
        console.log("[WazeMY] PluginCopyLatLon settings updated.", settings);
    }
    /**
     * Copies lat/lon of mouse position to clipboard.
     *
     * @return {void} This function does not return anything.
     */
    copyLatLon() {
        console.log("[WazeMY] Copy lat/lon shortcut triggered.");
        const latlon = $(".wz-map-ol-control-span-mouse-position").text();
        navigator.clipboard.writeText(latlon);
    }
}

;// ./src/plugins/PluginTrafficCameras.ts


class PluginTrafficCameras {
    constructor() {
        this.sdk = unsafeWindow.getWmeSdk({
            scriptId: "wme-wazemy-trafcam",
            scriptName: "WazeMY",
        });
        this.initialize();
    }
    initialize() {
        // Add settings into view.
        const settingsHTML = `<div>
      <input type="checkbox" id="wazemySettings_trafcam_enable" style="margin-top:0px"/>
      <label for="wazemySettings_trafcam_enable">Traffic cameras</label><br></div>`;
        const wazemySettings = document.getElementById("wazemySettings_settings");
        $("#wazemySettings_settings").append(settingsHTML);
        // wazemySettings.insertAdjacentHTML("afterbegin", settingsHTML);
        const settingsEl = document.getElementById(`wazemySettings_trafcam_enable`);
        const savedSettings = SettingsStorage.instance.getSetting("trafcam");
        if (savedSettings?.enable === true) {
            settingsEl.checked = true;
        }
        else {
            settingsEl.checked = false;
        }
        settingsEl.onchange = (e) => {
            const target = e.target;
            PluginManager.instance.updatePluginSettings("trafcam", {
                enable: target.checked,
            });
        };
        // Install camera icon
        if (!OpenLayers.Icon) {
            this.installIconClass();
        }
        this.trafcamLayer = new OpenLayers.Layer.Markers("wazemyTrafcamLayer");
        W.map.addLayer(this.trafcamLayer);
        this.showIcons();
        console.log("PluginTrafficCameras initialized.");
    }
    enable() {
        console.log("PluginTrafficCameras enabled.");
        this.trafcamLayer.setVisibility(true);
    }
    disable() {
        console.log("PluginTrafficCameras disabled.");
        this.trafcamLayer.setVisibility(false);
    }
    updateSettings(settings) {
        if (settings.enable === true) {
            this.enable();
        }
        else {
            this.disable();
        }
        console.log("PluginTrafficCameras settings updated", settings);
    }
    installIconClass() {
        OpenLayers.Icon = OpenLayers.Class({
            url: null,
            size: null,
            offset: null,
            calculateOffset: null,
            imageDiv: null,
            px: null,
            initialize: function (url, size, offset, calculateOffset) {
                this.url = url;
                this.size = size || { w: 20, h: 20 };
                this.offset = offset || {
                    x: -(this.size.w / 2),
                    y: -(this.size.h / 2),
                };
                this.calculateOffset = calculateOffset;
                url = OpenLayers.Util.createUniqueID("OL_Icon_");
                const div = (this.imageDiv = OpenLayers.Util.createAlphaImageDiv(url));
                $(div.firstChild).removeClass("olAlphaImg"); // LEAVE THIS LINE TO PREVENT WME-HARDHATS SCRIPT FROM TURNING ALL ICONS INTO HARDHAT WAZERS --MAPOPMATIC
            },
            destroy: function () {
                this.erase();
                OpenLayers.Event.stopObservingElement(this.imageDiv.firstChild);
                this.imageDiv.innerHTML = "";
                this.imageDiv = null;
            },
            clone: function () {
                return new OpenLayers.Icon(this.url, this.size, this.offset, this.calculateOffset);
            },
            setSize: function (size) {
                null !== size && (this.size = size);
                this.draw();
            },
            setUrl: function (url) {
                null !== url && (this.url = url);
                this.draw();
            },
            draw: function (a) {
                OpenLayers.Util.modifyAlphaImageDiv(this.imageDiv, null, null, this.size, this.url, "absolute");
                this.moveTo(a);
                return this.imageDiv;
            },
            erase: function () {
                null !== this.imageDiv &&
                    null !== this.imageDiv.parentNode &&
                    OpenLayers.Element.remove(this.imageDiv);
            },
            setOpacity: function (a) {
                OpenLayers.Util.modifyAlphaImageDiv(this.imageDiv, null, null, null, null, null, null, null, a);
            },
            moveTo: function (a) {
                null !== a && (this.px = a);
                null !== this.imageDiv &&
                    (null === this.px
                        ? this.display(!1)
                        : (this.calculateOffset &&
                            (this.offset = this.calculateOffset(this.size)),
                            OpenLayers.Util.modifyAlphaImageDiv(this.imageDiv, null, {
                                x: this.px.x + this.offset.x,
                                y: this.px.y + this.offset.y,
                            })));
            },
            display: function (a) {
                this.imageDiv.style.display = a ? "" : "none";
            },
            isDrawn: function () {
                return (this.imageDiv &&
                    this.imageDiv.parentNode &&
                    11 != this.imageDiv.parentNode.nodeType);
            },
            CLASS_NAME: "OpenLayers.Icon",
        });
    }
    showIcons() {
        trafficCamsData.forEach((e, idx) => {
            this.drawCamIcon({
                idx: idx,
                desc: e.desc,
                src: e.url,
                width: 20,
                height: 20,
                lat: e.lat,
                lon: e.lon,
            });
        });
    }
    drawCamIcon(spec) {
        const camIcon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAAGXcA1uAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA2ZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYxIDY0LjE0MDk0OSwgMjAxMC8xMi8wNy0xMDo1NzowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDpBRDNGNTkwRTYzQThFMzExQTc4MDhDNjAwODdEMzdEQSIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo2OUI0RUEyN0IwRjcxMUUzOERFM0E1OTJCRUY3NTFBOCIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo2OUI0RUEyNkIwRjcxMUUzOERFM0E1OTJCRUY3NTFBOCIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M1LjEgV2luZG93cyI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjZGOEJBMzExNkZCMEUzMTFCOEY5QTU3QUQxM0M2MjI5IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOkFEM0Y1OTBFNjNBOEUzMTFBNzgwOEM2MDA4N0QzN0RBIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+TV0cjwAABbhJREFUeNpiYIAAXiZGCIMPiP//f8DwnwnI+PT/HZD8y8AAEEBQVQzTwOSfuwz/u6qAyh4y/Gf8f4/hPwMnUJSZgQEggMCyzpZAmbsILMTHcAokPhPEWT8dqJoBgvetAtMMDBIiDCf/P4bqeMXwf+t8BiOAAGJAAqVA7A1iPH/+goFBT4OB8f9LJDueAzFQgOHGLoTZYEGgpJgww0+G/68ZQArAEsryEHpRN5BuK4FIcHMhjJORVTvBYG3MwPD2CkKwKAVI/3nBABBAYOcY6zKAjGSQEmP4cGkXxMlgK4BeaCll+B/lzzDh/yegmr8vIO4HGv/l/0eG/w4WDP9fnUM4Dhl/uMzwf/6CFQ4g9RUgE3ctRvgGGSvJMfw/tw3i7sY8hv8sQMGrQE8yuFoBZe8CeRwMDIKaDAyWRgwM2xYD+exA/AuIvwAV3kaE6sSPQCuBHv2vqczwf0YL0MR7SE4CsgsTGP5///aSCZQSGDRVGPJfv2dgNDNkcP30heHbB6BpyzYyMCRVMjCwqDIcOX+LgTEtioGRhfn/P4AAbJTfK0NhGMe/Z+ecpVkrScnIlCiWkoulpFyhxgXKXCGK3XGBG/4BJcoNN665tqsxo6XshiKtyQybn82vMZPF63nPOXKYi+fieU7P8z59P9/n6NlBVNrRRDFPMUlRIGhmM0gWzk5NSCFMuDE2MqAaUJGUhDgOgNmKkXmLwMRudA11diynI9lSKhEHG+oBu9q1mHkDf9AWWkM0dgHEb4H+PqqkKD51uxpJuSoDHpIfAowyohyUveJH+9pqUjigav/9UnIfzO/frkRvBxUuwcpK/gc3PkzfzynuwRoanYuStZDKaeAkwA8QEPJ/CYfpBUCmqxp1E7uXJ6u0tUNVQbvIR+DIBzgHgQMvrZ5LZWIiSuowh6N+nQ9ZYgnNcLTzdRBsz5Ot1socWCr1KipYulrJVDIQjqjwgqsESvcPQB5QWmP2nsWem5X80IeizhaadPfHQwTxnXJTDk5ZQgeOOCC0ScY0wtPdRrc4AzY7BVZuQ8bVDhcXJLyhNnwJUFj5hTQVhmH8mQ7H5nYYkRxJw8hqBWYsLIr+gisKYobdjKguClOKLiQvgrrwqogiIr1wECHdRCCjIopNiCKZIGkthysrrWSklg36M6O5fT3fzmk7C8kDL4zt2/neP8/ze01/b6XuceWsVmAJJR56gurObjSn0/DWrEY152SmIyFBNk1sxZhBZAQTyVmEDjeiy9eAQdm4FK1gLlHg8Y3CYlXzZW12A1+GYd1Yi1u1LogXQSYgmxdnjM8jsTFNZvLMxADE3h0QS8vxNNqLJWKa2ZMXBRXwaaNmL/XdoUct+hhtjF+MFBZ+zJq5Gw6ywoRyI/xs/JjJtCj38+XWo3rGdM6pI3nlqYshmmiGx7fJpLE8rAqGZQy+49o5CNeauoeplJZZPbWfztqSWurvmV/ixrCXQjRSFQE/xI8R/dK44VJae99OorWt/Xh2tZxp0Q+903zynX/q6YLwevgy28IXyiBYxCY3cXYeIvGGRL0Isc697Z5k0NRMQj8Grd92zuDALuAuIRm8CVSohe1uYZ+T74FwADjdBFBh6GgH+mm3ZuLDSb9Ocg9YLNYZOeSyUitevupFeWWVTlzjQ0dNfQJW1fOybulPWlmyZ85wpshQC43/m+9YsR2ZTn9wg5z955+z2FO3H0PRIIqcHHzgPpAgNukwOJzAwCB3NiFQxsyyjJ37J4lMXklpfnaRyidaO3xe7+6h3JmVy2CjkcInD3EO3/T1xsFn3mobX0z+RzkfNAxcpXrIjo+RkFKp0VLkk1hfwwqJr69RODxbcH05gem/wIEN62TV13XuMxNIvqYYqCT6R6x14UHsEarkwhBxJbtnC4wmS9fXDuT2stFkxIDsp4tfbZU5MCr0jnMbIMLoKy7Gc8WunU3rxHMoCmKxUaiqij/5alOWhMPoGAAAAABJRU5ErkJggg==";
        const size = new OpenLayers.Size(20, 20);
        const icon = new OpenLayers.Icon(camIcon, size);
        const epsg4326 = new OpenLayers.Projection("EPSG:4326"); // WGS 1984 projection
        const webMercator = new OpenLayers.Projection("EPSG:900913"); // Web Mercator projection used by WME
        const lonLat = new OpenLayers.LonLat(spec.lon, spec.lat).transform(epsg4326, webMercator);
        const newMarker = new OpenLayers.Marker(lonLat, icon);
        newMarker.idx = spec.idx;
        newMarker.title = spec.desc;
        newMarker.url = spec.src;
        newMarker.width = spec.width;
        newMarker.height = spec.height;
        newMarker.location = lonLat;
        newMarker.events.register("click", newMarker, this.popupCam);
        this.trafcamLayer.addMarker(newMarker);
    }
    popupCam(e) {
        popupCam_close(); // Close existing popup if already opened.
        var popupHTML = `<div id="gmPopupContainerCam" style="margin:1;text-align:center;padding:5px;z-index:1100;position:absolute;color:white;background:rgba(0,0,0,0.5)">
            <table border=0>
                <tr>
                    <td><div id="mycamdivheader" style="min-height:20px;white-space:pre-wrap;white-space:-moz-pre-wrap;white-space:-pre-wrap;white-space:-o-pre-wrap;word-wrap:break-word;width:380px">${e.object.title}</div></td>
                    <td align="right"><a href="#close" id="gmCloseCamDlgBtn" title="Close" style="color:red">X</a></td>
                </tr>
                <tr><td colspan=2>Select source:
                    <select id="wazemy_camSource">
                    </select>
                    <div hidden id="mycamid">${e.object.idx}</div>
                </td></tr>
                <tr><td colspan=2><img style="width:400px" id="staticimage"></td></tr>
                <tr><td colspan=2><div id="mycamstatus"></div></td></tr>
            </table></div>`;
        document.body.insertAdjacentHTML("afterbegin", popupHTML);
        // Get SDK instance for map viewport
        const sdk = unsafeWindow.getWmeSdk({
            scriptId: "wme-wazemy-trafcam",
            scriptName: "WazeMY",
        });
        // Handle cases where popup is too near the edge.
        let tw = $("#gmPopupContainerCam").width();
        let th = $("#gmPopupContainerCam").height() + 200;
        var tooltipX = e.clientX + window.scrollX + 15;
        var tooltipY = e.clientY + window.scrollY + 15;
        const mapElement = sdk.Map.getMapViewportElement();
        if (tooltipX + tw > mapElement.offsetWidth) {
            tooltipX -= tw + 20; // 20 = scroll bar size
            if (tooltipX < 0)
                tooltipX = 0;
        }
        if (tooltipY + th > mapElement.offsetHeight) {
            tooltipY -= th + 20;
            if (tooltipY < 0)
                tooltipY = 0;
        }
        $("#gmPopupContainerCam").css({ left: tooltipX });
        $("#gmPopupContainerCam").css({ top: tooltipY });
        //Add listener for popup's "Close" button
        const closeBtn = document.getElementById("gmCloseCamDlgBtn");
        closeBtn.onclick = popupCam_close;
        // Allow popup to be draggable.
        const popupContainerEl = document.getElementById("gmPopupContainerCam");
        popup_dragElement(popupContainerEl);
        const camSourceEl = document.getElementById("wazemy_camSource");
        for (let urlsrc in e.object.url) {
            if (urlsrc === "LLM" && e.object.url["LLM"].split("|").length == 2) {
                popup_appendOption(urlsrc);
            }
            else if (urlsrc === "Jalanow") {
                popup_appendOption(urlsrc);
            }
        }
        camSourceEl.onchange = (e) => {
            console.log("PluginTrafficCameras: Camera source selection changed.");
            const camId = document.getElementById("mycamid");
            const target = e.target;
            switch (target.selectedOptions[0].innerText) {
                case "Jalanow":
                    popup_getJalanowImage(trafficCamsData[camId.innerText]["url"]["Jalanow"]);
                    break;
                case "LLM":
                    popup_getLLMImage(trafficCamsData[camId.innerText]["url"]["LLM"]);
                    break;
            }
        };
        // Get image for the first time when popup is displayed.
        switch (Object.keys(e.object.url)[0]) {
            case "Jalanow":
                popup_getJalanowImage(e.object.url["Jalanow"]);
                break;
            case "LLM":
                popup_getLLMImage(e.object.url["LLM"]);
                break;
        }
        function popupCam_close() {
            const popupContainerEl = document.getElementById("gmPopupContainerCam");
            if (popupContainerEl) {
                popupContainerEl.remove();
                popupContainerEl.hidden = true;
            }
        }
        function popup_dragElement(elmnt) {
            var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
            if (document.getElementById("mycamdivheader")) {
                // if present, the header is where you move the DIV from:
                document.getElementById("mycamdivheader").onmousedown = dragMouseDown;
            }
            else {
                // otherwise, move the DIV from anywhere inside the DIV:
                elmnt.onmousedown = dragMouseDown;
            }
            function dragMouseDown(e) {
                e.preventDefault();
                // get the mouse cursor position at startup:
                pos3 = e.clientX;
                pos4 = e.clientY;
                document.onmouseup = closeDragElement;
                // call a function whenever the cursor moves:
                document.onmousemove = elementDrag;
            }
            function elementDrag(e) {
                e.preventDefault();
                // calculate the new cursor position:
                pos1 = pos3 - e.clientX;
                pos2 = pos4 - e.clientY;
                pos3 = e.clientX;
                pos4 = e.clientY;
                // set the element's new position:
                const popupContainerEl = document.getElementById("gmPopupContainerCam");
                popupContainerEl.style.top = popupContainerEl.offsetTop - pos2 + "px";
                popupContainerEl.style.left = popupContainerEl.offsetLeft - pos1 + "px";
            }
            function closeDragElement() {
                // stop moving when mouse button is released:
                document.onmouseup = null;
                document.onmousemove = null;
            }
        }
        function popup_appendOption(urlsrc) {
            const option = document.createElement("option");
            option.value = urlsrc;
            option.text = urlsrc;
            camSourceEl.append(option);
        }
        function popup_getJalanowImage(url) {
            GM_xmlhttpRequest({
                method: "GET",
                responseType: "blob",
                headers: {
                    authority: "p4.fgies.com",
                    referer: "https://www.jalanow.com/",
                    accept: "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
                },
                url: url,
                onload: function (response) {
                    const staticImageEl = document.getElementById("staticimage");
                    staticImageEl.src = URL.createObjectURL(response.response);
                    document.getElementById("mycamstatus").innerHTML = "";
                },
                onerror: function (response) {
                    document.getElementById("mycamstatus").innerHTML =
                        "Error loading image.";
                },
                onprogress: function (response) {
                    document.getElementById("mycamstatus").innerHTML = "Loading image...";
                },
            });
        }
        function popup_getLLMImage(url) {
            let camImg = url.split("|");
            GM_xmlhttpRequest({
                method: "GET",
                responseType: "blob",
                url: camImg[0],
                onload: function (response) {
                    const re = new RegExp('src="data:image/png;base64, ([A-Za-z0-9/+=]*)" title="' +
                        camImg[1] +
                        '"');
                    const m = response.responseText.match(re);
                    const staticImageEl = document.getElementById("staticimage");
                    staticImageEl.src = "data:image/png;base64," + m[1];
                    document.getElementById("mycamstatus").innerHTML = "";
                },
                onerror: function (response) {
                    document.getElementById("mycamstatus").innerHTML =
                        "Error loading image.";
                },
                onprogress: function (response) {
                    document.getElementById("mycamstatus").innerHTML = "Loading image...";
                },
            });
        }
    }
}

;// ./src/plugins/PluginKVMR.ts


class PluginKVMR {
    constructor() {
        this.areas = [
            {
                name: "Area 1",
                geometry: "POLYGON ((101.296968 3.210365, 101.30376 3.118812, 101.327352 3.100621, 101.332475 3.083048, 101.3447571 3.0671528, 101.3475037 2.9992702, 101.4546204 2.9862417, 101.443634 3.2097608, 101.296968 3.210365))",
                color: "#ffffff",
            },
            {
                name: "Area 2a",
                geometry: "POLYGON ((101.443634 3.2097608, 101.4546204 2.9862417, 101.542797963266 2.999451622765, 101.546214771469 3.20939581928522, 101.443634 3.2097608))",
                color: "#ff0000",
            },
            {
                name: "Area 2b",
                geometry: "POLYGON ((101.546208402411 3.20940523257651, 101.545212203573 3.14955753765693, 101.640751782444 3.14826179285013, 101.6379547 3.2090753, 101.546208402411 3.20940523257651))",
                color: "#00ff00",
            },
            {
                name: "Area 2c",
                geometry: "POLYGON ((101.545226515908 3.14956187716133, 101.544049591624 3.0763653393285, 101.643784992874 3.08223941174546, 101.640750558754 3.14825692296985, 101.545226515908 3.14956187716133))",
                color: "#0000ff",
            },
            {
                name: "Area 2d",
                geometry: "POLYGON ((101.544050641663 3.07636531606873, 101.542795175242 2.99943779058738, 101.6468811 3.0150413, 101.643784373198 3.08223705403019, 101.544050641663 3.07636531606873))",
                color: "#ffff00",
            },
            {
                name: "Area 3",
                geometry: "POLYGON ((101.6379547 3.2090753, 101.6412146 3.145488, 101.7443848 3.1501147, 101.7309414 3.2090495, 101.6379547 3.2090753))",
                color: "#ff00ff",
            },
            {
                name: "Area 4",
                geometry: "POLYGON ((101.6412146 3.145488, 101.6439612 3.0796673, 101.7615509 3.0791519, 101.7443848 3.1501147, 101.6412146 3.145488))",
                color: "#00ffff",
            },
            {
                name: "Area 5",
                geometry: "POLYGON ((101.788224 3.210399, 101.7309414 3.2090495, 101.7615509 3.0791519, 101.6439612 3.0796673, 101.6468811 3.0150413, 101.8391418 3.0253266, 101.788224 3.210399))",
                color: "#40ff00",
            },
            {
                name: "Area 6",
                geometry: "POLYGON ((101.332475 3.083048, 101.262098 3.074553, 101.2335205 3.0815516, 101.208976 3.060844, 101.162394 2.989639, 101.223721 2.903504, 101.268598 2.871386, 101.284902 2.830662, 101.448138 2.72835, 101.4546204 2.9862417, 101.3475037 2.9992702, 101.3447571 3.0671528, 101.332475 3.083048))",
                color: "#ff4000",
            },
            {
                name: "Area 7",
                geometry: "POLYGON ((101.4546204 2.9862417, 101.448138 2.72835, 101.477474 2.766274, 101.559411 2.807463, 101.6578674 2.8223442, 101.6468811 3.0150413, 101.4546204 2.9862417))",
                color: "#33ff00",
            },
            {
                name: "Area 8",
                geometry: "POLYGON ((101.6578674 2.8223442, 101.725067 2.83344, 101.756459 2.866068, 101.882828 2.870563, 101.8391418 3.0253266, 101.6468811 3.0150413, 101.6578674 2.8223442))",
                color: "#ff0033",
            },
        ];
        this.sdk = unsafeWindow.getWmeSdk({
            scriptId: "wme-wazemy-kvmr",
            scriptName: "WazeMY",
        });
        this.initialize();
    }
    initialize() {
        // Add settings into view.
        const settingsHTML = `<div>
      <input type="checkbox" id="wazemySettings_kvmr_enable" style="margin-top:0px"/>
      <label for="wazemySettings_kvmr_enable">Klang Valley Map Raid</label><br></div>`;
        $("#wazemySettings_settings").append(settingsHTML);
        const settingsEl = document.getElementById(`wazemySettings_kvmr_enable`);
        const savedSettings = SettingsStorage.instance.getSetting("kvmr");
        if (savedSettings?.enable === true) {
            settingsEl.checked = true;
        }
        else {
            settingsEl.checked = false;
        }
        settingsEl.onchange = (e) => {
            const target = e.target;
            PluginManager.instance.updatePluginSettings("kvmr", {
                enable: target.checked,
            });
        };
        // Add MR polygon overlay.
        this.raid_mapLayer = new OpenLayers.Layer.Vector("KlangValley", {
            displayInLayerSwitcher: true,
            uniqueName: "__KlangValley",
        });
        // W. object: Complex polygon vector layer with custom styling
        // SDK layer system is designed for GeoJSON; refactoring would have low ROI
        W.map.addLayer(this.raid_mapLayer);
        // Register layer for cross-plugin access
        PluginManager.instance.registerLayer("__KlangValley", this.raid_mapLayer);
        this.areas.forEach((area) => {
            const geometry = parseWKT(area.geometry);
            this.addRaidPolygon(this.raid_mapLayer, geometry, area.color, area.name);
        });
        // Create event handler reference for cleanup
        this.handleMapUpdate = () => this.currentRaidLocation();
        // Register SDK events for map updates
        // Note: wme-map-move-end fires after both panning and zooming
        this.sdk.Events.on({
            eventName: "wme-map-move-end",
            eventHandler: this.handleMapUpdate,
        });
        console.log("PluginKVMR initialized.");
        function parseWKT(wkt) {
            let trimmed;
            if (wkt.startsWith("POLYGON")) {
                trimmed = wkt.replace("POLYGON ((", "").replace("))", "");
            }
            const coordinatePairs = trimmed.split(", ");
            const coordinates = coordinatePairs.map((pair) => {
                const [lon, lat] = pair.split(" ");
                return { lon, lat };
            });
            return coordinates;
        }
    }
    /**
     * Updates the current raid location on the map based on the user's current location.
     *
     * @return {void} This function does not return anything.
     */
    currentRaidLocation() {
        // Only run if the plugin is enabled. Workaround because unregistering events doesn't work.
        if ($("#wazemySettings_kvmr_enable").is(":checked") === false) {
            return;
        }
        for (let i = 0; i < this.raid_mapLayer.features?.length; i++) {
            // W. object: Using W.map.getCenter() for map center in Web Mercator coordinates
            // Used for polygon containment check with OpenLayers geometry
            var raidMapCenter = W.map.getCenter();
            var raidCenterPoint = new OpenLayers.Geometry.Point(raidMapCenter.lon, raidMapCenter.lat);
            var raidCenterCheck = this.raid_mapLayer.features[i].geometry.components[0].containsPoint(raidCenterPoint);
            var holes = this.raid_mapLayer.features[i].attributes.holes;
            if (raidCenterCheck === true) {
                var str = $("#topbar-container > div > div.location-info-region > div").text();
                const location = str.split(" - ");
                if (location.length > 1) {
                    location[1] =
                        "Klang Valley MapRaid " +
                            this.raid_mapLayer.features[i].attributes.number;
                }
                else {
                    location.push("Klang Valley MapRaid " +
                        this.raid_mapLayer.features[i].attributes.number);
                }
                const raidLocationLabel = location.join(" - ");
                setTimeout(function () {
                    $("#topbar-container > div > div.location-info-region > div").text(raidLocationLabel);
                }, 200);
                if (holes === "false") {
                    break;
                }
            }
        }
    }
    enable() {
        this.raid_mapLayer.setVisibility(true);
        console.log("PluginKVMR enabled.");
    }
    disable() {
        this.raid_mapLayer.setVisibility(false);
        // Unregister SDK events
        this.sdk.Events.off({
            eventName: "wme-map-move-end",
            eventHandler: this.handleMapUpdate,
        });
        console.log("PluginKVMR disabled.");
    }
    updateSettings(settings) {
        if (settings.enable === true) {
            this.enable();
        }
        else {
            this.disable();
        }
        console.log("PluginKVMR settings updated", settings);
    }
    addRaidPolygon(raidLayer, groupPoints, groupColor, groupNumber) {
        var raidGroupLabel = "KlangValley " + groupNumber;
        var groupName = "RaidGroup " + groupNumber;
        var style = {
            strokeColor: groupColor,
            strokeOpacity: 0.8,
            strokeWidth: 3,
            fillColor: groupColor,
            fillOpacity: 0.15,
            label: raidGroupLabel,
            labelOutlineColor: "black",
            labelOutlineWidth: 3,
            fontSize: 14,
            fontColor: groupColor,
            fontOpacity: 0.85,
            fontWeight: "bold",
        };
        var attributes = {
            name: groupName,
            number: groupNumber,
        };
        var pnt = [];
        const wgs84 = new OpenLayers.Projection("EPSG:4326");
        const webMercator = new OpenLayers.Projection("EPSG:900913");
        for (let i = 0; i < groupPoints.length; i++) {
            const convPoint = new OpenLayers.Geometry.Point(groupPoints[i].lon, groupPoints[i].lat).transform(wgs84, webMercator);
            //console.log('MapRaid: ' + JSON.stringify(groupPoints[i]) + ', ' + groupPoints[i].lon + ', ' + groupPoints[i].lat);
            pnt.push(convPoint);
        }
        var ring = new OpenLayers.Geometry.LinearRing(pnt);
        var polygon = new OpenLayers.Geometry.Polygon([ring]);
        var feature = new OpenLayers.Feature.Vector(polygon, attributes, style);
        raidLayer.addFeatures([feature]);
    }
}

;// ./src/plugins/PluginZoomPic.ts
class PluginZoomPic {
    constructor() {
        this.currentBlobUrl = null;
        this.initialize();
    }
    /**
     * Initialize plugin.
     *
     * @return {void} This function does not return anything.
     */
    initialize() {
        this.createPopupContainer();
        this.setupPopupHandlers();
        $(document.body).on("click", () => {
            const img = $(".venue-image-dialog > wz-dialog-content > img");
            if (img.length > 0) {
                const newImg = img[0];
                // Remove existing zoom links
                const links = $(".venue-image-dialog > wz-dialog-header > #zoomPicLink");
                for (let i = 0; i < links.length; i++) {
                    links[i].remove();
                }
                // Add clickable span that fetches and displays image in popup
                const newImgHTML = `<span id="zoomPicLink" style="cursor:pointer; color:blue; text-decoration:underline;">(+)</span>`;
                $(".venue-image-dialog > wz-dialog-header").append(newImgHTML);
                $("#zoomPicLink").on("click", (e) => {
                    e.stopPropagation();
                    const fullSizeUrl = newImg.src.replace("thumbs/thumb700_", "");
                    this.fetchAndDisplayImage(fullSizeUrl);
                });
            }
        });
        console.log("[WazeMY] PluginZoomPic initialized.");
    }
    /**
     * Create the popup container for displaying full-size images.
     */
    createPopupContainer() {
        const popupHTML = `<div id="gmPopupContainerZoomPic" style="display:none; position:fixed; z-index:10001; background:#fff; border:2px solid #333; border-radius:5px; padding:5px; cursor:move; box-shadow: 0 4px 12px rgba(0,0,0,0.3);">
      <div style="text-align:right; margin-bottom:5px;">
        <span id="zoomPicClose" style="cursor:pointer; font-weight:bold; padding:0 5px;">[X]</span>
      </div>
      <div id="zoomPicLoading" style="display:none; padding:20px; text-align:center;">Loading...</div>
      <img id="zoomPicImage" style="max-width:90vw; max-height:85vh; display:block;">
    </div>`;
        document.body.insertAdjacentHTML("afterbegin", popupHTML);
    }
    /**
     * Setup event handlers for popup close and drag functionality.
     */
    setupPopupHandlers() {
        const popup = document.getElementById("gmPopupContainerZoomPic");
        const closeBtn = document.getElementById("zoomPicClose");
        // Close button handler
        closeBtn?.addEventListener("click", () => {
            this.closePopup();
        });
        // Close on Escape key
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape" && popup?.style.display === "block") {
                this.closePopup();
            }
        });
        // Drag functionality
        let isDragging = false;
        let offsetX = 0;
        let offsetY = 0;
        popup?.addEventListener("mousedown", (e) => {
            const target = e.target;
            // Don't drag if clicking on close button or image
            if (target.id === "zoomPicClose" || target.id === "zoomPicImage")
                return;
            isDragging = true;
            offsetX = e.clientX - popup.offsetLeft;
            offsetY = e.clientY - popup.offsetTop;
        });
        document.addEventListener("mousemove", (e) => {
            if (!isDragging || !popup)
                return;
            popup.style.left = e.clientX - offsetX + "px";
            popup.style.top = e.clientY - offsetY + "px";
        });
        document.addEventListener("mouseup", () => {
            isDragging = false;
        });
    }
    /**
     * Close the popup and cleanup blob URL.
     */
    closePopup() {
        const popup = document.getElementById("gmPopupContainerZoomPic");
        const imgEl = document.getElementById("zoomPicImage");
        if (popup) {
            popup.style.display = "none";
        }
        // Revoke blob URL to free memory
        if (this.currentBlobUrl) {
            URL.revokeObjectURL(this.currentBlobUrl);
            this.currentBlobUrl = null;
        }
        if (imgEl) {
            imgEl.src = "";
        }
    }
    /**
     * Fetch image via GM_xmlhttpRequest and display in popup.
     */
    fetchAndDisplayImage(url) {
        const popup = document.getElementById("gmPopupContainerZoomPic");
        const imgEl = document.getElementById("zoomPicImage");
        const loadingEl = document.getElementById("zoomPicLoading");
        if (!popup || !imgEl)
            return;
        // Show popup with loading indicator
        popup.style.display = "block";
        popup.style.left = "50px";
        popup.style.top = "50px";
        if (loadingEl)
            loadingEl.style.display = "block";
        imgEl.style.display = "none";
        // Cleanup previous blob URL if exists
        if (this.currentBlobUrl) {
            URL.revokeObjectURL(this.currentBlobUrl);
            this.currentBlobUrl = null;
        }
        GM_xmlhttpRequest({
            method: "GET",
            responseType: "blob",
            url: url,
            onload: (response) => {
                if (loadingEl)
                    loadingEl.style.display = "none";
                imgEl.style.display = "block";
                // Create blob URL - this works regardless of server MIME type
                this.currentBlobUrl = URL.createObjectURL(response.response);
                imgEl.src = this.currentBlobUrl;
            },
            onerror: () => {
                if (loadingEl)
                    loadingEl.style.display = "none";
                imgEl.style.display = "block";
                imgEl.alt = "Error loading image";
                console.error("[WazeMY] PluginZoomPic: Error loading image from", url);
            },
        });
    }
    /**
     * Enable plugin.
     *
     * @return {void} This function does not return anything.
     */
    enable() {
        console.log("[WazeMY] PluginZoomPic enabled.");
    }
    /**
     * Disable plugin.
     *
     * @return {void} This function does not return anything.
     */
    disable() {
        console.log("[WazeMY] PluginZoomPic disabled.");
    }
    /**
     * Updates the settings of the PluginZoomPic based on the provided settings object.
     *
     * @return {void} This function does not return anything.
     */
    updateSettings(settings) {
        console.log("[WazeMY] PluginZoomPic settings updated.", settings);
    }
}

;// ./src/utils/dateUtils.ts
/**
 * Formats a timestamp as a relative time string (e.g., "2 hours ago", "3 days ago").
 *
 * @param timestamp - Unix timestamp in milliseconds
 * @returns A human-readable relative time string
 */
function formatRelativeTime(timestamp) {
    const now = Date.now();
    const diff = now - timestamp;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);
    if (years > 0) {
        return years === 1 ? "1 year ago" : `${years} years ago`;
    }
    if (months > 0) {
        return months === 1 ? "1 month ago" : `${months} months ago`;
    }
    if (weeks > 0) {
        return weeks === 1 ? "1 week ago" : `${weeks} weeks ago`;
    }
    if (days > 0) {
        return days === 1 ? "1 day ago" : `${days} days ago`;
    }
    if (hours > 0) {
        return hours === 1 ? "1 hour ago" : `${hours} hours ago`;
    }
    if (minutes > 0) {
        return minutes === 1 ? "1 minute ago" : `${minutes} minutes ago`;
    }
    return "Just now";
}
/**
 * Formats a timestamp as a full date string for tooltips.
 *
 * @param timestamp - Unix timestamp in milliseconds
 * @returns A formatted date string (e.g., "Jan 15, 2025 3:45 PM")
 */
function formatFullDate(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
    });
}

;// ./src/plugins/PluginPlaces.ts



class PluginPlaces {
    constructor() {
        this.sidebarElements = null;
        this.tabHTML = `
    <div><h4>WazeMY Places</h4></div>
    <div id="wazemyPlaces">
      <select name="wazemyPlaces_polygons" id="wazemyPlaces_polygons"></select>
      <button id="wazemyPlaces_scan">Scan</button>
      <div id="wazemyPlaces_scanStatus"></div>
      <div id="wazemyPlaces_purCount"></div>
      <div id="wazemyPlaces_totalCount"></div>
      <div id="wazemyPlaces_table">
      <table id="wazemyPlaces_venues">
        <thead>
          <tr>
            <th title="I=Image\nN=New Place\nU=Update\nF=Flag\nD=Delete">PUR</th>
            <th>Date</th>
            <th>L</th>
            <th>Name</th>
            <th>Errors</th>
          </tr>
        </thead>
        <tbody></tbody>
      </table>
      </div>
    </div>
  `;
        this.sdk = unsafeWindow.getWmeSdk({
            scriptId: "wme-wazemy-places",
            scriptName: "WazeMY",
        });
        this.initialize();
    }
    /**
     * Initialize plugin.
     *
     * @return {void} This function does not return anything.
     */
    initialize() {
        const settingsHTML = `<div><input type="checkbox" id="wazemySettings_places_enable"/>
      <label for="wazemySettings_places_enable">Enable Places</label></div>`;
        $("#wazemySettings_settings").append(settingsHTML);
        $("#wazemySettings_places_enable").on("change", () => {
            PluginManager.instance.updatePluginSettings("places", {
                enable: $("#wazemySettings_places_enable").prop("checked"),
            });
        });
        // Set settings according to last stored value.
        const savedSettings = SettingsStorage.instance.getSetting("places");
        if (savedSettings?.enable === true) {
            $("#wazemySettings_places_enable").prop("checked", true);
        }
        else {
            $("#wazemySettings_places_enable").prop("checked", false);
        }
        console.log("[WazeMY] PluginPlaces initialized.");
    }
    /**
     * Enable plugin.
     *
     * @return {void} This function does not return anything.
     */
    enable() {
        this.sdk.Sidebar.registerScriptTab().then((sidebarResult) => {
            this.sidebarElements = sidebarResult;
            sidebarResult.tabLabel.innerHTML = "WazeMY Places";
            sidebarResult.tabLabel.title = "WazeMY Places";
            sidebarResult.tabPane.innerHTML = this.tabHTML;
            // Populate select options with polygons from KVMR.
            const kvmrLayer = PluginManager.instance.getLayer("__KlangValley");
            if (kvmrLayer) {
                kvmrLayer.features.forEach((feature) => {
                    $("#wazemyPlaces_polygons").append($("<option>", {
                        value: feature.data.number,
                        text: feature.data.number,
                    }));
                });
            }
            // Handle Scan button.
            $("#wazemyPlaces_scan").on("click", async () => {
                $("#wazemyPlaces_scanStatus").text("Scanning tiles.");
                $("#wazemyPlaces_venues > tbody").empty();
                const kvmrLayer = PluginManager.instance.getLayer("__KlangValley");
                if (!kvmrLayer) {
                    console.log("[PluginPlaces] No KVMR layer found. Aborting scan.");
                    return false;
                }
                const mr = kvmrLayer.getFeaturesByAttribute("number", $("#wazemyPlaces_polygons option:selected")[0].innerText);
                if (mr.length === 0) {
                    console.log("[PluginPlaces] No polygon found. Aborting scan.");
                    return false;
                }
                const feature = mr[0];
                let bounds = feature.geometry.getBounds().clone();
                const webMercator = new OpenLayers.Projection("EPSG:900913");
                const wgs84 = new OpenLayers.Projection("EPSG:4326");
                bounds = bounds.transform(webMercator, wgs84);
                const venues = await getAllVenues(bounds);
                // Helper functions defined once
                function evaluateVenue(venue) {
                    let status = {
                        priority: 0,
                        errors: [],
                    };
                    // Rule #1
                    if (typeof venue.name == "undefined") {
                        if (!venue.categories.includes("RESIDENCE_HOME")) {
                            status.priority = 3;
                            status.errors.push("Missing name.");
                        }
                    }
                    else {
                        // Rule: Check name for all uppercase.
                        if (venue.name === venue.name.toUpperCase()) {
                            status.priority = 3;
                            status.errors.push("Name is uppercase.");
                        }
                        // Rule: Check name for all lowercase.
                        if (venue.name === venue.name.toLowerCase()) {
                            status.priority = 3;
                            status.errors.push("Name is lowercase.");
                        }
                    }
                    // Rule: Min lock is not set.
                    if (venue.lockRank === 0) {
                        status.priority = 3;
                        status.errors.push("Min lock not set.");
                    }
                    // Rule: Phone number format.
                    if (venue.phone) {
                        if (/^[\d]{3}-[\d]{3} [\d]{4}$/.test(venue.phone) === false &&
                            /^[\d]{3}-[\d]{4} [\d]{4}$/.test(venue.phone) === false &&
                            /^[\d]{2}-[\d]{4} [\d]{4}$/.test(venue.phone) === false &&
                            /^[\d]{2}-[\d]{3} [\d]{4}$/.test(venue.phone) === false &&
                            /^[\d]{3}-[\d]{3} [\d]{3}$/.test(venue.phone) === false &&
                            /^[\d]{1}-[\d]{3}-[\d]{2}-[\d]{4}$/.test(venue.phone) === false) {
                            status.priority = 2;
                            status.errors.push("Phone number format incorrect.");
                        }
                    }
                    // Rule: Category specific rank locks.
                    if ((venue.categories.includes("CHARGING_STATION") &&
                        venue.lockRank < 3) ||
                        (venue.categories.includes("GAS_STATION") && venue.lockRank < 3) ||
                        (venue.categories.includes("AIRPORT") && venue.lockRank < 4) ||
                        (venue.categories.includes("BUS_STATION") && venue.lockRank < 2) ||
                        (venue.categories.includes("FERRY_PIER") && venue.lockRank < 2) ||
                        (venue.categories.includes("JUNCTION_INTERCHANGE") &&
                            venue.lockRank < 2) ||
                        (venue.categories.includes("REST_AREAS") && venue.lockRank < 2) ||
                        (venue.categories.includes("SEAPORT_MARINA_HARBOR") &&
                            venue.lockRank < 2) ||
                        (venue.categories.includes("TRAIN_STATION") &&
                            venue.lockRank < 2) ||
                        (venue.categories.includes("TUNNEL") && venue.lockRank < 2) ||
                        (venue.categories.includes("CITY_HALL") && venue.lockRank < 2) ||
                        (venue.categories.includes("COLLEGE_UNIVERSITY") &&
                            venue.lockRank < 2) ||
                        (venue.categories.includes("COURTHOUSE") && venue.lockRank < 2) ||
                        (venue.categories.includes("DOCTOR_CLINIC") &&
                            venue.lockRank < 2) ||
                        (venue.categories.includes("EMBASSY_CONSULATE") &&
                            venue.lockRank < 2) ||
                        (venue.categories.includes("FIRE_DEPARTMENT") &&
                            venue.lockRank < 2) ||
                        (venue.categories.includes("HOSPITAL_URGENT_CARE") &&
                            venue.lockRank < 3) ||
                        (venue.categories.includes("LIBRARY") && venue.lockRank < 2) ||
                        (venue.categories.includes("MILITARY") && venue.lockRank < 3) ||
                        (venue.categories.includes("POLICE_STATION") &&
                            venue.lockRank < 2) ||
                        (venue.categories.includes("PRISON_CORRECTIONAL_FACILITY") &&
                            venue.lockRank < 2) ||
                        (venue.categories.includes("RELIGIOUS_CENTER") &&
                            venue.lockRank < 3) ||
                        (venue.categories.includes("SCHOOL") && venue.lockRank < 2) ||
                        (venue.categories.includes("BANK_FINANCIAL") &&
                            venue.lockRank < 2) ||
                        (venue.categories.includes("SHOPPING_CENTER") &&
                            venue.lockRank < 2) ||
                        (venue.categories.includes("MUSEUM") && venue.lockRank < 2) ||
                        (venue.categories.includes("RACING_TRACK") && venue.lockRank < 2) ||
                        (venue.categories.includes("STADIUM_ARENA") &&
                            venue.lockRank < 2) ||
                        (venue.categories.includes("THEME_PARK") && venue.lockRank < 2) ||
                        (venue.categories.includes("TOURIST_ATTRACTION_HISTORIC_SITE") &&
                            venue.lockRank < 2) ||
                        (venue.categories.includes("ZOO_AQUARIUM") && venue.lockRank < 2) ||
                        (venue.categories.includes("BEACH") && venue.lockRank < 2) ||
                        (venue.categories.includes("GOLF_COURSE") && venue.lockRank < 2) ||
                        (venue.categories.includes("PARK") && venue.lockRank < 2) ||
                        (venue.categories.includes("FOREST_GROVE") && venue.lockRank < 2) ||
                        (venue.categories.includes("ISLAND") && venue.lockRank < 4) ||
                        (venue.categories.includes("RIVER_STREAM") && venue.lockRank < 3) ||
                        (venue.categories.includes("SEA_LAKE_POOL") &&
                            venue.lockRank < 5) ||
                        (venue.categories.includes("CANAL") && venue.lockRank < 2) ||
                        (venue.categories.includes("SWAMP_MARSH") && venue.lockRank < 2)) {
                        status.priority = 2;
                        status.errors.push("Min lock incorrect.");
                    }
                    return status;
                }
                function checkPURstatus(venue) {
                    return venue.venueUpdateRequests?.length > 0;
                }
                function getPURDate(venue) {
                    if (venue.venueUpdateRequests?.length > 0) {
                        // Try dateAdded first, fallback to createdOn
                        return (venue.venueUpdateRequests[0].dateAdded ||
                            venue.venueUpdateRequests[0].createdOn ||
                            null);
                    }
                    return null;
                }
                const processedVenues = [];
                venues.forEach((venue) => {
                    const status = evaluateVenue(venue);
                    const isPUR = checkPURstatus(venue);
                    if (status.priority > 0 || isPUR) {
                        let lon = 0;
                        let lat = 0;
                        if (venue.geometry.type === "Polygon") {
                            lon = venue.geometry.coordinates[0][0][0];
                            lat = venue.geometry.coordinates[0][0][1];
                        }
                        else {
                            lon = venue.geometry.coordinates[0];
                            lat = venue.geometry.coordinates[1];
                        }
                        processedVenues.push({
                            venue,
                            status,
                            isPUR,
                            purDate: getPURDate(venue),
                            lon,
                            lat,
                        });
                    }
                });
                // Sort: PURs first (newest to oldest), then non-PURs
                processedVenues.sort((a, b) => {
                    // PURs come first
                    if (a.isPUR && !b.isPUR)
                        return -1;
                    if (!a.isPUR && b.isPUR)
                        return 1;
                    // Both are PURs: sort by date descending (newest first)
                    if (a.isPUR && b.isPUR) {
                        const dateA = a.purDate || 0;
                        const dateB = b.purDate || 0;
                        return dateB - dateA;
                    }
                    // Both are non-PURs: keep original order
                    return 0;
                });
                // Render sorted venues
                let purCount = 0;
                let totalCount = 0;
                processedVenues.forEach((pv) => {
                    const { venue, status, isPUR, purDate, lon, lat } = pv;
                    const row = $("<tr>");
                    row.attr("id", `${lon}:${lat}:${venue.id}`);
                    row.on("click", (e) => {
                        const target = e.currentTarget.id.split(":"); // split to lon:lat:id
                        this.sdk.Map.setMapCenter({
                            lonLat: {
                                lon: parseFloat(target[0]),
                                lat: parseFloat(target[1]),
                            },
                        });
                    });
                    // PUR type column
                    let purHTML = ``;
                    if (isPUR) {
                        purCount++;
                        if (venue.approved === false) {
                            purHTML = `<td align="center">N</td>`;
                        }
                        else if (venue.venueUpdateRequests[0].type === "REQUEST") {
                            if (venue.venueUpdateRequests[0].subType === "FLAG") {
                                purHTML = `<td align="center">F</td>`;
                            }
                            else if (venue.venueUpdateRequests[0].subType === "UPDATE") {
                                purHTML = `<td align="center">U</td>`;
                            }
                            else if (venue.venueUpdateRequests[0].subType === "DELETE") {
                                purHTML = `<td align="center">D</td>`;
                            }
                            else {
                                purHTML = `<td align="center">+</td>`;
                            }
                        }
                        else if (venue.venueUpdateRequests[0].type === "IMAGE") {
                            purHTML = `<td align="center">I</td>`;
                        }
                        else {
                            purHTML = `<td align="center">+</td>`;
                        }
                    }
                    else {
                        purHTML = `<td></td>`;
                    }
                    row.append(purHTML);
                    // Date column
                    let dateHTML = `<td></td>`;
                    if (isPUR && purDate) {
                        const relativeTime = formatRelativeTime(purDate);
                        const fullDate = formatFullDate(purDate);
                        dateHTML = `<td title="${fullDate}">${relativeTime}</td>`;
                    }
                    row.append(dateHTML);
                    const levelHTML = `<td>${venue.lockRank ? venue.lockRank + 1 : 1}</td>`;
                    row.append(levelHTML);
                    const colHTML = `<td>${venue.name}</td>`;
                    row.append(colHTML);
                    const errorsHTML = `<td>${status.errors.join("\r\n")}</td>`;
                    row.append(errorsHTML);
                    $("#wazemyPlaces_venues > tbody").append(row);
                    totalCount++;
                });
                $("#wazemyPlaces_purCount").text(`# PUR = ${purCount}`);
                $("#wazemyPlaces_totalCount").text(`# total = ${totalCount}`);
                $("#wazemyPlaces_scanStatus").text("");
                async function getAllVenues(bounds) {
                    let venues = [];
                    // console.log(bounds);
                    const baseURL = "https://www.waze.com/row-Descartes/app/Features?language=en&v=2&cameras=true&mapComments=true&roadClosures=true&roadTypes=1%2C2%2C3%2C4%2C5%2C6%2C7%2C8%2C9%2C10%2C15%2C16%2C17%2C18%2C19%2C20%2C22&venueLevel=4&venueFilter=1%2C1%2C1%2C1&";
                    let urls = [];
                    const stepSize = 0.1;
                    for (let left = bounds.left; left <= bounds.right; left += stepSize) {
                        for (let bottom = bounds.bottom; bottom <= bounds.top; bottom += stepSize) {
                            urls.push(`bbox=${left}%2C${bottom}%2C${left + stepSize > bounds.right ? bounds.right : left + stepSize}%2C${bottom + stepSize > bounds.top ? bounds.top : bottom + stepSize}`);
                        }
                    }
                    for (let i = 0; i < urls.length; i++) {
                        // console.log(baseURL + urls[i]);
                        $("#wazemyPlaces_scanStatus").text(`Scanning tile ${i + 1} of ${urls.length}.`);
                        const result = await GM.xmlHttpRequest({
                            method: "GET",
                            responseType: "json",
                            url: baseURL + urls[i],
                        }).catch((e) => console.error(e));
                        venues = venues.concat(result.response.venues.objects);
                    }
                    return venues;
                }
            });
            console.log("[WazeMY] PluginPlaces enabled.");
        });
    }
    /**
     * Disable plugin.
     *
     * @return {void} This function does not return anything.
     */
    disable() {
        if (this.sidebarElements) {
            this.sidebarElements.tabLabel.remove();
            this.sidebarElements.tabPane.remove();
            this.sidebarElements = null;
        }
        console.log("[WazeMY] PluginPlaces disabled.");
    }
    /**
     * Updates the settings of the PluginPlaces based on the provided settings object.
     *
     * @return {void} This function does not return anything.
     */
    updateSettings(settings) {
        if (settings.enable === true) {
            this.enable();
        }
        else {
            this.disable();
        }
        console.log("[WazeMY] PluginPlaces settings updated.", settings);
    }
}

;// ./src/plugins/PluginGemini.ts


class PluginGemini {
    /**
     * Constructs a new instance of the PluginGemini class.
     * Initializes the WME SDK with the specified script ID and name,
     * and calls the initialize method to set up the plugin.
     */
    constructor() {
        this.lastEvaluatedImageSrc = null;
        this.evaluateDebounceTimer = null;
        this.sdk = unsafeWindow.getWmeSdk({
            scriptId: "wme-wazemy-gemini",
            scriptName: "WazeMY",
        });
        this.initialize();
    }
    /**
     * Initialize plugin.
     *
     * @return {void} This function does not return anything.
     */
    initialize() {
        const settingsHTML = `
      <div>
        <input type="checkbox" id="wazemySettings_gemini_enable"/>
        <label for="wazemySettings_gemini_enable">Enable Gemini integration</label>
      </div>
    `;
        $("#wazemySettings_settings").append(settingsHTML);
        $("#wazemySettings_gemini_enable").on("change", () => {
            PluginManager.instance.updatePluginSettings("gemini", {
                enable: $("#wazemySettings_gemini_enable").prop("checked"),
            });
        });
        const geminiAPIKeySettings = `
      <div>
        <label for="wazemySettings_gemini_apiKey">API Key</label>
        <input type="password" id="wazemySettings_gemini_apiKey" placeholder="Enter Gemini API Key"/>
        <wz-button id="wazemySettings_gemini_saveApiKey" class="wazemySettingsButton" style="padding:3px">
          Save
        </wz-button>
        <div style="font-size: 10px; margin-top: 5px;">
          Get your API key from <a href="https://aistudio.google.com/" target="_blank">Google AI Studio</a>.
        </div>
      </div>
    `;
        $("#wazemySettings_gemini").append(geminiAPIKeySettings);
        $("#wazemySettings_gemini_saveApiKey").on("click", () => {
            PluginManager.instance.updatePluginSettings("gemini", {
                geminiApiKey: $("#wazemySettings_gemini_apiKey").val(),
            });
        });
        // Set settings according to last stored value.
        const savedSettings = SettingsStorage.instance.getSetting("gemini");
        if (savedSettings?.enable === true) {
            $("#wazemySettings_gemini_enable").prop("checked", true);
        }
        else {
            $("#wazemySettings_gemini_enable").prop("checked", false);
        }
        if (savedSettings?.geminiApiKey) {
            $("#wazemySettings_gemini_apiKey").val(savedSettings.geminiApiKey);
            this.geminiApiKey = savedSettings.geminiApiKey;
        }
        // let aiAnswer = this.getGeminiTextResponse("How AI does work?");
        // console.log("[WazeMY] Gemini AI Answer:", aiAnswer);
        this.initializeVenueUpdateRequestImageHelper();
        console.log("[WazeMY] PluginGemini initialized.");
    }
    /**
     * Enable plugin.
     *
     * @return {void} This function does not return anything.
     */
    enable() {
        console.log("[WazeMY] PluginGemini enabled.");
    }
    /**
     * Disable plugin.
     *
     * @return {void} This function does not return anything.
     */
    disable() {
        console.log("[WazeMY] PluginGemini disabled.");
    }
    /**
     * Updates the settings of the PluginGemini based on the provided settings object.
     *
     * @return {void} This function does not return anything.
     */
    updateSettings(settings) {
        if (settings.enable) {
            if (settings.enable === true) {
                this.enable();
            }
            else {
                this.disable();
            }
        }
        console.log("[WazeMY] PluginGemini settings updated.");
    }
    /**
     * Initialize the helper for venue update request image.
     *
     * @return {void} This function does not return anything.
     */
    initializeVenueUpdateRequestImageHelper() {
        const arrayBufferToBase64 = (buffer) => {
            const bytes = new Uint8Array(buffer);
            let binary = "";
            for (let i = 0; i < bytes.byteLength; i++) {
                binary += String.fromCharCode(bytes[i]);
            }
            return btoa(binary);
        };
        const onload_base64image = (response) => {
            const base64data = arrayBufferToBase64(response.response);
            this.getGeminiPictureEvaluation(base64data).then((evaluation) => {
                const evaluationText = JSON.parse(evaluation);
                $("#gemini").replaceWith(`<div id='gemini' class="changes"><b>Gemini image evaluation: ${evaluationText.suggestion}</b><br><i>${evaluationText.reason}</i><br></div>`);
                if (evaluationText.suggestion === "Reject") {
                    $("#gemini").append(`<b>Violations:</b><ul>${evaluationText.violations.map((v) => `<li>${v}</li>`).join("")}</ul>`);
                }
            });
        };
        const evaluateImage = (displayAfterElement) => {
            const imagePreview = $(".image-preview");
            const geminiElement = $("#gemini");
            if (imagePreview.length > 0 && geminiElement.length === 0) {
                const src = imagePreview.attr("src");
                if (src === this.lastEvaluatedImageSrc) {
                    return;
                }
                this.lastEvaluatedImageSrc = src;
                $(displayAfterElement).after("<div id='gemini' class='changes'><i>Gemini is evaluating...</i><br></div>");
                GM_xmlhttpRequest({
                    method: "GET",
                    url: src,
                    responseType: "arraybuffer",
                    onload: onload_base64image.bind(this),
                });
            }
        };
        $(document.body).on("click", (_e) => {
            if (this.evaluateDebounceTimer) {
                clearTimeout(this.evaluateDebounceTimer);
            }
            this.evaluateDebounceTimer = setTimeout(() => {
                evaluateImage("div.changes");
            }, 300);
        });
    }
    getGeminiTextResponse(context) {
        return new Promise((resolve, reject) => {
            if (!this.geminiApiKey) {
                reject(new Error("Gemini API key is not set."));
                return;
            }
            const model = "gemini-2.5-flash";
            const message = {
                contents: [{ parts: [{ text: context }] }],
                generationConfig: { thinkingConfig: { thinkingBudget: 0 } },
            };
            GM_xmlhttpRequest({
                method: "POST",
                url: `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${this.geminiApiKey}`,
                headers: { "Content-Type": "application/json" },
                data: JSON.stringify(message),
                onload: function (response) {
                    try {
                        const data = JSON.parse(response.responseText);
                        // console.log(data["candidates"][0]["content"]["parts"][0]["text"]);
                        resolve(data["candidates"][0]["content"]["parts"][0]["text"]);
                    }
                    catch (e) {
                        console.error(new Error("Failed to parse response: " + e.message));
                        reject(new Error(`Failed to parse Gemini response: ${e.message}`));
                    }
                },
            });
        });
    }
    getGeminiPictureEvaluation(base64ImageData) {
        return new Promise((resolve, reject) => {
            if (!this.geminiApiKey) {
                reject(new Error("Gemini API key is not set."));
                return;
            }
            const model = "gemini-2.5-flash";
            const prompt = `You are an AI assistant specialized in Waze Map Editor (WME) venue image moderation.

Your task is to evaluate an uploaded image of a Waze venue against Waze Map Editor's official guidelines for venue images. You will determine if the image should be 'Approved' or 'Rejected' and provide a clear, concise justification, along with specific guideline violations if rejected.

I will provide you with an image for evaluation.

Respond with a JSON object with the following fields:
- "suggestion": "Approve" or "Reject"
- "reason": Concise explanation for the decision
- "violations": Array of violation codes if rejected. Valid codes: "IRRELEVANT_IMAGE", "LOW_QUALITY", "INAPPROPRIATE_CONTENT", "PERSONAL_INFORMATION", "SCREENSHOT_OF_MAP", "EXCESSIVE_TEXT_OR_OVERLAYS", "COPYRIGHTED_MATERIAL", "ORIENTATION_OR_CROPPING_ISSUE", "DUPLICATE_IMAGE", "OTHER_GENERAL_ISSUE"

Waze Venue Image Guidelines to Consider:

1.  **Relevance:** The image *must* clearly depict the venue/business itself (e.g., its entrance, sign, storefront). No random objects, people (unless part of a large crowd at an event, but generally avoided), or irrelevant scenery.
2.  **Quality:** Images must be clear, well-lit, in focus, and not blurry, pixelated, overexposed, or excessively dark.
3.  **Appropriateness:** No offensive, violent, sexually explicit, or hateful content.
4.  **No Personal Information:** Avoid identifiable faces (especially children), license plates, or other sensitive personal data unless it's an unchangeable part of the venue's permanent signage.
5.  **No Map Screenshots:** Do not approve images that are screenshots of Waze, Google Maps, or any other navigation/map application.
6.  **Minimal Text/Overlays:** Avoid images with excessive text, watermarks, promotional overlays, or graphic elements that are not part of the venue's physical branding/signage. A clear logo on a sign is generally fine; a flyer overlay is not.
7.  **Copyright:** Avoid copyrighted images without explicit permission (AI should err on the side of caution).
8.  **Focus:** The primary subject of the image should be the venue.
9.  **Orientation:** Landscape orientation is generally preferred for display, but a good quality portrait image of a tall building is acceptable if it clearly shows the venue. Poor rotation is a rejection reason.

Decision Logic:

* If the image adheres to all the above guidelines, set 'decision' to "Approved".
* If the image violates one or more guidelines, set 'decision' to "Rejected" and list *all* applicable violation codes in the 'violations' array.`;
            const message = {
                contents: [
                    {
                        parts: [
                            {
                                inlineData: {
                                    mimeType: "image/jpeg",
                                    data: base64ImageData,
                                },
                            },
                            {
                                text: prompt,
                            },
                        ],
                    },
                ],
                generationConfig: {
                    thinkingConfig: { thinkingBudget: 0 },
                    responseMimeType: "application/json",
                },
            };
            GM_xmlhttpRequest({
                method: "POST",
                url: `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${this.geminiApiKey}`,
                headers: { "Content-Type": "application/json" },
                data: JSON.stringify(message),
                onload: function (response) {
                    try {
                        const data = JSON.parse(response.responseText);
                        // console.log(data["candidates"][0]["content"]["parts"][0]["text"]);
                        resolve(data["candidates"][0]["content"]["parts"][0]["text"]);
                    }
                    catch (e) {
                        console.log(new Error("Failed to parse response: " + e.message));
                        reject(new Error(`Failed to parse Gemini response: ${e.message}`));
                    }
                },
            });
        });
    }
}

;// ./src/plugins/PluginURs.ts



class PluginURs {
    constructor() {
        this.sidebarElements = null;
        this.mapDataLoadedHandler = null;
        this.tabHTML = `
    <div><h4>WazeMY URs</h4></div>
    <div id="wazemyURs">
      <button id="wazemyURs_refresh">Refresh</button>
      <div id="wazemyURs_status"></div>
      <div id="wazemyURs_count"></div>
      <div id="wazemyURs_table">
      <table id="wazemyURs_list">
        <thead>
          <tr>
            <th>Type</th>
            <th>Sev</th>
            <th>Reported</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody></tbody>
      </table>
      </div>
    </div>
  `;
        this.sdk = unsafeWindow.getWmeSdk({
            scriptId: "wme-wazemy-urs",
            scriptName: "WazeMY",
        });
        this.initialize();
    }
    /**
     * Initialize plugin.
     *
     * @return {void} This function does not return anything.
     */
    initialize() {
        const settingsHTML = `<div><input type="checkbox" id="wazemySettings_urs_enable"/>
      <label for="wazemySettings_urs_enable">Enable URs Panel</label></div>`;
        $("#wazemySettings_settings").append(settingsHTML);
        $("#wazemySettings_urs_enable").on("change", () => {
            PluginManager.instance.updatePluginSettings("urs", {
                enable: $("#wazemySettings_urs_enable").prop("checked"),
            });
        });
        // Set settings according to last stored value.
        const savedSettings = SettingsStorage.instance.getSetting("urs");
        if (savedSettings?.enable === true) {
            $("#wazemySettings_urs_enable").prop("checked", true);
        }
        else {
            $("#wazemySettings_urs_enable").prop("checked", false);
        }
        console.log("[WazeMY] PluginURs initialized.");
    }
    /**
     * Enable plugin.
     *
     * @return {void} This function does not return anything.
     */
    enable() {
        this.sdk.Sidebar.registerScriptTab().then((sidebarResult) => {
            this.sidebarElements = sidebarResult;
            sidebarResult.tabLabel.innerHTML = "WazeMY URs";
            sidebarResult.tabLabel.title = "WazeMY URs";
            sidebarResult.tabPane.innerHTML = this.tabHTML;
            // Handle Refresh button.
            $("#wazemyURs_refresh").on("click", () => {
                this.refreshURList();
            });
            // Auto-refresh on map data loaded.
            this.mapDataLoadedHandler = () => {
                this.refreshURList();
            };
            this.sdk.Events.on({
                eventName: "wme-map-data-loaded",
                eventHandler: this.mapDataLoadedHandler,
            });
            // Initial load
            this.refreshURList();
            console.log("[WazeMY] PluginURs enabled.");
        });
    }
    /**
     * Refresh the UR list with current data.
     */
    refreshURList() {
        $("#wazemyURs_status").text("Loading URs...");
        $("#wazemyURs_list > tbody").empty();
        const allURs = this.sdk.DataModel.MapUpdateRequests.getAll();
        // Filter to only editable URs
        const editableURs = allURs.filter((ur) => ur.isEditable);
        // Sort by reportedOn descending (newest first)
        editableURs.sort((a, b) => b.reportedOn - a.reportedOn);
        let count = 0;
        editableURs.forEach((ur) => {
            const row = $("<tr>");
            row.attr("data-ur-id", ur.id.toString());
            row.addClass("wazemyURs_row");
            // Store geometry for click handler
            const lon = ur.geometry.coordinates[0];
            const lat = ur.geometry.coordinates[1];
            row.attr("data-lon", lon.toString());
            row.attr("data-lat", lat.toString());
            row.on("click", () => {
                this.sdk.Map.setMapCenter({
                    lonLat: { lon, lat },
                });
            });
            // Type column - format the type name
            const typeFormatted = this.formatURType(ur.updateRequestType);
            const typeHTML = `<td title="${ur.updateRequestType}">${typeFormatted}</td>`;
            row.append(typeHTML);
            // Severity column with color coding
            const severityClass = `wazemyURs_severity_${ur.severity}`;
            const severityHTML = `<td class="${severityClass}">${ur.severity.charAt(0).toUpperCase()}</td>`;
            row.append(severityHTML);
            // Reported date column
            const relativeTime = formatRelativeTime(ur.reportedOn);
            const fullDate = formatFullDate(ur.reportedOn);
            const reportedHTML = `<td title="${fullDate}">${relativeTime}</td>`;
            row.append(reportedHTML);
            // Status column
            const status = ur.isOpen ? "Open" : "Closed";
            const statusHTML = `<td>${status}</td>`;
            row.append(statusHTML);
            $("#wazemyURs_list > tbody").append(row);
            count++;
        });
        $("#wazemyURs_count").text(`Editable URs: ${count}`);
        $("#wazemyURs_status").text("");
    }
    /**
     * Format the UR type for display.
     */
    formatURType(type) {
        const typeMap = {
            BLOCKED_ROAD: "Blocked",
            INCORRECT_ADDRESS: "Address",
            INCORRECT_GENERAL_ERROR: "General",
            INCORRECT_JUNCTION: "Junction",
            INCORRECT_MISSING_ROUNDABOUT: "Roundabout",
            INCORRECT_ROUTE: "Route",
            INCORRECT_TURN: "Turn",
            MISSING_BRIDGE_OVERPASS: "Bridge",
            MISSING_EXIT: "Exit",
            MISSING_ROAD: "Missing Rd",
            TURN_NOT_ALLOWED: "No Turn",
            WRONG_DRIVING_DIRECTIONS: "Directions",
        };
        return typeMap[type] || type;
    }
    /**
     * Disable plugin.
     *
     * @return {void} This function does not return anything.
     */
    disable() {
        // Remove event handler
        if (this.mapDataLoadedHandler) {
            this.sdk.Events.off({
                eventName: "wme-map-data-loaded",
                eventHandler: this.mapDataLoadedHandler,
            });
            this.mapDataLoadedHandler = null;
        }
        if (this.sidebarElements) {
            this.sidebarElements.tabLabel.remove();
            this.sidebarElements.tabPane.remove();
            this.sidebarElements = null;
        }
        console.log("[WazeMY] PluginURs disabled.");
    }
    /**
     * Updates the settings of the PluginURs based on the provided settings object.
     *
     * @return {void} This function does not return anything.
     */
    updateSettings(settings) {
        if (settings.enable === true) {
            this.enable();
        }
        else {
            this.disable();
        }
        console.log("[WazeMY] PluginURs settings updated.", settings);
    }
}

;// ./src/PluginFactory.ts








class PluginFactory {
    static createPlugin(pluginName) {
        switch (pluginName) {
            case "PluginTooltip":
                return new PluginTooltip();
            case "PluginCopyLatLon":
                return new PluginCopyLatLon();
            case "PluginTrafficCameras":
                return new PluginTrafficCameras();
            case "PluginKVMR":
                return new PluginKVMR();
            case "PluginZoomPic":
                return new PluginZoomPic();
            case "PluginPlaces":
                return new PluginPlaces();
            case "PluginGemini":
                return new PluginGemini();
            case "PluginURs":
                return new PluginURs();
            default:
                throw new Error(`Unknown plugin: ${pluginName}`);
        }
    }
}

;// ./src/PluginManager.ts


class PluginManager {
    constructor(settings) {
        this.plugins = {};
        this.layerRegistry = new Map();
        this.settingsStorage = settings;
    }
    /**
     * Adds a plugin to the PluginManager.
     *
     * @param {string} key - The key to associate the plugin with.
     * @param {string} type - The type of plugin to create.
     * @return {void} This function does not return anything.
     */
    addPlugin(key, type) {
        const plugin = PluginFactory.createPlugin(type);
        this.plugins[key] = plugin;
        const pluginSettings = this.settingsStorage.getSetting(key);
        if (pluginSettings) {
            plugin.updateSettings(pluginSettings);
        }
    }
    /**
     * Removes a plugin from the PluginManager.
     *
     * @param {string} key - The key associated with the plugin to remove.
     * @return {void} This function does not return anything.
     */
    removePlugin(key) {
        if (this.plugins[key]) {
            this.settingsStorage.removeSetting(key);
            delete this.plugins[key];
        }
    }
    /**
     * Enables a plugin with the given key if it exists.
     *
     * @param {string} key - The key of the plugin to enable.
     * @return {void} This function does not return anything.
     */
    enablePlugin(key) {
        if (this.plugins[key]) {
            this.plugins[key].enable();
        }
    }
    /**
     * Disables a plugin with the given key if it exists.
     *
     * @param {string} key - The key of the plugin to disable.
     * @return {void} This function does not return anything.
     */
    disablePlugin(key) {
        if (this.plugins[key]) {
            this.plugins[key].disable();
        }
    }
    /**
     * Updates the settings of a plugin associated with the given key.
     *
     * @param {string} key - The key associated with the plugin.
     * @param {any} settings - The new settings to be applied to the plugin.
     * @return {void} This function does not return anything.
     */
    updatePluginSettings(key, settings) {
        if (this.plugins[key]) {
            this.plugins[key].updateSettings(settings);
            this.settingsStorage.updateSetting(key, settings);
        }
    }
    /**
     * Registers a layer in the layer registry for cross-plugin access.
     *
     * @param {string} name - The unique name of the layer.
     * @param {any} layer - The layer object to register.
     * @return {void} This function does not return anything.
     */
    registerLayer(name, layer) {
        this.layerRegistry.set(name, layer);
    }
    /**
     * Retrieves a layer from the layer registry.
     *
     * @param {string} name - The unique name of the layer.
     * @return {any} The layer object, or undefined if not found.
     */
    getLayer(name) {
        return this.layerRegistry.get(name);
    }
}
PluginManager.instance = new PluginManager(SettingsStorage.instance);

;// ./src/index.ts


const updateMessage = `Version 2026.01.29.1: Improved Gemini image evaluation performance with debounced click handling, image caching, proper binary-to-base64 conversion, and faster API responses.`;
var sdk;
console.log("[WazeMY] Script started");
unsafeWindow.SDK_INITIALIZED.then(initScript);
function initScript() {
    if (!unsafeWindow.getWmeSdk) {
        throw new Error("WME SDK not available");
    }
    sdk = unsafeWindow.getWmeSdk({
        scriptId: "wme-wazemy",
        scriptName: "WazeMY",
    });
    sdk.Events.once({ eventName: "wme-ready" }).then(initializeWazeMY);
}
function initializeWazeMY() {
    console.log("[WazeMY] WME ready");
    sdk.Sidebar.registerScriptTab().then((sidebarResult) => {
        sidebarResult.tabLabel.innerHTML = "WazeMY";
        sidebarResult.tabLabel.title = "WazeMY";
        sidebarResult.tabPane.innerHTML = `
        <wz-section-header headline="WazeMY" size="section-header2" class="settings-header">
          <wz-overline class="headline">WazeMY</wz-overline>
        </wz-section-header>
        <wz-overline class="headline">${GM_info.script.version}</wz-overline>
        <div class="settings">
          <div class="settings__form-group">
            <fieldset class="wazemySettings">
              <legend class="wazemySettingsLegend">
                <wz-label>Settings</wz-label>
              </legend>
              <div id="wazemySettings_settings"></div>
            </fieldset>
          </div>
          <div class="settings__form-group">
            <fieldset class="wazemySettings">
              <legend class="wazemySettingsLegend">
                <wz-label>Shortcuts</wz-label>
              </legend>
              <div id="wazemySettings_shortcuts"></div>
            </fieldset>
          </div>
          <div class="settings__form-group">
            <fieldset class="wazemySettings">
              <legend class="wazemySettingsLegend">
                <wz-label>Gemini</wz-label>
              </legend>
              <div id="wazemySettings_gemini"></div>
            </fieldset>
          </div>
        </div>
      `;
        WazeWrap.Interface.ShowScriptUpdate("WME WazeMY", GM_info.script.version, updateMessage, "https://greasyfork.org/en/scripts/404584-wazemy", "javascript:alert('No forum available');");
        const pluginManager = PluginManager.instance;
        pluginManager.addPlugin("copylatlon", "PluginCopyLatLon");
        pluginManager.addPlugin("tooltip", "PluginTooltip");
        pluginManager.addPlugin("trafcam", "PluginTrafficCameras");
        pluginManager.addPlugin("kvmr", "PluginKVMR");
        pluginManager.addPlugin("zoompic", "PluginZoomPic");
        pluginManager.addPlugin("places", "PluginPlaces");
        pluginManager.addPlugin("urs", "PluginURs");
        pluginManager.addPlugin("gemini", "PluginGemini");
    });
}

/******/ })()
;