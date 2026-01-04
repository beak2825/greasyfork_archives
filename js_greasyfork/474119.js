// ==UserScript==
// @name                灵云直播助手
// @namespace           http://gitlab.igetcool.com/sunjunjie/lingyun-helper
// @version             1.0.4
// @description         修改灵云直播教室使用的客户端版本号
// @author              sunjunjie
// @copyright           sunjunjie
// @license             MIT
// @match               *://*.igetcool.com/weblivev2/*
// @run-at              document-idle
// @supportURL          http://gitlab.igetcool.com/sunjunjie/lingyun-helper/issues
// @homepage            http://gitlab.igetcool.com/sunjunjie/lingyun-helper
// @grant               GM_getValue
// @grant               GM_setValue
// @grant               GM_addValueChangeListener
// @grant               GM_addStyle
// @icon                data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAG4AAABuCAYAAADGWyb7AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyVpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDYuMC1jMDAyIDc5LjE2NDM1MiwgMjAyMC8wMS8zMC0xNTo1MDozOCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6Qzc1MEI3NzAzRjMwMTFFRUE1RjlERUUwMTEyNUVDQTIiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6Qzc1MEI3NkYzRjMwMTFFRUE1RjlERUUwMTEyNUVDQTIiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIDIxLjEgKE1hY2ludG9zaCkiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpCOEQ2QTJEQjNFM0YxMUVFQkJGQUZGOEVFNkI2MTYxQSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpCOEQ2QTJEQzNFM0YxMUVFQkJGQUZGOEVFNkI2MTYxQSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PsD/gzgAABW3SURBVHja7F15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
// @require             https://code.jquery.com/jquery-3.6.3.slim.min.js
// @note                2023-08-28 1.0.0 初版发布
// @note                2023-08-30 1.0.1 修改添加按钮的时机
// @note                2023-08-30 1.0.2 修改logo
// @note                2024-05-13 1.0.3 修改添加按钮的时机和href的值
// @note                2024-11-19 1.0.4 修改链接host的取值方式，写死lingyun+version
// @downloadURL https://update.greasyfork.org/scripts/474119/%E7%81%B5%E4%BA%91%E7%9B%B4%E6%92%AD%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/474119/%E7%81%B5%E4%BA%91%E7%9B%B4%E6%92%AD%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==
/* eslint-disable */ /* spell-checker: disable */
// @[ You can find all source codes in GitHub repo ]
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 862:
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
___CSS_LOADER_EXPORT___.push([module.id, ".icon-setting {\n  font-size: 30px;\n  position: fixed;\n  top: 10px;\n  left: 10px;\n  cursor: pointer;\n}\n.icon-setting .icon {\n  font-size: 30px;\n}\n", ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ 915:
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
___CSS_LOADER_EXPORT___.push([module.id, ".dialog-container {\n  position: fixed;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  background-color: rgba(0, 0, 0, 0.3);\n  display: none;\n}\n.dialog-container .dialog {\n  position: relative;\n  margin: 200px auto 50px;\n  background: #fff;\n  border-radius: 4px;\n  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);\n  font-size: 14px;\n  width: 400px;\n}\n.dialog-container .dialog-title {\n  padding: 20px 20px 10px;\n  font-size: 18px;\n}\n.dialog-container .dialog-content {\n  padding: 30px 20px;\n  color: #606266;\n  font-size: 14px;\n  word-break: break-all;\n}\n.dialog-container .dialog-item {\n  display: flex;\n  flex-direction: row;\n}\n.dialog-container .dialog-label {\n  display: inline-block;\n  padding: 0 10px;\n  line-height: 20px;\n  text-align: center;\n}\n.dialog-container .dialog-input {\n  background-color: #fff;\n  border-radius: 4px;\n  border: 1px solid #dcdfe6;\n  box-sizing: border-box;\n  color: #606266;\n  display: inline-block;\n  font-size: inherit;\n  height: 40px;\n  line-height: 40px;\n  outline: 0;\n  padding: 0 15px;\n  transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);\n}\n.dialog-container .dialog-footer {\n  padding: 10px 20px 20px;\n  text-align: right;\n}\n.dialog-container .dialog-button {\n  display: inline-block;\n  line-height: 1;\n  white-space: nowrap;\n  cursor: pointer;\n  background: #fff;\n  border: 1px solid #dcdfe6;\n  color: #606266;\n  text-align: center;\n  box-sizing: border-box;\n  outline: 0;\n  margin: 0;\n  transition: 0.1s;\n  font-weight: 500;\n  padding: 12px 20px;\n  font-size: 14px;\n  border-radius: 4px;\n}\n.dialog-container .dialog-button:hover {\n  filter: opacity(80%);\n}\n.dialog-container .button-cancel {\n  border: 1px solid #ff6638;\n  color: #ff6638;\n}\n.dialog-container .button-ok {\n  background: #ff6638;\n  border: 1px solid #ff6638;\n  color: #fff;\n}\n", ""]);
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

/***/ 930:
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
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_node_modules_less_loader_dist_cjs_js_ruleSet_1_rules_4_use_2_app_less__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(862);

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_node_modules_less_loader_dist_cjs_js_ruleSet_1_rules_4_use_2_app_less__WEBPACK_IMPORTED_MODULE_6__/* ["default"] */ .Z, options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_node_modules_less_loader_dist_cjs_js_ruleSet_1_rules_4_use_2_app_less__WEBPACK_IMPORTED_MODULE_6__/* ["default"] */ .Z && _node_modules_css_loader_dist_cjs_js_node_modules_less_loader_dist_cjs_js_ruleSet_1_rules_4_use_2_app_less__WEBPACK_IMPORTED_MODULE_6__/* ["default"].locals */ .Z.locals ? _node_modules_css_loader_dist_cjs_js_node_modules_less_loader_dist_cjs_js_ruleSet_1_rules_4_use_2_app_less__WEBPACK_IMPORTED_MODULE_6__/* ["default"].locals */ .Z.locals : undefined);


/***/ }),

