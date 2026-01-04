// ==UserScript==
// @name         Enhanced Twitter post hider
// @namespace    victorique.moe
// @version      1.5.5
// @description  Allows finer control over what words you want to hide from the platform
// @grant        GM.xmlHttpRequest
// @grant        GM.getValue
// @grant        GM.listValues
// @grant        GM.setValue
// @author       Victoria
// @match        https://x.com/*
// @match        https://twitter.com/*
// @run-at       document-idle
// @icon         https://i.imgur.com/nx5ejHb.png
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/492269/Enhanced%20Twitter%20post%20hider.user.js
// @updateURL https://update.greasyfork.org/scripts/492269/Enhanced%20Twitter%20post%20hider.meta.js
// ==/UserScript==

(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["twitter-enhanced-muted-words"] = factory();
	else
		root["twitter-enhanced-muted-words"] = factory();
})(this, () => {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 944:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(601);
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(314);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `.remove-button {
    color: red;
}

.hidden {
    display: none;
}

#currentBlockedWordsTable {
    border-collapse: collapse;
    width: 100%;
}

#currentBlockedWordsTable td, #currentBlockedWordsTable th {
    border: 1px solid #ddd;
    padding: 8px;
}

#currentBlockedWordsTable td:last-of-type {
    border: none;
    width: 20px;
}

#currentBlockedWordsTable tr:hover {
    background-color: #073d1e;
}

#currentBlockedWordsTable th {
    padding-top: 12px;
    padding-bottom: 12px;
    text-align: left;
    background-color: #04AA6D;
    color: white;
}

.overlay {
    position: fixed;
    display: block;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 1.0);
    z-index: 2;
    cursor: pointer;
}

.overlay .text {
    position: absolute;
    top: 50%;
    left: 50%;
    color: white;
    transform: translate(-50%, -50%);
    -ms-transform: translate(-50%, -50%);
    font-family: TwitterChirp, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

#EH_settings {
    margin-top: 10px;
}

#yourUserId {
    margin-left: 10px;
}

#yourUserId:focus {
    outline: none;
    border-color: rgb(29, 155, 240);
    box-shadow: 0 0 10px rgb(29, 155, 240);
}
`, ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ 108:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(601);
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(314);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `.Modal {
    display: none;
    position: fixed;
    z-index: 9999;
    padding-top: 100px;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
    background-color: rgb(0, 0, 0);
    background-color: rgba(0, 0, 0, 0.4);
    font-family: TwitterChirp, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

.FSmodalContent {
    position: relative;
    background-color: #141414;
    color: #ffffff !important;
    margin: auto;
    padding: 0;
    border: 1px solid #888;
    width: 900px;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
    -webkit-animation-name: animatetop;
    -webkit-animation-duration: 0.4s;
    animation-name: animatetop;
    animation-duration: 0.4s
}


.button {
    background-color: #4CAF50; /* Green */
    border: none;
    color: white;
    padding: 7px 21px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    margin: 4px 2px;
    -webkit-transition-duration: 0.4s; /* Safari */
    transition-duration: 0.4s;
    cursor: pointer;
}

.blackButton {
    background-color: #141414;
    color: white;
    border: 2px solid #555555;
}

.blackButton:hover {
    background-color: #555555;
    color: white;
}

/* Add Animation */
@-webkit-keyframes animatetop {
    from {
        top: -300px;
        opacity: 0
    }
    to {
        top: 0;
        opacity: 1
    }
}

@keyframes animatetop {
    from {
        top: -300px;
        opacity: 0
    }
    to {
        top: 0;
        opacity: 1
    }
}

/* The Close Button */
.FSclose {
    float: right;
    font-size: 28px;
    font-weight: bold;
    margin-bottom: 1rem;
}

.FSclose:hover,
.FSclose:focus {
    color: #8f412c6e;
    text-decoration: none;
    cursor: pointer;
}

.FSmodalHeader {
    padding: 0.5rem;
}

.FSModalBody {
    padding: 1rem;
}

.FSModalFooter {
    color: white;
    display: flex;
    flex-wrap:wrap;
    justify-content: space-between;
    padding: 0.5rem;
    border-top: 1px solid #333232;

}

.FSmodalTitle {
    margin-left: 1rem;
}

.awesomplete > ul {
    color: #ff0000;
}
`, ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ 107:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(601);
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(314);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `* {
    --switch-height: 18px;
    --switch-padding: 8px;
    --switch-width: calc((var(--switch-height) * 2) - var(--switch-padding));
    --slider-height: calc(var(--switch-height) - var(--switch-padding));
    --slider-on: calc(var(--switch-height) - var(--switch-padding));
}

.switch {
    position: relative;
    display: inline-block;
    width: var(--switch-width);
    height: var(--switch-height);
}

.switch input {
    opacity: 0;
    width: 0;
    height: 0;
}

.slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    -webkit-transition: .4s;
    transition: .4s;
}

.slider:before {
    content: "";
    position: absolute;
    height: var(--slider-height);
    width: var(--slider-height);
    left: calc(var(--switch-padding) / 2);
    bottom: calc(var(--switch-padding) / 2);
    background-color: white;
    -webkit-transition: .4s;
    transition: .4s;
}

input:checked+.slider {
    background-color: #2196F3;
}

input:focus+.slider {
    box-shadow: 0 0 1px #2196F3;
}

input:checked+.slider:before {
    transform: translateX(var(--slider-on));
}

.slider.round {
    border-radius: var(--slider-height);
}

.slider.round:before {
    border-radius: 50%;
}
`, ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ 314:
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

/***/ 601:
/***/ ((module) => {



module.exports = function (i) {
  return i[1];
};

/***/ }),

/***/ 977:
/***/ ((__unused_webpack_module, __unused_webpack___webpack_exports__, __webpack_require__) => {

/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(72);
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(825);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(659);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(56);
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(540);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(113);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_main_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(944);

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());
options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_main_css__WEBPACK_IMPORTED_MODULE_6__/* ["default"] */ .A, options);




       /* unused harmony default export */ var __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_main_css__WEBPACK_IMPORTED_MODULE_6__/* ["default"] */ .A && _node_modules_css_loader_dist_cjs_js_main_css__WEBPACK_IMPORTED_MODULE_6__/* ["default"] */ .A.locals ? _node_modules_css_loader_dist_cjs_js_main_css__WEBPACK_IMPORTED_MODULE_6__/* ["default"] */ .A.locals : undefined);


/***/ }),

