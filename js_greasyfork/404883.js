// ==UserScript==
// @name         Surviv.io Counters
// @namespace    https://github.com/DamienVesper/SurvivCounters
// @version      2.0.1
// @description  An ingame counter overlay to view connection stats and in-game health stats.
// @author       DamienVesper
// @license      AGPL-3.0
// @match        *://surviv.io/*
// @match        *://surviv2.io/*
// @match        *://2dbattleroyale.com/*
// @match        *://2dbattleroyale.org/*
// @match        *://piearesquared.info/*
// @match        *://thecircleisclosing.com/*
// @match        *://secantsecant.com/*
// @match        *://parmainitiative.com/*
// @match        *://ot38.club/*
// @match        *://drchandlertallow.com/*
// @match        *://rarepotato.com
// @match        *://archimedesofsyracuse.info/*
// @match        *://nevelskoygroup.com/*
// @match        *://kugahi.com/*
// @match        *://kugaheavyindustry.com/*
// @match        *://chandlertallowmd.com/*
// @match        *://c79geyxwmp1zpas3qxbddzrtytffta.ext-twitch.tv/c79geyxwmp1zpas3qxbddzrtytffta/1.0.2/ce940530af57d2615ac39c266fe9679d/*
// @downloadURL https://update.greasyfork.org/scripts/404883/Survivio%20Counters.user.js
// @updateURL https://update.greasyfork.org/scripts/404883/Survivio%20Counters.meta.js
// ==/UserScript==

/*!
 * surviv-counters.dev.js
 * Created by DamienVesper#5225.
 * Licensed under the terms of the GNU AGPL v3.
 */
/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/.pnpm/css-loader@6.6.0_webpack@5.70.0/node_modules/css-loader/dist/cjs.js!./node_modules/.pnpm/sass-loader@12.6.0_sass@1.49.9+webpack@5.70.0/node_modules/sass-loader/dist/cjs.js!./assets/scss/common.scss":
/*!**********************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/.pnpm/css-loader@6.6.0_webpack@5.70.0/node_modules/css-loader/dist/cjs.js!./node_modules/.pnpm/sass-loader@12.6.0_sass@1.49.9+webpack@5.70.0/node_modules/sass-loader/dist/cjs.js!./assets/scss/common.scss ***!
  \**********************************************************************************************************************************************************************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _node_modules_pnpm_css_loader_6_6_0_webpack_5_70_0_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../node_modules/.pnpm/css-loader@6.6.0_webpack@5.70.0/node_modules/css-loader/dist/runtime/noSourceMaps.js */ \"./node_modules/.pnpm/css-loader@6.6.0_webpack@5.70.0/node_modules/css-loader/dist/runtime/noSourceMaps.js\");\n/* harmony import */ var _node_modules_pnpm_css_loader_6_6_0_webpack_5_70_0_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_pnpm_css_loader_6_6_0_webpack_5_70_0_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _node_modules_pnpm_css_loader_6_6_0_webpack_5_70_0_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../node_modules/.pnpm/css-loader@6.6.0_webpack@5.70.0/node_modules/css-loader/dist/runtime/api.js */ \"./node_modules/.pnpm/css-loader@6.6.0_webpack@5.70.0/node_modules/css-loader/dist/runtime/api.js\");\n/* harmony import */ var _node_modules_pnpm_css_loader_6_6_0_webpack_5_70_0_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_pnpm_css_loader_6_6_0_webpack_5_70_0_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);\n// Imports\n\n\nvar ___CSS_LOADER_EXPORT___ = _node_modules_pnpm_css_loader_6_6_0_webpack_5_70_0_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_pnpm_css_loader_6_6_0_webpack_5_70_0_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));\n// Module\n___CSS_LOADER_EXPORT___.push([module.id, \".sic-box-container {\\n  background: rgba(0, 0, 0, 0.25);\\n  border-radius: 5px;\\n  padding: 8px;\\n}\\n\\n#sic-bottomWrapper {\\n  margin-bottom: 5px;\\n}\\n\\n#sic-hpWrapper, #sic-adrenWrapper {\\n  width: 50px;\\n  margin-right: 5px;\\n  display: inline-block;\\n}\\n\\n#sic-fpsWrapper, #sic-latWrapper {\\n  margin: 5px 0px;\\n  width: 192px;\\n}\\n\\n#ui-spectate-options {\\n  top: 85px;\\n}\", \"\"]);\n// Exports\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);\n\n\n//# sourceURL=webpack://@damienvesper/survivio-counters/./assets/scss/common.scss?./node_modules/.pnpm/css-loader@6.6.0_webpack@5.70.0/node_modules/css-loader/dist/cjs.js!./node_modules/.pnpm/sass-loader@12.6.0_sass@1.49.9+webpack@5.70.0/node_modules/sass-loader/dist/cjs.js");

