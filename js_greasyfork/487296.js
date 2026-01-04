// ==UserScript==
// @name                WebNovalHindener
// @description         导入txt小说阅读.
// @author              aakqaj
// @copyright           aakqaj
// @license             MIT
// @match               *://*/*
// @run-at              document-idle
// @grant               GM_getValue
// @grant               GM_setValue
// @grant               GM_registerMenuCommand
// @version 1.0.3
// @namespace https://greasyfork.org/users/1261172
// @downloadURL https://update.greasyfork.org/scripts/487296/WebNovalHindener.user.js
// @updateURL https://update.greasyfork.org/scripts/487296/WebNovalHindener.meta.js
// ==/UserScript==
/* eslint-disable */ /* spell-checker: disable */
// @[ You can find all source codes in GitHub repo ]
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 426:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(81);
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(645);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, "#webNovelHidener {\n  position: fixed;\n  left: 230px;\n  top: 150px;\n  width: 500px;\n  height: 600px;\n  border-radius: 6px;\n  /* overflow: hidden; */\n  z-index: 100;\n  padding-bottom: 10px;\n\n  /* box-shadow: 0 0 8px hsla(0, 0%, 18%, 0.4); */\n  box-shadow: 0 3px 15px 0 rgba(179, 187, 215, 0.8);\n\n  display: flex;\n  flex-direction: column;\n  box-sizing: border-box;\n}\n\n#webNovelHidener.dark {\n  background-color: hsl(0, 0%, 20%);\n  color: white;\n}\n\n#webNovelHidener.dark .novel,\n#webNovelHidener.dark .config,\n#webNovelHidener.dark .replace,\n#webNovelHidener.dark .wnhView .tools .item {\n  background-color: hsl(0, 0%, 20%);\n  color: white;\n}\n\n#webNovelHidener.light {\n  background-color: hsl(0, 0%, 100%);\n  color: hsl(0, 0%, 23%);\n}\n\n#webNovelHidener.light .novel,\n#webNovelHidener.light .config,\n#webNovelHidener.light .replace,\n#webNovelHidener.light .wnhView .tools .item {\n  background-color: hsl(0, 0%, 100%);\n  color: black;\n}\n\n#webNovelHidener {\n  background-color: white;\n  color: black;\n}\n\n#webNovelHidener .novel,\n#webNovelHidener .config,\n#webNovelHidener .replace,\n.wnhView .tools .item {\n  background-color: white;\n  color: black;\n}\n\n#webNovelHidener * {\n  box-sizing: border-box;\n}\n\n#webNovelHidener ::-webkit-scrollbar {\n  width: 2px;\n  height: 6px;\n}\n#webNovelHidener ::-webkit-scrollbar-track {\n  border-radius: 3px;\n  background: rgba(0, 0, 0, 0.06);\n  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.08);\n}\n/* 滚动条滑块 */\n#webNovelHidener ::-webkit-scrollbar-thumb {\n  border-radius: 3px;\n  background: rgba(0, 0, 0, 0.12);\n  -webkit-box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.2);\n}\n\n#webNovelHidener .header {\n  height: 10px;\n  width: 100%;\n  align-items: center;\n  justify-content: center;\n  display: flex;\n  user-select: none;\n}\n#webNovelHidener .header .bar {\n  height: 4px;\n  width: 68px;\n  border-radius: 50px;\n  cursor: pointer;\n  /* background: hsl(0, 0%, 50%); */\n\n  transition: all 0.4s ease-in-out;\n}\n\n#webNovelHidener .header:hover .bar {\n  background: hsl(0, 0%, 50%);\n}\n\n#webNovelHidener .resizeHandle {\n  width: 10px;\n  height: 10px;\n  position: absolute;\n  z-index: 120;\n  bottom: 0;\n  right: 0;\n  cursor: nwse-resize;\n  user-select: none;\n}\n\n.wnhView {\n  width: 100%;\n  height: 100%;\n  position: relative;\n}\n\n.wnhView .novel {\n  left: 0;\n  top: 0;\n  position: absolute;\n  z-index: 102;\n  width: 100%;\n  height: 100%;\n  overflow: auto;\n  box-sizing: border-box;\n}\n\n.wnhView .replace {\n  box-sizing: border-box;\n  left: 0;\n  top: 0;\n  position: absolute;\n  z-index: 100;\n  width: 100%;\n  height: 100%;\n  padding: 15px;\n  overflow: auto;\n  font-weight: normal;\n  font-size: 12px;\n}\n\n.wnhView .novel .part {\n  cursor: default;\n}\n\n.novel .part {\n  box-sizing: border-box;\n  padding: 0px 12px;\n  width: 100%;\n  font-size: 12px;\n}\n\n.wnhView .part .title {\n  font-size: 14px;\n  font-weight: bolder;\n  text-align: center;\n}\n\n.wnhView .config {\n  box-sizing: border-box;\n  left: 0;\n  top: 0;\n  position: absolute;\n  z-index: 101;\n  /* z-index: 102; */\n  width: 100%;\n  height: 100%;\n  padding: 20px 18px;\n  overflow-y: auto;\n  overflow-x: hidden;\n  user-select: none;\n  display: flex;\n  flex-direction: column;\n}\n\n.wnhView .config .item {\n  margin-bottom: 12px;\n}\n\n.wnhView .config .tag {\n  font-size: 20px;\n}\n.wnhView .config .capsule,\n.wnhView .config .hidenMode {\n  font-size: 12px;\n  border-radius: 50px;\n  cursor: pointer;\n}\n\n.wnhView select:focus {\n  outline: none;\n}\n\n.wnhView .config .capsule {\n  color: hsl(0, 0%, 100%);\n}\n\n.wnhView .config .capsule .capactive.capactive {\n  background: hsl(240, 100%, 70%);\n}\n\n.wnhView .config .capsule .left {\n  padding: 2px 6px;\n  border-radius: 50px 0 0 50px;\n  background: hsl(0, 0%, 90%);\n}\n\n.wnhView .config .capsule .right {\n  padding: 2px 6px;\n  border-radius: 0px 50px 50px 0;\n  background: hsl(0, 0%, 90%);\n}\n\n#fileInput {\n  display: none;\n}\n\n.wnhView .tools .item {\n  width: 20px;\n  height: 20px;\n  font-size: 12px;\n  text-align: center;\n  line-height: 20px;\n  cursor: pointer;\n  border-radius: 2px;\n  box-shadow: 0 0 1px hsla(0, 0%, 18%, 0.8);\n  margin-bottom: 6px;\n  margin-left: auto;\n  user-select: none;\n}\n\n.wnhView .tools .control {\n  margin-top: auto;\n}\n\n.wnhView .control .next {\n  transform: rotate(-90deg);\n}\n.wnhView .control .pre {\n  transform: rotate(-90deg);\n}\n\n.wnhView .tools .search {\n  margin-bottom: 6px;\n}\n\n#webNovelHidener .search {\n  display: flex;\n  align-items: center;\n  border: 1px solid #ccc;\n  border-radius: 4px;\n  padding: 1px;\n}\n\n#webNovelHidener .search input[type='text'] {\n  border: none;\n  outline: none;\n  flex: 1;\n  padding: 6px;\n  font-size: 8px;\n}\n\n#webNovelHidener .search input[type='text']::placeholder {\n  color: #999;\n}\n\n#webNovelHidener .search input[type='text']:focus {\n  border-color: #007bff;\n}\n\n.wnhView .tools {\n  margin: 6px 0 0 0;\n  right: 6px;\n  top: 0;\n  position: absolute;\n  z-index: 103;\n  font: italic 2em Georgia, serif;\n\n  height: 100%;\n  display: flex;\n  flex-direction: column;\n  transition: all 0.2s ease-in-out;\n  opacity: 0;\n  /* opacity: 1; */\n}\n\n.wnhView .tools:hover {\n  opacity: 1;\n}\n\n.wnhView .tools.wnhActive {\n  opacity: 1;\n}\n\n/*  */\n#webNovelHidener .config .mask {\n  display: flex;\n  align-items: center;\n}\n\n#webNovelHidener .config .switch {\n  display: flex;\n  position: relative;\n  top: 2px;\n}\n#webNovelHidener .config input[type='checkbox'] {\n  height: 0;\n  width: 0;\n  visibility: hidden;\n}\n\n#webNovelHidener .config label {\n  cursor: pointer;\n  text-indent: -9999px;\n  width: 40px;\n  height: 16px;\n  background: grey;\n  display: block;\n  border-radius: 100px;\n  position: relative;\n}\n\n#webNovelHidener .config label:after {\n  content: '';\n  position: absolute;\n  top: 3px;\n  left: 5px;\n  width: 10px;\n  height: 10px;\n  background: #fff;\n  border-radius: 90px;\n  transition: 0.3s;\n}\n\n#webNovelHidener .config input:checked + label {\n  background: hsl(240, 100%, 70%);\n}\n\n#webNovelHidener .config input:checked + label:after {\n  left: calc(100% - 5px);\n  transform: translateX(-100%);\n}\n\n#webNovelHidener .config label:active:after {\n  width: 13px;\n}\n\n#webNovelHidener .config .hotKey .kItem {\n  margin-left: 40px;\n  margin-bottom: 12px;\n}\n\n#webNovelHidener .config .hotKey .kItem .key {\n  background-color: hsl(0, 0%, 90%);\n  color: hsl(0, 0%, 10%);\n  border-radius: 50px;\n  padding: 4px 12px;\n  font-size: 12px;\n}\n\n#webNovelHidener .config .msg {\n  margin-top: auto;\n  margin-bottom: 0;\n\n  display: flex;\n}\n\n#webNovelHidener .config .msg .ms {\n  width: 200px;\n  background: hsl(0, 0%, 90%);\n  padding: 12px;\n  border-radius: 12px;\n}\n\n#webNovelHidener .config .msg .btns {\n  display: flex;\n  margin-top: auto;\n  margin-left: auto;\n  margin-right: 100px;\n}\n\n#webNovelHidener .cancel,\n#webNovelHidener .apply {\n  width: 48px;\n  cursor: pointer;\n  text-align: center;\n  margin: 6px;\n  padding: 6px;\n  color: white;\n  border-radius: 8px;\n}\n\n/* mask */\n\n#webNovelHidener.mask {\n  border-radius: 0;\n}\n#webNovelHidener.mask .header {\n  height: 36px;\n  box-sizing: border-box;\n}\n\n#webNovelHidener.mask .resizeHandle {\n  right: -12px;\n  bottom: -12px;\n  border-width: 12px;\n  position: absolute;\n  display: block;\n  width: 0;\n  height: 0;\n  border-color: transparent;\n  border-top-color: #aaa;\n  border-style: solid;\n  transform: rotateZ(-45deg);\n}\n\n#webNovelHidener .textarea {\n  margin-left: 40px;\n  width: 100%;\n}\n#webNovelHidener .textarea textarea {\n  width: 380px;\n}\n\n.notes-head[data-v-73dd4d21] {\n  height: 36px;\n  width: 100%;\n  display: flex;\n  justify-content: space-between;\n  background-color: #57a7ff;\n  align-items: center;\n  position: relative;\n}\n.notes-head[data-v-73dd4d21] .fa,\n.notes-head[data-v-73dd4d21] .far {\n  margin: 0 10px 0 10px;\n  cursor: pointer;\n  display: block;\n  font-size: 16px;\n  color: #fff;\n}\n.fa-trash:before {\n  content: '\\f1f8';\n}\n\n.note-drag[data-v-73dd4d21] {\n  width: 90%;\n  height: 35px;\n  cursor: move;\n}\n\n.notes-head[data-v-73dd4d21] .fa,\n.notes-head[data-v-73dd4d21] .far {\n  margin: 0 10px 0 10px;\n  cursor: pointer;\n  display: block;\n  font-size: 16px;\n  color: #fff;\n}\n.notes-head[data-v-73dd4d21] .fa-plus:before {\n  color: #fff;\n}\n\n.fa-plus:before {\n  content: '\\f067';\n}\n\n.fa-eye-slash:before {\n  content: '\\f070';\n}\n\n.notes-head[data-v-73dd4d21] .fa,\n.notes-head[data-v-73dd4d21] .far {\n  margin: 0 10px 0 10px;\n  cursor: pointer;\n  display: block;\n  font-size: 16px;\n  color: #fff;\n}\n", ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ 645:
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