/***/ 492:
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
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_node_modules_less_loader_dist_cjs_js_ruleSet_1_rules_4_use_2_index_less__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(915);

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_node_modules_less_loader_dist_cjs_js_ruleSet_1_rules_4_use_2_index_less__WEBPACK_IMPORTED_MODULE_6__/* ["default"] */ .Z, options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_node_modules_less_loader_dist_cjs_js_ruleSet_1_rules_4_use_2_index_less__WEBPACK_IMPORTED_MODULE_6__/* ["default"] */ .Z && _node_modules_css_loader_dist_cjs_js_node_modules_less_loader_dist_cjs_js_ruleSet_1_rules_4_use_2_index_less__WEBPACK_IMPORTED_MODULE_6__/* ["default"].locals */ .Z.locals ? _node_modules_css_loader_dist_cjs_js_node_modules_less_loader_dist_cjs_js_ruleSet_1_rules_4_use_2_index_less__WEBPACK_IMPORTED_MODULE_6__/* ["default"].locals */ .Z.locals : undefined);


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
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
var icon_1 = __webpack_require__(536);
__webpack_require__(930);
var message_1 = __webpack_require__(803);
var versionDialog_1 = __importDefault(__webpack_require__(149));
var $ = window.jQuery;
message_1.MessageBox.generate();
var app = function () {
    // 添加设置按钮
    createSettingButton();
    addListeners();
    addObserver();
};
var createVersionButton = function (version) {
    // 直接克隆 class="electron" 的 a 标签
    var originButton = $('a.electron');
    if (originButton.length) {
        setTimeout(function () {
            // const hrefString = originButton.attr('href');
            // const newHrefString = hrefString.replace(/lingyun\d+/, `lingyun${version}`);
            // console.log('newHrefString', newHrefString);
            var _a = window.location.href.split('?') || [], query = _a[1];
            // 直接拼接
            var newHrefString = "lingyun".concat(version, ":?").concat(query);
            console.log('newHrefString', newHrefString);
            var CustomButton = "\n  <a href=\"".concat(newHrefString, "\" class=\"electron\" id=\"custom-version-button\">\u6253\u5F00\u7075\u4E91\u81EA\u5B9A\u4E49\u7248\u672C ").concat(version, "</a>\n  ");
            if ($('#custom-version-button').length) {
                // 修改版本号
                $('#custom-version-button').replaceWith(CustomButton);
            }
            else {
                // 创建版本号
                $('.index-bottom').append($(CustomButton));
            }
        }, 1000);
    }
};
var createSettingButton = function () {
    var setIcon = $("<span class=\"icon-setting\" title=\"\u8BBE\u7F6E\u7248\u672C\">".concat(icon_1.setting, "</span>"));
    $('body').append(setIcon);
    $('body').append($(versionDialog_1.default));
};
var addListeners = function () {
    $('.icon-setting').on('click', function () {
        $('#setting-dialog').show();
        var customVersion = GM_getValue("lingyun.user.js" + '_custom_version');
        if (customVersion) {
            $('#setting-input').val(customVersion);
        }
    });
    $('#setting-dialog-cancel').on('click', function () {
        $('#setting-dialog').hide();
    });
    $('#setting-dialog-ok').on('click', function () {
        var version = $('#setting-input').val();
        // 检查版本是否合法
        if (/^[1-9]\d*$/.test(version)) {
            GM_setValue("lingyun.user.js" + '_custom_version', version);
            createVersionButton(version);
        }
        else {
            new message_1.MessageBox('版本号不合法');
        }
        $('#setting-dialog').hide();
    });
};
var addObserver = function () {
    // 1. 获取目标节点
    var appContainer = document.querySelector('body');
    if (!appContainer) {
        return;
    }
    var observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (_a) {
            var type = _a.type, addedNodes = _a.addedNodes;
            if (type === 'childList' && addedNodes.length) {
                addedNodes.forEach(function (itemEl) {
                    var _a;
                    if (!itemEl) {
                        return;
                    }
                    if ((_a = itemEl === null || itemEl === void 0 ? void 0 : itemEl.classList) === null || _a === void 0 ? void 0 : _a.contains('index')) {
                        // 尝试
                        var customVersion = GM_getValue("lingyun.user.js" + '_custom_version');
                        // 有设置过版本自定义版本号，那就直接显示
                        if (customVersion) {
                            createVersionButton(customVersion);
                        }
                    }
                });
            }
        });
    });
    observer.observe(appContainer, {
        childList: true,
        subtree: true,
    });
};
exports["default"] = app;