/***/ }),

/***/ "./node_modules/.pnpm/css-loader@6.6.0_webpack@5.70.0/node_modules/css-loader/dist/runtime/api.js":
/*!********************************************************************************************************!*\
  !*** ./node_modules/.pnpm/css-loader@6.6.0_webpack@5.70.0/node_modules/css-loader/dist/runtime/api.js ***!
  \********************************************************************************************************/
/***/ ((module) => {

eval("\n\n/*\n  MIT License http://www.opensource.org/licenses/mit-license.php\n  Author Tobias Koppers @sokra\n*/\nmodule.exports = function (cssWithMappingToString) {\n  var list = []; // return the list of modules as css string\n\n  list.toString = function toString() {\n    return this.map(function (item) {\n      var content = \"\";\n      var needLayer = typeof item[5] !== \"undefined\";\n\n      if (item[4]) {\n        content += \"@supports (\".concat(item[4], \") {\");\n      }\n\n      if (item[2]) {\n        content += \"@media \".concat(item[2], \" {\");\n      }\n\n      if (needLayer) {\n        content += \"@layer\".concat(item[5].length > 0 ? \" \".concat(item[5]) : \"\", \" {\");\n      }\n\n      content += cssWithMappingToString(item);\n\n      if (needLayer) {\n        content += \"}\";\n      }\n\n      if (item[2]) {\n        content += \"}\";\n      }\n\n      if (item[4]) {\n        content += \"}\";\n      }\n\n      return content;\n    }).join(\"\");\n  }; // import a list of modules into the list\n\n\n  list.i = function i(modules, media, dedupe, supports, layer) {\n    if (typeof modules === \"string\") {\n      modules = [[null, modules, undefined]];\n    }\n\n    var alreadyImportedModules = {};\n\n    if (dedupe) {\n      for (var k = 0; k < this.length; k++) {\n        var id = this[k][0];\n\n        if (id != null) {\n          alreadyImportedModules[id] = true;\n        }\n      }\n    }\n\n    for (var _k = 0; _k < modules.length; _k++) {\n      var item = [].concat(modules[_k]);\n\n      if (dedupe && alreadyImportedModules[item[0]]) {\n        continue;\n      }\n\n      if (typeof layer !== \"undefined\") {\n        if (typeof item[5] === \"undefined\") {\n          item[5] = layer;\n        } else {\n          item[1] = \"@layer\".concat(item[5].length > 0 ? \" \".concat(item[5]) : \"\", \" {\").concat(item[1], \"}\");\n          item[5] = layer;\n        }\n      }\n\n      if (media) {\n        if (!item[2]) {\n          item[2] = media;\n        } else {\n          item[1] = \"@media \".concat(item[2], \" {\").concat(item[1], \"}\");\n          item[2] = media;\n        }\n      }\n\n      if (supports) {\n        if (!item[4]) {\n          item[4] = \"\".concat(supports);\n        } else {\n          item[1] = \"@supports (\".concat(item[4], \") {\").concat(item[1], \"}\");\n          item[4] = supports;\n        }\n      }\n\n      list.push(item);\n    }\n  };\n\n  return list;\n};\n\n//# sourceURL=webpack://@damienvesper/survivio-counters/./node_modules/.pnpm/css-loader@6.6.0_webpack@5.70.0/node_modules/css-loader/dist/runtime/api.js?");

/***/ }),

/***/ "./node_modules/.pnpm/css-loader@6.6.0_webpack@5.70.0/node_modules/css-loader/dist/runtime/noSourceMaps.js":
/*!*****************************************************************************************************************!*\
  !*** ./node_modules/.pnpm/css-loader@6.6.0_webpack@5.70.0/node_modules/css-loader/dist/runtime/noSourceMaps.js ***!
  \*****************************************************************************************************************/
/***/ ((module) => {

eval("\n\nmodule.exports = function (i) {\n  return i[1];\n};\n\n//# sourceURL=webpack://@damienvesper/survivio-counters/./node_modules/.pnpm/css-loader@6.6.0_webpack@5.70.0/node_modules/css-loader/dist/runtime/noSourceMaps.js?");

/***/ }),