/***/ 81:
/***/ ((module) => {



module.exports = function (i) {
  return i[1];
};

/***/ }),

/***/ 654:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(379);
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(795);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(569);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(565);
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(216);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(589);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_style_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(426);

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_style_css__WEBPACK_IMPORTED_MODULE_6__/* ["default"] */ .Z, options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_style_css__WEBPACK_IMPORTED_MODULE_6__/* ["default"] */ .Z && _node_modules_css_loader_dist_cjs_js_style_css__WEBPACK_IMPORTED_MODULE_6__/* ["default"].locals */ .Z.locals ? _node_modules_css_loader_dist_cjs_js_style_css__WEBPACK_IMPORTED_MODULE_6__/* ["default"].locals */ .Z.locals : undefined);


/***/ }),

/***/ 379:
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

/***/ 569:
/***/ ((module) => {



var memo = {};
/* istanbul ignore next  */

function getTarget(target) {
  if (typeof memo[target] === "undefined") {
    var styleTarget = document.querySelector(target); // Special case to return head of iframe instead of iframe itself

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

/***/ 216:
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

/***/ 565:
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

/***/ 795:
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
  } // For old IE

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

/***/ 589:
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

/***/ 752:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
var events_1 = __webpack_require__(905);
var init_1 = __webpack_require__(723);
var parse_1 = __webpack_require__(201);
__webpack_require__(654);
var app = function () {
    (0, init_1.DomInit)();
    (0, events_1.bindEvent)();
    (0, parse_1.fileParse)();
};
exports["default"] = app;


/***/ }),

/***/ 607:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
var app_1 = __importDefault(__webpack_require__(752));
if (true) {
    (0, app_1.default)();
}
else {}


/***/ }),

