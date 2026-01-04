// ==UserScript==
// @name          7Placer
// @description   typescript pixelplace.io bot
// @version       2.2.1
// @author        Azti
// @include       /^https:\/\/pixelplace.io\/\d+-/
// @require       https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js
// @require       https://update.greasyfork.org/scripts/498080/1395134/Hacktimer.js
// @require       https://cdnjs.cloudflare.com/ajax/libs/toastify-js/1.12.0/toastify.js
// @require       https://cdn.jsdelivr.net/npm/rgbquant@1.1.2/src/rgbquant.min.js
// @grant         none
// @run-at        document-start
// @namespace https://greasyfork.org/users/374503
// @downloadURL https://update.greasyfork.org/scripts/498043/7Placer.user.js
// @updateURL https://update.greasyfork.org/scripts/498043/7Placer.meta.js
// ==/UserScript==

/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/css-loader/dist/cjs.js!./src/GUI/GUIStyle.css":
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/css-loader/dist/runtime/noSourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
___CSS_LOADER_EXPORT___.push([module.id, "@import url(https://fonts.cdnfonts.com/css/verdana);"]);
// Module
___CSS_LOADER_EXPORT___.push([module.id, `:root {
    --gui-main-color: #7300ff;
    --gui-main-color-fade: color-mix(in oklab, var(--gui-main-color), #000)
}

/* GUI */
#sevenGUI {
    all: initial;
    background-color: #1C1C1C;
    height: 40vh;
    width: 50vh;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    position: absolute;
    border: #262626;
    border-style: solid;
    border-width: 0.4vh;
    user-select: none;
    display: flex;
    flex-direction: column;
    z-index: 1000;
}

#sevenGUIheader {
    color: var(--gui-main-color);
    text-align: center;
    font-family: Verdana, Tahoma, sans-serif;
    background-color: #1a1a1a;
    font-size: 1.5vh;
}

#sevenGUIheader:hover {
    cursor: move;
}

#rainbowBar {
    all: revert;
    height: 0.3vh;
    width: 100%;
    background: linear-gradient(90deg, rgba(0,140,255,1) 0%, rgba(96,39,147,1) 21%, rgba(140,77,78,1) 63%, rgba(181,181,0,1) 100%);
}

#generalContainer {
    display: flex;
    flex-grow: 1; /* Takes remaining space */
    min-height: 0;
}

/* SIDE BAR */
#sideBarContainer {
    height: 100%;
    width: 10vh;
    background-color: #161616;
    display: flex;
    flex-flow: column;
    align-items: center;
    position: relative;
}

#sideBarTabContainer {
    display: flex;
    flex-flow: column;
    flex-grow: 1;
    width: 100%;
    overflow-y: overlay;
    scrollbar-width: thin;
    scrollbar-color: grey #161616;
    direction: rtl;
}

.sideBarTab {
    height: 7vh;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
}

.sideBarTab img {
    object-fit: contain;
    width: 100%;
    filter: invert(1) brightness(0.45);
    height: 80%;
}

.sideBarTab.selected {
    background-color: #1C1C1C;
}

.sideBarTab.selected img {
    filter: invert(1) brightness(1);
}

#tabButton_settings {
    position: relative;
    bottom: 0;
}

/* TAB STUFF */
.GUITabContainer {
    all: revert;
    display: flex;
    flex-wrap: wrap;
    flex-grow: 1;
    flex-direction: column;
    position: relative;
    padding: 3%;
    gap: 3%;
}

.GUISubmenu {
    all: revert;
    min-width: 25%;
    max-width: 45%;
    box-sizing: border-box;
    flex-grow: 1;
    position: relative;
    background-color: #151515;
    border: #252525;
    border-width: 0.3vh;
    border-style: solid;
    display: flex;
}

.submenuInside {
    display: flex;
    all: revert;
    overflow-x: hidden;
    flex-grow: 1;
    padding-top: 2%;
    scrollbar-color: rgb(91, 91, 91) rgb(48, 48, 48);
    scrollbar-width: thin;
    padding: 2%;
    min-width: 0;
    max-width: 100%;
}

.submenuTitle {
    all: revert;
    position: absolute;
    top: -1.9vh;
    left: 5%;
    color: white;
    font-weight: bold;
    font-family: 'Verdana', sans-serif;
    font-size: 1vh;
}

/* Toggle */
.toggleContainer {
    display: flex;
    flex-direction: row;
    justify-content: left;
    align-items: center;
    gap: 5%;
    padding-left: 7%;
    overflow: hidden;
    margin-top: 3%;
}

.toggleSquare {
    padding-left: 5%;
    padding-bottom: 5%;
    background: rgb(58, 58, 58);
    border: solid #000000 0.2vh;
}

.toggleContainer.toggled .toggleSquare {
    background: linear-gradient(180deg, var(--gui-main-color) 0%, var(--gui-main-color-fade) 100%);
}

.toggleName {
    color: rgb(219, 219, 219);
    font-family: 'Verdana', sans-serif;
    font-size: 1vh;
    margin: 3%;
}

/* text */
.textContainer {
    width: 100%;
    font-size: 1vh;
    justify-content: center;
    display: flex;
    flex-direction: row;
    justify-content: left;
    overflow: hidden;
    margin-top: 3%;
    justify-content: center;
}

.textContainer > p {
    color: rgb(219, 219, 219);
    font-family: 'Verdana', sans-serif;
    font-size: 1vh;
    margin: 3%;
}

/* Drop Image */
.dropImage {
    position: relative;
    display: flex;
    height: 7vh;
    width: 80%;
    align-self: center;
    margin-left: auto;
    margin-right: auto;
    background-color: #242424;
    border: 0.3vh solid var(--gui-main-color);
    justify-content: center;
    align-items: center;
    margin-top: 5%;
    color: white;
    font-family: Verdana, sans-serif;
    font-size: 1vh;
}

/* Button */
.button {
    position: relative;
    display: flex;
    height: 1.7vh;
    width: 80%;
    background: linear-gradient(180deg, rgb(76, 75, 75) 0%, rgb(25, 25, 25) 100%);
    border: 0.2vh solid #000000;
    justify-content: center;
    align-items: center;
    justify-self: center;
    margin-top: 5%;
    color: white;
    font-family: Verdana, sans-serif;
    font-size: 1vh;
}

.button:active {
    background: linear-gradient(180deg, rgb(31, 31, 31) 0%, rgb(25, 25, 25) 100%)
}

/* Input */
.inputContainer {
    display: flex;
    position: relative;
    justify-content: center;
    margin-top: 5%;
    width: 7vh;
    margin-left: auto;
    margin-right: auto;
}

.inputContainer input {
    text-align: center;
    height: 1.7vh;
    width: 100%;
    background-color: #2b2b2b;
    border: 1px solid #000;
    color: white;
    font-family: Verdana, Tahoma, sans-serif;
    font-size: 1.1vh;
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
}

/* Select */
.submenuInside select {
    background: linear-gradient(180deg, rgb(76, 75, 75) 0%, rgb(25, 25, 25) 100%);
    border: none;
    color: rgb(203, 203, 203);
    font-family: Verdana, Tahoma, sans-serif;
    height: 1.7vh;
    width: 80%;
    display: block;
    margin: 5% auto;
    font-size: 1vh;
}
select option {
    background: rgb(25, 25, 25);
    color: #fff;
}

/* ColorSelect */
.colorPicker {
    font-family: Verdana, sans-serif;
    font-size: 1vh;
    color: white;
    text-align: center;
}

.colorPicker input {
    height: 1.7vh;
    width: 80%;
    margin-top: 0.2vh;
}
input[type="color"]::-webkit-color-swatch-wrapper {
	padding: 0;
}
`, ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/api.js":
/***/ ((module) => {

"use strict";


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
/***/ ((module) => {

"use strict";


module.exports = function (i) {
  return i[1];
};

/***/ }),

/***/ "./src/GUI/GUIStyle.css":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./node_modules/style-loader/dist/runtime/styleDomAPI.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("./node_modules/style-loader/dist/runtime/insertBySelector.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("./node_modules/style-loader/dist/runtime/insertStyleElement.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("./node_modules/style-loader/dist/runtime/styleTagTransform.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_GUIStyle_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("./node_modules/css-loader/dist/cjs.js!./src/GUI/GUIStyle.css");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());
options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_GUIStyle_css__WEBPACK_IMPORTED_MODULE_6__/* ["default"] */ .A, options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_GUIStyle_css__WEBPACK_IMPORTED_MODULE_6__/* ["default"] */ .A && _node_modules_css_loader_dist_cjs_js_GUIStyle_css__WEBPACK_IMPORTED_MODULE_6__/* ["default"] */ .A.locals ? _node_modules_css_loader_dist_cjs_js_GUIStyle_css__WEBPACK_IMPORTED_MODULE_6__/* ["default"] */ .A.locals : undefined);


/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js":
/***/ ((module) => {

"use strict";


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
/***/ ((module) => {

"use strict";


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
/***/ ((module) => {

"use strict";


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
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


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
/***/ ((module) => {

"use strict";


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
/***/ ((module) => {

"use strict";


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

/***/ "./src/GUI/GUICore.ts":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   MainGUI: () => (/* binding */ MainGUI),
/* harmony export */   Submenu: () => (/* binding */ Submenu),
/* harmony export */   Tab: () => (/* binding */ Tab)
/* harmony export */ });
/* harmony import */ var _dragElement__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./src/GUI/dragElement.ts");

class MainGUI {
    constructor() {
        this._tabs = new Map();
        this._createMainGUI();
    }
    createTab(name, tab_image) {
        if (this._tabs.has(name))
            return;
        const created_tab = new Tab(this, name, tab_image);
        this._tabs.set(name, created_tab);
        return created_tab;
    }
    switchTab(name) {
        const tab = this._tabs.get(name);
        this._tabs.forEach((tab) => {
            tab.hide();
        });
        tab.show();
    }
    getTab(name) {
        return this._tabs.get(name);
    }
    _createMainGUI() {
        // main gui elements
        let GUI_core = `
        <div id='sevenGUI' style="display: none;">
            <div id="sevenGUIheader">7PLACER</div>
            <div id="rainbowBar"></div>
            <div id="generalContainer">
                <div id="sideBarContainer">
                    <div id="sideBarTabContainer"></div>
                </div>
            </div>
        </div>
        `;
        $("body").append(GUI_core);
        (0,_dragElement__WEBPACK_IMPORTED_MODULE_0__["default"])($("#sevenGUI")[0]);
        // menu toggle
        const toggle_gui_button = $('<a href="#" title="Seven Opener" class="grey margin-top-button"><img src="https://infonutricional.tomatelavida.com.co/wp-content/uploads/2023/06/postobon_informacion_nutriconallogo-7up.png" alt="icon"></a>');
        toggle_gui_button.css("border-color", "var(--gui-main-color)");
        $("#menu-buttons").append(toggle_gui_button);
        let toggle = false;
        toggle_gui_button.on("click", () => {
            if (toggle) {
                $('#sevenGUI').css("display", "none");
                toggle = false;
            }
            else {
                $('#sevenGUI').css({ "display": "flex", "top": "50%", "left": "50%", "transform": "translate(-50%, -50%)" });
                toggle = true;
            }
        });
        // settings tab
        const settings_tab = this.createTab('settings', 'https://upload.wikimedia.org/wikipedia/commons/d/dc/Settings-icon-symbol-vector.png');
        settings_tab.tab_button.appendTo('#sideBarContainer');
    }
    ;
    static get instance() {
        if (!this._instance) {
            this._instance = new MainGUI;
        }
        return this._instance;
    }
}
;
class Tab {
    constructor(main_gui, name, tab_image) {
        this._submenus = new Map();
        this._main_gui = main_gui;
        this._createTab(name, tab_image);
    }
    ;
    createSubmenu(name) {
        if (this._submenus.has(name))
            return;
        const created_submenu = new Submenu(this, name);
        this._submenus.set(name, created_submenu);
        return created_submenu;
    }
    getSubmenu(name) {
        return this._submenus.get(name);
    }
    show() {
        this._tab_button.addClass("selected");
        this._submenu_container.css("display", "flex");
    }
    hide() {
        this._tab_button.removeClass("selected");
        this._submenu_container.css("display", "none");
    }
    _createTab(name, tab_image) {
        this._tab_button = $(`<div class="sideBarTab" id="tabButton_${name}"><img src="${tab_image}" class="sideBarTab" draggable="false"></div>`);
        this._tab_button.on("click", () => {
            this._main_gui.switchTab(name);
        });
        $("#sideBarTabContainer").append(this._tab_button);
        this._submenu_container = $(`<div class="GUITabContainer" id="tab_${name}">`).css("display", "none");
        $("#generalContainer").append(this._submenu_container);
    }
    ;
    get submenu_container() {
        return this._submenu_container;
    }
    get tab_button() {
        return this._tab_button;
    }
}
class Submenu {
    constructor(parent_tab, name) {
        this._parent_tab = parent_tab;
        this._createSubmenu(name);
    }
    createToggle(name, default_state, callback) {
        const container = $(`<div class="toggleContainer" id="toggle_${name}"></div>`);
        container.append('<div class="toggleSquare"></div>');
        container.append(`<p class="toggleName">${name}</p>`);
        this._submenu_inside.append(container);
        if (default_state) {
            container.addClass("toggled");
        }
        let state = default_state;
        container.on("click", () => {
            if (state) {
                state = false;
                container.removeClass("toggled");
            }
            else {
                state = true;
                container.addClass("toggled");
            }
            callback(state);
        });
        return container;
    }
    createButton(name, callback) {
        const button = $(`<div class="button" id="button_${name}">${name}</div>`);
        this._submenu_inside.append(button);
        button.on("click", () => {
            callback();
        });
        return button;
    }
    createDrop(label, onFile) {
        const drop_container = $(`<div class="dropImage">${label}</div>`);
        drop_container.on("dragover", function (event) {
            event.preventDefault();
        });
        drop_container.on("drop", function (event) {
            event.preventDefault();
            const file = event.originalEvent.dataTransfer.files[0];
            if (file.type.startsWith("image/")) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    drop_container.html(`<img src="${e.target.result}" style="max-width: 100%; max-height: 100%;">`);
                };
                reader.readAsDataURL(file);
                onFile(file);
            }
        });
        drop_container.on("click", () => {
            const input = $('<input type="file" accept="image/*" style="display:none">');
            $("body").append(input);
            input.on('change', function () {
                const file = input.prop('files')[0];
                if (!file)
                    return;
                const dropTarget = drop_container[0];
                const dataTransfer = new DataTransfer();
                dataTransfer.items.add(file);
                const dragEnter = new DragEvent('dragenter', { dataTransfer: dataTransfer });
                const dragOver = new DragEvent('dragover', { dataTransfer: dataTransfer });
                const drop = new DragEvent('drop', { dataTransfer: dataTransfer });
                dropTarget.dispatchEvent(dragEnter);
                dropTarget.dispatchEvent(dragOver);
                dropTarget.dispatchEvent(drop);
            });
            input.trigger("click");
        });
        this._submenu_inside.append(drop_container);
        return drop_container;
    }
    createInput(placeholder, type, onType) {
        const input = $(`<input id="${type}_input_${placeholder}" class="input" type="${type}" placeholder="${placeholder}">`);
        input.on("input", () => {
            onType(input.val());
        });
        this._submenu_inside.append($(`<div class="inputContainer"></div>`).append(input));
        return input;
    }
    createText(text) {
        const container = $(`<div class="textContainer">`);
        const text_elem = container.append(`<p>${text}</p>`);
        this._submenu_inside.append(container);
        return text_elem;
    }
    createSelect(default_value, options, onChange) {
        const selector = $(`<select id="selector_${default_value}"></select>`);
        selector.append(`<option value="">${default_value}</option>`);
        for (const option of options) {
            selector.append(`<option value="${option.value}">${option.label}</option>`);
        }
        selector.on("change", () => {
            const value = selector.val();
            if (value == "")
                return;
            onChange(value);
        });
        this._submenu_inside.append(selector);
        return selector;
    }
    createColor(label, default_color, onChange) {
        const color_selector = $(`<input type="color" value="${default_color}" />`);
        const container = $(`<div class="colorPicker"><div>${label}</div></div>`).append(color_selector);
        color_selector.on("input", () => {
            onChange(color_selector.val());
        });
        this._submenu_inside.append(container);
        return color_selector;
    }
    _createSubmenu(name) {
        this._submenu_element = $(`<div class="GUISubmenu" id="submenu_${name}">`);
        this._submenu_element.append(`<p class="submenuTitle">${name}</p>`);
        this._submenu_inside = $('<div class="submenuInside">');
        this._submenu_element.append(this._submenu_inside);
        this._parent_tab.submenu_container.append(this._submenu_element);
    }
}


/***/ }),

/***/ "./src/GUI/TAB_Botting.ts":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _modules__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./src/modules/index.ts");
/* harmony import */ var _modules_defaultModules_Queue__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./src/modules/defaultModules/Queue.ts");
/* harmony import */ var _modules_util_getClientMouse__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("./src/modules/util/getClientMouse.ts");
/* harmony import */ var _GUICore__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("./src/GUI/GUICore.ts");




$(function () {
    const GUI = _GUICore__WEBPACK_IMPORTED_MODULE_2__.MainGUI.instance;
    const TAB = GUI.createTab("Botting", "https://pngimg.com/d/android_logo_PNG5.png");
    GUI.switchTab("Botting");
    const image_submenu = TAB.createSubmenu("Images");
    let current_image;
    let current_image_x;
    let current_image_y;
    image_submenu.createDrop("Drop Image", dropped_image => {
        current_image = dropped_image;
    });
    image_submenu.createInput("X", "number", x_coord => {
        current_image_x = parseInt(x_coord);
    });
    image_submenu.createInput("Y", "number", y_coord => {
        current_image_y = parseInt(y_coord);
    });
    const dithering_options = [
        { label: "None", value: "None" },
        { label: "FloydSteinberg", value: "FloydSteinberg" },
        { label: "FalseFloydSteinberg", value: "FalseFloydSteinberg" },
        { label: "Stucki", value: "Stucki" },
        { label: "Atkinson", value: "Atkinson" },
        { label: "Jarvis", value: "Jarvis" },
        { label: "Burkes", value: "Burkes" },
        { label: "Sierra", value: "Sierra" },
        { label: "TwoSierra", value: "TwoSierra" },
        { label: "SierraLite", value: "SierraLite" },
    ];
    image_submenu.createSelect("-- select dithering --", dithering_options, (value) => {
        if (value == "None") {
            window.seven.dither = null;
            return;
        }
        window.seven.dither = value;
    });
    image_submenu.createButton("Start", () => {
        (0,_modules__WEBPACK_IMPORTED_MODULE_0__.botImage)(current_image_x, current_image_y, current_image);
    });
    image_submenu.createButton("Stop", () => {
        _modules_defaultModules_Queue__WEBPACK_IMPORTED_MODULE_1__["default"].stop();
    });
    const protecting_submenu = TAB.createSubmenu("Protecting");
    protecting_submenu.createToggle("Protect", false, (state) => {
        window.seven.protect = state;
    });
    protecting_submenu.createToggle("Agressive protection", false, (state) => {
        window.seven.agressive_protection = state;
    });
    const square_submenu = TAB.createSubmenu("Squares");
    let square_x1;
    let square_y1;
    let square_x2;
    let square_y2;
    square_submenu.createText("Select color as usual");
    square_submenu.createInput('X1', "number", text => {
        square_x1 = parseInt(text);
    });
    square_submenu.createInput('Y1', "number", text => {
        square_y1 = parseInt(text);
    });
    square_submenu.createInput('X2', "number", text => {
        square_x2 = parseInt(text);
    });
    square_submenu.createInput('Y2', "number", text => {
        square_y2 = parseInt(text);
    });
    square_submenu.createButton("Start", () => {
        (0,_modules__WEBPACK_IMPORTED_MODULE_0__.BotSquare)(square_x1, square_y1, square_x2, square_y2, (0,_modules_util_getClientMouse__WEBPACK_IMPORTED_MODULE_3__["default"])()[2]);
    });
    square_submenu.createButton("Stop", () => {
        _modules_defaultModules_Queue__WEBPACK_IMPORTED_MODULE_1__["default"].stop();
    });
});


/***/ }),

/***/ "./src/GUI/TAB_Settings.ts":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _GUICore__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./src/GUI/GUICore.ts");
/* harmony import */ var _package_json__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./package.json");


$(function () {
    const gui = _GUICore__WEBPACK_IMPORTED_MODULE_1__.MainGUI.instance;
    const tab = gui.getTab("settings");
    const bot_settings = tab.createSubmenu("bot settings");
    bot_settings.createText("pixel speed default is 21");
    const pixelspeed_input = bot_settings.createInput(`pixel speed`, "number", (number) => {
        number = parseInt(number);
        if (number < 16.5)
            number = 16.5;
        window.seven.pixelspeed = number;
    });
    const sort_options = [
        { label: "none", value: "none" },
        { label: "grid", value: "grid" },
        { label: "top left", value: "topleft" },
        { label: "random", value: "rand" },
        { label: "colors", value: "colors" },
        { label: "vertical", value: "vertical" },
        { label: "horizontal", value: "horizontal" },
        { label: "circle", value: "circle" },
    ];
    bot_settings.createSelect('-- select sorting --', sort_options, value => {
        window.seven.order = value;
    });
    bot_settings.createText('Only works in canvas your admin');
    const pixel_type_options = [
        { label: "default", value: "default" },
        { label: "protect", value: "protect" },
        { label: "sea protect", value: "seaprotect" },
        { label: "unprotect", value: "unprotect" },
        { label: "replace", value: "replace" },
    ];
    bot_settings.createSelect('-- select tool --', pixel_type_options, value => {
        window.seven.pixel_type = value;
    });
    bot_settings.createColor("GUI Color Picker", "", color => {
        $(":root").css("--gui-main-color", color);
    });
    tab.createSubmenu("version").createText("7Placer version " + _package_json__WEBPACK_IMPORTED_MODULE_0__/* .version */ .rE);
});


/***/ }),

/***/ "./src/GUI/dragElement.ts":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ dragElement)
/* harmony export */ });
// W3SCHOOLS
function dragElement(elmnt) {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    if (document.getElementById(elmnt.id + "header")) {
        // if present, the header is where you move the DIV from:
        document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
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
        elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    }
    function closeDragElement() {
        // stop moving when mouse button is released:
        document.onmouseup = null;
        document.onmousemove = null;
    }
}


/***/ }),