/***/ "./assets/scss/common.scss":
/*!*********************************!*\
  !*** ./assets/scss/common.scss ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _node_modules_pnpm_style_loader_3_3_1_webpack_5_70_0_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../node_modules/.pnpm/style-loader@3.3.1_webpack@5.70.0/node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ \"./node_modules/.pnpm/style-loader@3.3.1_webpack@5.70.0/node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js\");\n/* harmony import */ var _node_modules_pnpm_style_loader_3_3_1_webpack_5_70_0_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_pnpm_style_loader_3_3_1_webpack_5_70_0_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _node_modules_pnpm_style_loader_3_3_1_webpack_5_70_0_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !../../node_modules/.pnpm/style-loader@3.3.1_webpack@5.70.0/node_modules/style-loader/dist/runtime/styleDomAPI.js */ \"./node_modules/.pnpm/style-loader@3.3.1_webpack@5.70.0/node_modules/style-loader/dist/runtime/styleDomAPI.js\");\n/* harmony import */ var _node_modules_pnpm_style_loader_3_3_1_webpack_5_70_0_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_pnpm_style_loader_3_3_1_webpack_5_70_0_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _node_modules_pnpm_style_loader_3_3_1_webpack_5_70_0_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../node_modules/.pnpm/style-loader@3.3.1_webpack@5.70.0/node_modules/style-loader/dist/runtime/insertBySelector.js */ \"./node_modules/.pnpm/style-loader@3.3.1_webpack@5.70.0/node_modules/style-loader/dist/runtime/insertBySelector.js\");\n/* harmony import */ var _node_modules_pnpm_style_loader_3_3_1_webpack_5_70_0_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_pnpm_style_loader_3_3_1_webpack_5_70_0_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _node_modules_pnpm_style_loader_3_3_1_webpack_5_70_0_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../node_modules/.pnpm/style-loader@3.3.1_webpack@5.70.0/node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js */ \"./node_modules/.pnpm/style-loader@3.3.1_webpack@5.70.0/node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js\");\n/* harmony import */ var _node_modules_pnpm_style_loader_3_3_1_webpack_5_70_0_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_node_modules_pnpm_style_loader_3_3_1_webpack_5_70_0_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);\n/* harmony import */ var _node_modules_pnpm_style_loader_3_3_1_webpack_5_70_0_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! !../../node_modules/.pnpm/style-loader@3.3.1_webpack@5.70.0/node_modules/style-loader/dist/runtime/insertStyleElement.js */ \"./node_modules/.pnpm/style-loader@3.3.1_webpack@5.70.0/node_modules/style-loader/dist/runtime/insertStyleElement.js\");\n/* harmony import */ var _node_modules_pnpm_style_loader_3_3_1_webpack_5_70_0_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_node_modules_pnpm_style_loader_3_3_1_webpack_5_70_0_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);\n/* harmony import */ var _node_modules_pnpm_style_loader_3_3_1_webpack_5_70_0_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! !../../node_modules/.pnpm/style-loader@3.3.1_webpack@5.70.0/node_modules/style-loader/dist/runtime/styleTagTransform.js */ \"./node_modules/.pnpm/style-loader@3.3.1_webpack@5.70.0/node_modules/style-loader/dist/runtime/styleTagTransform.js\");\n/* harmony import */ var _node_modules_pnpm_style_loader_3_3_1_webpack_5_70_0_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_node_modules_pnpm_style_loader_3_3_1_webpack_5_70_0_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);\n/* harmony import */ var _node_modules_pnpm_css_loader_6_6_0_webpack_5_70_0_node_modules_css_loader_dist_cjs_js_node_modules_pnpm_sass_loader_12_6_0_sass_1_49_9_webpack_5_70_0_node_modules_sass_loader_dist_cjs_js_common_scss__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../../node_modules/.pnpm/css-loader@6.6.0_webpack@5.70.0/node_modules/css-loader/dist/cjs.js!../../node_modules/.pnpm/sass-loader@12.6.0_sass@1.49.9+webpack@5.70.0/node_modules/sass-loader/dist/cjs.js!./common.scss */ \"./node_modules/.pnpm/css-loader@6.6.0_webpack@5.70.0/node_modules/css-loader/dist/cjs.js!./node_modules/.pnpm/sass-loader@12.6.0_sass@1.49.9+webpack@5.70.0/node_modules/sass-loader/dist/cjs.js!./assets/scss/common.scss\");\n\n      \n      \n      \n      \n      \n      \n      \n      \n      \n\nvar options = {};\n\noptions.styleTagTransform = (_node_modules_pnpm_style_loader_3_3_1_webpack_5_70_0_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());\noptions.setAttributes = (_node_modules_pnpm_style_loader_3_3_1_webpack_5_70_0_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());\n\n      options.insert = _node_modules_pnpm_style_loader_3_3_1_webpack_5_70_0_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, \"head\");\n    \noptions.domAPI = (_node_modules_pnpm_style_loader_3_3_1_webpack_5_70_0_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());\noptions.insertStyleElement = (_node_modules_pnpm_style_loader_3_3_1_webpack_5_70_0_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());\n\nvar update = _node_modules_pnpm_style_loader_3_3_1_webpack_5_70_0_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_pnpm_css_loader_6_6_0_webpack_5_70_0_node_modules_css_loader_dist_cjs_js_node_modules_pnpm_sass_loader_12_6_0_sass_1_49_9_webpack_5_70_0_node_modules_sass_loader_dist_cjs_js_common_scss__WEBPACK_IMPORTED_MODULE_6__[\"default\"], options);\n\n\n\n\n       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_pnpm_css_loader_6_6_0_webpack_5_70_0_node_modules_css_loader_dist_cjs_js_node_modules_pnpm_sass_loader_12_6_0_sass_1_49_9_webpack_5_70_0_node_modules_sass_loader_dist_cjs_js_common_scss__WEBPACK_IMPORTED_MODULE_6__[\"default\"] && _node_modules_pnpm_css_loader_6_6_0_webpack_5_70_0_node_modules_css_loader_dist_cjs_js_node_modules_pnpm_sass_loader_12_6_0_sass_1_49_9_webpack_5_70_0_node_modules_sass_loader_dist_cjs_js_common_scss__WEBPACK_IMPORTED_MODULE_6__[\"default\"].locals ? _node_modules_pnpm_css_loader_6_6_0_webpack_5_70_0_node_modules_css_loader_dist_cjs_js_node_modules_pnpm_sass_loader_12_6_0_sass_1_49_9_webpack_5_70_0_node_modules_sass_loader_dist_cjs_js_common_scss__WEBPACK_IMPORTED_MODULE_6__[\"default\"].locals : undefined);\n\n\n//# sourceURL=webpack://@damienvesper/survivio-counters/./assets/scss/common.scss?");