/***/ 889:
/***/ (function(__unused_webpack_module, exports) {


var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.config = void 0;
var DEFAULT_CONFIG = {
    hidenMode: 'hiden',
    replaceText: "\u3010\u534E\u4E3A\u5BA2\u670D\u3011\u5C0A\u656C\u7684\u534E\u4E3A\u7528\u6237\uFF0C\u611F\u8C22\u60A8\u7684\u6765\u7535\uFF0C\n    \u5728\u7535\u8111\u9ED8\u8BA4\u6D4F\u89C8\u5668\u5730\u5740\u680F\uFF08\u6700\u4E0A\u9762\u7684\u641C\u7D22\u680F\uFF09\u8F93\u5165\u4EE5\u4E0B\u7F51\u5740\n    https://app.huawei.com/pc\uFF08\u6CE8\uFF1A\u4E0D\u8981\u4F7F\u7528\u5FAE\u4FE1\u6253\u5F00\u6B64\u94FE\u63A5\uFF0C\u5FAE\u4FE1\u4F1A\u62E6\u622A\u94FE\u63A5\uFF09\n    \u5982\u60A8\u6709\u4EFB\u4F55\u7591\u95EE\u6B22\u8FCE\u968F\n    \u65F6\u81F4\u7535950800\uFF0C\u6211\u4EEC\u4F1A\u4E00\u76F4\u4E3A\u60A8\u63D0\u4F9B\u6E29\u6696\u670D\u52A1\uFF0C\u611F\u8C22\u60A8\u7684\u652F\u6301\uFF0C\u795D\u60A8\u751F\u6D3B\u6109\u5FEB\uFF01",
    Mask: true,
    width: 360,
    height: 500,
    position: [230, 150],
    TitleSize: 14,
    ContentSize: 14,
    Theme: 'light',
    HotKey: {
        hiden: 'ShiftLeft+Space',
        search: 'ShiftLeft+KeyF',
        next: 'ArrowRight',
        pre: 'ArrowLeft',
    },
};
var CONFIG_KEY = 'webHidenerConfig';
var Config = /** @class */ (function () {
    function Config() {
        this.config = DEFAULT_CONFIG;
        this.loadConfig();
    }
    Config.prototype.loadConfig = function () {
        var storedConfig = localStorage.getItem(CONFIG_KEY);
        if (storedConfig) {
            this.config = JSON.parse(storedConfig);
        }
        else {
            this.saveConfig();
        }
    };
    Config.prototype.updateConfig = function (con) {
        this.config = __assign(__assign({}, this.config), con);
        this.saveConfig();
    };
    Config.prototype.saveConfig = function () {
        localStorage.setItem(CONFIG_KEY, JSON.stringify(this.config));
    };
    return Config;
}());
exports.config = new Config();


/***/ }),

/***/ 464:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
var utils_1 = __webpack_require__(721);
var _Book = /** @class */ (function () {
    function _Book() {
        this.bookname = "";
        this.content = "";
        this.titles = [];
        this.cursorChangeCallbacks = [];
        this.cursor = 0;
    }
    _Book.prototype.setBook = function (bookInfo) {
        var _a, _b, _c;
        this.bookname = (_a = bookInfo === null || bookInfo === void 0 ? void 0 : bookInfo.bookname) !== null && _a !== void 0 ? _a : this.bookname;
        this.content = (_b = bookInfo === null || bookInfo === void 0 ? void 0 : bookInfo.content) !== null && _b !== void 0 ? _b : this.content;
        this.titles = (_c = bookInfo === null || bookInfo === void 0 ? void 0 : bookInfo.titles) !== null && _c !== void 0 ? _c : this.titles;
    };
    _Book.prototype.getContent = function (cur) {
        return (0, utils_1.getContentByTitle)(cur, this.content, this.titles);
    };
    _Book.prototype.onCursorChange = function (callback) {
        this.cursorChangeCallbacks.push(callback);
    };
    _Book.prototype.setCursor = function (cursor) {
        if (cursor >= this.titles.length)
            cursor = this.titles.length - 1;
        if (cursor < 0)
            cursor = 0;
        this.cursor = cursor;
        this.cursorChangeCallbacks.forEach(function (callback) { return callback(); });
    };
    _Book.prototype.getCursor = function () {
        return this.cursor;
    };
    _Book.prototype.searchTitle = function (str) {
        if ((0, utils_1.isNumeric)(str.toString())) {
            var index = parseInt(str.toString());
            if (index >= 0 && index < this.titles.length) {
                return { index: index, title: this.titles[index].title };
            }
            else {
                return null;
            }
        }
        else {
            var regex = new RegExp(str.toString(), 'i');
            for (var i = 0; i < this.titles.length; i++) {
                if (regex.test(this.titles[i].title)) {
                    return { index: i, title: this.titles[i].title };
                }
            }
            return null;
        }
    };
    return _Book;
}());
var Book = new _Book();
exports["default"] = Book;


/***/ }),