/***/ }),

/***/ 803:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MessageBox = void 0;
// 需要手动增加 GM_addStyle 和 GM_notification 权限
/**
 * 消息通知类：不依赖框架
 * @param text string | undefined
 * @param setTime number | string = 5000,
 * @param importance number = 1
 * @example
 * 0.先在入口文件中调用静态方法 MessageBox.generate() 方法初始化消息弹出窗口；
 * 1. new MessageBox('hello')
 * 2.空初始化时调用 show() 显示消息；
 * 3.setTime：ms，非数字时为永久消息，需手动调用 refresh() 刷新消息，remove() 移除消息；
 * 4.importance：1： log + 自定义弹窗；2： log + 自定义弹窗 + GM系统提示；其它值：自定义弹窗；
 */
var MessageBox = /** @class */ (function () {
    function MessageBox(text, setTime, importance) {
        if (setTime === void 0) { setTime = 5000; }
        if (importance === void 0) { importance = 1 /* IMPORTANCE.LOG_POP */; }
        this._msg = null; // 永久显示标记，和元素地址
        this._text = text;
        this._setTime = setTime;
        this._importance = importance;
        this._timer = 0; // 计数器
        // 非空初始化，立即执行；
        if (text !== undefined) {
            this.show();
        }
    }
    // 静态方法，初始化消息盒子，先调用本方法初始化消息弹出窗口
    MessageBox.generate = function () {
        // 添加样式
        GM_addStyle("\n      #messageBox {\n        width: 222px; \n        position: fixed; \n        right: 5%; \n        top: 20px; \n        z-index: 999\n      }\n      #messageBox div {\n        width: 100%; \n        background-color: #F56C6C; \n        float: left; \n        padding: 5px 10px; \n        margin-top: 10px; \n        border-radius: 4px; \n        color: #fff; \n        box-shadow: 0px 0px 1px 3px #ffffff;\n        text-align: center;\n      }\n      ");
        this._msgBox = document.createElement('div'); // 创建类型为div的DOM对象
        this._msgBox.id = 'messageBox';
        document.body.append(this._msgBox); // 消息盒子添加到body
    };
    // 显示消息
    MessageBox.prototype.show = function (text, setTime, importance) {
        var _this = this;
        if (text === void 0) { text = this._text; }
        if (setTime === void 0) { setTime = this._setTime; }
        if (importance === void 0) { importance = this._importance; }
        if (this._msg !== null) {
            throw new Error('先移除上条消息，才可再次添加！');
        }
        if (text === undefined) {
            throw new Error('未输入消息');
        }
        this._text = text;
        this._setTime = setTime;
        this._importance = importance;
        this._msg = document.createElement('div');
        this._msg.textContent = text;
        MessageBox._msgBox.append(this._msg); // 显示消息
        switch (importance) {
            case 1: {
                console.log(text);
                break;
            }
            case 2: {
                console.log(text);
                GM_notification(text);
                break;
            }
            default: {
                break;
            }
        }
        if (setTime && !isNaN(Number(setTime))) {
            // 默认5秒删掉消息，可设置时间，none一直显示
            setTimeout(function () {
                _this.remove();
            }, Number(setTime));
        }
    };
    MessageBox.prototype.refresh = function (text) {
        if (isNaN(Number(this._setTime)) && this._msg) {
            this._msg.textContent = text;
            switch (this._importance) {
                case 1: {
                    console.log(text);
                    break;
                }
                case 2: {
                    console.log(text);
                    GM_notification(text);
                    break;
                }
                default: {
                    break;
                }
            }
        }
        else {
            throw new Error('只有弹窗永久消息支持刷新内容：' + this._setTime);
        }
    };
    // 移除方法，没有元素则等待setTime 5秒再试5次
    MessageBox.prototype.remove = function () {
        var _this = this;
        if (this._msg) {
            this._msg.remove();
            this._msg = null; // 清除标志位
        }
        else {
            // 空初始化时，消息异步发送，导致先执行移除而获取不到元素，默认 setTime=5000
            // 消息发出后，box 非空，可以移除，不会执行 setTime="none"
            if (this._timer == 4) {
                throw new Error('移除的元素不存在：' + this._msg);
            }
            this._timer++;
            setTimeout(function () {
                _this.remove();
            }, Number(this._setTime));
        }
    };
    return MessageBox;
}());
exports.MessageBox = MessageBox;