/***/ }),

/***/ "./node_modules/.pnpm/style-loader@3.3.1_webpack@5.70.0/node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js":
/*!*********************************************************************************************************************************!*\
  !*** ./node_modules/.pnpm/style-loader@3.3.1_webpack@5.70.0/node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js ***!
  \*********************************************************************************************************************************/
/***/ ((module) => {

eval("\n\nvar stylesInDOM = [];\n\nfunction getIndexByIdentifier(identifier) {\n  var result = -1;\n\n  for (var i = 0; i < stylesInDOM.length; i++) {\n    if (stylesInDOM[i].identifier === identifier) {\n      result = i;\n      break;\n    }\n  }\n\n  return result;\n}\n\nfunction modulesToDom(list, options) {\n  var idCountMap = {};\n  var identifiers = [];\n\n  for (var i = 0; i < list.length; i++) {\n    var item = list[i];\n    var id = options.base ? item[0] + options.base : item[0];\n    var count = idCountMap[id] || 0;\n    var identifier = \"\".concat(id, \" \").concat(count);\n    idCountMap[id] = count + 1;\n    var indexByIdentifier = getIndexByIdentifier(identifier);\n    var obj = {\n      css: item[1],\n      media: item[2],\n      sourceMap: item[3],\n      supports: item[4],\n      layer: item[5]\n    };\n\n    if (indexByIdentifier !== -1) {\n      stylesInDOM[indexByIdentifier].references++;\n      stylesInDOM[indexByIdentifier].updater(obj);\n    } else {\n      var updater = addElementStyle(obj, options);\n      options.byIndex = i;\n      stylesInDOM.splice(i, 0, {\n        identifier: identifier,\n        updater: updater,\n        references: 1\n      });\n    }\n\n    identifiers.push(identifier);\n  }\n\n  return identifiers;\n}\n\nfunction addElementStyle(obj, options) {\n  var api = options.domAPI(options);\n  api.update(obj);\n\n  var updater = function updater(newObj) {\n    if (newObj) {\n      if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap && newObj.supports === obj.supports && newObj.layer === obj.layer) {\n        return;\n      }\n\n      api.update(obj = newObj);\n    } else {\n      api.remove();\n    }\n  };\n\n  return updater;\n}\n\nmodule.exports = function (list, options) {\n  options = options || {};\n  list = list || [];\n  var lastIdentifiers = modulesToDom(list, options);\n  return function update(newList) {\n    newList = newList || [];\n\n    for (var i = 0; i < lastIdentifiers.length; i++) {\n      var identifier = lastIdentifiers[i];\n      var index = getIndexByIdentifier(identifier);\n      stylesInDOM[index].references--;\n    }\n\n    var newLastIdentifiers = modulesToDom(newList, options);\n\n    for (var _i = 0; _i < lastIdentifiers.length; _i++) {\n      var _identifier = lastIdentifiers[_i];\n\n      var _index = getIndexByIdentifier(_identifier);\n\n      if (stylesInDOM[_index].references === 0) {\n        stylesInDOM[_index].updater();\n\n        stylesInDOM.splice(_index, 1);\n      }\n    }\n\n    lastIdentifiers = newLastIdentifiers;\n  };\n};\n\n//# sourceURL=webpack://@damienvesper/survivio-counters/./node_modules/.pnpm/style-loader@3.3.1_webpack@5.70.0/node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js?");

/***/ }),