/***/ "./src/GUI/style.ts":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   canvascss: () => (/* binding */ canvascss),
/* harmony export */   drop: () => (/* binding */ drop),
/* harmony export */   trackercss: () => (/* binding */ trackercss)
/* harmony export */ });
const trackercss = {
    top: '0px',
    left: '0px',
    borderColor: 'rgb(138,43,226)',
    color: 'rgb(138,43,226)',
    backgroundColor: 'black',
    opacity: '60%',
    display: 'none',
    transition: 'all 0.06s ease-in-out',
    pointerEvents: 'none'
};
// design by 0vc4
const drop = {
    width: 'calc(100% - 2em)',
    height: 'calc(100% - 2em)',
    position: 'fixed',
    left: '0px',
    top: '0px',
    backgroundColor: 'rgba(0, 0, 0, 0.533)',
    zIndex: '9999-',
    display: 'flex',
    color: 'white',
    fontSize: '48pt',
    justifyContent: 'center',
    alignItems: 'center',
    border: '3px white dashed',
    borderRadius: '18px',
    margin: '1em',
};
const canvascss = {
    position: 'absolute',
    pointerEvents: 'none',
    left: '0px',
    top: '0px',
    imageRendering: 'pixelated',
    opacity: '50%',
    animation: 'blink 3s ease-out infinite'
};
const blink = document.createElement("style");
blink.type = "text/css";
blink.innerText = `
@keyframes blink {
  0% { opacity: .30; }
  50% { opacity: .10; }
  100% { opacity: .30; }
}`;
document.head.appendChild(blink);