/***/ 839:
/***/ ((__unused_webpack_module, __unused_webpack___webpack_exports__, __webpack_require__) => {

/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(72);
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(825);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(659);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(56);
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(540);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(113);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_modal_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(108);

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());
options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_modal_css__WEBPACK_IMPORTED_MODULE_6__/* ["default"] */ .A, options);




       /* unused harmony default export */ var __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_modal_css__WEBPACK_IMPORTED_MODULE_6__/* ["default"] */ .A && _node_modules_css_loader_dist_cjs_js_modal_css__WEBPACK_IMPORTED_MODULE_6__/* ["default"] */ .A.locals ? _node_modules_css_loader_dist_cjs_js_modal_css__WEBPACK_IMPORTED_MODULE_6__/* ["default"] */ .A.locals : undefined);


/***/ }),

/***/ 206:
/***/ ((__unused_webpack_module, __unused_webpack___webpack_exports__, __webpack_require__) => {

/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(72);
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(825);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(659);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(56);
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(540);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(113);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_switch_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(107);

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());
options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_switch_css__WEBPACK_IMPORTED_MODULE_6__/* ["default"] */ .A, options);




       /* unused harmony default export */ var __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_switch_css__WEBPACK_IMPORTED_MODULE_6__/* ["default"] */ .A && _node_modules_css_loader_dist_cjs_js_switch_css__WEBPACK_IMPORTED_MODULE_6__/* ["default"] */ .A.locals ? _node_modules_css_loader_dist_cjs_js_switch_css__WEBPACK_IMPORTED_MODULE_6__/* ["default"] */ .A.locals : undefined);


/***/ }),

/***/ 72:
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

/***/ 659:
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

/***/ 540:
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

/***/ 56:
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

/***/ 825:
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

/***/ 113:
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