/***/ "./node_modules/.pnpm/style-loader@3.3.1_webpack@5.70.0/node_modules/style-loader/dist/runtime/insertBySelector.js":
/*!*************************************************************************************************************************!*\
  !*** ./node_modules/.pnpm/style-loader@3.3.1_webpack@5.70.0/node_modules/style-loader/dist/runtime/insertBySelector.js ***!
  \*************************************************************************************************************************/
/***/ ((module) => {

eval("\n\nvar memo = {};\n/* istanbul ignore next  */\n\nfunction getTarget(target) {\n  if (typeof memo[target] === \"undefined\") {\n    var styleTarget = document.querySelector(target); // Special case to return head of iframe instead of iframe itself\n\n    if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {\n      try {\n        // This will throw an exception if access to iframe is blocked\n        // due to cross-origin restrictions\n        styleTarget = styleTarget.contentDocument.head;\n      } catch (e) {\n        // istanbul ignore next\n        styleTarget = null;\n      }\n    }\n\n    memo[target] = styleTarget;\n  }\n\n  return memo[target];\n}\n/* istanbul ignore next  */\n\n\nfunction insertBySelector(insert, style) {\n  var target = getTarget(insert);\n\n  if (!target) {\n    throw new Error(\"Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.\");\n  }\n\n  target.appendChild(style);\n}\n\nmodule.exports = insertBySelector;\n\n//# sourceURL=webpack://@damienvesper/survivio-counters/./node_modules/.pnpm/style-loader@3.3.1_webpack@5.70.0/node_modules/style-loader/dist/runtime/insertBySelector.js?");

/***/ }),

/***/ "./node_modules/.pnpm/style-loader@3.3.1_webpack@5.70.0/node_modules/style-loader/dist/runtime/insertStyleElement.js":
/*!***************************************************************************************************************************!*\
  !*** ./node_modules/.pnpm/style-loader@3.3.1_webpack@5.70.0/node_modules/style-loader/dist/runtime/insertStyleElement.js ***!
  \***************************************************************************************************************************/
/***/ ((module) => {

eval("\n\n/* istanbul ignore next  */\nfunction insertStyleElement(options) {\n  var element = document.createElement(\"style\");\n  options.setAttributes(element, options.attributes);\n  options.insert(element, options.options);\n  return element;\n}\n\nmodule.exports = insertStyleElement;\n\n//# sourceURL=webpack://@damienvesper/survivio-counters/./node_modules/.pnpm/style-loader@3.3.1_webpack@5.70.0/node_modules/style-loader/dist/runtime/insertStyleElement.js?");

/***/ }),

/***/ "./node_modules/.pnpm/style-loader@3.3.1_webpack@5.70.0/node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js":
/*!***************************************************************************************************************************************!*\
  !*** ./node_modules/.pnpm/style-loader@3.3.1_webpack@5.70.0/node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js ***!
  \***************************************************************************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("\n\n/* istanbul ignore next  */\nfunction setAttributesWithoutAttributes(styleElement) {\n  var nonce =  true ? __webpack_require__.nc : 0;\n\n  if (nonce) {\n    styleElement.setAttribute(\"nonce\", nonce);\n  }\n}\n\nmodule.exports = setAttributesWithoutAttributes;\n\n//# sourceURL=webpack://@damienvesper/survivio-counters/./node_modules/.pnpm/style-loader@3.3.1_webpack@5.70.0/node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js?");

/***/ }),

/***/ "./node_modules/.pnpm/style-loader@3.3.1_webpack@5.70.0/node_modules/style-loader/dist/runtime/styleDomAPI.js":
/*!********************************************************************************************************************!*\
  !*** ./node_modules/.pnpm/style-loader@3.3.1_webpack@5.70.0/node_modules/style-loader/dist/runtime/styleDomAPI.js ***!
  \********************************************************************************************************************/