/***/ }),

/***/ "./src/auth/Auth.ts":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Auth)
/* harmony export */ });
class Auth {
    constructor(authObj) {
        this.authKey = authObj.authKey;
        this.authId = authObj.authId;
        this.authToken = authObj.authToken;
    }
}


/***/ }),

/***/ "./src/auth/util/commands.ts":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   deleteAccount: () => (/* binding */ deleteAccount),
/* harmony export */   public_commands: () => (/* binding */ public_commands)
/* harmony export */ });
/* harmony import */ var _Auth__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("./src/auth/Auth.ts");
/* harmony import */ var _variables__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./src/variables.ts");
/* harmony import */ var _requests_get_painting__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./src/requests/get-painting.ts");
/* harmony import */ var _bot_util_websocket__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("./src/bot/util/websocket.ts");




var LocalAccounts = new Map();
const public_commands = {
    saveAuth,
    getAuth,
    saveAccount,
    getAccounts,
    deleteAccount,
    connect,
    connectAll,
    disconnect,
    disconnectAll,
};
// save changes in localstorage
function storagePush() {
    const obj = Object.fromEntries(LocalAccounts);
    localStorage.setItem('LocalAccounts', JSON.stringify(obj));
}
// restore localstorage to localaccounts
function storageGet() {
    const storedAccounts = localStorage.getItem('LocalAccounts');
    if (storedAccounts) {
        const parsedAccounts = JSON.parse(storedAccounts);
        LocalAccounts = new Map(Object.entries(parsedAccounts));
    }
    else
        LocalAccounts = new Map();
}
async function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
// saves from params
function saveAuth(username, authId, authKey, authToken, print = true) {
    if (!authId || !authKey || !authToken) {
        console.log('[7p] saveAuth usage: saveAuth(username, authId, authKey, authToken)');
        return;
    }
    const account = { authId, authKey, authToken };
    LocalAccounts.set(username, account);
    storagePush();
    if (print)
        console.log('Auth saved. Saved list: ', LocalAccounts);
}
// returns client's auth
async function getAuth(print = true) {
    const cookieStore = window.cookieStore;
    const authToken = await cookieStore.get("authToken");
    const authKey = await cookieStore.get("authKey");
    const authId = await cookieStore.get("authId");
    if (authToken == null || authKey == null || authId == null) {
        console.log('[7p] Please login first!');
        return;
    }
    if (print)
        console.log(`authId = "${authId.value}", authKey = "${authKey.value}", authToken = "${authToken.value}"`);
    return { authToken: authToken.value, authKey: authKey.value, authId: authId.value };
}
// saves auth from client cookies
async function saveAccount() {
    storageGet();
    const AuthObj = await getAuth(false);
    const userinfo = await (0,_requests_get_painting__WEBPACK_IMPORTED_MODULE_1__["default"])(AuthObj.authId, AuthObj.authKey, AuthObj.authToken);
    saveAuth(userinfo.user.name, AuthObj.authId, AuthObj.authKey, AuthObj.authToken, false);
    console.log('Auth saved. Saved list: ', LocalAccounts);
}
// logs saved auths
function getAccounts() {
    storageGet();
    if (!LocalAccounts || LocalAccounts.size == 0) {
        console.log('No accounts found');
        return;
    }
    console.log(`Found ${LocalAccounts.size} accounts`);
    console.log(LocalAccounts);
}
// deletes auths
function deleteAccount(identifier) {
    if (identifier == null) {
        console.log('deleteAccount usage: deleteAccount(user or index)');
        return;
    }
    storageGet();
    if (typeof identifier == 'string') {
        if (identifier == 'all') {
            LocalAccounts.forEach((value, key) => {
                LocalAccounts.delete(key);
            });
            return;
        }
        if (!LocalAccounts.has(identifier)) {
            console.log(`[7p] Error deleting: No account with name ${identifier}`);
            return;
        }
        LocalAccounts.delete(identifier);
        console.log(`[7p] Deleted account ${identifier}.`);
        console.log(LocalAccounts);
    }
    if (typeof identifier == 'number') {
        const keys = Array.from(LocalAccounts.keys());
        if (identifier > keys.length) {
            console.log(`[7p] Error deleting: No account with index ${identifier}`);
            return;
        }
        LocalAccounts.delete(keys[identifier]);
        console.log(`Deleted account ${identifier}`);
        console.log(LocalAccounts);
    }
    storagePush();
}
async function connect(username) {
    storageGet();
    const account = LocalAccounts.get(username);
    const seven = window.seven;
    if (!username) {
        console.log('[7p] Missing bot username, connect("username")');
        return;
    }
    if (!account) {
        console.log(`[7p] No account found with username ${username}`);
        return;
    }
    if (seven.bots.has(username)) {
        console.log(`[7p] Account ${username} is already connected.`);
        return;
    }
    const auth = new _Auth__WEBPACK_IMPORTED_MODULE_3__["default"](account);
    (0,_bot_util_websocket__WEBPACK_IMPORTED_MODULE_2__.createBot)(auth, username);
}
async function connectAll() {
    storageGet();
    const seven = window.seven;
    for (const [username, account] of LocalAccounts) {
        if (seven.bots.has(username)) {
            console.log(`[7p] Account ${username} is already connected.`);
            continue;
        }
        const auth = new _Auth__WEBPACK_IMPORTED_MODULE_3__["default"](account);
        (0,_bot_util_websocket__WEBPACK_IMPORTED_MODULE_2__.createBot)(auth, username);
        await delay(500);
    }
}
function disconnect(username) {
    const seven = window.seven;
    const bot = seven.bots.get(username);
    if (!username) {
        console.log('[7p] disconnect requires a username, disconnect("username")');
        return;
    }
    if (!bot) {
        console.log(`[7p] No bot connected with username ${username}`);
        return;
    }
    ;
    bot.kill();
}
function disconnectAll() {
    const seven = window.seven;
    if (seven.bots.size == 5) {
        console.log('[7p] No bots connected.');
        return;
    }
    ;
    seven.bots.forEach((bot, name) => {
        if (name == "Client") {
            return;
        }
        ;
        bot.kill();
    });
}