/***/ 279:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   TwitterPostObserver: () => (/* binding */ TwitterPostObserver)
/* harmony export */ });
/* harmony import */ var _UiBuilder_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(361);
/* harmony import */ var _managers_LocalStoreManager_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(146);
/* harmony import */ var _decorators_PostObserver_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(967);
/* harmony import */ var _PageInterceptor_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(678);
/* harmony import */ var _Utils_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(41);
/* harmony import */ var _TwitterMutator_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(57);
/* harmony import */ var _css_modal_css__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(839);
/* harmony import */ var _css_switch_css__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(206);
/* harmony import */ var _css_main_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(977);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_decorators_PostObserver_js__WEBPACK_IMPORTED_MODULE_2__, _TwitterMutator_js__WEBPACK_IMPORTED_MODULE_3__]);
([_decorators_PostObserver_js__WEBPACK_IMPORTED_MODULE_2__, _TwitterMutator_js__WEBPACK_IMPORTED_MODULE_3__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var TwitterPostObserver_1;









let TwitterPostObserver = class TwitterPostObserver {
    static { TwitterPostObserver_1 = this; }
    constructor() {
        this.uiBuilder = _UiBuilder_js__WEBPACK_IMPORTED_MODULE_0__/* .UiBuilder */ .i.getInstance();
        this.localStoreManager = _managers_LocalStoreManager_js__WEBPACK_IMPORTED_MODULE_1__/* .LocalStoreManager */ .g.getInstance();
        this.regexPhraseCache = new Map();
    }
    static async getInstance() {
        if (!TwitterPostObserver_1.instance) {
            TwitterPostObserver_1.instance = new TwitterPostObserver_1();
            await TwitterPostObserver_1.instance.init();
            TwitterPostObserver_1.instance.twitterMutator = await _TwitterMutator_js__WEBPACK_IMPORTED_MODULE_3__/* .TwitterMutator */ .q.getInstance();
        }
        return TwitterPostObserver_1.instance;
    }
    removeElm(blockedWordEntry, elms) {
        for (const elm of elms) {
            const e = elm;
            if (blockedWordEntry.options.useOverlay) {
                this.uiBuilder.injectOverlay(e, blockedWordEntry.phrase);
            }
            else {
                e.style.display = "none";
            }
            e.dataset.thidden = "true";
        }
    }
    async processMuteMap(muteMap) {
        const pArr = [];
        for (const [entry, elements] of muteMap) {
            this.removeElm(entry, elements);
            pArr.push(this.localStoreManager.incrementBlockedWordAudit(entry.phrase));
        }
        await Promise.all(pArr);
    }
    findMatchingBlockPhrase(tweetText, allBlockedWords, testId) {
        for (const blockedWord of allBlockedWords) {
            const { phrase, options } = blockedWord;
            const { useRegex, filterUsername } = options;
            if (testId === "User-Name" && !filterUsername) {
                return null;
            }
            if (useRegex) {
                let regExp = this.regexPhraseCache.get(phrase);
                if (!regExp) {
                    regExp = new RegExp(phrase, "mi");
                    this.regexPhraseCache.set(phrase, regExp);
                }
                if (regExp.test(tweetText)) {
                    return blockedWord;
                }
            }
            else if (tweetText.includes(phrase)) {
                return blockedWord;
            }
        }
        return null;
    }
    shouldRemove(el, allBlockedWords, globalOpts) {
        if (!allBlockedWords || allBlockedWords.length === 0) {
            return [false, null];
        }
        const tweetTexts = el.querySelectorAll("[data-testid='tweetText']");
        const username = el.querySelectorAll("[data-testid='User-Name']");
        if (el.dataset.thidden) {
            return [false, null]; // already hidden
        }
        // we want to check the username first, so it needs to be this order
        const elements = Array.from(username).concat(Array.from(tweetTexts));
        for (const tweet of elements) {
            let content;
            if (tweet.dataset.testid === "User-Name") {
                content = tweet.querySelector("a")?.href?.split("/")?.pop() ?? null;
                if (globalOpts.username) {
                    // content at this point is the user handle
                    if (content === globalOpts.username) {
                        return [false, null];
                    }
                }
            }
            else {
                content = tweet.textContent;
            }
            if (content) {
                const dataset = tweet.dataset;
                const matchedPhrase = this.findMatchingBlockPhrase(content, allBlockedWords, dataset.testid);
                if (matchedPhrase) {
                    return [true, matchedPhrase];
                }
            }
        }
        return [false, null];
    }
    async observe(mutationList, observer) {
        const allBlockedWords = await this.localStoreManager.getAllStoredWords();
        const globalOptions = await this.localStoreManager.getAllGlobalOpts();
        // collection of how many elements a phrase muted
        const muteMap = new Map();
        for (const mutationRecord of mutationList) {
            for (let i = 0; i < mutationRecord.addedNodes.length; i++) {
                const removedNode = mutationRecord.addedNodes[i];
                this.populateMuteMap(removedNode, allBlockedWords, muteMap, globalOptions);
            }
        }
        await this.processMuteMap(muteMap);
    }
    populateMuteMap(removedNode, allBlockedWords, muteMap, globalOpts) {
        const [shouldRemove, entry] = this.shouldRemove(removedNode, allBlockedWords, globalOpts);
        if (shouldRemove) {
            if (muteMap.has(entry)) {
                muteMap.get(entry)?.push(removedNode);
            }
            else {
                muteMap.set(entry, [removedNode]);
            }
        }
    }
    async init() {
        const pageInterceptor = _PageInterceptor_js__WEBPACK_IMPORTED_MODULE_7__/* .PageInterceptor */ .L.getInstance();
        pageInterceptor.addAction(async () => {
            const allBlockedWords = await this.localStoreManager.getAllStoredWords();
            if (allBlockedWords.length === 0) {
                this.twitterMutator.closeMutators();
                return;
            }
            await this.twitterMutator.init();
            await this.loadPage();
        });
        await this.loadPage();
        pageInterceptor.addAction(async () => {
            const page = window.location.pathname.split("/").pop();
            if (page !== "mute_and_block") {
                return;
            }
            const anchor = this.uiBuilder.buildOption();
            if (!anchor) {
                return;
            }
            const insertAfter = await (0,_Utils_js__WEBPACK_IMPORTED_MODULE_8__/* .waitForElm */ .ZO)("a[href='/settings/muted_keywords']");
            if (!insertAfter) {
                return;
            }
            insertAfter.after(anchor);
            const modal = await this.buildModal();
            anchor.addEventListener("click", () => {
                _Utils_js__WEBPACK_IMPORTED_MODULE_8__/* .DomUtil */ .bQ.openModal(modal);
            });
        });
    }
    async buildModal() {
        const [modal, exists] = await this.uiBuilder.getEditor(blockedWords => {
            // no point listening for mutation events if there are no words to block
            if (blockedWords.length === 0) {
                this.twitterMutator.closeMutators();
            }
        });
        if (!exists) {
            const el = document.body;
            el.insertAdjacentElement("beforeend", modal);
        }
        return modal;
    }
    async loadPage() {
        const allBlockedWords = await this.localStoreManager.getAllStoredWords();
        if (allBlockedWords.length === 0) {
            return;
        }
        const allGlobalOpts = await this.localStoreManager.getAllGlobalOpts();
        const selectorToLoad = (0,_Utils_js__WEBPACK_IMPORTED_MODULE_8__/* .getSelectorForPage */ .c4)();
        const timelineContainer = await (0,_Utils_js__WEBPACK_IMPORTED_MODULE_8__/* .waitForElm */ .ZO)(selectorToLoad);
        if (!timelineContainer) {
            return;
        }
        if (!timelineContainer.children) {
            return;
        }
        const muteMap = new Map();
        for (let i = 0; i < timelineContainer.children.length; i++) {
            const chatItem = timelineContainer.children[i];
            this.populateMuteMap(chatItem, allBlockedWords, muteMap, allGlobalOpts);
        }
        await this.processMuteMap(muteMap);
    }
};
TwitterPostObserver = TwitterPostObserver_1 = __decorate([
    _decorators_PostObserver_js__WEBPACK_IMPORTED_MODULE_2__/* .PostObserver */ .z,
    __metadata("design:paramtypes", [])
], TwitterPostObserver);

await TwitterPostObserver.getInstance();

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } }, 1);