/***/ 905:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.bindEvent = exports.updateConfigEvent = exports.addPreEvent = exports.addNextEvent = exports.addSearchHotKeyListener = exports.addGlobalHotKeyListener = exports.addConfigEvent = exports.addScrollEvent = exports.addSearchEvent = exports.addMoveEvent = void 0;
var Config_1 = __webpack_require__(889);
var book_1 = __importDefault(__webpack_require__(464));
var page_1 = __webpack_require__(210);
var template_1 = __webpack_require__(352);
var utils_1 = __webpack_require__(721);
function addMoveEvent() {
    var initialX;
    var initialY;
    var initialWidth;
    var initialHeight;
    var resizing = false;
    var moving = false;
    var resizableDiv = document.getElementById('webNovelHidener');
    var header = document.querySelector('#webNovelHidener .header');
    var resizeHandle = document.querySelector('.resizeHandle');
    // 添加 mousedown 事件监听器到可调整大小的手柄元素
    resizeHandle.addEventListener('mousedown', function (event) {
        var ev = event;
        initialX = ev.clientX;
        initialY = ev.clientY;
        initialWidth = resizableDiv.offsetWidth;
        initialHeight = resizableDiv.offsetHeight;
        resizing = true;
        moving = false;
    });
    // 添加 mousedown 事件监听器到 header 元素
    header.addEventListener('mousedown', function (event) {
        var ev = event;
        initialX = ev.clientX - resizableDiv.offsetLeft;
        initialY = ev.clientY - resizableDiv.offsetTop;
        moving = true;
        resizing = false;
    });
    // 添加 mouseup 事件监听器
    document.addEventListener('mouseup', function () {
        resizing = false;
        moving = false;
    });
    // 添加 mousemove 事件监听器
    document.addEventListener('mousemove', function (event) {
        if (resizing) {
            var dx = event.clientX - initialX;
            var dy = event.clientY - initialY;
            var newWidth = initialWidth + dx;
            var newHeight = initialHeight + dy;
            resizableDiv.style.width = "".concat(newWidth, "px");
            resizableDiv.style.height = "".concat(newHeight, "px");
        }
        if (moving) {
            resizableDiv.style.left = event.clientX - initialX + 'px';
            resizableDiv.style.top = event.clientY - initialY + 'px';
        }
    });
}
exports.addMoveEvent = addMoveEvent;
function addSearchEvent() {
    document.getElementById('searchInput').addEventListener('keydown', function (event) {
        var keyboardEvent = event;
        if (keyboardEvent.key === 'Enter') {
            var searchString = event.target.value;
            event.target.value = '';
            var res = book_1.default.searchTitle(searchString);
            if (!res || !searchString)
                return;
            (0, page_1.clearContents)();
            var index = res.index;
            if ((0, utils_1.isNumeric)(searchString)) {
                index = index - 1;
            }
            (0, page_1.renderContent)(index);
            (0, page_1.renderContent)(index + 1);
            (0, page_1.renderContent)(index + 2);
            book_1.default.setCursor(index + 2);
        }
    });
}
exports.addSearchEvent = addSearchEvent;
function addScrollEvent() {
    var novelDiv = document.querySelector('.novel');
    novelDiv.addEventListener('scroll', (0, utils_1.debounce)(function () {
        var scrollTop = novelDiv.scrollTop;
        var contentHeight = novelDiv.scrollHeight;
        var visibleHeight = novelDiv.clientHeight;
        var scrollPosition = novelDiv.scrollTop;
        var distanceToBottom = contentHeight - visibleHeight - scrollPosition;
        if (scrollTop <= 100)
            (0, page_1.renderPre)();
        if (distanceToBottom <= 800)
            (0, page_1.renderNext)();
    }, 200));
}
exports.addScrollEvent = addScrollEvent;
function addConfigEvent() {
    var configBtn = document.querySelector('#webNovelHidener .settings');
    var novel = document.querySelector('#webNovelHidener .novel');
    var config = document.querySelector('#webNovelHidener .config');
    configBtn.onclick = function () {
        (0, page_1.reloadConfigPage)();
        novel.style.zIndex = novel.style.zIndex === '101' ? '102' : '101';
        config.style.zIndex = config.style.zIndex === '102' ? '101' : '102';
    };
}
exports.addConfigEvent = addConfigEvent;
function addGlobalHotKeyListener() {
    var app = document.querySelector('#webNovelHidener');
    var replace = document.querySelector('#webNovelHidener .replace');
    (0, utils_1.keyListener)(document.body, Config_1.config.config.HotKey.hiden, function () {
        if (!app)
            return;
        if (Config_1.config.config.hidenMode === 'hiden' || app.style.display === 'none') {
            app.style.display = app.style.display !== 'none' ? 'none' : 'flex';
        }
        if (Config_1.config.config.hidenMode === 'replace') {
            replace.style.zIndex = replace.style.zIndex !== '100' ? '100' : '110';
        }
    });
}
exports.addGlobalHotKeyListener = addGlobalHotKeyListener;
function addSearchHotKeyListener() {
    var father = document.querySelector('#webNovelHidener');
    (0, utils_1.keyListener)(father, Config_1.config.config.HotKey.search, function () {
        var tools = document.querySelector('#webNovelHidener .tools');
        if (!tools)
            return;
        var classList = tools.classList;
        console.log(classList.contains('wnhActive'));
        if (!classList.contains('wnhActive')) {
            tools.classList.add('wnhActive');
        }
        else {
            tools.classList.remove('wnhActive');
        }
    });
}
exports.addSearchHotKeyListener = addSearchHotKeyListener;
function addNextEvent() {
    var father = document.querySelector('#webNovelHidener .wnhView .novel');
    var nextBtn = document.querySelector('#webNovelHidener .next');
    nextBtn.onclick = function () { return (0, page_1.toNext)(); };
    (0, utils_1.keyListener)(father, Config_1.config.config.HotKey.next, function () { return (0, page_1.toNext)(); });
}
exports.addNextEvent = addNextEvent;
function addPreEvent() {
    var father = document.querySelector('#webNovelHidener .wnhView .novel');
    var preBtn = document.querySelector('#webNovelHidener .pre');
    preBtn.onclick = function () { return (0, page_1.toPre)(); };
    (0, utils_1.keyListener)(father, Config_1.config.config.HotKey.pre, function () { return (0, page_1.toPre)(); });
}
exports.addPreEvent = addPreEvent;
function updateConfigEvent() {
    // 更新主题
    var themeItems = document.querySelectorAll('.theme .capsule span');
    themeItems.forEach(function (themeItem) {
        themeItem.addEventListener('click', function () {
            var _a;
            if (!themeItem)
                return;
            var theme = (_a = themeItem.textContent) === null || _a === void 0 ? void 0 : _a.toLowerCase();
            Config_1.config.updateConfig({ Theme: theme });
            (0, page_1.reloadConfigPage)();
            (0, utils_1.updateStyle)();
        });
    });
    // 更新标题字体大小
    var titleSizeSelect = document.getElementById('titleSize');
    titleSizeSelect.addEventListener('change', function () {
        var titleSize = Number(titleSizeSelect.value);
        Config_1.config.updateConfig({ TitleSize: titleSize });
        (0, page_1.reloadConfigPage)();
        (0, utils_1.updateStyle)();
    });
    // 更新内容字体大小
    var contentSizeSelect = document.getElementById('contentSize');
    contentSizeSelect.addEventListener('change', function () {
        var contentSize = Number(contentSizeSelect.value);
        Config_1.config.updateConfig({ ContentSize: contentSize });
        (0, page_1.reloadConfigPage)();
        (0, utils_1.updateStyle)();
    });
    // 更新隐藏模式
    var hidenModeItems = document.querySelectorAll('.hidenMode .capsule span');
    hidenModeItems.forEach(function (hidenModeItem) {
        hidenModeItem.addEventListener('click', function () {
            var _a;
            var hidenMode = (_a = hidenModeItem.textContent) === null || _a === void 0 ? void 0 : _a.toLowerCase();
            Config_1.config.updateConfig({ hidenMode: hidenMode });
            (0, page_1.reloadConfigPage)();
        });
    });
    // 更新遮罩开关
    var maskSwitch = document.getElementById('maskSwitch');
    maskSwitch.addEventListener('change', function () {
        var mask = maskSwitch.checked;
        Config_1.config.updateConfig({ Mask: mask });
        (0, page_1.reloadConfigPage)();
    });
}
exports.updateConfigEvent = updateConfigEvent;
function addMaskEvent() {
    var isMask = Config_1.config.config.Mask;
    var headerEle = document.querySelector('#webNovelHidener .header');
    var webNovelHidener = document.querySelector('#webNovelHidener');
    if (isMask) {
        webNovelHidener.classList.add('mask');
        headerEle.innerHTML = template_1.headerMask;
    }
    var maskSwitch = document.getElementById('maskSwitch');
    maskSwitch.addEventListener('change', function () {
        var mask = maskSwitch.checked;
        Config_1.config.updateConfig({ Mask: mask });
        (0, utils_1.updateStyle)();
    });
}
function updateReplaceTextEvent() {
    var textarea = document.querySelector('#webNovelHidener .textarea textarea');
    var replaceEle = document.querySelector('#webNovelHidener .replace');
    textarea.addEventListener('keydown', function (event) {
        var e = event;
        if (e.key === 'Enter' && !e.shiftKey) {
            event.preventDefault(); // 阻止默认的回车换行行为
            // 在这里执行你的逻辑
            if (!textarea.value)
                return;
            replaceEle.innerHTML = textarea.value;
            Config_1.config.updateConfig({ replaceText: textarea.value });
        }
    });
}
function bindEvent() {
    addMoveEvent();
    addSearchEvent();
    addScrollEvent();
    addConfigEvent();
    updateConfigEvent();
    addGlobalHotKeyListener();
    addSearchHotKeyListener();
    addNextEvent();
    addPreEvent();
    addMaskEvent();
    updateReplaceTextEvent();
}
exports.bindEvent = bindEvent;