/***/ }),

/***/ "./src/bot/Bot.ts":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Bot: () => (/* binding */ Bot),
/* harmony export */   Client: () => (/* binding */ Client),
/* harmony export */   WSBot: () => (/* binding */ WSBot)
/* harmony export */ });
/* harmony import */ var _canvas_Canvas__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./src/canvas/Canvas.ts");
/* harmony import */ var _variables__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./src/variables.ts");
/* harmony import */ var _GUI_style__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("./src/GUI/style.ts");
/* harmony import */ var _requests_get_painting__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("./src/requests/get-painting.ts");
/* harmony import */ var _util_MessageHandler__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("./src/bot/util/MessageHandler.ts");
/* harmony import */ var _modules_defaultModules_Protect__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("./src/modules/defaultModules/Protect.ts");
/* harmony import */ var _auth_util_commands__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("./src/auth/util/commands.ts");








class Bot {
    constructor(websocket) {
        this.trackeriters = 0;
        this.lastplace = performance.now();
        this._ws = websocket;
        this.handler = new _util_MessageHandler__WEBPACK_IMPORTED_MODULE_6__.MessageHandler(this, this.ws);
    }
    ;
    emit(event, params) {
        this.ws.send(`42["${event}",${params}]`);
    }
    ;
    kill() {
        const seven = window.seven;
        seven.bots.delete(this.username);
        if (this._ws.readyState == 1) {
            this._ws.close();
        }
        ;
    }
    ;
    async placePixel(pixel, tracker = true) {
        const canvas = _canvas_Canvas__WEBPACK_IMPORTED_MODULE_0__["default"].instance;
        const seven = window.seven;
        if (window.seven.pixel_type == "default" && (canvas.isSameColor(pixel) || canvas.isProtected(pixel))) {
            return true;
        }
        ;
        while (performance.now() - this.lastplace < seven.pixelspeed) {
            await new Promise(resolve => setTimeout(resolve, 0));
        }
        ;
        // console.log(performance.now() - this.lastplace)
        const pixel_param = this.determinePixelType(pixel);
        this.emit('p', pixel_param);
        this.lastplace = performance.now();
        if (tracker && this.trackeriters >= 6) {
            $(this.tracker).css({ top: pixel.y, left: pixel.x, display: 'block' });
            this.trackeriters = 0;
        }
        ;
        this.trackeriters += 1;
        clearTimeout(this._trackerTimeout);
        this._trackerTimeout = setTimeout(() => {
            this.tracker?.hide();
        }, 5000);
        return true;
    }
    ;
    determinePixelType(pixel, type) {
        const types = {
            default: `[${pixel.x},${pixel.y},${pixel.color},1]`,
            protect: `[${pixel.x},${pixel.y},${pixel.color},1,1]`,
            seaprotect: `[${pixel.x},${pixel.y},-100,1,1]`,
            unprotect: `[${pixel.x},${pixel.y},${pixel.color},1,2]`,
            replace: `[${pixel.x}, ${pixel.y}, ${pixel.color}, 1, 3]`
        };
        if (!type)
            type = window.seven.pixel_type;
        if (!(type in types)) {
            throw new Error(type + " is not a valid pixel type.");
        }
        return types[type];
    }
    ;
    static async findAvailableBot() {
        const seven = window.seven;
        const bots = seven.bots;
        var tick = 0;
        while (true) {
            for (const [_, bot] of bots) {
                if (Date.now() - bot.lastplace >= seven.pixelspeed) {
                    // console.log(`[7p] found available bot: ${bot.username}, ${ Date.now() - bot.lastplace }`);
                    return bot;
                }
                ;
            }
            ;
            tick += 1;
            if (tick == seven.tickspeed) {
                tick = 0;
                await new Promise(resolve => setTimeout(resolve, 0));
            }
            ;
        }
        ;
    }
    createTracker() {
        const tracker = $('<div class="track" id="bottracker">').text(`[7P] ${this.username}`).css(_GUI_style__WEBPACK_IMPORTED_MODULE_2__.trackercss);
        $('#canvas').ready(function () {
            // console.log(`[7p] created tracker: ${name}`)
            $('#painting-move').append(tracker);
        });
        return tracker;
    }
    ;
    get ws() {
        return this._ws;
    }
    ;
}
class WSBot extends Bot {
    constructor(auth, username, websocket) {
        super(websocket);
        this._auth = auth;
        this.username = username;
        this.startBot();
    }
    async startBot() {
        this.generalinfo = await (0,_requests_get_painting__WEBPACK_IMPORTED_MODULE_3__["default"])(this.auth.authId, this.auth.authKey, this.auth.authToken);
        this.tracker = this.createTracker();
        this.internalListeners();
    }
    get auth() {
        return this._auth;
    }
    ;
    internalListeners() {
        this.handler.on('server_time', (data) => {
            this.paliveServerTime = data[1]; // stores servertime for palive
        });
        // this.handler.on('ping.alive', () => {
        //         const hash = getPalive(this.paliveServerTime, this.botid);
        //         console.log('[7p]', this.username, ': pong =', hash, this.botid)
        //         this.emit('pong.alive', `"${hash}"`);
        // })
        this.handler.on('throw.error', (data) => {
            if (data[1] == 49) {
                console.log(`[7p] [Bot ${this.username}] Error (${data[1]}): This auth is not valid! Deleting account from saved accounts...`);
                (0,_auth_util_commands__WEBPACK_IMPORTED_MODULE_5__.deleteAccount)(this.username);
                this.kill();
                return;
            }
            else if (data[1] == 16) {
                this.kill();
            }
            ;
            console.log(`[7p] [Bot ${this.username}] Pixelplace WS error: ${data[1]}`);
        });
        this.handler.on('canvas', () => {
            const seven = window.seven;
            console.log(`[7p] Succesfully connected to bot ${this.username}`);
            seven.bots.set(this.username, this);
        });
        this.handler.on(2, () => {
            this.ws.send('3');
        });
        this.handler.on('start', () => {
            this.ws.send('40');
        });
        this.handler.on('init', () => {
            this.emit('init', `{"authKey":"${this.auth.authKey}","authToken":"${this.auth.authToken}","authId":"${this.auth.authId}","boardId":${_canvas_Canvas__WEBPACK_IMPORTED_MODULE_0__["default"].instance.ID}}`);
        });
    }
}
class Client extends Bot {
    constructor(websocket) {
        super(websocket);
        Client.instance = this;
        this.start();
    }
    ;
    static get Client() {
        return Client.instance;
    }
    ;
    start() {
        const seven = window.seven;
        this.username = 'Client';
        this.tracker = this.createTracker();
        this.internalListeners();
        seven.bots.set(this.username, this);
    }
    ;
    internalListeners() {
        // Bot canvas array updater
        this.handler.on('p', (data) => {
            for (const pixel of data[1]) {
                const canvas = _canvas_Canvas__WEBPACK_IMPORTED_MODULE_0__["default"].instance;
                const x = pixel[0];
                const y = pixel[1];
                const color = pixel[2];
                const id = pixel[4];
                canvas.updatePixel(x, y, color);
                _modules_defaultModules_Protect__WEBPACK_IMPORTED_MODULE_4__["default"].checkPixel(x, y, color);
            }
        });
        // Rewrites some pixels after loading (I think because of cache lag)
        this.handler.on("canvas", (data) => {
            for (const pixel of data[1]) {
                const canvas = _canvas_Canvas__WEBPACK_IMPORTED_MODULE_0__["default"].instance;
                const x = pixel[0];
                const y = pixel[1];
                const color = pixel[2];
                canvas.updatePixel(x, y, color);
            }
            ;
        });
    }
    ;
}
;