/***/ }),

/***/ 678:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   L: () => (/* binding */ PageInterceptor)
/* harmony export */ });
class PageInterceptor {
    constructor() {
        this.actions = [];
    }
    static getInstance() {
        if (!PageInterceptor.instance) {
            PageInterceptor.instance = new PageInterceptor();
            PageInterceptor.instance.init();
        }
        return PageInterceptor.instance;
    }
    init() {
        window.addEventListener("load", () => {
            let oldHref = document.location.href;
            const body = document.querySelector("body");
            if (!body) {
                return;
            }
            const observer = new MutationObserver(() => {
                if (oldHref !== document.location.href) {
                    oldHref = document.location.href;
                    for (const action of this.actions) {
                        action();
                    }
                }
            });
            observer.observe(body, { childList: true, subtree: true });
        }, true);
    }
    addAction(action) {
        this.actions.push(action);
    }
}


/***/ }),

/***/ 57:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   q: () => (/* binding */ TwitterMutator)
/* harmony export */ });
/* harmony import */ var _Utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(41);
/* harmony import */ var _Main_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(279);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_Main_js__WEBPACK_IMPORTED_MODULE_0__]);
_Main_js__WEBPACK_IMPORTED_MODULE_0__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];


class TwitterMutator {
    constructor() {
        this.timelineObserverProxy = null;
        this.observerList = [];
        this.instanceMap = new Map();
    }
    static async getInstance() {
        if (!TwitterMutator.instance) {
            TwitterMutator.instance = new TwitterMutator();
            await TwitterMutator.instance.init();
        }
        return TwitterMutator.instance;
    }
    async init() {
        await this.onTweet();
    }
    addObserver(context) {
        this.observerList.push(context);
    }
    async getObserver(context) {
        let instance = this.instanceMap.get(context) ?? null;
        if (instance) {
            return instance;
        }
        if (context === _Main_js__WEBPACK_IMPORTED_MODULE_0__.TwitterPostObserver) {
            instance = await _Main_js__WEBPACK_IMPORTED_MODULE_0__.TwitterPostObserver.getInstance();
            this.instanceMap.set(context, instance);
            return instance;
        }
        return null;
    }
    async onTweet() {
        const homePageSelector = (0,_Utils_js__WEBPACK_IMPORTED_MODULE_1__/* .getSelectorForPage */ .c4)();
        const elm = await (0,_Utils_js__WEBPACK_IMPORTED_MODULE_1__/* .waitForElm */ .ZO)(homePageSelector);
        if (!elm) {
            return;
        }
        const parentSection = elm.closest("section");
        if (!parentSection) {
            return;
        }
        const sectionWrapper = parentSection.parentElement;
        if (!sectionWrapper) {
            return;
        }
        if (this.timelineObserverProxy) {
            this.timelineObserverProxy.disconnect();
        }
        this.timelineObserverProxy = new MutationObserver(async (mutations, observer) => {
            const observers = (await Promise.all(this.observerList.map(observer => this.getObserver(observer)))).filter(observer => !!observer);
            observers.map(instanceObserver => {
                instanceObserver.observe(mutations, observer);
            });
        });
        this.timelineObserverProxy.observe(sectionWrapper, {
            childList: true,
            subtree: true,
        });
    }
    closeMutators() {
        this.timelineObserverProxy?.disconnect();
    }
    async openMutators() {
        await this.init();
    }
}

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ 361:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   i: () => (/* binding */ UiBuilder)
/* harmony export */ });
/* harmony import */ var _Utils_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(41);
/* harmony import */ var _typings_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(872);
/* harmony import */ var _managers_LocalStoreManager_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(146);