/***/ ((module) => {

eval("\n\n/* istanbul ignore next  */\nfunction apply(styleElement, options, obj) {\n  var css = \"\";\n\n  if (obj.supports) {\n    css += \"@supports (\".concat(obj.supports, \") {\");\n  }\n\n  if (obj.media) {\n    css += \"@media \".concat(obj.media, \" {\");\n  }\n\n  var needLayer = typeof obj.layer !== \"undefined\";\n\n  if (needLayer) {\n    css += \"@layer\".concat(obj.layer.length > 0 ? \" \".concat(obj.layer) : \"\", \" {\");\n  }\n\n  css += obj.css;\n\n  if (needLayer) {\n    css += \"}\";\n  }\n\n  if (obj.media) {\n    css += \"}\";\n  }\n\n  if (obj.supports) {\n    css += \"}\";\n  }\n\n  var sourceMap = obj.sourceMap;\n\n  if (sourceMap && typeof btoa !== \"undefined\") {\n    css += \"\\n/*# sourceMappingURL=data:application/json;base64,\".concat(btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))), \" */\");\n  } // For old IE\n\n  /* istanbul ignore if  */\n\n\n  options.styleTagTransform(css, styleElement, options.options);\n}\n\nfunction removeStyleElement(styleElement) {\n  // istanbul ignore if\n  if (styleElement.parentNode === null) {\n    return false;\n  }\n\n  styleElement.parentNode.removeChild(styleElement);\n}\n/* istanbul ignore next  */\n\n\nfunction domAPI(options) {\n  var styleElement = options.insertStyleElement(options);\n  return {\n    update: function update(obj) {\n      apply(styleElement, options, obj);\n    },\n    remove: function remove() {\n      removeStyleElement(styleElement);\n    }\n  };\n}\n\nmodule.exports = domAPI;\n\n//# sourceURL=webpack://@damienvesper/survivio-counters/./node_modules/.pnpm/style-loader@3.3.1_webpack@5.70.0/node_modules/style-loader/dist/runtime/styleDomAPI.js?");

/***/ }),

/***/ "./node_modules/.pnpm/style-loader@3.3.1_webpack@5.70.0/node_modules/style-loader/dist/runtime/styleTagTransform.js":
/*!**************************************************************************************************************************!*\
  !*** ./node_modules/.pnpm/style-loader@3.3.1_webpack@5.70.0/node_modules/style-loader/dist/runtime/styleTagTransform.js ***!
  \**************************************************************************************************************************/
/***/ ((module) => {

eval("\n\n/* istanbul ignore next  */\nfunction styleTagTransform(css, styleElement) {\n  if (styleElement.styleSheet) {\n    styleElement.styleSheet.cssText = css;\n  } else {\n    while (styleElement.firstChild) {\n      styleElement.removeChild(styleElement.firstChild);\n    }\n\n    styleElement.appendChild(document.createTextNode(css));\n  }\n}\n\nmodule.exports = styleTagTransform;\n\n//# sourceURL=webpack://@damienvesper/survivio-counters/./node_modules/.pnpm/style-loader@3.3.1_webpack@5.70.0/node_modules/style-loader/dist/runtime/styleTagTransform.js?");

/***/ }),

/***/ "./src/Component.ts":
/*!**************************!*\
  !*** ./src/Component.ts ***!
  \**************************/
/***/ ((__unused_webpack_module, exports) => {

eval("\r\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\r\nclass Component {\r\n    constructor() {\r\n        this.destroy = () => {\r\n            this.element.remove();\r\n        };\r\n        this.element = document.createElement(`div`);\r\n    }\r\n}\r\nexports[\"default\"] = Component;\r\n\n\n//# sourceURL=webpack://@damienvesper/survivio-counters/./src/Component.ts?");

/***/ }),

/***/ "./src/Core.ts":
/*!*********************!*\
  !*** ./src/Core.ts ***!
  \*********************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

eval("\r\nvar __importDefault = (this && this.__importDefault) || function (mod) {\r\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\r\n};\r\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\r\n// Counters.\r\nconst FPSCounter_1 = __importDefault(__webpack_require__(/*! ./components/FPSCounter */ \"./src/components/FPSCounter.ts\"));\r\n// import PingCounter from './components/PingCounter';\r\nconst AdrenCounter_1 = __importDefault(__webpack_require__(/*! ./components/AdrenCounter */ \"./src/components/AdrenCounter.ts\"));\r\nconst HealthCounter_1 = __importDefault(__webpack_require__(/*! ./components/HealthCounter */ \"./src/components/HealthCounter.ts\"));\r\n// Utilities.\r\nconst BottomWrapper_1 = __importDefault(__webpack_require__(/*! ./utils/BottomWrapper */ \"./src/utils/BottomWrapper.ts\"));\r\nconst Core = {\r\n    utils: {\r\n        bottomWrapper: new BottomWrapper_1.default() // This needs to be initialized first!\r\n    },\r\n    counters: {\r\n        fps: new FPSCounter_1.default(),\r\n        // ping: new PingCounter(),\r\n        health: new HealthCounter_1.default(),\r\n        adren: new AdrenCounter_1.default()\r\n    }\r\n};\r\nexports[\"default\"] = Core;\r\n\n\n//# sourceURL=webpack://@damienvesper/survivio-counters/./src/Core.ts?");

/***/ }),

