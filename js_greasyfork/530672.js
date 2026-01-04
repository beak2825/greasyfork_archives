// ==UserScript==
// @name Fentify
// @description we do a little trolling
// @version 0.0.5
// @author crackbob
// @license GPL-3.0-or-later
// @homepage https://github.com/crackbob/Fentify
// @supportURL https://github.com/crackbob/Fentify
// @match *://Vectaria.io/*
// @grant none
// @namespace fentify
// @downloadURL https://update.greasyfork.org/scripts/530672/Fentify.user.js
// @updateURL https://update.greasyfork.org/scripts/530672/Fentify.meta.js
// ==/UserScript==

/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/css-loader/dist/cjs.js!./src/module/modules/visual/styles/clickgui.css":
/*!*********************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./src/module/modules/visual/styles/clickgui.css ***!
  \*********************************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../../node_modules/css-loader/dist/runtime/noSourceMaps.js */ "./node_modules/css-loader/dist/runtime/noSourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `@font-face {
    font-family: "Product Sans";
    src: url(https://fonts.gstatic.com/s/productsans/v19/pxiDypQkot1TnFhsFMOfGShVF9eO.woff2);
}

:root {
    --Fentify-accent-color: linear-gradient(90deg, rgb(64, 190, 255) 0%, rgb(129, 225, 255) 100%);
    --button-color: rgb(40, 40, 40, 0.9);
    --hover-color: rgb(50, 50, 50, 0.9);
    --panel-bg: rgb(34, 34, 34, 0.85);
    --panel-bg: rgb(10, 10, 10, 0.85);
    --text-color: #ffffff;
    --header-text-size: 25px;
    --button-text-size: 20px;
    --setting-text-size: 15px;
}

.gui-panel {
    position: fixed;
    z-index: 1000;
    width: 200px;
    border-radius: 8px;
    background-color: var(--panel-bg);
    box-shadow: 0 4px 8px rgba(0,0,0,0.3);
    font-family: 'Product Sans', sans-serif;
    color: var(--text-color);
    overflow: hidden;
}

.gui-header {
    background-color: var(--header-bg);
    height: 40px;
    font-weight: 900;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: var(--header-text-size);
    cursor: grab;
}

.gui-header:active {
    cursor: grabbing;
}

.gui-button {
    height: 35px;
    display: flex;
    align-items: center;
    padding-left: 10px;
    box-sizing: border-box;
    cursor: pointer;
    border-radius: 0;
    transition: all 0.3s;
    font-size: var(--button-text-size);
    font-weight: 200;
    outline: none;
    background: var(--button-color);
    color: var(--text-color);
}

.gui-button.enabled {
    background: var(--Fentify-accent-color);
}

.gui-button:not(.enabled):hover {
    background: var(--hover-color);
}

.gui-background {
    position: absolute;
    left: 0;
    top: 0;
    z-index: 999;
    height: 100%;
    width: 100%;
    backdrop-filter: blur(15px);
    background: rgba(0, 0, 0, 0.3);
}

.gui-setting-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: var(--panel-bg);
    padding: 2px;
}

.gui-setting-label {
    font-size: var(--setting-text-size);
    margin-left: 10px;
    font-weight: 300;
    color: var(--text-color);
}

.gui-checkbox {
    width: 15px;
    height: 15px;
    border-radius: 4px;
    background: var(--button-color);
    position: relative;
    margin: 8px;
    cursor: pointer;
    transition: background 0.3s;
}

.gui-checkbox.enabled {
    background: var(--Fentify-accent-color);
}

.gui-color-picker {
    width: 15px;
    height: 15px;
    border-radius: 4px;
    position: relative;
    margin: 8px;
    cursor: pointer;
}

.gui-color-input {
    width: 20px;
    height: 20px;
    opacity: 0;
    cursor: pointer;
}

.gui-button-container {
    background-color: var(--panel-bg);
    display: flex;
    flex-direction: column;
}

.gui-text-input {
    background: var(--button-color);
    border: none;
    color: var(--text-color);
    font-family: 'Product Sans', sans-serif;
    font-size: var(--setting-text-size);
    width: 40px;
    border-radius: 4px;
    outline: none;
    transition: background 0.3s;
    text-align: center;
    margin: 5px;
    margin-right: 10px;
}

.gui-text-input:hover {
    background: var(--hover-color);
}

.gui-text-input:focus {
    background: var(--hover-color);
}

.with-animations .gui-panel {
    animation: fadeInScale 0.3s ease-out;
}

@keyframes fadeInScale {
    from {
        opacity: 0;
        transform: scale(0.9);
    }
    to {
        opacity: 1;
        transform: scale(1);
    }
}

.with-animations .gui-background {
    animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}

.with-animations .gui-button {
    transition: transform 0.2s ease, background 0.2s ease;
}

.with-animations .gui-button:hover {
    transform: scale(1.01);
}

.with-animations .gui-setting-container {
    will-change: transform, opacity;
    transform-origin: top;
    animation: slideDown 0.25s ease-out forwards;
}

@keyframes slideDown {
    from {
        opacity: 0;
        transform: scaleY(0.8);
    }
    to {
        opacity: 1;
        transform: scaleY(1);
    }
}

.blockSelector {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 500px;
    height: 500px;
    overflow-y: auto;
    background-color: rgba(40, 40, 40);
    border-radius: 10px;
    padding: 20px;
    z-index: 9999;
}