class UiBuilder {
    constructor() {
        this.localStoreManager = _managers_LocalStoreManager_js__WEBPACK_IMPORTED_MODULE_1__/* .LocalStoreManager */ .g.getInstance();
    }
    static getInstance() {
        if (!UiBuilder.instance) {
            UiBuilder.instance = new UiBuilder();
        }
        return UiBuilder.instance;
    }
    buildOption() {
        const hasEl = document.querySelector("#enhanced_muted_words") !== null;
        if (hasEl) {
            return null;
        }
        const a = document.createElement("a");
        a.className = "css-175oi2r r-1wtj0ep r-16x9es5 r-1f1sjgu r-o7ynqc r-6416eg r-1ny4l3l r-1loqt21";
        a.id = "enhanced_muted_words";
        a.setAttribute("style", "padding-right: 16px; padding-left: 16px;");
        a.innerHTML = `<div class="css-175oi2r r-1awozwy r-18u37iz r-16y2uox"><div class="css-175oi2r r-16y2uox r-1wbh5a2"><div dir="ltr" class="css-1rynq56 r-bcqeeo r-qvutc0 r-37j5jr r-a023e6 r-rjixqe r-16dba41" style="text-overflow: unset; color: rgb(231, 233, 234);"><span class="css-1qaijid r-bcqeeo r-qvutc0 r-poiln3" style="text-overflow: unset;">Enhanced muted words</span></div></div><svg viewBox="0 0 24 24" aria-hidden="true" class="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-1bwzh9t r-1q142lx r-f727ji"><g><path d="M14.586 12L7.543 4.96l1.414-1.42L17.414 12l-8.457 8.46-1.414-1.42L14.586 12z"></path></g></svg></div>`;
        a.addEventListener("mouseenter", evt => {
            evt.target.classList.add("r-g2wdr4");
        });
        a.addEventListener("mouseleave", evt => {
            evt.target.classList.remove("r-g2wdr4");
        });
        return a;
    }
    injectOverlay(e, phrase) {
        const overlay = document.createElement("div");
        const text = document.createElement("span");
        const innerContent = e.firstChild;
        innerContent.style.display = "none";
        e.style.height = "121px";
        text.className = "text";
        text.textContent = `Content hidden due to rule ${phrase} - click to show`;
        overlay.append(text);
        overlay.className = "overlay";
        overlay.onclick = () => {
            overlay.style.display = "none";
            innerContent.style.removeProperty("display");
            e.style.removeProperty("height");
            delete e.dataset.thidden;
        };
        e.append(overlay);
    }
    async getEditor(onSave) {
        function createTableBodyRows(allBlockedWords) {
            let tableBodyRows = "";
            for (const blockedWord of allBlockedWords) {
                const useOverlay = blockedWord.options.useOverlay ?? false;
                const filterUsername = blockedWord.options.useOverlay ?? false;
                tableBodyRows += `
                <tr>
                    <td contenteditable="true">${blockedWord.phrase}</td>
                    <td>
                        <select>
                            <option value="true" ${blockedWord.options.useRegex ? "selected" : ""}>true</option>
                            <option value="false" ${blockedWord.options.useRegex ? "" : "selected"}>false</option>
                        </select>
                    </td>
                    <td>
                        <label class="switch">
                          <input type="checkbox" class="useOverlayCheck" ${useOverlay ? "" : "checked"}>
                          <span class="slider round"></span>
                        </label>                    
                    </td>
                    <td>
                        <label class="switch">
                          <input type="checkbox" class="includeUsernameCheck" ${filterUsername ? "checked" : ""}>
                          <span class="slider round"></span>
                        </label>                    
                    </td>
                    <td>${blockedWord.count}</td>
                    <td>
                        <button data-id="removeRow">Remove</button>
                    </td>
                </tr>
            `;
            }
            return tableBodyRows;
        }
        function createHtml(allBlockedWords, settings) {
            return `
                <div id='currentBlockedWordsTableWrapper'>
                    <table id='currentBlockedWordsTable'>
                        <thead>
                            <tr>
                                <th scope="col">Phrase</th>
                                <th scope="col">Regex</th>
                                <th scope="col"><span title="If toggled on, this will remove the post completely instead of using an overlay">Remove posts</span></th>
                                <th scope="col"><span title="If on, it will also include user handles (@) in the filter">Include username</span></th>
                                <th scope="col">Mute count</th>
                            </tr>
                        </thead>
                    <tbody id="currentBlockedWordsTableBody">
                        ${createTableBodyRows(allBlockedWords)}
                    </tbody>
                    </table>
                    <div id='EH_settings'>
                         <label for="yourUserId">Your Username:</label>
                         <input id="yourUserId" placeholder="Example: @VictoriqueM" value="${settings.username ?? ""}" data-type="${_typings_js__WEBPACK_IMPORTED_MODULE_0__/* .SETTING */ .H.USERNAME}" style="margin-left: 10px;"/>
                    </div>
                </div>
            `;
        }
        function bindRemoveButtons() {
            modal.querySelectorAll("button[data-id='removeRow']").forEach(e => {
                _Utils_js__WEBPACK_IMPORTED_MODULE_2__/* .DomUtil */ .bQ.offOn(e, "click", e => {
                    const target = e.target;
                    target.closest("tr")?.remove();
                });
            });
        }
        const existingModel = document.getElementById("#enhancedMutedWordsDialog");
        if (existingModel) {
            return [existingModel, true];
        }
        const allBlockedWords = await this.localStoreManager.getAllStoredWords();
        const muteCount = await this.localStoreManager.getAuditEntries();
        const merged = allBlockedWords.map(value => {
            const auditEntry = muteCount[value.phrase] ?? 0;
            return { ...value, count: auditEntry };
        });
        const globalOpts = await this.localStoreManager.getAllGlobalOpts();
        const modal = await _Utils_js__WEBPACK_IMPORTED_MODULE_2__/* .DomUtil */ .bQ.createModal({
            id: "enhancedMutedWordsDialog",
            body: () => createHtml(merged, globalOpts),
            title: "Enhanced Muted words",
            modalBodyStyle: {
                height: "auto",
                overflow: "auto",
            },
            footer: `
                <button id="AddRowButton" class="button blackButton">Add row</button>
                <button id="applyEnhancedMutedWords" class="button blackButton apply">Save</button>
            `,
        });
        modal.querySelector("#applyEnhancedMutedWords")?.addEventListener("click", async () => {
            const table = modal.querySelector("#currentBlockedWordsTable");
            const tableRows = Array.from(table.querySelectorAll("#currentBlockedWordsTableBody tr"));
            const muteCount = await this.localStoreManager.getAuditEntries();
            const blockedWords = [];
            for (const row of tableRows) {
                const tableTextContent = row.querySelector("td:first-child")?.textContent;
                if (!tableTextContent) {
                    alert("Unable to set blank phrase");
                    return;
                }
                const phrase = tableTextContent;
                const useRegex = row.querySelector("select").value === "true";
                if (useRegex) {
                    try {
                        new RegExp(phrase);
                    }
                    catch (e) {
                        alert(`Regex ${phrase} is not valid: ${e.message}`);
                        return;
                    }
                }
                const hidePost = row.querySelector("input.useOverlayCheck").checked;
                const filterUsername = row.querySelector("input.includeUsernameCheck").checked;
                const auditEntry = muteCount[phrase] ?? 0;
                blockedWords.push({
                    phrase,
                    options: {
                        useRegex,
                        useOverlay: !hidePost,
                        filterUsername,
                    },
                    count: auditEntry,
                });
            }
            await this.localStoreManager.setBlockedWords(blockedWords);
            const globalOptsToSet = {};
            const globalOpts = modal.querySelector("#EH_settings");
            globalOpts?.querySelectorAll("input").forEach(e => {
                const type = e.dataset.type;
                let value = e.value;
                if (type === _typings_js__WEBPACK_IMPORTED_MODULE_0__/* .SETTING */ .H.USERNAME) {
                    if (value.startsWith("@")) {
                        // we don't want @ in the input
                        value = value.slice(1);
                    }
                }
                globalOptsToSet[type] = value;
            });
            await this.localStoreManager.setAllGlobalOpts(globalOptsToSet);
            if (onSave) {
                await onSave(blockedWords);
            }
            alert("Saved successfully.");
        });
        bindRemoveButtons();
        modal.querySelector("#AddRowButton")?.addEventListener("click", () => {
            const table = modal.querySelector("#currentBlockedWordsTable");
            const newRow = document.createElement("tr");
            newRow.innerHTML = `
                <td contenteditable="true"></td>
                <td>
                    <select>
                        <option value="true">true</option>
                        <option value="false">false</option>
                    </select>
                </td>
                <td>
                    <label class=" switch">
                      <input type="checkbox" class="useOverlayCheck">
                      <span class="slider round"></span>
                    </label>                    
                </td>
                 <td>
                    <label class=" switch">
                      <input type="checkbox" class="includeUsernameCheck">
                      <span class="slider round"></span>
                    </label>                    
                </td>
                <td>0</td>
                <td>
                    <button data-id="removeRow">Remove</button>
                </td>
            `;
            table.querySelector("#currentBlockedWordsTableBody")?.appendChild(newRow);
            bindRemoveButtons();
        });
        return [modal, false];
    }
}