/***/ }),

/***/ 723:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DomInit = void 0;
var page_1 = __webpack_require__(210);
var template_1 = __importDefault(__webpack_require__(352));
var utils_1 = __webpack_require__(721);
function DomInit() {
    var App = document.createElement('div');
    App.id = 'webNovelHidener';
    App.style.display = 'none';
    App.innerHTML = "\n    <div class=\"header\">\n    ".concat(template_1.default.header, "\n    </div>\n    ").concat(template_1.default.resizeHandle, "\n    ").concat(template_1.default.wnhView, "\n    ");
    document.body.append(App);
    (0, utils_1.updateStyle)();
    (0, page_1.reloadConfigPage)();
}
exports.DomInit = DomInit;


/***/ }),

/***/ 210:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.reloadConfigPage = exports.renderPre = exports.renderNext = exports.renderContent = exports.clearContents = exports.toPre = exports.toNext = void 0;
var Config_1 = __webpack_require__(889);
var book_1 = __importDefault(__webpack_require__(464));
var utils_1 = __webpack_require__(721);
function toNext() {
    var _a;
    var father = document.querySelector('#webNovelHidener .wnhView .novel');
    var viewEle = (0, utils_1.getViewElement)(father);
    if (!viewEle)
        return;
    var cur = Number(viewEle.id.substring(1));
    (_a = document.querySelector("#p".concat(cur + 1))) === null || _a === void 0 ? void 0 : _a.scrollIntoView({ behavior: 'smooth' });
    renderNext();
}
exports.toNext = toNext;
function toPre() {
    var father = document.querySelector('#webNovelHidener .wnhView .novel');
    var viewEle = (0, utils_1.getViewElement)(father);
    if (!viewEle)
        return;
    var cur = Number(viewEle.id.substring(1));
    var preEle = document.querySelector("#p".concat(cur - 1));
    if (!preEle) {
        renderPre();
        return;
    }
    preEle === null || preEle === void 0 ? void 0 : preEle.scrollIntoView({ behavior: 'smooth' });
}
exports.toPre = toPre;
function clearContents() {
    var fa = document.querySelector('.wnhView .novel');
    fa.innerHTML = '';
}
exports.clearContents = clearContents;
function renderContent(index, isBefore) {
    var _a;
    if (isBefore === void 0) { isBefore = false; }
    var title = (_a = book_1.default.searchTitle(index)) === null || _a === void 0 ? void 0 : _a.title;
    var fa = document.querySelector('.wnhView .novel');
    var content = book_1.default.getContent(index);
    var part = document.createElement('div');
    var filterContent = (0, utils_1.adjustNewlines)(content);
    if (!content)
        return;
    part.className = 'part';
    part.id = "p".concat(index);
    part.innerHTML = "\n    <div class=\"title\">".concat(title, "</div>\n    <div style=\"white-space: pre-wrap;\">").concat(filterContent, "</div>\n    ");
    if (isBefore) {
        var firstChild = fa.firstChild;
        fa.insertBefore(part, firstChild);
        return;
    }
    fa.append(part);
}
exports.renderContent = renderContent;
function renderNext(cur) {
    if (cur === void 0) { cur = null; }
    var fa = document.querySelector('.wnhView .novel');
    var lastChild = fa.lastElementChild;
    if (!lastChild)
        return;
    cur = cur ? cur : Number(lastChild.id.substring(1));
    renderContent(cur + 1);
    book_1.default.setCursor(cur + 1);
}
exports.renderNext = renderNext;
function renderPre(cur) {
    if (cur === void 0) { cur = null; }
    var fa = document.querySelector('.wnhView .novel');
    var firstChild = fa.firstElementChild;
    if (!firstChild)
        return;
    cur = cur ? cur : Number(firstChild.id.substring(1));
    if (cur <= 0)
        cur = 1;
    renderContent(cur - 1, true);
    book_1.default.setCursor(cur - 1);
}
exports.renderPre = renderPre;
function reloadConfigPage() {
    var config = Config_1.config.config;
    var theme = config.Theme;
    var titleSize = config.TitleSize;
    var contentSize = config.ContentSize;
    var hidenMode = config.hidenMode;
    var mask = config.Mask;
    var hotKeys = config.HotKey;
    // 更新主题
    var themeItems = document.querySelectorAll('.theme .capsule span');
    themeItems[0].classList.toggle('capactive', theme === 'light');
    themeItems[1].classList.toggle('capactive', theme === 'dark');
    // 更新标题字体大小
    var titleSizeSelect = document.getElementById('titleSize');
    titleSizeSelect.value = String(titleSize);
    // 更新内容字体大小
    var contentSizeSelect = document.getElementById('contentSize');
    contentSizeSelect.value = String(contentSize);
    // 更新隐藏模式
    var hidenModeItems = document.querySelectorAll('.hidenMode .capsule span');
    hidenModeItems[0].classList.toggle('capactive', hidenMode === 'hiden');
    hidenModeItems[1].classList.toggle('capactive', hidenMode === 'replace');
    // 更新遮罩开关
    var maskSwitch = document.getElementById('maskSwitch');
    maskSwitch.checked = mask;
    // 更新快捷键
    var hotKeyItems = document.querySelectorAll('.hotKey .kItem');
    hotKeyItems.forEach(function (item, index) {
        var keyName = Object.keys(hotKeys)[index];
        var keyCombo = hotKeys[keyName];
        var keySpan = item.querySelector('.key');
        keySpan.textContent = keyCombo;
    });
}
exports.reloadConfigPage = reloadConfigPage;
// function updateElementStyle() {
//     //遮罩样式更新
//     const webNovelHidener = document.querySelector("#webNovelHidener")!
//     if (!webNovelHidener) return;
//     const headerEle = document.querySelector("#webNovelHidener .header")!
//     const mask = c.config.Mask
//     if (mask) {
//         console.log(mask);
//         headerEle.innerHTML = headerMask
//         webNovelHidener.classList.add("mask")
//     } else {
//         console.log("es");
//         headerEle.innerHTML = header
//         webNovelHidener.classList.remove("mask")
//     }
//     //字体样式更新
//     updateStyle(`
//         #webNovelHidener .novel .part{
//          font-size: ${config.config.ContentSize}px;
//         }
//         #webNovelHidener .novel .part .title{
//             font-size: ${config.config.TitleSize}px;
//            }
//          `)
//     const textarea = document.querySelector<HTMLTextAreaElement>('#webNovelHidener .textarea textarea')!;
//     const replaceEle = document.querySelector("#webNovelHidener .replace")!
//     replaceEle.innerHTML = config.config.replaceText
//     textarea.value = config.config.replaceText
// }