/***/ }),

/***/ "./src/bot/util/MessageHandler.ts":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   MessageHandler: () => (/* binding */ MessageHandler)
/* harmony export */ });
class MessageHandler {
    constructor(bot, websocket) {
        this._listeners = new Map();
        this._bot = bot;
        this._websocket = websocket;
        this._startHandler();
    }
    ;
    on(message_type, callback) {
        if (!this._listeners.has(message_type))
            this._listeners.set(message_type, []);
        this._listeners.get(message_type).push(callback);
    }
    ;
    cancel(func) {
        this._listeners.forEach((value) => {
            value.filter((listener) => {
                listener != func;
            });
        });
    }
    ;
    _startHandler() {
        this._websocket.addEventListener('message', event => this._handleMessage(event));
    }
    _handleMessage(message) {
        message = message.data;
        if (message.startsWith('42')) {
            message = JSON.parse(message.slice(2));
            const message_type = message[0];
            this._fire(message_type, message);
            return;
        }
        if (message.startsWith('0')) {
            this._fire('start');
            return;
        }
        if (message.startsWith('40')) {
            this._fire('init');
        }
        this._fire(message);
    }
    ;
    _fire(message_type, data) {
        if (!this._listeners.has(message_type))
            return;
        this._listeners.get(message_type).forEach((listener) => {
            listener(data);
        });
    }
    ;
}
;


/***/ }),

/***/ "./src/bot/util/palive.ts":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getPalive),
/* harmony export */   getTDelay: () => (/* binding */ getTDelay)
/* harmony export */ });
// credits to symmetry
function randomString(charList, num) {
    return Array.from({ length: num }, () => charList.charAt(Math.floor(Math.random() * charList.length))).join('');
}
function randomString1(num) {
    const charList = 'abcdefghijklmnopqrstuvwxyz1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    return randomString(charList, num);
}
function randomString2(num) {
    const charList = 'gmbonjklezcfxta1234567890GMBONJKLEZCFXTA';
    return randomString(charList, num);
}
function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
const paliveCharmap = {
    "0": "g",
    "1": "n",
    "2": "b",
    "3": "r",
    "4": "z",
    "5": "s",
    "6": "l",
    "7": "x",
    "8": "i",
    "9": "o",
};
function getPalive(serverTime, userId) {
    const tDelay = getTDelay(serverTime);
    const sequenceLengths = [6, 5, 9, 4, 5, 3, 6, 6, 3];
    const currentTimestamp = Math.floor(Date.now() / 1000) + tDelay - 5400;
    const timestampString = currentTimestamp.toString();
    const timestampCharacters = timestampString.split('');
    let result = '';
    for (let i = 0; i < sequenceLengths.length; i++) {
        const sequenceNumber = sequenceLengths[i];
        result += randInt(0, 1) == 1 ? randomString2(sequenceNumber) : randomString1(sequenceNumber);
        const letter = paliveCharmap[parseInt(timestampCharacters[i])];
        result += randInt(0, 1) == 0 ? letter.toUpperCase() : letter;
    }
    result += userId.toString().substring(0, 1) + (randInt(0, 1) == 1 ? randomString2(randInt(4, 20)) : randomString1(randInt(4, 25)));
    return result + "0=";
}
function getTDelay(serverTime) {
    const currentTime = new Date().getTime() / 1e3;
    return Math.floor(serverTime - currentTime);
}


/***/ }),

/***/ "./src/bot/util/websocket.ts":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createBot: () => (/* binding */ createBot)
/* harmony export */ });
/* harmony import */ var _Bot__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./src/bot/Bot.ts");
/* harmony import */ var _variables__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./src/variables.ts");


// client
function hookClient() {
    const unmodifiedWS = window.WebSocket;
    window.WebSocket = function (url, protocols) {
        const socket = new unmodifiedWS(url, protocols);
        socket.addEventListener("open", () => new _Bot__WEBPACK_IMPORTED_MODULE_0__.Client(socket));
        socket.addEventListener("close", hookClient);
        // client.handler = new MessageHandler(client, socket)
        return socket;
    };
}
hookClient();
// multibot
async function createBot(auth, username) {
    console.log(`[7p] Attempting to connect account ${username}`);
    const socket = new WebSocket("wss://pixelplace.io/socket.io/?EIO=4&transport=websocket");
    const bot = new _Bot__WEBPACK_IMPORTED_MODULE_0__.WSBot(auth, username, socket);
    socket.addEventListener("close", () => { bot.kill(); });
}


/***/ }),

/***/ "./src/canvas/Canvas.ts":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Canvas: () => (/* binding */ Canvas),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _GUI_style__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./src/GUI/style.ts");
/* harmony import */ var _modules__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./src/modules/index.ts");
/* harmony import */ var _util_canvasloader__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("./src/canvas/util/canvasloader.ts");



class Canvas {
    constructor() {
        this._ID = this.ParseID();
        this._isProcessed = false;
        this._customCanvas = this.newPreviewCanvas();
        this._colors = this.getPalette();
    }
    static get instance() {
        if (!Canvas._instance) {
            Canvas._instance = new Canvas;
            (0,_util_canvasloader__WEBPACK_IMPORTED_MODULE_2__.processColors)();
        }
        return Canvas._instance;
    }
    newPreviewCanvas() {
        const canvas = $(`<canvas width="2500" height="2088">`).css(_GUI_style__WEBPACK_IMPORTED_MODULE_0__.canvascss);
        $('#canvas').ready(function () {
            $('#painting-move').append(canvas);
        });
        const ctx = canvas[0].getContext("2d");
        return ctx;
    }
    isSameColor(pixel) {
        return this.getColor(pixel.x, pixel.y) == pixel.color;
    }
    ;
    isProtected(pixel) {
        return this.getColor(pixel.x, pixel.y) == 200;
    }
    getColor(x, y) {
        return this.canvasArray[x][y];
    }
    ;
    updatePixel(x, y, color) {
        if (!this._isProcessed)
            return;
        this.canvasArray[x][y] = color;
        // console.log(this.getColor(x, y), "->", color)
    }
    getPalette() {
        const palette_buttons = document.querySelectorAll("#palette-buttons a");
        let unsorted_array = [];
        palette_buttons.forEach((color) => {
            let id = color.getAttribute('data-id');
            let colorhex = color.getAttribute('title');
            unsorted_array.push({ color: colorhex, id: parseInt(id) });
        });
        unsorted_array.sort((a, b) => { return a.id - b.id; });
        let result = [];
        unsorted_array.forEach((colorobj) => {
            result.push((0,_modules__WEBPACK_IMPORTED_MODULE_1__.hex2rgb)(colorobj.color));
        });
        return result;
    }
    ;
    ParseID() {
        return parseInt(window.location.href.split("/").slice(-1)[0].split("-")[0]);
    }
    get previewCanvas() {
        return this._customCanvas;
    }
    get canvasArray() {
        return this._canvasArray;
    }
    get isProcessed() {
        return this._isProcessed;
    }
    set isProcessed(bool) {
        this._isProcessed = bool;
    }
    get ID() {
        return this._ID;
    }
    get colors() {
        return this._colors;
    }
    set canvasArray(array) {
        this._canvasArray = array;
        this.isProcessed = true;
    }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Canvas);


/***/ }),

/***/ "./src/canvas/util/canvasloader.ts":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   processColors: () => (/* binding */ processColors),
/* harmony export */   processWater: () => (/* binding */ processWater)
/* harmony export */ });
/* harmony import */ var _Canvas__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./src/canvas/Canvas.ts");

async function processWater() {
    const pixelplace_canvas = document.getElementById('canvas');
    var waterArray = Array.from({ length: pixelplace_canvas.width }, () => Array.from({ length: pixelplace_canvas.height }, () => 1));
    var image = await fetch('https://pixelplace.io/canvas/' + _Canvas__WEBPACK_IMPORTED_MODULE_0__["default"].instance.ID + 'p.png?t200000=' + Date.now());
    if (!image.ok) {
        return waterArray;
    }
    const blob = await image.blob();
    const bitmap = await createImageBitmap(blob);
    const canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
    const context = canvas.getContext('2d', { "willReadFrequently": true });
    context.drawImage(bitmap, 0, 0, bitmap.width, bitmap.height);
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    return new Promise((resolve) => {
        if (bitmap.width == 1 && bitmap.height == 1) { // custom canvases ?
            resolve(waterArray);
        }
        for (let y = 0; y < canvas.height; y++) {
            for (let x = 0; x < canvas.width; x++) {
                const index = (y * imageData.width + x) * 4;
                var r = imageData.data[index];
                var g = imageData.data[index + 1];
                var b = imageData.data[index + 2];
                if (r == 204 && g == 204 && b == 204) {
                    waterArray[x][y] = 200;
                }
            }
        }
        console.log(waterArray);
        resolve(waterArray);
    });
}
async function processColors() {
    const start_total_time = performance.now();
    const canvas = _Canvas__WEBPACK_IMPORTED_MODULE_0__["default"].instance;
    const pixelplace_canvas = document.getElementById('canvas');
    const ctx = pixelplace_canvas.getContext('2d', { "willReadFrequently": true });
    const imageData = ctx.getImageData(0, 0, pixelplace_canvas.width, pixelplace_canvas.height);
    const pixelData = imageData.data;
    const start_water_time = performance.now();
    const waterArray = await processWater();
    const final_water_time = performance.now() - start_water_time;
    var CanvasArray = Array.from({ length: pixelplace_canvas.width }, () => Array.from({ length: pixelplace_canvas.height }, () => 1));
    const start_color_time = performance.now();
    if (waterArray.length > 1) {
        CanvasArray = waterArray;
    }
    for (let y = 0; y < pixelplace_canvas.height; y++) {
        for (let x = 0; x < pixelplace_canvas.width; x++) {
            if (CanvasArray[x][y] == 200) {
                continue;
            }
            const pixelIndex = (y * pixelplace_canvas.width + x) * 4;
            const r = pixelData[pixelIndex];
            const g = pixelData[pixelIndex + 1];
            const b = pixelData[pixelIndex + 2];
            const colorIndex = canvas.colors.findIndex(color => color[0] === r && color[1] === g && color[2] === b);
            CanvasArray[x][y] = colorIndex;
        }
    }
    console.log(CanvasArray);
    _Canvas__WEBPACK_IMPORTED_MODULE_0__["default"].instance.canvasArray = CanvasArray;
    // Logging
    const final_total_time = performance.now() - start_total_time;
    const final_colors_time = performance.now() - start_color_time;
    console.log(`[7p PROCESSING] Total Time: ${final_total_time}ms, Colors Time: ${final_colors_time}ms, Water Time: ${final_water_time}ms`);
    Toastify({
        text: `Canvas loaded!`,
        style: {
            background: "#1a1a1a",
            border: "solid rgb(0, 255, 81)"
        },
    }).showToast();
}