.blockSelector::-webkit-scrollbar {
    display: none;
}`, ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/api.js":
/*!*****************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/api.js ***!
  \*****************************************************/
/***/ ((module) => {



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

/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/noSourceMaps.js":
/*!**************************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/noSourceMaps.js ***!
  \**************************************************************/
/***/ ((module) => {



module.exports = function (i) {
  return i[1];
};

/***/ }),

/***/ "./src/module/modules/visual/styles/clickgui.css":
/*!*******************************************************!*\
  !*** ./src/module/modules/visual/styles/clickgui.css ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../../../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !../../../../../node_modules/style-loader/dist/runtime/styleDomAPI.js */ "./node_modules/style-loader/dist/runtime/styleDomAPI.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../../../../node_modules/style-loader/dist/runtime/insertBySelector.js */ "./node_modules/style-loader/dist/runtime/insertBySelector.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../../../../node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js */ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! !../../../../../node_modules/style-loader/dist/runtime/insertStyleElement.js */ "./node_modules/style-loader/dist/runtime/insertStyleElement.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! !../../../../../node_modules/style-loader/dist/runtime/styleTagTransform.js */ "./node_modules/style-loader/dist/runtime/styleTagTransform.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_clickgui_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../../../../../node_modules/css-loader/dist/cjs.js!./clickgui.css */ "./node_modules/css-loader/dist/cjs.js!./src/module/modules/visual/styles/clickgui.css");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());
options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_clickgui_css__WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_clickgui_css__WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_clickgui_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_clickgui_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js":
/*!****************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js ***!
  \****************************************************************************/
/***/ ((module) => {



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

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/insertBySelector.js":
/*!********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/insertBySelector.js ***!
  \********************************************************************/
/***/ ((module) => {



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

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/insertStyleElement.js":
/*!**********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/insertStyleElement.js ***!
  \**********************************************************************/
/***/ ((module) => {



/* istanbul ignore next  */
function insertStyleElement(options) {
  var element = document.createElement("style");
  options.setAttributes(element, options.attributes);
  options.insert(element, options.options);
  return element;
}
module.exports = insertStyleElement;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js":
/*!**********************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js ***!
  \**********************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



/* istanbul ignore next  */
function setAttributesWithoutAttributes(styleElement) {
  var nonce =  true ? __webpack_require__.nc : 0;
  if (nonce) {
    styleElement.setAttribute("nonce", nonce);
  }
}
module.exports = setAttributesWithoutAttributes;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/styleDomAPI.js":
/*!***************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/styleDomAPI.js ***!
  \***************************************************************/
/***/ ((module) => {



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

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/styleTagTransform.js":
/*!*********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/styleTagTransform.js ***!
  \*********************************************************************/
/***/ ((module) => {



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

/***/ }),

/***/ "./src/events.js":
/*!***********************!*\
  !*** ./src/events.js ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
    listeners: {},
    activeKeys: new Set(),
    on: function (event, callback) {
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }

        this.listeners[event].push(callback);
    },
    remove: function (event, callback) {
        if (!this.listeners[event]) {
            return;
        }

        this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
    },
    emit: function (event, data) {
        if (!this.listeners[event]) {
            return;
        }

        this.listeners[event].forEach(callback => callback(data));
    },
    trackKey: function (eventType, key, code) {
        if (eventType === "keydown") {
            moduleManager.handleKeyPress(code);
        }
        if (eventType === "keydown" && !this.activeKeys.has(key)) {
            this.activeKeys.add(key);
            this.emit("keyPress", { key, code });
        }
        if (eventType === "keyup" && this.activeKeys.has(key)) {
            this.activeKeys.delete(key);
            this.emit("keyRelease", { key, code });
        }
    }
});

/***/ }),

/***/ "./src/hooks.js":
/*!**********************!*\
  !*** ./src/hooks.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
    get mainIndexUrl () {
        return Object.values(document.scripts).find(script => script?.src?.includes("index")).src
    },
    
    async getAllChunks () {
        let code = await fetch(this.mainIndexUrl)
        .then(res => res.text())
        .then(code => code.split('\n')[0]);

        let __vite__mapDeps = Function(code + `return __vite__mapDeps`)()
        __vite__mapDeps([1]);
        return __vite__mapDeps.f.filter(chunkUrl => chunkUrl.includes("js"));
    },

    safeImport (src) {
        return eval(`(async () => { return await import("${src}")})()`);
    },

    init: async function () {
        let allChunks = (await this.getAllChunks()).map(url => "https://" + location.host + "/" + url);
        allChunks.push(this.mainIndexUrl);
        allChunks = allChunks.filter(url => !url.includes("General")); // causes errors idk wtf
        let importedModules = await Promise.all(allChunks.map(url => this.safeImport(url)));
        let allModuleExports = importedModules.flatMap(module => Object.values(module));
        this.stores = Object.values(allModuleExports).filter(exports => exports?.$id).reduce((acc, exports) => (acc[exports.$id] = exports(), acc), {});
    }
});

/***/ }),

/***/ "./src/module/module.js":
/*!******************************!*\
  !*** ./src/module/module.js ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Module)
/* harmony export */ });
/* harmony import */ var _events__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../events */ "./src/events.js");


class Module {
    constructor(name, category, options, keybind) {
        this.name = name;
        this.category = category;
        this.options = options;
        this.keybind = keybind;
        this.waitingForBind = false;
        this.isEnabled = false;
        this.toggle = this.toggle.bind(this);
    }

    onEnable () {}
    onDisable() {}
    onRender() {}
    onSettingUpdate() {}

    enable () {
        this.isEnabled = true;
        _events__WEBPACK_IMPORTED_MODULE_0__["default"].emit("module.update", this);
        this.onEnable();
    }

    disable () {
        this.isEnabled = false;
        _events__WEBPACK_IMPORTED_MODULE_0__["default"].emit("module.update", this);
        this.onDisable();
    }

    toggle () {
        if (this.isEnabled) {
            this.disable();
        } else {
            this.enable();
        }
    };
};

/***/ }),

/***/ "./src/module/moduleManager.js":
/*!*************************************!*\
  !*** ./src/module/moduleManager.js ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _events__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../events */ "./src/events.js");
/* harmony import */ var _modules_visual_Arraylist__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./modules/visual/Arraylist */ "./src/module/modules/visual/Arraylist.js");
/* harmony import */ var _hooks__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../hooks */ "./src/hooks.js");
/* harmony import */ var _modules_visual_Watermark__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./modules/visual/Watermark */ "./src/module/modules/visual/Watermark.js");
/* harmony import */ var _modules_visual_ClickGUI__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./modules/visual/ClickGUI */ "./src/module/modules/visual/ClickGUI.js");
/* harmony import */ var _modules_movement_Airjump__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./modules/movement/Airjump */ "./src/module/modules/movement/Airjump.js");
/* harmony import */ var _modules_misc_Instabreak__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./modules/misc/Instabreak */ "./src/module/modules/misc/Instabreak.js");
/* harmony import */ var _modules_misc_SpoofBlock__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./modules/misc/SpoofBlock */ "./src/module/modules/misc/SpoofBlock.js");
/* harmony import */ var _modules_misc_Nuker__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./modules/misc/Nuker */ "./src/module/modules/misc/Nuker.js");
/* harmony import */ var _modules_misc_SpoofLevel__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./modules/misc/SpoofLevel */ "./src/module/modules/misc/SpoofLevel.js");
/* harmony import */ var _modules_misc_Emote__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./modules/misc/Emote */ "./src/module/modules/misc/Emote.js");
/* harmony import */ var _modules_misc_AdBypass__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./modules/misc/AdBypass */ "./src/module/modules/misc/AdBypass.js");
/* harmony import */ var _modules_movement_Velocity__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./modules/movement/Velocity */ "./src/module/modules/movement/Velocity.js");
/* harmony import */ var _modules_combat_NoHitDelay__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./modules/combat/NoHitDelay */ "./src/module/modules/combat/NoHitDelay.js");
/* harmony import */ var _modules_movement_Fly__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./modules/movement/Fly */ "./src/module/modules/movement/Fly.js");
/* harmony import */ var _modules_movement_NoFall__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./modules/movement/NoFall */ "./src/module/modules/movement/NoFall.js");
/* harmony import */ var _modules_movement_Speed__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./modules/movement/Speed */ "./src/module/modules/movement/Speed.js");
/* harmony import */ var _modules_misc_FreeCoupons__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ./modules/misc/FreeCoupons */ "./src/module/modules/misc/FreeCoupons.js");
/* harmony import */ var _modules_visual_Chams__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ./modules/visual/Chams */ "./src/module/modules/visual/Chams.js");
/* harmony import */ var _modules_combat_Triggerbot__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ./modules/combat/Triggerbot */ "./src/module/modules/combat/Triggerbot.js");
/* harmony import */ var _modules_movement_Scaffold__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ./modules/movement/Scaffold */ "./src/module/modules/movement/Scaffold.js");
/* harmony import */ var _modules_misc_Fill__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! ./modules/misc/Fill */ "./src/module/modules/misc/Fill.js");
/* harmony import */ var _modules_movement_NoClip__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! ./modules/movement/NoClip */ "./src/module/modules/movement/NoClip.js");
/* harmony import */ var _modules_combat_Killaura__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(/*! ./modules/combat/Killaura */ "./src/module/modules/combat/Killaura.js");
/* harmony import */ var _modules_visual_BlockOutline__WEBPACK_IMPORTED_MODULE_24__ = __webpack_require__(/*! ./modules/visual/BlockOutline */ "./src/module/modules/visual/BlockOutline.js");
/* harmony import */ var _modules_combat_TPAura__WEBPACK_IMPORTED_MODULE_25__ = __webpack_require__(/*! ./modules/combat/TPAura */ "./src/module/modules/combat/TPAura.js");
/* harmony import */ var _modules_misc_InstantRespawn__WEBPACK_IMPORTED_MODULE_26__ = __webpack_require__(/*! ./modules/misc/InstantRespawn */ "./src/module/modules/misc/InstantRespawn.js");





























/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
    modules: {},
    addModules: function (...modules) {
        for(const module of modules) this.modules[module.name] = module;
    },
    addModule: function (module) {
        this.modules[module.name] = module;
    },
    handleKeyPress: function (key) {
        for (let name in this.modules) {
            let module = this.modules[name];

            if (module.waitingForBind) {
                module.keybind = key;
                module.waitingForBind = false;
                
            } else if (module.keybind == key) {
                module.toggle();
            }
        }
    },

    init () {
        this.addModules(
            new _modules_visual_Arraylist__WEBPACK_IMPORTED_MODULE_1__["default"](),
            new _modules_visual_Watermark__WEBPACK_IMPORTED_MODULE_3__["default"](),
            new _modules_visual_ClickGUI__WEBPACK_IMPORTED_MODULE_4__["default"](),
            new _modules_movement_Airjump__WEBPACK_IMPORTED_MODULE_5__["default"](),
            new _modules_misc_Instabreak__WEBPACK_IMPORTED_MODULE_6__["default"](),
            new _modules_misc_SpoofBlock__WEBPACK_IMPORTED_MODULE_7__["default"](),
            new _modules_misc_Nuker__WEBPACK_IMPORTED_MODULE_8__["default"](),
            new _modules_misc_SpoofLevel__WEBPACK_IMPORTED_MODULE_9__["default"](),
            new _modules_misc_Emote__WEBPACK_IMPORTED_MODULE_10__["default"](),
            new _modules_misc_AdBypass__WEBPACK_IMPORTED_MODULE_11__["default"](),
            new _modules_movement_Velocity__WEBPACK_IMPORTED_MODULE_12__["default"](),
            new _modules_combat_NoHitDelay__WEBPACK_IMPORTED_MODULE_13__["default"](),
            new _modules_movement_Fly__WEBPACK_IMPORTED_MODULE_14__["default"](),
            new _modules_movement_NoFall__WEBPACK_IMPORTED_MODULE_15__["default"](),
            new _modules_movement_Speed__WEBPACK_IMPORTED_MODULE_16__["default"](),
            new _modules_misc_FreeCoupons__WEBPACK_IMPORTED_MODULE_17__["default"](),
            new _modules_visual_Chams__WEBPACK_IMPORTED_MODULE_18__["default"](),
            new _modules_combat_Triggerbot__WEBPACK_IMPORTED_MODULE_19__["default"](),
            new _modules_movement_Scaffold__WEBPACK_IMPORTED_MODULE_20__["default"](),
            new _modules_misc_Fill__WEBPACK_IMPORTED_MODULE_21__["default"](),
            new _modules_movement_NoClip__WEBPACK_IMPORTED_MODULE_22__["default"](),
            new _modules_combat_Killaura__WEBPACK_IMPORTED_MODULE_23__["default"](),
            new _modules_visual_BlockOutline__WEBPACK_IMPORTED_MODULE_24__["default"](),
            new _modules_combat_TPAura__WEBPACK_IMPORTED_MODULE_25__["default"](),
            new _modules_misc_InstantRespawn__WEBPACK_IMPORTED_MODULE_26__["default"]()
        );

        _events__WEBPACK_IMPORTED_MODULE_0__["default"].on("render", () => {
            for (let name in this.modules) {
                if (this.modules[name].isEnabled) {
                    this.modules[name].onRender();
                }
            }
        });

        _events__WEBPACK_IMPORTED_MODULE_0__["default"].on("keydown", this.handleKeyPress.bind(this));
        _events__WEBPACK_IMPORTED_MODULE_0__["default"].on("setting.update", () => {
            for (let name in this.modules) {
                if (this.modules[name].isEnabled) {
                    this.modules[name].onSettingUpdate();
                }
            }
        });

        
        this.modules["Arraylist"].enable();
        this.modules["Watermark"].enable();
    }
});

/***/ }),

/***/ "./src/module/modules/combat/Killaura.js":
/*!***********************************************!*\
  !*** ./src/module/modules/combat/Killaura.js ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Killaura)
/* harmony export */ });
/* harmony import */ var _module__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../module */ "./src/module/module.js");
/* harmony import */ var _hooks__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../hooks */ "./src/hooks.js");
/* harmony import */ var _moduleManager__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../moduleManager */ "./src/module/moduleManager.js");
/* harmony import */ var _utils_gameUtils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../utils/gameUtils */ "./src/utils/gameUtils.js");





class Killaura extends _module__WEBPACK_IMPORTED_MODULE_0__["default"] {
    constructor() {
        super("Killaura", "Combat", {
            "Y Offset": 1.62,
            "Reach": 5,
            "Delay": 100
        });
        this.lastExecutionTime = null;
    }

    onRender() {
        const currentTime = Date.now();
        if (!_hooks__WEBPACK_IMPORTED_MODULE_1__["default"]?.stores?.gameState?.gameWorld?.player) return;
        if (currentTime - this.lastExecutionTime >= this.options["Delay"]) {
            this.lastExecutionTime = currentTime;
            this.tryKill();
        }
    }

    tryKill () {
        let reach = this.options["Reach"];
        let yOffset = this.options["Y Offset"];

        let targetPlayer = _utils_gameUtils__WEBPACK_IMPORTED_MODULE_3__["default"].getClosestPlayer();
        var playerPosition = {
            x: _hooks__WEBPACK_IMPORTED_MODULE_1__["default"].stores.gameState.gameWorld.player.position.x,
            y: _hooks__WEBPACK_IMPORTED_MODULE_1__["default"].stores.gameState.gameWorld.player.position.y + yOffset,
            z: _hooks__WEBPACK_IMPORTED_MODULE_1__["default"].stores.gameState.gameWorld.player.position.z
        };

        var targetPosition = targetPlayer.position;
        var direction = {
            x: playerPosition.x - targetPosition.x,
            y: playerPosition.y - targetPosition.y,
            z: playerPosition.z - targetPosition.z
        };

        var length = Math.sqrt(direction.x * direction.x + direction.y * direction.y + direction.z * direction.z);

        if (length !== 0) {
            direction.x /= length;
            direction.y /= length;
            direction.z /= length;
        }

        direction.x = -direction.x;
        direction.y = -direction.y;
        direction.z = -direction.z;

        var distance = Math.sqrt(
            Math.pow(playerPosition.x - targetPosition.x, 2) +
            Math.pow(playerPosition.y - targetPosition.y, 2) +
            Math.pow(playerPosition.z - targetPosition.z, 2)
        );

        if (distance < reach) {
            _hooks__WEBPACK_IMPORTED_MODULE_1__["default"].stores.gameState.gameWorld.server.sendData(61, [
                playerPosition.x,
                playerPosition.y,
                playerPosition.z,
                direction.x,
                direction.y,
                direction.z,
                _hooks__WEBPACK_IMPORTED_MODULE_1__["default"].stores.gameState.gameWorld.time.localServerTimeMs,
                targetPlayer.id
            ]);
        }
    }
}

/***/ }),

/***/ "./src/module/modules/combat/NoHitDelay.js":
/*!*************************************************!*\
  !*** ./src/module/modules/combat/NoHitDelay.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ NoHitDelay)
/* harmony export */ });
/* harmony import */ var _module__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../module */ "./src/module/module.js");
/* harmony import */ var _hooks__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../hooks */ "./src/hooks.js");



class NoHitDelay extends _module__WEBPACK_IMPORTED_MODULE_0__["default"] {
    constructor() {
        super("NoHitDelay", "Combat");
    }

    get hitSystem () {
        return _hooks__WEBPACK_IMPORTED_MODULE_1__["default"].stores.gameState.gameWorld.systemsManager.activeExecuteSystems.find(sys => sys?.lastAttackTimeMs !== undefined);
    }

    onEnable() {
        this.hitSystem.__defineGetter__("attackTimeDelayMs", () => 0);
        this.hitSystem.__defineSetter__("attackTimeDelayMs", () => 0);
    }

    onDisable() {
        delete this.hitSystem.attackTimeDelayMs;
        this.hitSystem.attackTimeDelayMs = 750;
    }
}

/***/ }),

/***/ "./src/module/modules/combat/TPAura.js":
/*!*********************************************!*\
  !*** ./src/module/modules/combat/TPAura.js ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ TPAura)
/* harmony export */ });
/* harmony import */ var _module__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../module */ "./src/module/module.js");
/* harmony import */ var _hooks__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../hooks */ "./src/hooks.js");
/* harmony import */ var _moduleManager__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../moduleManager */ "./src/module/moduleManager.js");
/* harmony import */ var _utils_gameUtils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../utils/gameUtils */ "./src/utils/gameUtils.js");





class TPAura extends _module__WEBPACK_IMPORTED_MODULE_0__["default"] {
    constructor() {
        super("TPAura", "Combat", {
            "Y Offset": 1.62,
            "Radius": 1,
            "Delay": 100
        });
        this.lastExecutionTime = null;
    }

    onRender() {
        const currentTime = Date.now();
        if (!_hooks__WEBPACK_IMPORTED_MODULE_1__["default"]?.stores?.gameState?.gameWorld?.player) return;
        if (currentTime - this.lastExecutionTime >= this.options["Delay"]) {
            this.lastExecutionTime = currentTime;
            this.tryKill();
        }
    }

    tryKill () {
        let radius = this.options["Radius"];
        let yOffset = this.options["Y Offset"];

        let targetPlayer = _utils_gameUtils__WEBPACK_IMPORTED_MODULE_3__["default"].getClosestPlayer();

        if (!targetPlayer?.position) return;

        var playerPosition = {
            x: _hooks__WEBPACK_IMPORTED_MODULE_1__["default"].stores.gameState.gameWorld.player.position.x,
            y: _hooks__WEBPACK_IMPORTED_MODULE_1__["default"].stores.gameState.gameWorld.player.position.y + yOffset,
            z: _hooks__WEBPACK_IMPORTED_MODULE_1__["default"].stores.gameState.gameWorld.player.position.z
        };

        var targetPosition = targetPlayer.position;
        var direction = {
            x: playerPosition.x - targetPosition.x,
            y: playerPosition.y - targetPosition.y,
            z: playerPosition.z - targetPosition.z
        };

        var length = Math.sqrt(direction.x * direction.x + direction.y * direction.y + direction.z * direction.z);

        if (length !== 0) {
            direction.x /= length;
            direction.y /= length;
            direction.z /= length;
        }

        direction.x = -direction.x;
        direction.y = -direction.y;
        direction.z = -direction.z;

        var distance = Math.sqrt(
            Math.pow(playerPosition.x - targetPosition.x, 2) +
            Math.pow(playerPosition.y - targetPosition.y, 2) +
            Math.pow(playerPosition.z - targetPosition.z, 2)
        );

        if (distance > radius) {
            _hooks__WEBPACK_IMPORTED_MODULE_1__["default"].stores.gameState.gameWorld.player.position = targetPlayer.position.clone();
        }

        _hooks__WEBPACK_IMPORTED_MODULE_1__["default"].stores.gameState.gameWorld.server.sendData(61, [
            playerPosition.x,
            playerPosition.y,
            playerPosition.z,
            direction.x,
            direction.y,
            direction.z,
            _hooks__WEBPACK_IMPORTED_MODULE_1__["default"].gameWorld.time.localServerTimeMs,
            targetPlayer.id
        ]);
    }
}

/***/ }),

/***/ "./src/module/modules/combat/Triggerbot.js":
/*!*************************************************!*\
  !*** ./src/module/modules/combat/Triggerbot.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Triggerbot)
/* harmony export */ });
/* harmony import */ var _module__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../module */ "./src/module/module.js");
/* harmony import */ var _hooks__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../hooks */ "./src/hooks.js");



class Triggerbot extends _module__WEBPACK_IMPORTED_MODULE_0__["default"] {
    constructor() {
        super("Triggerbot", "Combat", {
            "Interval": 50
        });
        this.lastExecutionTime = 0;
    }

    get hitSystem () {
        return _hooks__WEBPACK_IMPORTED_MODULE_1__["default"].stores.gameState.gameWorld.systemsManager.activeExecuteSystems.find(sys => sys?.lastAttackTimeMs !== undefined);
    }

    onRender() {
        const currentTime = Date.now();

        if (!_hooks__WEBPACK_IMPORTED_MODULE_1__["default"]?.stores?.gameState?.gameWorld?.player) return;
        if (currentTime - this.lastExecutionTime >= this.options["Interval"] && this.hitSystem?.hitPlayers) {
            this.lastExecutionTime = currentTime;
            this.hitSystem.hitPlayers()
        }
    }
}

/***/ }),

/***/ "./src/module/modules/misc/AdBypass.js":
/*!*********************************************!*\
  !*** ./src/module/modules/misc/AdBypass.js ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ AdBypass)
/* harmony export */ });
/* harmony import */ var _module__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../module */ "./src/module/module.js");
/* harmony import */ var _hooks__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../hooks */ "./src/hooks.js");



class AdBypass extends _module__WEBPACK_IMPORTED_MODULE_0__["default"] {
    constructor() {
        super("AdBypass", "Misc");
    }

    onEnable() {
        this._reward = this._reward || _hooks__WEBPACK_IMPORTED_MODULE_1__["default"].stores.user.rewardCommercialVideoWrapper;
        _hooks__WEBPACK_IMPORTED_MODULE_1__["default"].stores.user.rewardCommercialVideoWrapper = () => true;
    }

    onDisable() {
        _hooks__WEBPACK_IMPORTED_MODULE_1__["default"].stores.user.rewardCommercialVideoWrapper = () => this._reward;
    }
}

/***/ }),

/***/ "./src/module/modules/misc/Emote.js":
/*!******************************************!*\
  !*** ./src/module/modules/misc/Emote.js ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Emote)
/* harmony export */ });
/* harmony import */ var _module__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../module */ "./src/module/module.js");
/* harmony import */ var _hooks__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../hooks */ "./src/hooks.js");



class Emote extends _module__WEBPACK_IMPORTED_MODULE_0__["default"] {
    constructor() {
        super("Emote", "Misc", {
            "Emote name": "No",
            "Infinity": false
        });
    }

    onEnable() {
        _hooks__WEBPACK_IMPORTED_MODULE_1__["default"].stores.roomManager.ws.sendData(77, {
            name: this.options["Emote name"],
            infinity: this.options["Infinity"]
        })
    }
}

/***/ }),

/***/ "./src/module/modules/misc/Fill.js":
/*!*****************************************!*\
  !*** ./src/module/modules/misc/Fill.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Fill)
/* harmony export */ });
/* harmony import */ var _module__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../module */ "./src/module/module.js");
/* harmony import */ var _hooks__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../hooks */ "./src/hooks.js");
/* harmony import */ var _moduleManager__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../moduleManager */ "./src/module/moduleManager.js");




class Fill extends _module__WEBPACK_IMPORTED_MODULE_0__["default"] {
    constructor() {
        super("Fill", "Misc", {
            "Radius": 4,
            "Delay": 120
        });
        this.blockIndex = 0;
    }

    onEnable() {
        this.blockIndex = 0;
        let radius = this.options["Radius"];
        let blockUnderPlayer = Object.values(_hooks__WEBPACK_IMPORTED_MODULE_1__["default"].stores.gameState.gameWorld.player.position).map(Math.floor);
        blockUnderPlayer[1]--;

        let dx = -radius, dy = -radius, dz = -radius;
        let blocks = [];
        
        while (dx <= radius) {
            while (dy <= radius) {
                while (dz <= radius) {
                    if (Math.sqrt(dx * dx + dy * dy + dz * dz) <= radius) {
                        let blockPos = [blockUnderPlayer[0] + dx, blockUnderPlayer[1] + dy, blockUnderPlayer[2] + dz];
                        let blockID = _hooks__WEBPACK_IMPORTED_MODULE_1__["default"].stores.gameState.gameWorld.chunkManager.getBlock(...blockPos);
                        let replaceable = _hooks__WEBPACK_IMPORTED_MODULE_1__["default"].stores.gameState.gameWorld.allItems[blockID]?.replaceable || false;

                        if (replaceable || blockID == 0) {
                            blocks.push(blockPos);
                        }
                    }
                    dz++;
                }
                dz = -radius;
                dy++;
            }
            dy = -radius;
            dx++;
        }
        
        let context = this;
        let delay = this.options["Delay"];
        function placeNextBlock() {
            let blockId = _hooks__WEBPACK_IMPORTED_MODULE_1__["default"].stores.gameState.gameWorld.player.currentHandItemId;
            if (context.blockIndex < blocks.length) {
                const [newX, newY, newZ] = blocks[context.blockIndex];
                setTimeout(() => {
                    _hooks__WEBPACK_IMPORTED_MODULE_1__["default"].stores.gameState.gameWorld.chunkManager.placeBlockWithMsgSending(newX, newY, newZ, blockId);
                    context.blockIndex++;
                    placeNextBlock();
                }, delay);
            } else {
                context.blockIndex = 0;
                _moduleManager__WEBPACK_IMPORTED_MODULE_2__["default"].modules["Fill"].disable();
            }
        }
        placeNextBlock();
    }
}

/***/ }),

/***/ "./src/module/modules/misc/FreeCoupons.js":
/*!************************************************!*\
  !*** ./src/module/modules/misc/FreeCoupons.js ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ FreeCoupons)
/* harmony export */ });
/* harmony import */ var _module__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../module */ "./src/module/module.js");
/* harmony import */ var _hooks__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../hooks */ "./src/hooks.js");
/* harmony import */ var _moduleManager__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../moduleManager */ "./src/module/moduleManager.js");




class FreeCoupons extends _module__WEBPACK_IMPORTED_MODULE_0__["default"] {
    constructor() {
        super("FreeCoupons", "Misc");
        
    }

    onEnable() {
        fetch("https://api.vectaria.io/v2/users/getAdCoupons", {
            "credentials": "include"
        }).then(response => {
            if (!response.ok) {
                alert("Reached Daily limit");
            } else {
                _hooks__WEBPACK_IMPORTED_MODULE_1__["default"].stores.user.user.coupons += 10;
            }
        })
        _moduleManager__WEBPACK_IMPORTED_MODULE_2__["default"].modules["FreeCoupons"].disable();
    }
}

/***/ }),

/***/ "./src/module/modules/misc/Instabreak.js":
/*!***********************************************!*\
  !*** ./src/module/modules/misc/Instabreak.js ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Instabreak)
/* harmony export */ });
/* harmony import */ var _module__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../module */ "./src/module/module.js");
/* harmony import */ var _hooks__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../hooks */ "./src/hooks.js");



class Instabreak extends _module__WEBPACK_IMPORTED_MODULE_0__["default"] {
    constructor() {
        super("Instabreak", "Misc", null);
        this.originalHardness = new Map();
    }

    onEnable() {
        Object.values(_hooks__WEBPACK_IMPORTED_MODULE_1__["default"].stores.gameState.gameWorld.allItems).forEach((block) => {
            if (block?.destruction) {
                if (!this.originalHardness.has(block)) {
                    this.originalHardness.set(block, block.destruction.durability);
                }
                block.destruction.durability = 0;
            }
        });
    }

    onDisable() {
        Object.values(_hooks__WEBPACK_IMPORTED_MODULE_1__["default"].stores.gameState.gameWorld.allItems).forEach((block) => {
            if (block?.destruction && this.originalHardness.has(block)) {
                block.destruction.durability = this.originalHardness.get(block);
            }
        });
    }
}

/***/ }),

/***/ "./src/module/modules/misc/InstantRespawn.js":
/*!***************************************************!*\
  !*** ./src/module/modules/misc/InstantRespawn.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ InstantRespawn)
/* harmony export */ });
/* harmony import */ var _module__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../module */ "./src/module/module.js");
/* harmony import */ var _hooks__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../hooks */ "./src/hooks.js");



class InstantRespawn extends _module__WEBPACK_IMPORTED_MODULE_0__["default"] {
    constructor() {
        super("InstantRespawn", "Misc", null);
    }

    onRender() {
        if (!_hooks__WEBPACK_IMPORTED_MODULE_1__["default"]?.stores?.gameState?.gameWorld?.player) return;

        if (_hooks__WEBPACK_IMPORTED_MODULE_1__["default"].stores.playerState.isDeath) {
            _hooks__WEBPACK_IMPORTED_MODULE_1__["default"].stores.playerState.respawn();
            _hooks__WEBPACK_IMPORTED_MODULE_1__["default"].stores.playerState.isDeath = false;
        }
    }
}

/***/ }),

/***/ "./src/module/modules/misc/Nuker.js":
/*!******************************************!*\
  !*** ./src/module/modules/misc/Nuker.js ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Nuker)
/* harmony export */ });
/* harmony import */ var _module__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../module */ "./src/module/module.js");
/* harmony import */ var _hooks__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../hooks */ "./src/hooks.js");
/* harmony import */ var _moduleManager__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../moduleManager */ "./src/module/moduleManager.js");




class Nuker extends _module__WEBPACK_IMPORTED_MODULE_0__["default"] {
    constructor() {
        super("Nuker", "Misc", {
            "Radius": 4,
            "Delay": 120,
            "Target Selected Block": false,
            "Auto Disable": false
        });
        this.blockIndex = 0;
    }

    get selectedBlock () {
        return _hooks__WEBPACK_IMPORTED_MODULE_1__["default"].stores.gameState.gameWorld?.systemsManager.activeExecuteSystems.find(sys => sys?.currBlockPos !== undefined) || undefined;
    }

    onEnable() {
        this.blockIndex = 0;
        let radius = this.options["Radius"];
        let blockUnderPlayer = Object.values(_hooks__WEBPACK_IMPORTED_MODULE_1__["default"].stores.gameState.gameWorld.player.position).map(Math.floor);
        blockUnderPlayer[1]--;

        if (this.options["Target Selected Block"]) {
            blockUnderPlayer = [...this.selectedBlock.currBlockPos];
        }

        let dx = -radius, dy = -radius, dz = -radius;
        let blocks = [];
        
        while (dx <= radius) {
            while (dy <= radius) {
                while (dz <= radius) {
                    if (Math.sqrt(dx * dx + dy * dy + dz * dz) <= radius) {
                        let blockPos = [blockUnderPlayer[0] + dx, blockUnderPlayer[1] + dy, blockUnderPlayer[2] + dz];
                        let blockID = _hooks__WEBPACK_IMPORTED_MODULE_1__["default"].stores.gameState.gameWorld.chunkManager.getBlock(...blockPos);

                        if (blockID !== 0) {
                            blocks.push(blockPos);
                        }
                    }
                    dz++;
                }
                dz = -radius;
                dy++;
            }
            dy = -radius;
            dx++;
        }
        
        let context = this;
        let options = this.options;
        function breakNextBlock() {
            if (context.blockIndex < blocks.length) {
                const [newX, newY, newZ] = blocks[context.blockIndex];
                setTimeout(() => {
                    _hooks__WEBPACK_IMPORTED_MODULE_1__["default"].stores.gameState.gameWorld.chunkManager.placeBlockWithMsgSending(newX, newY, newZ, 0);
                    context.blockIndex++;
                    breakNextBlock();
                }, options["Delay"]);
            } else {
                context.blockIndex = 0;
                if (options["Auto Disable"]) {
                    _moduleManager__WEBPACK_IMPORTED_MODULE_2__["default"].modules["Nuker"].disable();
                } else {
                    context.onEnable();
                }
            }
        }

        breakNextBlock();
    }
}

/***/ }),

/***/ "./src/module/modules/misc/SpoofBlock.js":
/*!***********************************************!*\
  !*** ./src/module/modules/misc/SpoofBlock.js ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ SpoofBlock)
/* harmony export */ });
/* harmony import */ var _module__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../module */ "./src/module/module.js");
/* harmony import */ var _hooks__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../hooks */ "./src/hooks.js");



class SpoofBlock extends _module__WEBPACK_IMPORTED_MODULE_0__["default"] {
    constructor() {
        super("SpoofBlock", "Misc");
        this.blockID = 0;
    }

    onRender () {
        if (!_hooks__WEBPACK_IMPORTED_MODULE_1__["default"]?.stores?.gameState?.gameWorld?.player) return;
        _hooks__WEBPACK_IMPORTED_MODULE_1__["default"].stores.itemsManager[1][_hooks__WEBPACK_IMPORTED_MODULE_1__["default"].stores.itemsManager.selectedItem][0] = this.blockID;
        _hooks__WEBPACK_IMPORTED_MODULE_1__["default"].stores.gameState.gameWorld.player.currentHandItemId = this.blockID;
    }

    onEnable () {
        let moduleContext = this;
        let menuContainer = document.createElement("div");
        menuContainer.className = "blockSelector";
        document.body.appendChild(menuContainer);

        let itemContainer = document.createElement("div");
        Object.assign(itemContainer.style, {
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center"
        });
        menuContainer.appendChild(itemContainer);

        function addButton(id) {
            let button = document.createElement("button");
            Object.assign(button.style, {
                border: "none",
                background: "none",
                margin: "10px"
            });
            let img = document.createElement("img");
            Object.assign(img.style, {
                width: "40px",
                height: "40px",
                objectFit: "cover"
            });
            img.src = $assetsUrls["defaultSurvival/renderItems/" + id + ".png"];
            button.appendChild(img);
            button.addEventListener("click", () => {
                _hooks__WEBPACK_IMPORTED_MODULE_1__["default"].stores.itemsManager[1][_hooks__WEBPACK_IMPORTED_MODULE_1__["default"].stores.itemsManager.selectedItem][0] = id;
                _hooks__WEBPACK_IMPORTED_MODULE_1__["default"].stores.gameState.gameWorld.player.currentHandItemId = id;
                moduleContext.blockID = id;
                menuContainer.remove();
            });
            itemContainer.appendChild(button);
        }

        Object.keys(_hooks__WEBPACK_IMPORTED_MODULE_1__["default"].stores.gameState.gameWorld.allItems).forEach(key => addButton(key));
    }
}

/***/ }),

/***/ "./src/module/modules/misc/SpoofLevel.js":
/*!***********************************************!*\
  !*** ./src/module/modules/misc/SpoofLevel.js ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ SpoofLevel)
/* harmony export */ });
/* harmony import */ var _module__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../module */ "./src/module/module.js");
/* harmony import */ var _hooks__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../hooks */ "./src/hooks.js");



class SpoofLevel extends _module__WEBPACK_IMPORTED_MODULE_0__["default"] {
    constructor() {
        super("SpoofLevel", "Misc", {
            "Level": 999
        });
        this.ogLevel;
    }

    onEnable() {
        if (_hooks__WEBPACK_IMPORTED_MODULE_1__["default"].stores.user?.user?.lvl) this.ogLevel = _hooks__WEBPACK_IMPORTED_MODULE_1__["default"].stores.user.user.lvl;
        _hooks__WEBPACK_IMPORTED_MODULE_1__["default"].stores.user.user = _hooks__WEBPACK_IMPORTED_MODULE_1__["default"].stores.user.user || {};
        _hooks__WEBPACK_IMPORTED_MODULE_1__["default"].stores.user.user.lvl = this.options["Level"];
    }

    onDisable() {
        _hooks__WEBPACK_IMPORTED_MODULE_1__["default"].stores.user.user = _hooks__WEBPACK_IMPORTED_MODULE_1__["default"].stores.user.user || {};
        _hooks__WEBPACK_IMPORTED_MODULE_1__["default"].stores.user.user.lvl = this.ogLevel;
    }
}

/***/ }),

/***/ "./src/module/modules/movement/Airjump.js":
/*!************************************************!*\
  !*** ./src/module/modules/movement/Airjump.js ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Airjump)
/* harmony export */ });
/* harmony import */ var _module__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../module */ "./src/module/module.js");
/* harmony import */ var _hooks__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../hooks */ "./src/hooks.js");



class Airjump extends _module__WEBPACK_IMPORTED_MODULE_0__["default"] {
    constructor () {
        super("Airjump", "Movement", null)
    }

    onEnable () {
        _hooks__WEBPACK_IMPORTED_MODULE_1__["default"].stores.gameState.gameWorld.player.collision.__defineGetter__("isGrounded", () => true);
        _hooks__WEBPACK_IMPORTED_MODULE_1__["default"].stores.gameState.gameWorld.player.collision.__defineSetter__("isGrounded", () => true);
    }

    onDisable () {
        delete _hooks__WEBPACK_IMPORTED_MODULE_1__["default"].stores.gameState.gameWorld.player.collision.isGrounded;
        _hooks__WEBPACK_IMPORTED_MODULE_1__["default"].stores.gameState.gameWorld.player.collision.isGrounded = true;
    }
};

/***/ }),

/***/ "./src/module/modules/movement/Fly.js":
/*!********************************************!*\
  !*** ./src/module/modules/movement/Fly.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Fly)
/* harmony export */ });
/* harmony import */ var _module__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../module */ "./src/module/module.js");
/* harmony import */ var _hooks__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../hooks */ "./src/hooks.js");



class Fly extends _module__WEBPACK_IMPORTED_MODULE_0__["default"] {
    constructor () {
        super("Fly", "Movement", {
            "Vertical Speed": 5
        })
    }

    onEnable () {
        _hooks__WEBPACK_IMPORTED_MODULE_1__["default"].stores.gameState.gameWorld.player.velocity.gravity = 0;
    }

    onRender () {
        if (_hooks__WEBPACK_IMPORTED_MODULE_1__["default"].stores.gameState.gameWorld.player.inputs.jump) {
            _hooks__WEBPACK_IMPORTED_MODULE_1__["default"].stores.gameState.gameWorld.player.velocity.velVec3.y = this.options["Vertical Speed"];
        } else if (_hooks__WEBPACK_IMPORTED_MODULE_1__["default"].stores.gameState.gameWorld.player.inputs.crouch) {
            _hooks__WEBPACK_IMPORTED_MODULE_1__["default"].stores.gameState.gameWorld.player.velocity.velVec3.y = -this.options["Vertical Speed"];;
        } else {
            _hooks__WEBPACK_IMPORTED_MODULE_1__["default"].stores.gameState.gameWorld.player.velocity.velVec3.y = 0;
        }
    }

    onDisable () {
        _hooks__WEBPACK_IMPORTED_MODULE_1__["default"].stores.gameState.gameWorld.player.velocity.gravity = 23;
    }
};

/***/ }),

/***/ "./src/module/modules/movement/NoClip.js":
/*!***********************************************!*\
  !*** ./src/module/modules/movement/NoClip.js ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ NoClip)
/* harmony export */ });
/* harmony import */ var _module__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../module */ "./src/module/module.js");
/* harmony import */ var _hooks__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../hooks */ "./src/hooks.js");



class NoClip extends _module__WEBPACK_IMPORTED_MODULE_0__["default"] {
    constructor() {
        super("NoClip", "Movement");
        this.realGameMode = 0;
    }

    onEnable() {
        this.realGameMode = _hooks__WEBPACK_IMPORTED_MODULE_1__["default"].stores.gameState.gameWorld.player.gameMode;
        _hooks__WEBPACK_IMPORTED_MODULE_1__["default"].stores.gameState.gameWorld.server.switchGameMode(3);
    }

    onDisable() {
        _hooks__WEBPACK_IMPORTED_MODULE_1__["default"].stores.gameState.gameWorld.server.switchGameMode(this.realGameMode);
    }
}

/***/ }),

/***/ "./src/module/modules/movement/NoFall.js":
/*!***********************************************!*\
  !*** ./src/module/modules/movement/NoFall.js ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ NoFall)
/* harmony export */ });
/* harmony import */ var _module__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../module */ "./src/module/module.js");
/* harmony import */ var _hooks__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../hooks */ "./src/hooks.js");



class NoFall extends _module__WEBPACK_IMPORTED_MODULE_0__["default"] {
    constructor () {
        super("NoFall", "Movement")
    }

    onRender () {
        if (!_hooks__WEBPACK_IMPORTED_MODULE_1__["default"]?.stores?.gameState?.gameWorld?.player) return;
        
        let blockPos = _hooks__WEBPACK_IMPORTED_MODULE_1__["default"].stores.gameState.gameWorld.player.position.clone().floor();
        blockPos.y--;
        let blockDirectlyUnderPlayer = !!_hooks__WEBPACK_IMPORTED_MODULE_1__["default"].stores.gameState.gameWorld.chunkManager.getBlock(...blockPos);
        blockPos.y -= 2;
        let blockUnderPlayer = !!_hooks__WEBPACK_IMPORTED_MODULE_1__["default"].stores.gameState.gameWorld.chunkManager.getBlock(...blockPos);


        if (blockUnderPlayer && _hooks__WEBPACK_IMPORTED_MODULE_1__["default"].stores.gameState.gameWorld.player.velocity.velVec3.y < -6 && !blockDirectlyUnderPlayer) {
            _hooks__WEBPACK_IMPORTED_MODULE_1__["default"].stores.gameState.gameWorld.player.position.y = blockPos.y + 1.5;
            _hooks__WEBPACK_IMPORTED_MODULE_1__["default"].stores.gameState.gameWorld.player.velocity.velVec3.y = 0.1;
        }
    }
};

/***/ }),

/***/ "./src/module/modules/movement/Scaffold.js":
/*!*************************************************!*\
  !*** ./src/module/modules/movement/Scaffold.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Scaffold)
/* harmony export */ });
/* harmony import */ var _module__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../module */ "./src/module/module.js");
/* harmony import */ var _hooks__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../hooks */ "./src/hooks.js");



class Scaffold extends _module__WEBPACK_IMPORTED_MODULE_0__["default"] {
    constructor () {
        super("Scaffold", "Movement", null)
    }

    onRender () {
        let blockPos = Object.values(_hooks__WEBPACK_IMPORTED_MODULE_1__["default"].stores.gameState.gameWorld.player.position).splice(0, 3).map(Math.floor);
        
        blockPos[1]--;

        let holdingBlockID = _hooks__WEBPACK_IMPORTED_MODULE_1__["default"].stores.gameState.gameWorld.player.currentHandItemId;
        let blockUnderID = _hooks__WEBPACK_IMPORTED_MODULE_1__["default"].stores.gameState.gameWorld.chunkManager.getBlock(...blockPos);
        let replaceable = _hooks__WEBPACK_IMPORTED_MODULE_1__["default"].stores.gameState.gameWorld.allItems[blockUnderID]?.replaceable || false;
        
        if ((blockUnderID == 0 || replaceable) && holdingBlockID) {
            _hooks__WEBPACK_IMPORTED_MODULE_1__["default"].stores.gameState.gameWorld.chunkManager.placeBlockWithMsgSending(...blockPos, holdingBlockID);
        }
    }
};

/***/ }),

/***/ "./src/module/modules/movement/Speed.js":
/*!**********************************************!*\
  !*** ./src/module/modules/movement/Speed.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Speed)
/* harmony export */ });
/* harmony import */ var _module__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../module */ "./src/module/module.js");
/* harmony import */ var _hooks__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../hooks */ "./src/hooks.js");



class Speed extends _module__WEBPACK_IMPORTED_MODULE_0__["default"] {
    constructor () {
        super("Speed", "Movement", {
            "Speed": 15
        })
    }

    onEnable () {
        _hooks__WEBPACK_IMPORTED_MODULE_1__["default"].stores.gameState.gameWorld.player.velocity.__defineGetter__("moveSpeed", () => this.options["Speed"]);
        _hooks__WEBPACK_IMPORTED_MODULE_1__["default"].stores.gameState.gameWorld.player.velocity.__defineSetter__("moveSpeed", () => this.options["Speed"]);
        _hooks__WEBPACK_IMPORTED_MODULE_1__["default"].stores.gameState.gameWorld.player.velocity.__defineGetter__("fastMoveSpeed", () => this.options["Speed"]);
        _hooks__WEBPACK_IMPORTED_MODULE_1__["default"].stores.gameState.gameWorld.player.velocity.__defineSetter__("fastMoveSpeed", () => this.options["Speed"]);
    }

    onDisable () {
        delete _hooks__WEBPACK_IMPORTED_MODULE_1__["default"].stores.gameState.gameWorld.player.velocity.moveSpeed;
        delete _hooks__WEBPACK_IMPORTED_MODULE_1__["default"].stores.gameState.gameWorld.player.velocity.fastMoveSpeed;
        _hooks__WEBPACK_IMPORTED_MODULE_1__["default"].stores.gameState.gameWorld.player.velocity.moveSpeed = 4.5;
        _hooks__WEBPACK_IMPORTED_MODULE_1__["default"].stores.gameState.gameWorld.player.velocity.fastMoveSpeed = 6.4;
    }
};

/***/ }),

/***/ "./src/module/modules/movement/Velocity.js":
/*!*************************************************!*\
  !*** ./src/module/modules/movement/Velocity.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Velocity)
/* harmony export */ });
/* harmony import */ var _module__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../module */ "./src/module/module.js");
/* harmony import */ var _hooks__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../hooks */ "./src/hooks.js");



class Velocity extends _module__WEBPACK_IMPORTED_MODULE_0__["default"] {
    constructor () {
        super("Velocity", "Movement", null)
    }

    get serverPacketHandlers () {
        return _hooks__WEBPACK_IMPORTED_MODULE_1__["default"].stores.gameState.gameWorld.server.msgsListeners
    }

    get velocityPacket () {
        return Object.keys(this.serverPacketHandlers).find(key => this.serverPacketHandlers[key].toString().includes('velocity'));
    }

    onEnable () {
        this.velocityHandler = this.velocityHandler || this.serverPacketHandlers[this.velocityPacket];
        this.serverPacketHandlers[this.velocityPacket] = () => {};
    }

    onDisable () {
        this.serverPacketHandlers[this.velocityPacket] = this.velocityHandler;
    }
};

/***/ }),

/***/ "./src/module/modules/visual/Arraylist.js":
/*!************************************************!*\
  !*** ./src/module/modules/visual/Arraylist.js ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ ArrayList)
/* harmony export */ });
/* harmony import */ var _module__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../module */ "./src/module/module.js");
/* harmony import */ var _moduleManager__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../moduleManager */ "./src/module/moduleManager.js");
/* harmony import */ var _events__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../events */ "./src/events.js");




class ArrayList extends _module__WEBPACK_IMPORTED_MODULE_0__["default"] {
    constructor () {
        super("Arraylist", "Visual");
        this.namesMap = {};
        this.arraylistContainer = null;
        this.initialized = false;
    }

    update(name, enabled) {
        if (enabled) {
            if (!this.namesMap[name]) {
                let moduleElement = document.createElement("div");
                moduleElement.style.backgroundColor = "rgba(10, 10, 10, 0.7)";
                moduleElement.style.color = "white";
                moduleElement.style.padding = "2px 10px 2px 10px";
                moduleElement.style.display = "flex";
                moduleElement.style.alignItems = "center";
                moduleElement.style.boxSizing = "border-box";
                moduleElement.style.margin = "0";
                moduleElement.style.fontFamily = "'Product Sans', sans-serif";
                moduleElement.style.boxShadow = "rgb(0, 0, 0, 0.05) -5px 1px";
                moduleElement.style.transition = "max-height 0.2s ease-in-out, opacity 0.2s ease-in-out";
                moduleElement.style.overflow = "hidden";
                moduleElement.style.maxHeight = "0";
                moduleElement.style.opacity = "0";

                let textElem = document.createElement("span");
                textElem.style.fontWeight = "800";
                textElem.style.fontSize = "16px";
                textElem.style.backgroundImage = "var(--Fentify-accent-color)";
                textElem.style.color = "transparent";
                textElem.style.backgroundClip = "text";
                textElem.innerHTML = name;
                moduleElement.appendChild(textElem);

                this.arraylistContainer.appendChild(moduleElement);
                
                setTimeout(() => {
                    moduleElement.style.maxHeight = "50px";
                    moduleElement.style.opacity = "1";
                }, 1);

                this.namesMap[name] = moduleElement;
            }
        } else {
            if (this.namesMap[name]) {
                const moduleElement = this.namesMap[name];
                moduleElement.style.maxHeight = "0";
                moduleElement.style.opacity = "0";

                setTimeout(() => {
                    this.arraylistContainer.removeChild(moduleElement);
                    delete this.namesMap[name];
                }, 5);
            }
        }

        const sortedElements = Object.values(this.namesMap).sort((a, b) => this.measureElementWidth(b) - this.measureElementWidth(a));
        this.arraylistContainer.innerHTML = '';

        sortedElements.forEach(element => {
            this.arraylistContainer.appendChild(element);
        });
    }

    onEnable() {
        if (!this.initialized) {
            this.arraylistContainer = document.createElement("div");
            this.arraylistContainer.style.flexDirection = "column";
            this.arraylistContainer.style.position = "absolute";
            this.arraylistContainer.style.zIndex = "1000";
            this.arraylistContainer.style.display = "flex";
            this.arraylistContainer.style.right = "5px";
            this.arraylistContainer.style.top = "5px";
            this.arraylistContainer.style.alignItems = "flex-end";
            this.arraylistContainer.style.pointerEvents = "none";
            this.arraylistContainer.style.textTransform = "lowercase";

            this.arraylistContainer.style.border = "2px solid transparent";
            this.arraylistContainer.style.borderImage = "var(--Fentify-accent-color)";
            this.arraylistContainer.style.borderImageSlice = "1";
            this.arraylistContainer.style.borderBottom = "0";
            this.arraylistContainer.style.borderLeft = "0";

            document.body.appendChild(this.arraylistContainer);

            _events__WEBPACK_IMPORTED_MODULE_2__["default"].on("module.update", (module) => {
                this.update(module.name, module.isEnabled);
            });

            this.initialized = true;
        } else {
            this.arraylistContainer.style.opacity = "1";
        }
    }

    measureElementWidth(element) {
        return element.getBoundingClientRect().width;
    }

    onDisable() {
        this.arraylistContainer.style.opacity = "0";
    }
}

/***/ }),

/***/ "./src/module/modules/visual/BlockOutline.js":
/*!***************************************************!*\
  !*** ./src/module/modules/visual/BlockOutline.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ BlockOutline)
/* harmony export */ });
/* harmony import */ var _module__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../module */ "./src/module/module.js");
/* harmony import */ var _hooks__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../hooks */ "./src/hooks.js");
/* harmony import */ var _utils_gameUtils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../utils/gameUtils */ "./src/utils/gameUtils.js");




class BlockOutline extends _module__WEBPACK_IMPORTED_MODULE_0__["default"] {
    constructor () {
        super("Block Outline", "Movement", {
            "Outline Color": "#81e1ff",
        })
    }

    get selectedBlock () {
        return _hooks__WEBPACK_IMPORTED_MODULE_1__["default"].stores.gameState.gameWorld?.systemsManager.activeExecuteSystems.find(sys => sys?.currBlockPos !== undefined) || undefined;
    }

    onRender () {
        if (this?.selectedBlock?.mesh) {
            let selectedColor = _utils_gameUtils__WEBPACK_IMPORTED_MODULE_2__["default"].hexToRgb(this.options["Outline Color"]);
            
            if (this.selectedBlock.mesh.material.color.r !== selectedColor.r) {
                this.onEnable();
            }
        }
    }

    onEnable () {
        let selectedColor = _utils_gameUtils__WEBPACK_IMPORTED_MODULE_2__["default"].hexToRgb(this.options["Outline Color"]);
        let selectedBlockMesh = this.selectedBlock.mesh;
        Object.keys(selectedColor).forEach(function (key) {
            selectedBlockMesh.material.color[key] = selectedColor[key];
        })
    }

    onDisable () {
        this.selectedBlock.mesh.material.color.r = 1;
        this.selectedBlock.mesh.material.color.g = 1;
        this.selectedBlock.mesh.material.color.b = 1;
    }
};

/***/ }),

/***/ "./src/module/modules/visual/Chams.js":
/*!********************************************!*\
  !*** ./src/module/modules/visual/Chams.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Chams)
/* harmony export */ });
/* harmony import */ var _module__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../module */ "./src/module/module.js");
/* harmony import */ var _hooks__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../hooks */ "./src/hooks.js");



class Chams extends _module__WEBPACK_IMPORTED_MODULE_0__["default"] {
    constructor () {
        super("Chams", "Visual", null)
    }

    onRender () {
        if (!_hooks__WEBPACK_IMPORTED_MODULE_1__["default"]?.stores?.gameState?.gameWorld?.player) return;
        _hooks__WEBPACK_IMPORTED_MODULE_1__["default"].stores.gameState.gameWorld.server.playerIdToData.forEach(player => {
            player.headObj3D.material.depthTest = false;
            player.headObj3D.material.wireframe = true;
        });
    }

    onDisable () {
        if (!_hooks__WEBPACK_IMPORTED_MODULE_1__["default"]?.stores?.gameState?.gameWorld?.player) return;
        _hooks__WEBPACK_IMPORTED_MODULE_1__["default"].stores.gameState.gameWorld.server.playerIdToData.forEach(player => {
            player.headObj3D.material.depthTest = true;
            player.headObj3D.material.wireframe = false;
        });
    }
};

/***/ }),

/***/ "./src/module/modules/visual/ClickGUI.js":
/*!***********************************************!*\
  !*** ./src/module/modules/visual/ClickGUI.js ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ ClickGUI)
/* harmony export */ });
/* harmony import */ var _module_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../module.js */ "./src/module/module.js");
/* harmony import */ var _moduleManager_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../moduleManager.js */ "./src/module/moduleManager.js");
/* harmony import */ var _events__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../events */ "./src/events.js");
/* harmony import */ var _components_Panel_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./components/Panel.js */ "./src/module/modules/visual/components/Panel.js");
/* harmony import */ var _styles_clickgui_css__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./styles/clickgui.css */ "./src/module/modules/visual/styles/clickgui.css");






class ClickGUI extends _module_js__WEBPACK_IMPORTED_MODULE_0__["default"] {
    constructor() {
        super("ClickGUI", "Visual", {
            "Accent Color 1": "rgb(64, 190, 255)",
            "Accent Color 2": "rgb(129, 225, 255)",
            "Button Color": "rgb(40, 40, 40, 0.9)",
            "Hover Color": "rgb(50, 50, 50, 0.9)",
            "Header Color": "rgb(0, 0, 0, 0.85)",
            "Panel Color": "rgb(18 18 18)",
            "Text Color": "#ffffff",
            "Enable Animations": true
        }, "ShiftRight");

        this.GUILoaded = false;
        this.panels = [];
        this.blurredBackground = null;
        this.updateColors();
    }

    updateAnimations() {
        if (this.options["Enable Animations"]) {
            document.body.classList.add("with-animations");
        } else {
            document.body.classList.remove("with-animations");
        }
    }

    updateColors() {
        document.body.style.setProperty('--Fentify-accent-color', 
            `linear-gradient(90deg, ${this.options["Accent Color 1"]} 0%, ${this.options["Accent Color 2"]} 100%)`);
        document.body.style.setProperty('--button-color', this.options["Button Color"]);
        document.body.style.setProperty('--hover-color', this.options["Hover Color"]);
        document.body.style.setProperty('--header-bg', this.options["Header Color"]);
        document.body.style.setProperty('--panel-bg', this.options["Panel Color"]);
        document.body.style.setProperty('--text-color', this.options["Text Color"]);
    }

    onEnable() {
        document.pointerLockElement && document.exitPointerLock();

        if (!this.GUILoaded) {
            this.setupBackground();
            this.createPanels();
            this.setupEventListeners();
            this.GUILoaded = true;
            this.updateAnimations();
        } else {
            this.showGUI();
            this.updateAnimations();
        }
    }

    setupBackground() {
        this.blurredBackground = document.createElement("div");
        this.blurredBackground.className = "gui-background";
        document.body.appendChild(this.blurredBackground);
    }

    createPanels() {
        const panelConfigs = [
            { title: "Combat", position: { top: "100px", left: "100px" } },
            { title: "Movement", position: { top: "100px", left: "320px" } },
            { title: "Visual", position: { top: "100px", left: "540px" } },
            { title: "Misc", position: { top: "100px", left: "760px" } }
        ];

        this.panels.forEach(panel => {
            if (panel.panel && panel.panel.parentNode) {
                panel.panel.parentNode.removeChild(panel.panel);
            }
        });
        this.panels = [];

        panelConfigs.forEach(config => {
            const panel = new _components_Panel_js__WEBPACK_IMPORTED_MODULE_3__["default"](config.title, config.position);
            this.panels.push(panel);
        });

        const modulesByCategory = {};
        Object.values(_moduleManager_js__WEBPACK_IMPORTED_MODULE_1__["default"].modules).forEach(module => {
            if (!modulesByCategory[module.category]) {
                modulesByCategory[module.category] = [];
            }
            modulesByCategory[module.category].push(module);
        });

        Object.entries(modulesByCategory).forEach(([category, modules]) => {
            const panel = this.panels.find(p => p.header.textContent === category);
            if (!panel) return;

            modules.sort((a, b) => b.name.length - a.name.length);
            modules.forEach(module => panel.addButton(module));
        });
    }

    setupEventListeners() {
        _events__WEBPACK_IMPORTED_MODULE_2__["default"].on("module.update", (module) => {
            const panel = this.panels.find(p => p.header.textContent === module.category);
            if (!panel) return;
            
            const button = panel.buttons.find(btn => btn.textContent === module.name);
            if (button) button.classList.toggle("enabled", module.isEnabled);
        });
    }

    showGUI() {
        this.panels.forEach(panel => panel.show());
        this.blurredBackground.style.display = "block";
    }

    onDisable() {
        this.panels.forEach(panel => panel.hide());
        this.blurredBackground.style.display = "none";
    }

    onSettingUpdate() {
        this.updateColors();
        this.updateAnimations();
    }
}

/***/ }),

/***/ "./src/module/modules/visual/Watermark.js":
/*!************************************************!*\
  !*** ./src/module/modules/visual/Watermark.js ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Watermark)
/* harmony export */ });
/* harmony import */ var _module__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../module */ "./src/module/module.js");


class Watermark extends _module__WEBPACK_IMPORTED_MODULE_0__["default"] {
    constructor () {
        super("Watermark", "Visual", {
            "Text": "Fentify"
        })
    }

    onSettingUpdate() {
        let watermarkElement = document.querySelector(".Fentify-overlay-title");
        if(watermarkElement) watermarkElement.textContent = this.options["Text"];
    }

    onEnable() {
        let watermarkElement = document.querySelector(".Fentify-overlay-title");
        if (!watermarkElement) {
            watermarkElement = document.createElement("div");
            watermarkElement.className = "Fentify-overlay-title";
            watermarkElement.textContent = this.options["Text"];
            watermarkElement.style.position = "absolute";
            watermarkElement.style.top = "0";
            watermarkElement.style.left = "0";
            watermarkElement.style.padding = "0.5em";
            watermarkElement.style.userSelect = "none";
            watermarkElement.style.display = "none";
            watermarkElement.style.zIndex = "1000";
            watermarkElement.style.textShadow = "var(--Fentify-accent-color) 0px 0px 10px";
            watermarkElement.style.fontFamily = "'Product Sans', sans-serif";
            watermarkElement.style.fontSize = "24px";
            watermarkElement.style.background = "var(--Fentify-accent-color)";
            watermarkElement.style.backgroundClip = "text";
            watermarkElement.style.webkitFontSmoothing = "antialiased";
            watermarkElement.style.webkitTextFillColor = "transparent";
            document.body.appendChild(watermarkElement);
        }

        document.querySelector(".Fentify-overlay-title").style.display = "flex";
    }

    onDisable() {
        document.querySelector(".Fentify-overlay-title").style.display = "none";
    }
};

/***/ }),

/***/ "./src/module/modules/visual/components/ModuleSettings.js":
/*!****************************************************************!*\
  !*** ./src/module/modules/visual/components/ModuleSettings.js ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ ModuleSettings)
/* harmony export */ });
/* harmony import */ var _events__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../events */ "./src/events.js");


class ModuleSettings {
    constructor(module, container) {
        this.module = module;
        this.container = container;
        this.components = [];
        this.initialized = false;
        this.isOpen = false;
    }

    initialize() {
        if (this.initialized || !this.module?.options) return;
        
        Object.keys(this.module.options).forEach(key => {
            const settingValue = this.module.options[key];
            const settingType = typeof settingValue;

            if (key.toLowerCase().includes("color")) {
                this.addColorPicker(key);
            } else if (settingType === "boolean" || settingValue === "true" || settingValue === "false") {
                this.addCheckbox(key);
            } else if (settingType === "string") {
                this.addStringInput(key);
            } else {
                this.addNumberInput(key);
            }
        });

        this.components.forEach(component => component.style.display = "none");
        this.initialized = true;
    }

    toggle() {
        this.isOpen = !this.isOpen;
        this.components.forEach(component => {
            component.style.display = this.isOpen ? "flex" : "none";
            if (this.isOpen) {
                this.container.style.marginBottom = "5px";
            } else {
                this.container.style.marginBottom = "0px";
            }
        });
    }

    addNumberInput(name) {
        const container = document.createElement("div");
        container.className = "gui-setting-container";

        const label = document.createElement("span");
        label.className = "gui-setting-label";
        label.textContent = name;

        const input = document.createElement("input");
        input.type = "text";
        input.className = "gui-text-input";
        input.value = this.module.options[name];

        let lastValidValue = input.value;

        input.addEventListener("input", () => {
            const value = input.value.trim();
            if (!isNaN(value) && value !== "") {
                lastValidValue = value;
                this.module.options[name] = value;
                _events__WEBPACK_IMPORTED_MODULE_0__["default"].emit("setting.update", this.module);
            }
        });

        input.addEventListener("blur", () => {
            if (isNaN(input.value) || input.value.trim() === "") {
                input.value = lastValidValue;
            }
        });

        input.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                input.blur();
            }
        });

        container.appendChild(label);
        container.appendChild(input);
        this.container.appendChild(container);
        this.components.push(container);
    }

    addStringInput(name) {
        const container = document.createElement("div");
        container.className = "gui-setting-container";

        const label = document.createElement("span");
        label.className = "gui-setting-label";
        label.textContent = name;

        const input = document.createElement("input");
        input.type = "text";
        input.className = "gui-text-input";
        input.value = this.module.options[name];

        input.addEventListener("input", () => {
            const value = input.value.trim();
            this.module.options[name] = value;
            _events__WEBPACK_IMPORTED_MODULE_0__["default"].emit("setting.update", this.module);
        });

        container.appendChild(label);
        container.appendChild(input);
        this.container.appendChild(container);
        this.components.push(container);
    }

    addCheckbox(name) {
        const container = document.createElement("div");
        container.className = "gui-setting-container";

        const label = document.createElement("span");
        label.className = "gui-setting-label";
        label.textContent = name;

        const checkbox = document.createElement("div");
        checkbox.className = "gui-checkbox";
        checkbox.classList.toggle("enabled", this.module.options[name] === true || this.module.options[name] === "true");

        checkbox.addEventListener("click", () => {
            const wasChecked = checkbox.classList.contains("enabled");
            checkbox.classList.toggle("enabled");
            this.module.options[name] = (!wasChecked).toString();
            _events__WEBPACK_IMPORTED_MODULE_0__["default"].emit("setting.update", this.module);
        });

        container.appendChild(label);
        container.appendChild(checkbox);
        this.container.appendChild(container);
        this.components.push(container);
    }

    addColorPicker(name) {
        const container = document.createElement("div");
        container.className = "gui-setting-container";

        const label = document.createElement("span");
        label.className = "gui-setting-label";
        label.textContent = name;

        const colorPickerBg = document.createElement("div");
        colorPickerBg.className = "gui-color-picker";
        colorPickerBg.style.background = this.module.options[name];

        const colorPicker = document.createElement("input");
        colorPicker.type = "color";
        colorPicker.className = "gui-color-input";
        colorPickerBg.appendChild(colorPicker);

        colorPicker.addEventListener("input", (event) => {
            colorPickerBg.style.background = event.target.value;
            this.module.options[name] = event.target.value;
            _events__WEBPACK_IMPORTED_MODULE_0__["default"].emit("setting.update", this.module);
        });

        container.appendChild(label);
        container.appendChild(colorPickerBg);
        this.container.appendChild(container);
        this.components.push(container);
    }
}


/***/ }),

/***/ "./src/module/modules/visual/components/Panel.js":
/*!*******************************************************!*\
  !*** ./src/module/modules/visual/components/Panel.js ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Panel)
/* harmony export */ });
/* harmony import */ var _ModuleSettings_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ModuleSettings.js */ "./src/module/modules/visual/components/ModuleSettings.js");


class Panel {
    constructor(title, position = { top: "200px", left: "200px" }) {
        this.panel = document.createElement("div");
        this.panel.className = "gui-panel";
        this.panel.style.top = position.top;
        this.panel.style.left = position.left;
        
        this.header = document.createElement("div");
        this.header.className = "gui-header";
        this.header.textContent = title;
        this.panel.appendChild(this.header);
        
        document.body.appendChild(this.panel);
        this.buttons = [];
        this.setupDragHandling();
    }

    setupDragHandling() {
        let isDragging = false;
        let offset = { x: 0, y: 0 };

        this.header.addEventListener("mousedown", (e) => {
            isDragging = true;
            offset.x = e.clientX - this.panel.offsetLeft;
            offset.y = e.clientY - this.panel.offsetTop;
        });

        document.addEventListener("mousemove", (e) => {
            if (!isDragging) return;
            this.panel.style.left = (e.clientX - offset.x) + "px";
            this.panel.style.top = (e.clientY - offset.y) + "px";
        });

        document.addEventListener("mouseup", () => isDragging = false);
    }

    addButton(module) {
        const buttonContainer = document.createElement("div");
        buttonContainer.className = "gui-button-container";

        const btn = document.createElement("div");
        btn.className = `gui-button ${module.isEnabled ? "enabled" : ""}`;
        btn.textContent = module.name;

        const settings = new _ModuleSettings_js__WEBPACK_IMPORTED_MODULE_0__["default"](module, buttonContainer);

        btn.addEventListener("mousedown", (event) => {
            if (event.button === 0) {
                module.toggle();
                btn.classList.toggle("enabled", module.isEnabled);
            }
            if (event.button === 1) {
                btn.textContent = "waiting for bind..";
                module.waitingForBind = true;
            }
        });

        btn.addEventListener("contextmenu", (event) => {
            event.preventDefault();
            settings.initialize();
            settings.toggle();
        });

        btn.setAttribute("tabindex", -1);
        btn.addEventListener("keydown", (event) => {
            btn.textContent = module.name;
            if (module.waitingForBind) {
                event.preventDefault();
                event.stopPropagation();
                event.stopImmediatePropagation();
                if (event.key === "Escape") {
                    module.keybind = null;
                } else {
                    module.keybind = String(event.code);
                }
                module.waitingForBind = false;
            }
        });

        buttonContainer.appendChild(btn);
        this.panel.appendChild(buttonContainer);
        this.buttons.push(btn);
        return btn;
    }

    show() {
        this.panel.style.display = "block";
    }

    hide() {
        this.panel.style.display = "none";
    }
}


/***/ }),

/***/ "./src/utils/gameUtils.js":
/*!********************************!*\
  !*** ./src/utils/gameUtils.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _hooks__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../hooks */ "./src/hooks.js");
/* harmony import */ var _mathUtils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./mathUtils */ "./src/utils/mathUtils.js");



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
    getClosestPlayer () {
        let localPlayerPos = _hooks__WEBPACK_IMPORTED_MODULE_0__["default"].stores.gameState.gameWorld.player.position;
        let playersData = _hooks__WEBPACK_IMPORTED_MODULE_0__["default"].stores.gameState.gameWorld.server.playerIdToData;
        let playersWithDistances = [];

        playersData.forEach(function(player, playerId) {
            let distance = _mathUtils__WEBPACK_IMPORTED_MODULE_1__["default"].distanceBetween(
                localPlayerPos,
                { x: player.position.x, y: player.position.y, z: player.position.z }
            );
            player.id = playerId;
            playersWithDistances.push({ player, distance });
        });

        playersWithDistances.sort((a, b) => a.distance - b.distance);

        return playersWithDistances.map(item => item.player)[0];
    },

    hexToRgb(hex) {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16)
        } : null;
    }
});

/***/ }),

/***/ "./src/utils/mathUtils.js":
/*!********************************!*\
  !*** ./src/utils/mathUtils.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
    normalizeVector(vector) {
        const magnitudeSquared = vector.x * vector.x + vector.y * vector.y + vector.z * vector.z;
        if (magnitudeSquared > 0) {
            const reciprocalMagnitude = 1 / Math.sqrt(magnitudeSquared);
            return [vector.x * reciprocalMagnitude, vector.y * reciprocalMagnitude, vector.z * reciprocalMagnitude];
        }
        return vector;
    },

    distanceBetween(point1, point2) {
        const xDifference = point2.x - point1.x;
        const yDifference = point2.y - point1.y;
        const zDifference = point2.z - point1.z;
        return xDifference * xDifference + yDifference * yDifference + zDifference * zDifference;
    },

    distanceBetweenSqrt(pointA, pointB) {
        return Math.sqrt(this.distanceBetween(pointA, pointB));
    },
});

/***/ })

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
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/nonce */
/******/ 	(() => {
/******/ 		__webpack_require__.nc = undefined;
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
/*!*********************!*\
  !*** ./src/main.js ***!
  \*********************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _module_moduleManager__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./module/moduleManager */ "./src/module/moduleManager.js");
/* harmony import */ var _events__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./events */ "./src/events.js");
/* harmony import */ var _hooks__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./hooks */ "./src/hooks.js");
/* harmony import */ var _utils_gameUtils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./utils/gameUtils */ "./src/utils/gameUtils.js");





class Fentify {
    constructor() {
        this.version = "1.0.0";
        this.init();
    }

    init () {
            
        setInterval(() => {
            _events__WEBPACK_IMPORTED_MODULE_1__["default"].emit("render");
        }, (1000 / 60));

        document.addEventListener("keydown", (e) => {
            _events__WEBPACK_IMPORTED_MODULE_1__["default"].emit("keydown", e.code);
        });

        _hooks__WEBPACK_IMPORTED_MODULE_2__["default"].init();
        _module_moduleManager__WEBPACK_IMPORTED_MODULE_0__["default"].init();
    }

    disable () {

    }
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (new Fentify());
})();

/******/ })()
;