/***/ }),

/***/ 201:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.fileParse = void 0;
var book_1 = __importDefault(__webpack_require__(464));
var utils_1 = __webpack_require__(721);
function fileParse() {
    return __awaiter(this, void 0, void 0, function () {
        var uploadDiv;
        var _this = this;
        return __generator(this, function (_a) {
            uploadDiv = document.querySelector('.upload');
            if (uploadDiv && !uploadDiv.onclick) {
                uploadDiv.addEventListener('click', function () { return __awaiter(_this, void 0, void 0, function () {
                    var fileInput, content, titles;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                fileInput = document.getElementById('fileInput');
                                fileInput.value = '';
                                fileInput.click();
                                return [4 /*yield*/, (0, utils_1.getFileContent)()];
                            case 1:
                                content = _a.sent();
                                titles = (0, utils_1.splitNovelByTitle)(content);
                                console.log(titles);
                                book_1.default.setBook({
                                    content: content,
                                    titles: titles,
                                });
                                return [2 /*return*/];
                        }
                    });
                }); });
            }
            return [2 /*return*/];
        });
    });
}
exports.fileParse = fileParse;


/***/ }),

/***/ 352:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.wnhView = exports.resizeHandle = exports.headerMask = exports.header = void 0;
var Config_1 = __webpack_require__(889);
exports.header = " \n<div class=\"bar\"></div>\n";
exports.headerMask = "\n\n        <div data-v-73dd4d21=\"\" class=\"notes-head\">\n          <i\n            data-v-73dd4d21=\"\"\n            class=\"fa fa-trash xui-tooltip item\"\n            aria-describedby=\"xui-tooltip-41462\"\n            tabindex=\"0\"></i>\n          <div data-v-73dd4d21=\"\" class=\"note-drag\"></div>\n          <i\n            data-v-73dd4d21=\"\"\n            class=\"fa fa-plus xui-tooltip item\"\n            aria-describedby=\"xui-tooltip-43874\"\n            tabindex=\"0\"></i>\n          <i\n            data-v-73dd4d21=\"\"\n            class=\"far fa-eye-slash xui-tooltip item\"\n            aria-describedby=\"xui-tooltip-33637\"\n            tabindex=\"0\"></i>\n          <div data-v-73dd4d21=\"\" class=\"delete-note\" style=\"display: none\">\n            <span data-v-73dd4d21=\"\" class=\"delete-note-title\">\u786E\u5B9A\u8981\u5220\u9664\u5417\uFF1F</span>\n            <div data-v-73dd4d21=\"\" class=\"delete-button\">\n              <button data-v-73dd4d21=\"\" type=\"button\" class=\"xui-button xui-button--default\">\n                <!----><!----><span>\u53D6\u6D88</span>\n              </button>\n              <button data-v-73dd4d21=\"\" type=\"button\" class=\"xui-button xui-button--default\">\n                <!----><!----><span>\u5220\u9664</span>\n              </button>\n            </div>\n            <div data-v-73dd4d21=\"\" class=\"popper__arrow\"></div>\n          </div>\n        </div>\n\n";
exports.resizeHandle = "<div class=\"resizeHandle\"></div>";
var configHTML = "\n          <div class=\"theme item\">\n            <span class=\"tag\">Theme: </span>\n            <span class=\"capsule\"><span class=\"left capactive\">Light</span><span class=\"right\">Dark</span></span>\n          </div>\n          <div class=\"tsize item\">\n            <span class=\"tag\">Title Size: </span>\n            <select id=\"titleSize\" name=\"titleSize\">\n              <option value=\"12\">12</option>\n              <option value=\"13\">13</option>\n              <option value=\"14\">14</option>\n              <option value=\"15\">15</option>\n              <option value=\"16\">16</option>\n              <option value=\"17\">17</option>\n              <option value=\"18\">18</option>\n              <option value=\"19\">19</option>\n              <option value=\"20\">20</option>\n            </select>\n          </div>\n          <div class=\"csize item\">\n            <span class=\"tag\">Content Size: </span>\n            <select id=\"contentSize\" name=\"titleSize\">\n              <option value=\"12\">12</option>\n              <option value=\"13\">13</option>\n              <option value=\"14\">14</option>\n              <option value=\"15\">15</option>\n              <option value=\"16\">16</option>\n              <option value=\"17\">17</option>\n              <option value=\"18\">18</option>\n              <option value=\"19\">19</option>\n              <option value=\"20\">20</option>\n            </select>\n          </div>\n\n          <div class=\"hidenMode item\">\n            <span class=\"tag\">Hiden Mode: </span>\n            <span class=\"capsule\"><span class=\"left capactive\">hiden</span><span class=\"right\">replace</span></span>\n          </div>\n\n          <div class=\"mask item\">\n            <span class=\"tag\">Mask: </span\n            ><span class=\"switch\"><input type=\"checkbox\" id=\"maskSwitch\" /><label for=\"maskSwitch\">Toggle</label></span>\n          </div>\n\n          <div class=\"hotKey item\">\n            <span class=\"tag\">Hot Key: </span>\n            <div class=\"kItem\">\n              <span class=\"name\">Hiden</span>\n              <span class=\"key\">AltLeft+Space</span>\n            </div>\n            <div class=\"kItem\">\n              <span class=\"name\">Search</span>\n              <span class=\"key\">AltLeft+KeyF</span>\n            </div>\n            <div class=\"kItem\">\n              <span class=\"name\">Next Page</span>\n              <span class=\"key\">ArrowRight</span>\n            </div>\n            <div class=\"kItem\">\n              <span class=\"name\">Previous Page</span>\n              <span class=\"key\">ArrowLeft</span>\n            </div>\n          </div>\n\n          <div class=\"replaceText item\">\n            <span class=\"tag\">Replace Text: </span>\n          <div class=\"textarea\">\n            <textarea>".concat(Config_1.config.config.replaceText, "</textarea>\n          </div>\n        </div>\n\n          <div class=\"msg item\">\n            <div class=\"ms\">\n              <div><span>width: </span> <span>240</span> <span>height: </span> <span>240</span></div>\n              <div><span>x: </span> <span>240</span> <span>y: </span> <span>240</span></div>\n            </div>\n          </div>\n");
exports.wnhView = "<div class=\"wnhView\">\n<div class=\"novel\"></div>\n<div class=\"replace\">".concat(Config_1.config.config.replaceText, "</div>\n<div class=\"config\">").concat(configHTML, "</div>\n\n<div class=\"tools\">\n  <div class=\"search\">\n    <input type=\"text\" id=\"searchInput\" placeholder=\"\u952E\u5165\u7AE0\u8282\u540D\u6216\u5E8F\u53F7\" />\n  </div>\n  <div class=\"item\">\n    <div class=\"upload\">u</div>\n    <input type=\"file\" id=\"fileInput\" accept=\".txt\" />\n  </div>\n\n  <div class=\"item\">\n    <div class=\"settings\">c</div>\n  </div>\n\n  <div class=\"control\">\n    <div class=\"pre item\">&gt;</div>\n    <div class=\"next item\">&lt;</div>\n  </div>\n</div>\n</div>");
exports["default"] = { header: exports.header, resizeHandle: exports.resizeHandle, wnhView: exports.wnhView, headerMask: exports.headerMask };