/***/ }),

/***/ 41:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ZO: () => (/* binding */ waitForElm),
/* harmony export */   bQ: () => (/* binding */ DomUtil),
/* harmony export */   c4: () => (/* binding */ getSelectorForPage)
/* harmony export */ });
/* unused harmony export toggleHide */
function waitForElm(selector, node) {
    return new Promise((resolve, reject) => {
        const e = node ?? document;
        if (e.querySelector(selector)) {
            return resolve(e.querySelector(selector));
        }
        const timeout = setTimeout(() => {
            resolve(null);
            observer.disconnect();
        }, 10000);
        const observer = new MutationObserver(() => {
            if (e.querySelector(selector)) {
                resolve(e.querySelector(selector));
                observer.disconnect();
                clearTimeout(timeout);
            }
        });
        observer.observe(e, {
            childList: true,
            subtree: true,
        });
    });
}
class DomUtil {
    static guid() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        return `${s4()}${s4()}-${s4()}-${s4()}-${s4()}-${s4()}${s4()}${s4()}`;
    }
    /**
     * Create a modal with the given options
     * @param options
     */
    static async createModal(options) {
        function getStyle(styleObj) {
            let styleStr = "";
            if (styleObj) {
                for (const key in styleObj) {
                    styleStr += `${key}: ${styleObj[key]}; `;
                }
            }
            return styleStr;
        }
        let id;
        if (options.id) {
            id = options.id;
        }
        else {
            id = this.guid();
        }
        const bodyStyle = getStyle(options.modalContentStyle);
        const styleStr = getStyle(options.modalBodyStyle);
        const body = await options.body();
        let html = `<div class="Modal" id="${id}"> 
                        <div class="FSmodalContent" style="${bodyStyle}"> 
                            <div class="FSmodalHeader"> 
                                <span class="FSclose">&times;</span> 
                                <h5 class="FSmodalTitle">${options.title}</h5> 
                            </div> 
                            <div class="FSModalBody" style="${styleStr}">${body}</div>`;
        if (options.footer) {
            html += ` <div class="FSModalFooter"> 
                         ${options.footer} 
                       </div>`;
        }
        html += `</div></div>`;
        const modal = DomUtil.createElementFromHTML(html);
        window.onclick = (event) => {
            if (event.target == modal) {
                DomUtil.closeModal(modal);
            }
        };
        DomUtil.offOn(DomUtil.bySelector(".FSclose", modal), "click", e => {
            DomUtil.closeModal(modal);
        });
        return modal;
    }
    static bySelector(selector, el) {
        if (el) {
            return el.querySelector(selector);
        }
        return document.querySelector(selector);
    }
    static offOn(el, event, callBack, fireImmediately = false) {
        if (!el) {
            return;
        }
        let toTrigger;
        if (el instanceof Element) {
            toTrigger = el;
        }
        else {
            toTrigger = document.querySelector(el);
        }
        if (!toTrigger) {
            return;
        }
        toTrigger = DomUtil.off(toTrigger);
        DomUtil.on(toTrigger, event, callBack, fireImmediately);
    }
    static off(el) {
        if (!el) {
            return;
        }
        const newEl = el.cloneNode(false);
        while (el.hasChildNodes()) {
            if (el.firstChild) {
                newEl.appendChild(el.firstChild);
            }
        }
        el?.parentNode?.replaceChild(newEl, el);
        return newEl;
    }
    static on(el, event, callBack, fireImmediately = false) {
        if (!el) {
            return;
        }
        let toTrigger;
        if (el instanceof Element) {
            toTrigger = el;
        }
        else {
            toTrigger = document.querySelector(el);
        }
        if (!toTrigger) {
            return;
        }
        toTrigger.addEventListener(event, callBack);
        if (fireImmediately) {
            toTrigger.dispatchEvent(new Event(event));
        }
    }
    static openModal(modal) {
        modal.style.display = "block";
    }
    static createElementFromHTML(htmlString) {
        const div = document.createElement("div");
        div.innerHTML = htmlString.trim();
        return div.firstChild;
    }
    static closeModal(modal) {
        modal.style.display = "none";
    }
}
function getSelectorForPage() {
    const path = window.location.pathname;
    const page = path.split("/").pop();
    if (page === "mute_and_block") {
        return "a[href='/settings/muted_keywords']";
    }
    return "[aria-label*='Timeline'] > div[style^='position: relative']";
}
function toggleHide(hide, element) {
    hide ? element.classList.add("hidden") : element.classList.remove("hidden");
}