/***/ "./src/components/AdrenCounter.ts":
/*!****************************************!*\
  !*** ./src/components/AdrenCounter.ts ***!
  \****************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

eval("\r\nvar __importDefault = (this && this.__importDefault) || function (mod) {\r\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\r\n};\r\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\r\nconst Component_1 = __importDefault(__webpack_require__(/*! ../Component */ \"./src/Component.ts\"));\r\nclass AdrenCounter extends Component_1.default {\r\n    constructor() {\r\n        var _a;\r\n        super();\r\n        /**\r\n         * Calculate current player adrenaline.\r\n         */\r\n        this.calculateAdren = () => {\r\n            let adrenPercentage = 0;\r\n            const boosts = document.querySelectorAll(`.ui-boost-base .ui-bar-inner`);\r\n            boosts.forEach((boost, i) => {\r\n                if (i <= 1)\r\n                    adrenPercentage += parseInt(boost.style.width.slice(0, boost.style.width.length - 1)) / 4;\r\n                else if (i === 2)\r\n                    adrenPercentage += parseInt(boost.style.width.slice(0, boost.style.width.length - 1)) / 2.5;\r\n                else if (i === 3)\r\n                    adrenPercentage += parseInt(boost.style.width.slice(0, boost.style.width.length - 1)) / 10;\r\n            });\r\n            return Math.round(adrenPercentage);\r\n        };\r\n        /**\r\n         * Update the adrenaline counter.\r\n         */\r\n        this.updateAdren = () => {\r\n            const adren = this.calculateAdren();\r\n            this.text.innerHTML = `AD: ${adren}`;\r\n            this.element.style.display = adren === 0 ? `none` : `inline-block`;\r\n        };\r\n        this.text = document.createElement(`span`);\r\n        this.element.id = `sic-adrenWrapper`;\r\n        this.element.classList.add(`sic-box-container`);\r\n        this.element.appendChild(this.text);\r\n        (_a = document.querySelector(`#sic-bottomWrapper`)) === null || _a === void 0 ? void 0 : _a.appendChild(this.element);\r\n    }\r\n}\r\nexports[\"default\"] = AdrenCounter;\r\n\n\n//# sourceURL=webpack://@damienvesper/survivio-counters/./src/components/AdrenCounter.ts?");

/***/ }),

/***/ "./src/components/FPSCounter.ts":
/*!**************************************!*\
  !*** ./src/components/FPSCounter.ts ***!
  \**************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

eval("\r\nvar __importDefault = (this && this.__importDefault) || function (mod) {\r\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\r\n};\r\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\r\nconst Component_1 = __importDefault(__webpack_require__(/*! ../Component */ \"./src/Component.ts\"));\r\nclass FPSCounter extends Component_1.default {\r\n    constructor() {\r\n        var _a;\r\n        super();\r\n        /**\r\n         * Calculate the current FPS.\r\n         * @author Quintec\r\n         */\r\n        this.calculateFPS = () => {\r\n            window.requestAnimationFrame(() => {\r\n                const now = performance.now();\r\n                while (this.frameTimes.length > 0 && this.frameTimes[0] <= now - 1000)\r\n                    this.frameTimes.shift();\r\n                this.frameTimes.push(now);\r\n                this.calculateFPS();\r\n            });\r\n        };\r\n        /**\r\n         * Update the FPS counter.\r\n         */\r\n        this.updateFPS = () => {\r\n            this.text.innerHTML = `${this.frameTimes.length} FPS`;\r\n        };\r\n        this.text = document.createElement(`span`);\r\n        this.frameTimes = [];\r\n        this.element.id = `sic-fpsWrapper`;\r\n        this.element.classList.add(`sic-box-container`);\r\n        this.element.appendChild(this.text);\r\n        (_a = document.querySelector(`#ui-top-left`)) === null || _a === void 0 ? void 0 : _a.appendChild(this.element);\r\n        // Start calculating the FPS.\r\n        this.calculateFPS();\r\n    }\r\n}\r\nexports[\"default\"] = FPSCounter;\r\n\n\n//# sourceURL=webpack://@damienvesper/survivio-counters/./src/components/FPSCounter.ts?");

/***/ }),