/***/ }),

/***/ "./src/index.ts":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _package_json__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./package.json");
/* harmony import */ var _canvas_Canvas__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./src/canvas/Canvas.ts");
/* harmony import */ var _util_ExternalLoader__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("./src/util/ExternalLoader.ts");



// @ts-ignore (GLOBAL IMPORT)
const context = __webpack_require__("./src sync recursive ^(?%21.*global\\.d).+");
context.keys().forEach(context);
Object.defineProperty(window.console, 'log', {
    configurable: false,
    enumerable: true,
    writable: false,
    value: console.log
});
console.log(`%c7Placer Loaded! Version: ${_package_json__WEBPACK_IMPORTED_MODULE_0__/* .version */ .rE}`, 'color: chartreuse; font-size: 60px; font-style: italic;');
(0,_util_ExternalLoader__WEBPACK_IMPORTED_MODULE_2__.loadCss)('https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css');
const intervalId = setInterval(() => {
    if (document.getElementById('canvas')) {
        clearInterval(intervalId);
        Toastify({
            text: `7Placer ${_package_json__WEBPACK_IMPORTED_MODULE_0__/* .version */ .rE} Loaded! Loading canvas...`,
            style: {
                background: "#1a1a1a",
                border: "solid var(--gui-main-color)"
            },
            callback: () => {
                Toastify({
                    text: `Click me to join the discord.`,
                    destination: "https://discord.gg/3fXfQp7Rms",
                    newWindow: true,
                    style: {
                        background: "#1a1a1a",
                        border: "solid var(--gui-main-color)"
                    },
                }).showToast();
            }
        }).showToast();
        _canvas_Canvas__WEBPACK_IMPORTED_MODULE_1__["default"].instance;
    }
}, 100);


/***/ }),

/***/ "./src/modules/defaultModules/ImageTools.ts":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   botImage: () => (/* binding */ botImage),
/* harmony export */   hex2rgb: () => (/* binding */ hex2rgb),
/* harmony export */   imageBitmap2imageData: () => (/* binding */ imageBitmap2imageData),
/* harmony export */   imageData2array: () => (/* binding */ imageData2array)
/* harmony export */ });
/* harmony import */ var _canvas_Canvas__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./src/canvas/Canvas.ts");
/* harmony import */ var _variables__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./src/variables.ts");
/* harmony import */ var _Queue__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("./src/modules/defaultModules/Queue.ts");
/* harmony import */ var _Sorting__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("./src/modules/defaultModules/Sorting.ts");




function hex2rgb(hex) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return [r, g, b];
}
function previewCanvasImage(x, y, image) {
    const canvas = _canvas_Canvas__WEBPACK_IMPORTED_MODULE_0__["default"].instance;
    const ctx = canvas.previewCanvas;
    const img = new Image();
    img.onload = function () {
        ctx.drawImage(img, x, y);
    };
    img.src = URL.createObjectURL(image);
}
const workerCode = `
    function getColorDistance(c1, c2) {
        return (c1.r - c2[0]) ** 2 + (c1.g - c2[1]) ** 2 + (c1.b - c2[2]) ** 2;
    }
    function findClosestColor(color, palette) {
        let minDistance = Infinity;
        let colorNumber
        let index = 0
        for (const palette_color of palette) {
            const distance = getColorDistance(color, palette_color);
            if (distance < minDistance) {
            minDistance = distance;
            colorNumber = index
            }
            index += 1
        }
        return colorNumber;
    }

    self.onmessage = function (e) { // {imageData: ImageData, palette: [r, g, b][]}
        const pixelData = e.data.imageData.data
        const result = []
        for (let y = 0; y < e.data.imageData.height; y++) {
            for (let x = 0; x < e.data.imageData.width; x++) {
                const pixelIndex = (y * e.data.imageData.width + x) * 4;
                const r = pixelData[pixelIndex];
                const g = pixelData[pixelIndex + 1];
                const b = pixelData[pixelIndex + 2];
                const a = pixelData[pixelIndex + 3];
                if (a < 1) {
                    continue; // ignore transparent pixels
                };
                const color = findClosestColor({r, g, b}, e.data.palette);
                result.push({x, y, color});
            };
        }
        self.postMessage(result);
    };
`;
const blob = new Blob([workerCode], { type: 'application/javascript' });
const blobUrl = URL.createObjectURL(blob);
async function imageData2array(imageData, palette, dither) {
    const t0 = performance.now();
    const processing_toast = Toastify({
        text: `Processing image...`,
        duration: 100000,
        style: {
            background: "#1a1a1a",
            border: "solid var(--gui-main-color)"
        },
    }).showToast();
    if (dither) {
        const quant = new RgbQuant({ palette: _canvas_Canvas__WEBPACK_IMPORTED_MODULE_0__["default"].instance.colors });
        quant.sample(imageData);
        quant.reduce(imageData, 1, dither);
    }
    const final_result = await new Promise(resolve => {
        const worker = new Worker(blobUrl);
        var result = [];
        worker.postMessage({ imageData: imageData, palette: palette });
        worker.onmessage = function (e) {
            worker.terminate();
            resolve(e.data);
        };
    });
    processing_toast.hideToast();
    Toastify({
        text: `Image processed!`,
        style: {
            background: "#1a1a1a",
            border: "solid rgb(0, 255, 81)"
        },
    }).showToast();
    return final_result;
}
async function imageBitmap2imageData(image) {
    const canvas = new OffscreenCanvas(image.width, image.height);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(image, 0, 0, image.width, image.height);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    return imageData;
}
async function botImage(x, y, image) {
    if (x == undefined || y == undefined || !image)
        return;
    const seven = window.seven;
    const bitmap = await createImageBitmap(image);
    let image_data = await imageBitmap2imageData(bitmap);
    let processed = await imageData2array(image_data, _canvas_Canvas__WEBPACK_IMPORTED_MODULE_0__["default"].instance.colors, window.seven.dither);
    previewCanvasImage(x, y, image);
    processed = await (0,_Sorting__WEBPACK_IMPORTED_MODULE_3__["default"])(processed, seven.order);
    processed.forEach((pixel) => {
        pixel.x += x;
        pixel.y += y;
    });
    _Queue__WEBPACK_IMPORTED_MODULE_2__["default"].bulkAdd(processed, true);
}


/***/ }),

/***/ "./src/modules/defaultModules/Protect.ts":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _canvas_Canvas__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./src/canvas/Canvas.ts");
/* harmony import */ var _Queue__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./src/modules/defaultModules/Queue.ts");


class Protector {
    protect(x, y, color) {
        Protector.protected.push({ x: x, y: y, color: color });
    }
    static clear() {
        Protector.protected = [];
    }
    static checkPixel(x, y, color) {
        const canvas = _canvas_Canvas__WEBPACK_IMPORTED_MODULE_0__["default"].instance;
        if (Protector.protected.length == 0) {
            return;
        }
        function isInsideProtected(pixel) {
            if (pixel.x == x && pixel.y == y) {
                return true;
            }
            return false;
        }
        function isSameColor(pixel) {
            const canvasColor = canvas.getColor(x, y);
            if (canvasColor == pixel.color) {
                return true;
            }
            return false;
        }
        Protector.protected.forEach((pixel) => {
            if (isInsideProtected(pixel) && !isSameColor(pixel)) {
                _Queue__WEBPACK_IMPORTED_MODULE_1__["default"].add(pixel, false, window.seven.agressive_protection);
            }
        });
    }
}
Protector.protected = [];
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Protector);


/***/ }),

/***/ "./src/modules/defaultModules/Queue.ts":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Queue)
/* harmony export */ });
/* harmony import */ var _bot_Bot__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./src/bot/Bot.ts");
/* harmony import */ var _canvas_Canvas__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./src/canvas/Canvas.ts");
/* harmony import */ var _variables__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("./src/variables.ts");
/* harmony import */ var _Protect__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("./src/modules/defaultModules/Protect.ts");