/***/ }),

/***/ 721:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.adjustNewlines = exports.updateStyle = exports.setStyle = exports.getViewElement = exports.keyListener = exports.debounce = exports.isNumeric = exports.getContentByTitle = exports.splitNovelByTitle = exports.getFileContent = void 0;
var Config_1 = __webpack_require__(889);
var template_1 = __webpack_require__(352);
function getFileContent() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    var fileInput = document.getElementById('fileInput');
                    if (!fileInput) {
                        reject('File input not found');
                        return;
                    }
                    function initFileInput() {
                        fileInput.addEventListener('change', function (event) {
                            var _a, _b;
                            var file = (_b = (_a = event.target) === null || _a === void 0 ? void 0 : _a.files) === null || _b === void 0 ? void 0 : _b[0];
                            if (!file) {
                                reject('No file uploaded');
                                return;
                            }
                            var reader = new FileReader();
                            reader.onload = function (event) {
                                var _a;
                                var content = (_a = event.target) === null || _a === void 0 ? void 0 : _a.result;
                                resolve(content);
                            };
                            reader.readAsText(file);
                        });
                    }
                    if (!fileInput.onchange) {
                        initFileInput();
                    }
                })];
        });
    });
}
exports.getFileContent = getFileContent;
function splitNovelByTitle(novelText) {
    var titleRegex = /^(?:\s*|^)(楔子.*|序章.*|序言.*|序.*|引子.*|卷[零一二三四五六七八九十百千0123456789].*|第[零一二三四五六七八九十百千0123456789]+[章卷节].*)$/gm;
    var matches = novelText.match(titleRegex);
    if (!matches)
        return [];
    return matches.map(function (title) { return ({ title: title.trim() }); });
}
exports.splitNovelByTitle = splitNovelByTitle;
function getContentByTitle(titleOrIndex, content, chapters) {
    var _a, _b, _c;
    var startIndex;
    if (typeof titleOrIndex === 'string') {
        startIndex = chapters.findIndex(function (chapter) { return chapter.title === titleOrIndex; });
    }
    else {
        startIndex = titleOrIndex;
    }
    if (startIndex === -1 || startIndex > chapters.length - 1) {
        return '';
    }
    var nextTitleIndex = chapters.findIndex(function (chapter, index) { return index > startIndex && (chapter === null || chapter === void 0 ? void 0 : chapter.title) !== ''; });
    var endIndex = nextTitleIndex === -1 ? content.length : content.indexOf((_a = chapters[nextTitleIndex]) === null || _a === void 0 ? void 0 : _a.title);
    var start = content.indexOf((_b = chapters[startIndex]) === null || _b === void 0 ? void 0 : _b.title) + ((_c = chapters[startIndex]) === null || _c === void 0 ? void 0 : _c.title.length);
    var text = content.substring(start, endIndex);
    return text;
}
exports.getContentByTitle = getContentByTitle;
// export function getContentByTitle(titleOrIndex: string | number, content: string, chapters: Chapter[]): string {
//   let startIndex: number;
//   if (typeof titleOrIndex === 'string') {
//     startIndex = chapters.findIndex((chapter) => chapter.title === titleOrIndex);
//   } else {
//     startIndex = titleOrIndex;
//   }
//   if (startIndex === -1) {
//     return '';
//   }
//   const nextTitleIndex = chapters.findIndex((chapter, index) => index > startIndex && chapter.title !== '');
//   if (!chapters[nextTitleIndex]?.title) return '';
//   console.log({ nextTitleIndex, startIndex });
//   const endIndex = nextTitleIndex === -1 ? content.length : content.indexOf(chapters[nextTitleIndex].title);
//   const start = content.indexOf(chapters[startIndex].title) + chapters[startIndex].title.length;
//   const text = content.substring(start, endIndex);
//   return text;
// }
function isNumeric(str) {
    return /^\d+$/.test(str);
}
exports.isNumeric = isNumeric;
function debounce(fn, wait) {
    var timeout = null;
    return function () {
        if (timeout !== null)
            clearTimeout(timeout);
        timeout = setTimeout(fn, wait);
    };
}
exports.debounce = debounce;
function keyListener(dom, hotkey, callback) {
    if (!dom) {
        console.error('not found Dom');
        return;
    }
    // 为 div 元素添加聚焦以使用键盘监听
    if (dom.tabIndex === -1) {
        dom.tabIndex = 0;
        dom.style.outline = 'none';
    }
    var modifiers = hotkey.split('+').map(function (k) { return k.toLowerCase(); });
    var keys = modifiers.pop();
    var modifiersPressed = {};
    modifiers.forEach(function (modifier) { return (modifiersPressed[modifier] = false); });
    var handleKeyDown = function (event) {
        var key = event.code.toLowerCase();
        if (keys === key && modifiers.every(function (modifier) { return modifiersPressed[modifier]; })) {
            callback();
            event.preventDefault(); // 阻止默认行为
        }
        else if (modifiers.includes(key)) {
            modifiersPressed[key] = true;
        }
    };
    var handleKeyUp = function (event) {
        var key = event.code.toLowerCase();
        if (modifiers.includes(key)) {
            modifiersPressed[key] = false;
        }
    };
    dom.addEventListener('keydown', handleKeyDown);
    dom.addEventListener('keyup', handleKeyUp);
}
exports.keyListener = keyListener;
// export function keyListener(dom: HTMLElement | null, hotkey: string, callback: () => void) {
//   if (!dom) {
//     console.error('not found dom');
//     return;
//   }
//   // 为div元素添加聚焦以使用键盘监听
//   if (dom.tabIndex === -1) {
//     dom.tabIndex = 0;
//     dom.style.outline = 'none';
//   }
//   if (!hotkey.includes('+')) {
//     dom.addEventListener('keyup', (event: KeyboardEvent) => {
//       const key = event.code.toLocaleLowerCase();
//       if (key === hotkey.toLocaleLowerCase()) callback();
//     });
//     return;
//   }
//   const [leftKey, rightKey] = hotkey.split('+').map((k) => k.toLowerCase());
//   let leftKeyPressed = false;
//   let rightKeyPressed = false;
//   const handleKeyDown = (event: KeyboardEvent) => {
//     const key = event.code.toLocaleLowerCase();
//     if (key === leftKey) {
//       leftKeyPressed = true;
//     }
//     if (leftKeyPressed && key === rightKey) {
//       rightKeyPressed = true;
//     }
//   };
//   const handleKeyUp = (event: KeyboardEvent) => {
//     const key = event.code.toLocaleLowerCase();
//     if (key === leftKey) {
//       leftKeyPressed = false;
//     }
//     if (key === rightKey && leftKeyPressed && rightKeyPressed) {
//       rightKeyPressed = false;
//       callback();
//     }
//   };
//   dom.addEventListener('keydown', handleKeyDown);
//   dom.addEventListener('keyup', handleKeyUp);
// }
function getViewElement(fatherBox) {
    var fatherRect = fatherBox.getBoundingClientRect(); // 获取父容器的位置信息
    var scrollTop = fatherBox.scrollTop; // 获取父容器的滚动位置
    var visibleHeight = fatherRect.height; // 获取父容器的可视区域高度
    // 获取子元素集合
    var children = fatherBox.children;
    // 遍历子元素，找出当前可视区域内的元素
    for (var i = 0; i < children.length; i++) {
        var child = children[i];
        var childRect = child.getBoundingClientRect(); // 获取子元素的位置信息
        var isInView = (childRect.top >= fatherRect.top && childRect.bottom <= fatherRect.bottom) || // 子元素完全在可视区域内
            (childRect.top < fatherRect.top && childRect.bottom > fatherRect.top) || // 子元素部分在可视区域内（顶部在可视区域内）
            (childRect.top < fatherRect.bottom && childRect.bottom > fatherRect.bottom); // 子元素部分在可视区域内（底部在可视区域内）
        if (isInView) {
            return child; // 返回第一个在可视区域内的子元素
        }
    }
    return null; // 如果没有找到在可视区域内的子元素，则返回 null
}
exports.getViewElement = getViewElement;
function setStyle(cssText) {
    var style = document.createElement('style');
    style.type = 'text/css';
    style.textContent = cssText;
    document.head.appendChild(style);
}
exports.setStyle = setStyle;
function updateStyle() {
    var theme = Config_1.config.config.Theme;
    var isMask = Config_1.config.config.Mask;
    var titleSize = Config_1.config.config.TitleSize;
    var contentSize = Config_1.config.config.ContentSize;
    // theme
    var webNovelHidener = document.querySelector('#webNovelHidener');
    if (theme === 'light') {
        webNovelHidener.classList.remove('dark');
        webNovelHidener.classList.add('light');
    }
    else {
        webNovelHidener.classList.remove('light');
        webNovelHidener.classList.add('dark');
    }
    var headerEle = document.querySelector('#webNovelHidener .header');
    if (isMask) {
        headerEle.innerHTML = template_1.headerMask;
        webNovelHidener.classList.add('mask');
    }
    else {
        headerEle.innerHTML = template_1.header;
        webNovelHidener.classList.remove('mask');
    }
    setStyle("\n  #webNovelHidener .novel .part{ \n   font-size: ".concat(contentSize, "px;\n  }\n   "));
    setStyle("\n   #webNovelHidener .novel .part .title{ \n    font-size: ".concat(titleSize, "px;\n   }\n    "));
}
exports.updateStyle = updateStyle;
function adjustNewlines(text) {
    return (text
        .split('\n')
        .filter(function (t) {
        var tt = t.trim();
        return tt !== '\r' && tt !== '';
    })
        .map(function (i) { return '　　' + i.trim(); })
        .reduce(function (pre, cur) { return pre + '\n\n' + cur; }, '') + '\r\r\n\n');
}
exports.adjustNewlines = adjustNewlines;


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
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
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
/******/ 	var __webpack_exports__ = __webpack_require__(607);
/******/ 	
/******/ })()
;