/***/ }),

/***/ 967:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   z: () => (/* binding */ PostObserver)
/* harmony export */ });
/* harmony import */ var _TwitterMutator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(57);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_TwitterMutator_js__WEBPACK_IMPORTED_MODULE_0__]);
_TwitterMutator_js__WEBPACK_IMPORTED_MODULE_0__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];

function PostObserver(target) {
    _TwitterMutator_js__WEBPACK_IMPORTED_MODULE_0__/* .TwitterMutator */ .q.getInstance().then(mutatorProxy => {
        mutatorProxy.addObserver(target);
    });
}

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ 146:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   g: () => (/* binding */ LocalStoreManager)
/* harmony export */ });
/* harmony import */ var _typings_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(872);

class LocalStoreManager {
    constructor() {
        this.KEY = "TWITTER_POST_HIDER_MANAGER";
    }
    static getInstance() {
        if (!LocalStoreManager.instance) {
            LocalStoreManager.instance = new LocalStoreManager();
        }
        return LocalStoreManager.instance;
    }
    async addBlockedWord(entry) {
        const storedWords = await this.getAllStoredWords();
        const idx = storedWords.findIndex(value => value.phrase === entry.phrase);
        if (idx > -1) {
            storedWords[idx] = entry;
        }
        else {
            storedWords.push(entry);
        }
        await this.setBlockedWords(storedWords);
    }
    async getBlockedWord(phrase) {
        const allWords = await this.getAllStoredWords();
        if (allWords) {
            return allWords.find(value => value.phrase === phrase) ?? null;
        }
        return null;
    }
    async hasBlockedWord(word) {
        const allWords = await this.getAllStoredWords();
        if (allWords) {
            return !!allWords.find(value => value.phrase === word);
        }
        return false;
    }
    async getAllStoredWords() {
        const itmJson = await GM.getValue(this.KEY, `{"blockedWords": []}`);
        const json = JSON.parse(itmJson);
        return json.blockedWords;
    }
    async getAllGlobalOpts() {
        const itmJson = (await GM.getValue(this.KEY, `{}`));
        const gmJson = JSON.parse(itmJson);
        return gmJson.globalSettings ?? {};
    }
    async setAllGlobalOpts(options) {
        const itmJson = (await GM.getValue(this.KEY, `{}`));
        const gmJson = JSON.parse(itmJson);
        gmJson.globalSettings = options;
        await GM.setValue(this.KEY, JSON.stringify(gmJson));
    }
    async setGlobalOpts(opt) {
        const itmJson = (await GM.getValue(this.KEY, `{}`));
        const gmJson = JSON.parse(itmJson);
        const globalOpts = gmJson.globalSettings ?? {};
        switch (opt) {
            case _typings_js__WEBPACK_IMPORTED_MODULE_0__/* .SETTING */ .H.USERNAME:
                globalOpts.username = opt;
                break;
        }
        gmJson.globalSettings = globalOpts;
        await GM.setValue(this.KEY, JSON.stringify(gmJson));
    }
    async getGlobalOption(opt) {
        const itmJson = (await GM.getValue(this.KEY, `{}`));
        const gmJson = JSON.parse(itmJson);
        const globalOpts = gmJson.globalSettings ?? {};
        switch (opt) {
            case _typings_js__WEBPACK_IMPORTED_MODULE_0__/* .SETTING */ .H.USERNAME:
                return globalOpts?.username ?? null;
        }
    }
    async setBlockedWords(blockedWordEntries) {
        const itmJson = (await GM.getValue(this.KEY, `{"blockedWords": []}`));
        const gmJson = JSON.parse(itmJson);
        gmJson.blockedWords = blockedWordEntries;
        await GM.setValue(this.KEY, JSON.stringify(gmJson));
    }
    async incrementBlockedWordAudit(key) {
        const itmJson = (await GM.getValue(this.KEY, `{"audit": {}}`));
        const gmJson = JSON.parse(itmJson);
        const auditEntries = gmJson.audit ?? {};
        auditEntries[key] = auditEntries[key] ? auditEntries[key] + 1 : 1;
        gmJson.audit = auditEntries;
        await GM.setValue(this.KEY, JSON.stringify(gmJson));
    }
    async getAuditEntries() {
        const itmJson = (await GM.getValue(this.KEY, `{"audit": []}`));
        const json = JSON.parse(itmJson);
        return json.audit;
    }
}