class Queue {
    constructor() {
        Queue.performance = performance.now();
    }
    static add(pixel, protection, atStart = false, client = false) {
        const seven = window.seven;
        if (atStart)
            seven.queue.unshift(pixel);
        else {
            seven.queue.push(pixel);
        }
        ;
        if (seven.queue.length == 1)
            Queue.start();
    }
    ;
    static bulkAdd(pixel_array, protection, atStart = false, client = false) {
        const seven = window.seven;
        pixel_array.forEach(pixel => {
            pixel.protected = protection;
            pixel.client = client;
        });
        if (!atStart) {
            seven.queue = seven.queue.concat(pixel_array);
        }
        else {
            seven.queue.unshift(...pixel_array);
        }
        if (seven.queue.length == pixel_array.length)
            Queue.start();
    }
    ;
    static clear() {
        const seven = window.seven;
        // console.log('Queue cleared: ', seven.queue);
        seven.queue = [];
    }
    ;
    static async start() {
        const seven = window.seven;
        const canvas = _canvas_Canvas__WEBPACK_IMPORTED_MODULE_1__["default"].instance;
        const protector = new _Protect__WEBPACK_IMPORTED_MODULE_3__["default"];
        if (!canvas.isProcessed) {
            Toastify({
                text: `Canvas has not been processed yet.`,
                style: {
                    background: "#1a1a1a",
                    border: "solid rgb(255, 0, 0)",
                },
            }).showToast();
            console.log('[7p] Error starting queue: Canvas has not been processed yet.');
            Queue.stop();
            return;
        }
        seven.inprogress = true;
        let tick = 0;
        while (seven.inprogress) {
            // console.log(performance.now() - Queue.performance);
            Queue.performance = performance.now();
            const pixel = seven.queue[0];
            let bot;
            if (pixel.client) {
                bot = _bot_Bot__WEBPACK_IMPORTED_MODULE_0__.Client.instance;
            }
            else {
                bot = await _bot_Bot__WEBPACK_IMPORTED_MODULE_0__.Bot.findAvailableBot();
            }
            ;
            // Anti lag when skipping (fix it pls)
            const canvas_color = canvas.getColor(pixel.x, pixel.y);
            if (pixel.color == canvas_color) {
                tick += 1;
            }
            else
                tick = 0;
            if (tick == 100) {
                await new Promise(resolve => setTimeout(resolve, 0));
                tick = 0;
            }
            ;
            await bot.placePixel(pixel);
            var indexOfRemoval = seven.queue.indexOf(pixel);
            seven.queue.splice(indexOfRemoval, 1);
            if (pixel.protected && seven.protect) {
                protector.protect(pixel.x, pixel.y, pixel.color);
            }
            if (seven.queue.length == 0) {
                seven.inprogress = false;
                console.log('[7p] Queue done.');
            }
            ;
        }
        ;
    }
    ;
    static stop() {
        const seven = window.seven;
        seven.inprogress = false;
        const canvas = _canvas_Canvas__WEBPACK_IMPORTED_MODULE_1__["default"].instance;
        canvas.previewCanvas.clearRect(0, 0, 3000, 3000);
        _Protect__WEBPACK_IMPORTED_MODULE_3__["default"].clear();
        Queue.clear();
    }
    ;
}
;


/***/ }),

/***/ "./src/modules/defaultModules/Sorting.ts":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ sort)
/* harmony export */ });
const workerCode = `
    self.onmessage = function (e) { // {array: {x: number, y: number, color: number}[], order: string}
        let array = e.data.array
        switch (e.data.order) {
            case 'none':
            break

            case 'rand':
            array.sort(() => Math.random() - 0.5);
            break

            case 'colors':
            array.sort((a, b) => a.color - b.color);
            break

            case 'vertical':
            array.sort((a, b) => a.x - b.x);
            break

            case 'horizontal':
            array.sort((a, b) => a.y - b.y);
            break

            case 'topleft':
            array.sort((a, b) => {
                return (a.x + a.y) - (b.x + b.y);
            });
            break

            case 'grid':
            array.sort((a, b) => {
                if (b.x % 2 == 0 && b.y % 2 == 0) {
                    return -1
                } else {
                    return 1
                }
            })
            break

            default:
            case 'circle':
            const CX = Math.floor((array[0].x + array[array.length - 1].x) / 2);
            const CY = Math.floor((array[0].y + array[array.length - 1].y) / 2);
            array.sort((a, b) => {
                const distanceA = Math.sqrt((a.x - CX) ** 2 + (a.y - CY) ** 2);
                const distanceB = Math.sqrt((b.x - CX) ** 2 + (b.y - CY) ** 2);
                return distanceA - distanceB;
            });
        }
        self.postMessage(array)
    };
`;
const blob = new Blob([workerCode], { type: 'application/javascript' });
const blobUrl = URL.createObjectURL(blob);
async function sort(array, order) {
    const pixel_array = await new Promise(resolve => {
        let t0 = performance.now();
        let sorting_toast = Toastify({
            text: `Sorting...`,
            duration: 100000,
            style: {
                background: "#1a1a1a",
                border: "solid var(--gui-main-color)"
            },
        }).showToast();
        const worker = new Worker(blobUrl);
        worker.postMessage({ array: array, order: order });
        worker.onmessage = function (e) {
            resolve(e.data);
            console.log(`Sorted in ${performance.now() - t0}`);
            sorting_toast.hideToast();
            clearTimeout(long_sort_timeout);
        };
        let long_sort_timeout = setTimeout(() => {
            Toastify({
                text: `If sorting is taking too long consider using "sort: none"`,
                duration: 10000,
                style: {
                    background: "#1a1a1a",
                    border: "solid rgb(255, 251, 0)"
                },
            }).showToast();
        }, 7000);
    });
    return pixel_array;
}


/***/ }),

/***/ "./src/modules/defaultModules/SquareMaker.ts":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BotSquare: () => (/* binding */ BotSquare)
/* harmony export */ });
/* harmony import */ var _Queue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./src/modules/defaultModules/Queue.ts");
/* harmony import */ var _Sorting__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./src/modules/defaultModules/Sorting.ts");


async function BotSquare(x1, y1, x2, y2, color) {
    if (x1 == undefined || y1 == undefined || x2 == undefined || y2 == undefined || color === undefined)
        return;
    const seven = window.seven;
    var result = [];
    if (x2 < x1)
        [x1, x2] = [x2, x1];
    if (y2 < y1)
        [y1, y2] = [y2, y1];
    for (let x = x1; x <= x2; x++) {
        for (let y = y1; y <= y2; y++) {
            result.push({ x, y, color });
        }
    }
    result = await (0,_Sorting__WEBPACK_IMPORTED_MODULE_1__["default"])(result, seven.order);
    result.forEach((pixel) => {
        _Queue__WEBPACK_IMPORTED_MODULE_0__["default"].add(pixel, true);
    });
    Toastify({
        text: `Square from ${x1}, ${y1} TO ${x2}, ${y2} with color ID ${color}`,
        style: {
            background: "#1a1a1a",
            border: "solid var(--gui-main-color)"
        },
    }).showToast();
}


/***/ }),

/***/ "./src/modules/defaultModules/defaultKeys.ts":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _util_getClientMouse__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("./src/modules/util/getClientMouse.ts");
/* harmony import */ var _Queue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./src/modules/defaultModules/Queue.ts");
/* harmony import */ var _SquareMaker__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./src/modules/defaultModules/SquareMaker.ts");



var coord1 = null;
$(document).on('keydown', function (event) {
    if ($(':input[type="text"]').is(':focus'))
        return;
    let x, y, color;
    switch (event.which) {
        case (87):
            if (!event.altKey)
                return;
            _Queue__WEBPACK_IMPORTED_MODULE_0__["default"].stop();
            break;
        case (66):
            [x, y, color] = (0,_util_getClientMouse__WEBPACK_IMPORTED_MODULE_2__["default"])();
            $("#number_input_X").val(x).trigger("input");
            $("#number_input_Y").val(y).trigger("input");
            break;
        case 88:
            [x, y, color] = (0,_util_getClientMouse__WEBPACK_IMPORTED_MODULE_2__["default"])();
            if (coord1 == null) {
                coord1 = { x: x, y: y };
                return;
            }
            ;
            (0,_SquareMaker__WEBPACK_IMPORTED_MODULE_1__.BotSquare)(coord1.x, coord1.y, x, y, color);
            coord1 = null;
            break;
    }
});


/***/ }),

/***/ "./src/modules/defaultModules/index.ts":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BotSquare: () => (/* reexport safe */ _SquareMaker__WEBPACK_IMPORTED_MODULE_2__.BotSquare),
/* harmony export */   botImage: () => (/* reexport safe */ _ImageTools__WEBPACK_IMPORTED_MODULE_0__.botImage),
/* harmony export */   hex2rgb: () => (/* reexport safe */ _ImageTools__WEBPACK_IMPORTED_MODULE_0__.hex2rgb),
/* harmony export */   imageBitmap2imageData: () => (/* reexport safe */ _ImageTools__WEBPACK_IMPORTED_MODULE_0__.imageBitmap2imageData),
/* harmony export */   imageData2array: () => (/* reexport safe */ _ImageTools__WEBPACK_IMPORTED_MODULE_0__.imageData2array)
/* harmony export */ });
/* harmony import */ var _ImageTools__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./src/modules/defaultModules/ImageTools.ts");
/* harmony import */ var _Queue__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./src/modules/defaultModules/Queue.ts");
/* harmony import */ var _SquareMaker__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("./src/modules/defaultModules/SquareMaker.ts");
/* harmony import */ var _defaultKeys__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("./src/modules/defaultModules/defaultKeys.ts");






/***/ }),