/***/ "./src/components/HealthCounter.ts":
/*!*****************************************!*\
  !*** ./src/components/HealthCounter.ts ***!
  \*****************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

eval("\r\nvar __importDefault = (this && this.__importDefault) || function (mod) {\r\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\r\n};\r\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\r\nconst Component_1 = __importDefault(__webpack_require__(/*! ../Component */ \"./src/Component.ts\"));\r\nclass HealthCounter extends Component_1.default {\r\n    constructor() {\r\n        var _a;\r\n        super();\r\n        /**\r\n         * Calculate current player health.\r\n         */\r\n        this.calculateHealth = () => {\r\n            const healthBar = document.querySelector(`#ui-health-actual`);\r\n            return (healthBar != null) ? Math.round(healthBar.clientWidth / 4) : 0;\r\n        };\r\n        /**\r\n         * Update the health counter.\r\n         */\r\n        this.updateHealth = () => {\r\n            const hp = this.calculateHealth();\r\n            this.text.innerHTML = `HP: ${hp}`;\r\n            this.element.style.display = (hp === 0 || hp === 100) ? `none` : `inline-block`;\r\n        };\r\n        this.text = document.createElement(`span`);\r\n        this.element.id = `sic-hpWrapper`;\r\n        this.element.classList.add(`sic-box-container`);\r\n        this.element.appendChild(this.text);\r\n        (_a = document.querySelector(`#sic-bottomWrapper`)) === null || _a === void 0 ? void 0 : _a.appendChild(this.element);\r\n    }\r\n}\r\nexports[\"default\"] = HealthCounter;\r\n\n\n//# sourceURL=webpack://@damienvesper/survivio-counters/./src/components/HealthCounter.ts?");

/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

eval("\r\n// ==UserScript==\r\n// @name         Surviv.io Counters\r\n// @namespace    https://github.com/DamienVesper/SurvivCounters\r\n// @version      2.0.1\r\n// @description  An ingame counter overlay to view connection stats and in-game health stats.\r\n// @author       DamienVesper\r\n// @license      AGPL-3.0\r\n// @match        *://surviv.io/*\r\n// @match        *://surviv2.io/*\r\n// @match        *://2dbattleroyale.com/*\r\n// @match        *://2dbattleroyale.org/*\r\n// @match        *://piearesquared.info/*\r\n// @match        *://thecircleisclosing.com/*\r\n// @match        *://secantsecant.com/*\r\n// @match        *://parmainitiative.com/*\r\n// @match        *://ot38.club/*\r\n// @match        *://drchandlertallow.com/*\r\n// @match        *://rarepotato.com\r\n// @match        *://archimedesofsyracuse.info/*\r\n// @match        *://nevelskoygroup.com/*\r\n// @match        *://kugahi.com/*\r\n// @match        *://kugaheavyindustry.com/*\r\n// @match        *://chandlertallowmd.com/*\r\n// @match        *://c79geyxwmp1zpas3qxbddzrtytffta.ext-twitch.tv/c79geyxwmp1zpas3qxbddzrtytffta/1.0.2/ce940530af57d2615ac39c266fe9679d/*\r\n// ==/UserScript==\r\nvar __importDefault = (this && this.__importDefault) || function (mod) {\r\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\r\n};\r\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\r\n// Import styles.\r\n__webpack_require__(/*! ../assets/scss/common.scss */ \"./assets/scss/common.scss\");\r\nconst Core_1 = __importDefault(__webpack_require__(/*! ./Core */ \"./src/Core.ts\"));\r\nconst init = () => {\r\n    setInterval(Core_1.default.counters.fps.updateFPS, 1e3); // Update FPS every second.\r\n    // setInterval(Core.counters.ping.updatePing, 1e3); // Update ping every second.\r\n    setInterval(Core_1.default.counters.health.updateHealth, 25); // Update health every 25ms.\r\n    setInterval(Core_1.default.counters.adren.updateAdren, 25); // Update adren every 25ms.\r\n};\r\nwindow.onload = () => {\r\n    init();\r\n};\r\n\n\n//# sourceURL=webpack://@damienvesper/survivio-counters/./src/index.ts?");

/***/ }),

/***/ "./src/utils/BottomWrapper.ts":
/*!************************************!*\
  !*** ./src/utils/BottomWrapper.ts ***!
  \************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

eval("\r\nvar __importDefault = (this && this.__importDefault) || function (mod) {\r\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\r\n};\r\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\r\nconst Component_1 = __importDefault(__webpack_require__(/*! ../Component */ \"./src/Component.ts\"));\r\nclass BottomWrapper extends Component_1.default {\r\n    constructor() {\r\n        var _a;\r\n        super();\r\n        this.element.id = `sic-bottomWrapper`;\r\n        (_a = document.querySelector(`#ui-bottom-center-0`)) === null || _a === void 0 ? void 0 : _a.insertBefore(this.element, document.querySelector(`#ui-boost-counter`));\r\n        // Remove the extra bottom margin if an older version of surviv is runnnig.\r\n        if (window.location.hostname === `c79geyxwmp1zpas3qxbddzrtytffta.ext-twitch.tv`)\r\n            this.element.style.marginBottom = `0px`;\r\n    }\r\n}\r\nexports[\"default\"] = BottomWrapper;\r\n\n\n//# sourceURL=webpack://@damienvesper/survivio-counters/./src/utils/BottomWrapper.ts?");

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
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./src/index.ts");
/******/ 	
/******/ })()
;