/***/ }),

/***/ 149:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
__webpack_require__(492);
exports["default"] = "\n<div class=\"dialog-container\" id=\"setting-dialog\">\n<div class=\"dialog\">\n  <div class=\"dialog-title\">\u4FEE\u6539\u6D4B\u8BD5\u7248\u672C</div>\n  <div class=\"dialog-content\">\n    <div class=\"dialog-item\">\n      <span class=\"dialog-label\">\u8BF7\u8F93\u5165\u7248\u672C\u53F7<br/>(\u4F8B\u5982\uFF1A512)</span>\n      <input type=\"text\" class=\"dialog-input\" id=\"setting-input\" />\n    </div>\n  </div>\n  <div class=\"dialog-footer\">\n    <div class=\"dialog-button button-cannel\" id=\"setting-dialog-cancel\">\u53D6\u6D88</div>\n    <div class=\"dialog-button button-ok\" id=\"setting-dialog-ok\">\u786E\u5B9A</div>\n  </div>\n</div>\n</div>\n";


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

/***/ 536:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.setting = void 0;
exports.setting = "<svg t=\"1693215079188\" class=\"icon\" viewBox=\"0 0 1040 1024\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" p-id=\"4035\" width=\"300\" height=\"300\"><path d=\"M690.794106 382.923226c-11.656481 16.910135-12.815887 40.266076-11.32186 58.597583L553.446971 441.520809c-11.863189-82.990133-82.880639-147.083893-169.229263-147.752112-95.15622-0.733711-172.893722 75.847455-173.627433 171.039491-0.735757 95.193059 75.810616 172.960237 170.966836 173.695994 10.920724 0.077771 21.611204-0.862647 31.985482-2.727111l0 122.787534c-6.480598-0.110517-12.43317 0.10847-17.250896 0.593518-49.568952 4.976338-38.587853 73.825402-68.14503 86.264713-34.288944 14.431687-89.841168-4.300956-105.754602-36.978193-9.768481-20.057825 20.511149-45.567825-1.774413-81.982176-8.972349-14.656815-25.688055-39.778982-43.004443-48.550763-29.684066-15.027252-53.422723 10.878768-91.742471 20.992103-20.889773 5.51562-43.86095-37.70781-50.197262-53.426817-14.619976-36.286438-18.23327-48.428989 29.53364-79.32772 28.492938-18.433838 27.764344-73.854055 22.473851-101.08321-2.764973-14.226003-25.251104-24.825408-47.973618-29.30135-37.974893-7.471159-62.180178-54.910611-8.673543-125.429711 18.070564-23.817452 50.105165 18.032702 94.02035-4.100388 11.777231-5.934153 51.836599-32.045857 53.481052-59.860343 2.133593-36.056194-25.832342-54.187133-25.972535-70.112847-0.309038-37.653575 55.140855-67.348897 75.245751-69.336158 41.24845-4.063549 42.894949 38.522362 76.667124 58.45125 27.576055 16.278755 64.470337 13.357216 81.877799 7.866155 24.248264-7.647167 26.074865-67.762313 51.234895-81.5749 32.453133-17.808598 89.48915 6.758937 105.829304 27.339672 9.340739 11.764951-9.299807 42.627866-7.751544 67.439972 1.579985 25.38311 29.903054 48.604998 40.514739 58.177004 54.764278 49.39499 88.317465-17.068747 115.729791-6.341429 29.90817 11.704576 54.630225 61.48126 52.303226 92.016717C742.228545 356.477924 716.931393 345.020988 690.794106 382.923226L690.794106 382.923226zM690.794106 382.923226\" fill=\"#ff6638\" p-id=\"4036\"></path><path d=\"M498.385934 513.400906c15.622816 0 28.28009 12.659321 28.28009 28.282137 0 15.622816-12.657274 28.28009-28.28009 28.28009-15.616676 0-28.282137-12.657274-28.282137-28.28009C470.103798 526.059204 482.769258 513.400906 498.385934 513.400906L498.385934 513.400906zM498.385934 513.400906\" fill=\"#ff6638\" p-id=\"4037\"></path><path d=\"M576.75277 513.400906l419.511539 0c15.294334 0 27.692712 12.397355 27.692712 27.692712l0 1.178849c0 15.294334-12.397355 27.690666-27.692712 27.690666L576.75277 569.963133c-15.294334 0-27.690666-12.396331-27.690666-27.690666l0-1.178849C549.062104 525.798261 561.458435 513.400906 576.75277 513.400906L576.75277 513.400906zM576.75277 513.400906\" fill=\"#ff6638\" p-id=\"4038\"></path><path d=\"M498.385934 677.200506c15.622816 0 28.28009 12.659321 28.28009 28.282137 0 15.616676-12.657274 28.28009-28.28009 28.28009-15.616676 0-28.282137-12.657274-28.282137-28.28009C470.103798 689.858804 482.769258 677.200506 498.385934 677.200506L498.385934 677.200506zM498.385934 677.200506\" fill=\"#ff6638\" p-id=\"4039\"></path><path d=\"M576.75277 677.200506l419.511539 0c15.294334 0 27.692712 12.397355 27.692712 27.692712l0 1.178849c0 15.294334-12.397355 27.690666-27.692712 27.690666L576.75277 733.762733c-15.294334 0-27.690666-12.396331-27.690666-27.690666l0-1.178849C549.062104 689.597861 561.458435 677.200506 576.75277 677.200506L576.75277 677.200506zM576.75277 677.200506\" fill=\"#ff6638\" p-id=\"4040\"></path><path d=\"M498.385934 841.000106c15.622816 0 28.28009 12.659321 28.28009 28.282137s-12.657274 28.28009-28.28009 28.28009c-15.616676 0-28.282137-12.657274-28.282137-28.28009S482.769258 841.000106 498.385934 841.000106L498.385934 841.000106zM498.385934 841.000106\" fill=\"#ff6638\" p-id=\"4041\"></path><path d=\"M576.75277 841.000106l419.511539 0c15.294334 0 27.692712 12.397355 27.692712 27.692712l0 1.178849c0 15.294334-12.397355 27.690666-27.692712 27.690666L576.75277 897.562333c-15.294334 0-27.690666-12.396331-27.690666-27.690666l0-1.178849C549.062104 853.397461 561.458435 841.000106 576.75277 841.000106L576.75277 841.000106zM576.75277 841.000106\" fill=\"#ff6638\" p-id=\"4042\"></path></svg>";


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