/***/ "./src/modules/index.ts":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BotSquare: () => (/* reexport safe */ _defaultModules__WEBPACK_IMPORTED_MODULE_0__.BotSquare),
/* harmony export */   botImage: () => (/* reexport safe */ _defaultModules__WEBPACK_IMPORTED_MODULE_0__.botImage),
/* harmony export */   hex2rgb: () => (/* reexport safe */ _defaultModules__WEBPACK_IMPORTED_MODULE_0__.hex2rgb),
/* harmony export */   imageBitmap2imageData: () => (/* reexport safe */ _defaultModules__WEBPACK_IMPORTED_MODULE_0__.imageBitmap2imageData),
/* harmony export */   imageData2array: () => (/* reexport safe */ _defaultModules__WEBPACK_IMPORTED_MODULE_0__.imageData2array)
/* harmony export */ });
/* harmony import */ var _defaultModules__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./src/modules/defaultModules/index.ts");

// custom exports


/***/ }),

/***/ "./src/modules/util/getClientMouse.ts":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getClientMouse)
/* harmony export */ });
function getClientMouse() {
    const coordinates = $('#coordinates').text();
    const [x, y] = coordinates.split(',').map(coord => parseInt(coord.trim()));
    const selectedcolor = $('#palette-buttons a.selected').data('id');
    return [x, y, selectedcolor];
}


/***/ }),

/***/ "./src/requests/get-painting.ts":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getPainting)
/* harmony export */ });
/* harmony import */ var _getCookie__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./src/requests/getCookie.ts");
/* harmony import */ var _canvas_Canvas__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./src/canvas/Canvas.ts");


async function getPainting(authId, authKey, authToken) {
    const canvas = _canvas_Canvas__WEBPACK_IMPORTED_MODULE_0__["default"].instance;
    const originalAuthId = (0,_getCookie__WEBPACK_IMPORTED_MODULE_1__["default"])('authId');
    const originalAuthKey = (0,_getCookie__WEBPACK_IMPORTED_MODULE_1__["default"])('authKey');
    const originalAuthToken = (0,_getCookie__WEBPACK_IMPORTED_MODULE_1__["default"])('authToken');
    document.cookie = `authId=${authId}; path=/`;
    document.cookie = `authKey=${authKey}; path=/`;
    document.cookie = `authToken=${authToken}; path=/`;
    try {
        const response = await fetch(`https://pixelplace.io/api/get-painting.php?id=${canvas.ID}&connected=1`, {
            headers: {
                'Accept': 'application/json, text/javascript, */*; q=0.01',
            },
            credentials: 'include'
        });
        const json = response.json();
        return json;
    }
    finally {
        document.cookie = `authId=${originalAuthId}; path=/`;
        document.cookie = `authKey=${originalAuthKey}; path=/`;
        document.cookie = `authToken=${originalAuthToken}; path=/`;
    }
}


/***/ }),

/***/ "./src/requests/getCookie.ts":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getCookie)
/* harmony export */ });
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2)
        return parts.pop().split(';').shift();
}


/***/ }),

/***/ "./src/requests/ping.ts":
/***/ (() => {

// to do


/***/ }),

/***/ "./src/util/ExternalLoader.ts":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   loadCss: () => (/* binding */ loadCss)
/* harmony export */ });
function loadCss(url) {
    var head = document.getElementsByTagName('head')[0];
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = url;
    link.media = 'all';
    head.appendChild(link);
}


/***/ }),

/***/ "./src/variables.ts":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _auth_util_commands__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./src/auth/util/commands.ts");

window.seven = {
    bots: new Map(),
    pixelspeed: 21,
    queue: [],
    inprogress: false,
    protect: false,
    tickspeed: 1000,
    order: 'fromCenter',
    multi: _auth_util_commands__WEBPACK_IMPORTED_MODULE_0__.public_commands,
    dither: null,
    agressive_protection: false,
    pixel_type: "default",
};


/***/ }),

/***/ "./src sync recursive ^(?%21.*global\\.d).+":
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var map = {
	".": "./src/index.ts",
	"./": "./src/index.ts",
	"./GUI/GUICore": "./src/GUI/GUICore.ts",
	"./GUI/GUICore.ts": "./src/GUI/GUICore.ts",
	"./GUI/GUIStyle.css": "./src/GUI/GUIStyle.css",
	"./GUI/TAB_Botting": "./src/GUI/TAB_Botting.ts",
	"./GUI/TAB_Botting.ts": "./src/GUI/TAB_Botting.ts",
	"./GUI/TAB_Settings": "./src/GUI/TAB_Settings.ts",
	"./GUI/TAB_Settings.ts": "./src/GUI/TAB_Settings.ts",
	"./GUI/dragElement": "./src/GUI/dragElement.ts",
	"./GUI/dragElement.ts": "./src/GUI/dragElement.ts",
	"./GUI/style": "./src/GUI/style.ts",
	"./GUI/style.ts": "./src/GUI/style.ts",
	"./auth/Auth": "./src/auth/Auth.ts",
	"./auth/Auth.ts": "./src/auth/Auth.ts",
	"./auth/util/commands": "./src/auth/util/commands.ts",
	"./auth/util/commands.ts": "./src/auth/util/commands.ts",
	"./bot/Bot": "./src/bot/Bot.ts",
	"./bot/Bot.ts": "./src/bot/Bot.ts",
	"./bot/util/MessageHandler": "./src/bot/util/MessageHandler.ts",
	"./bot/util/MessageHandler.ts": "./src/bot/util/MessageHandler.ts",
	"./bot/util/palive": "./src/bot/util/palive.ts",
	"./bot/util/palive.ts": "./src/bot/util/palive.ts",
	"./bot/util/websocket": "./src/bot/util/websocket.ts",
	"./bot/util/websocket.ts": "./src/bot/util/websocket.ts",
	"./canvas/Canvas": "./src/canvas/Canvas.ts",
	"./canvas/Canvas.ts": "./src/canvas/Canvas.ts",
	"./canvas/util/canvasloader": "./src/canvas/util/canvasloader.ts",
	"./canvas/util/canvasloader.ts": "./src/canvas/util/canvasloader.ts",
	"./index": "./src/index.ts",
	"./index.ts": "./src/index.ts",
	"./modules": "./src/modules/index.ts",
	"./modules/": "./src/modules/index.ts",
	"./modules/defaultModules": "./src/modules/defaultModules/index.ts",
	"./modules/defaultModules/": "./src/modules/defaultModules/index.ts",
	"./modules/defaultModules/ImageTools": "./src/modules/defaultModules/ImageTools.ts",
	"./modules/defaultModules/ImageTools.ts": "./src/modules/defaultModules/ImageTools.ts",
	"./modules/defaultModules/Protect": "./src/modules/defaultModules/Protect.ts",
	"./modules/defaultModules/Protect.ts": "./src/modules/defaultModules/Protect.ts",
	"./modules/defaultModules/Queue": "./src/modules/defaultModules/Queue.ts",
	"./modules/defaultModules/Queue.ts": "./src/modules/defaultModules/Queue.ts",
	"./modules/defaultModules/Sorting": "./src/modules/defaultModules/Sorting.ts",
	"./modules/defaultModules/Sorting.ts": "./src/modules/defaultModules/Sorting.ts",
	"./modules/defaultModules/SquareMaker": "./src/modules/defaultModules/SquareMaker.ts",
	"./modules/defaultModules/SquareMaker.ts": "./src/modules/defaultModules/SquareMaker.ts",
	"./modules/defaultModules/defaultKeys": "./src/modules/defaultModules/defaultKeys.ts",
	"./modules/defaultModules/defaultKeys.ts": "./src/modules/defaultModules/defaultKeys.ts",
	"./modules/defaultModules/index": "./src/modules/defaultModules/index.ts",
	"./modules/defaultModules/index.ts": "./src/modules/defaultModules/index.ts",
	"./modules/index": "./src/modules/index.ts",
	"./modules/index.ts": "./src/modules/index.ts",
	"./modules/util/getClientMouse": "./src/modules/util/getClientMouse.ts",
	"./modules/util/getClientMouse.ts": "./src/modules/util/getClientMouse.ts",
	"./requests/get-painting": "./src/requests/get-painting.ts",
	"./requests/get-painting.ts": "./src/requests/get-painting.ts",
	"./requests/getCookie": "./src/requests/getCookie.ts",
	"./requests/getCookie.ts": "./src/requests/getCookie.ts",
	"./requests/ping": "./src/requests/ping.ts",
	"./requests/ping.ts": "./src/requests/ping.ts",
	"./util/ExternalLoader": "./src/util/ExternalLoader.ts",
	"./util/ExternalLoader.ts": "./src/util/ExternalLoader.ts",
	"./variables": "./src/variables.ts",
	"./variables.ts": "./src/variables.ts"
};


function webpackContext(req) {
	var id = webpackContextResolve(req);
	return __webpack_require__(id);
}
function webpackContextResolve(req) {
	if(!__webpack_require__.o(map, req)) {
		var e = new Error("Cannot find module '" + req + "'");
		e.code = 'MODULE_NOT_FOUND';
		throw e;
	}
	return map[req];
}
webpackContext.keys = function webpackContextKeys() {
	return Object.keys(map);
};
webpackContext.resolve = webpackContextResolve;
module.exports = webpackContext;
webpackContext.id = "./src sync recursive ^(?%21.*global\\.d).+";

/***/ }),

/***/ "./package.json":
/***/ ((module) => {

"use strict";
module.exports = {"rE":"2.2.1"};

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
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./src/index.ts");
/******/ 	
/******/ })()
;