/***/ }),

/***/ 872:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   H: () => (/* binding */ SETTING)
/* harmony export */ });
var SETTING;
(function (SETTING) {
    SETTING["USERNAME"] = "username";
})(SETTING || (SETTING = {}));


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
/******/ 	/* webpack/runtime/async module */
/******/ 	(() => {
/******/ 		var webpackQueues = typeof Symbol === "function" ? Symbol("webpack queues") : "__webpack_queues__";
/******/ 		var webpackExports = typeof Symbol === "function" ? Symbol("webpack exports") : "__webpack_exports__";
/******/ 		var webpackError = typeof Symbol === "function" ? Symbol("webpack error") : "__webpack_error__";
/******/ 		var resolveQueue = (queue) => {
/******/ 			if(queue && queue.d < 1) {
/******/ 				queue.d = 1;
/******/ 				queue.forEach((fn) => (fn.r--));
/******/ 				queue.forEach((fn) => (fn.r-- ? fn.r++ : fn()));
/******/ 			}
/******/ 		}
/******/ 		var wrapDeps = (deps) => (deps.map((dep) => {
/******/ 			if(dep !== null && typeof dep === "object") {
/******/ 				if(dep[webpackQueues]) return dep;
/******/ 				if(dep.then) {
/******/ 					var queue = [];
/******/ 					queue.d = 0;
/******/ 					dep.then((r) => {
/******/ 						obj[webpackExports] = r;
/******/ 						resolveQueue(queue);
/******/ 					}, (e) => {
/******/ 						obj[webpackError] = e;
/******/ 						resolveQueue(queue);
/******/ 					});
/******/ 					var obj = {};
/******/ 					obj[webpackQueues] = (fn) => (fn(queue));
/******/ 					return obj;
/******/ 				}
/******/ 			}
/******/ 			var ret = {};
/******/ 			ret[webpackQueues] = x => {};
/******/ 			ret[webpackExports] = dep;
/******/ 			return ret;
/******/ 		}));
/******/ 		__webpack_require__.a = (module, body, hasAwait) => {
/******/ 			var queue;
/******/ 			hasAwait && ((queue = []).d = -1);
/******/ 			var depQueues = new Set();
/******/ 			var exports = module.exports;
/******/ 			var currentDeps;
/******/ 			var outerResolve;
/******/ 			var reject;
/******/ 			var promise = new Promise((resolve, rej) => {
/******/ 				reject = rej;
/******/ 				outerResolve = resolve;
/******/ 			});
/******/ 			promise[webpackExports] = exports;
/******/ 			promise[webpackQueues] = (fn) => (queue && fn(queue), depQueues.forEach(fn), promise["catch"](x => {}));
/******/ 			module.exports = promise;
/******/ 			body((deps) => {
/******/ 				currentDeps = wrapDeps(deps);
/******/ 				var fn;
/******/ 				var getResult = () => (currentDeps.map((d) => {
/******/ 					if(d[webpackError]) throw d[webpackError];
/******/ 					return d[webpackExports];
/******/ 				}))
/******/ 				var promise = new Promise((resolve) => {
/******/ 					fn = () => (resolve(getResult));
/******/ 					fn.r = 0;
/******/ 					var fnQueue = (q) => (q !== queue && !depQueues.has(q) && (depQueues.add(q), q && !q.d && (fn.r++, q.push(fn))));
/******/ 					currentDeps.map((dep) => (dep[webpackQueues](fnQueue)));
/******/ 				});
/******/ 				return fn.r ? promise : getResult();
/******/ 			}, (err) => ((err ? reject(promise[webpackError] = err) : outerResolve(exports)), resolveQueue(queue)));
/******/ 			queue && queue.d < 0 && (queue.d = 0);
/******/ 		};
/******/ 	})();
/******/ 	
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
/******/ 	var __webpack_exports__ = __webpack_require__(279);
/******/ 	
/******/ 	return __webpack_exports__;
/******/ })()
;
});