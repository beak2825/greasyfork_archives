// ==UserScript==
// @name         OneDrive 文件下载直链
// @namespace    http://tampermonkey.net/
// @version      1.2.6
// @description  获得 OneDrive 文件下载直链的 TamperMonkey 插件
// @author       KAAAsS
// @license      MIT
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @match        https://*.sharepoint.com/*
// @match        https://*.sharepoint.cn/*
// @grant        GM_cookie
// @grant        GM_setClipboard
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @require      https://cdn.staticfile.org/vue/2.6.12/vue.min.js
// @require      https://cdn.staticfile.org/element-ui/2.14.1/index.min.js
// @connect      *
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/432415/OneDrive%20%E6%96%87%E4%BB%B6%E4%B8%8B%E8%BD%BD%E7%9B%B4%E9%93%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/432415/OneDrive%20%E6%96%87%E4%BB%B6%E4%B8%8B%E8%BD%BD%E7%9B%B4%E9%93%BE.meta.js
// ==/UserScript==

/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 452:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(645);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__);
// Imports

var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default()(function(i){return i[1]});
// Module
___CSS_LOADER_EXPORT___.push([module.id, "*{padding:0;margin:0}body{font-size:14px}.app .el-tag{height:20px;line-height:20px;border-radius:10px;padding:0 6px}.app-container{background-color:#ffffff;padding:10px}\n", ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ 857:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(645);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__);
// Imports

var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default()(function(i){return i[1]});
// Module
___CSS_LOADER_EXPORT___.push([module.id, "*[data-v-5ef48958]{margin:0;padding:0}\n", ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ 75:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(645);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__);
// Imports

var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default()(function(i){return i[1]});
// Module
___CSS_LOADER_EXPORT___.push([module.id, ".header[data-v-61dd7a3d]{display:flex;align-items:center;padding:10px}.header i[data-v-61dd7a3d]{font-size:20px}.header h3[data-v-61dd7a3d]{margin:0 10px;font-size:20px}\n", ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ 205:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(645);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__);
// Imports

var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default()(function(i){return i[1]});
// Module
___CSS_LOADER_EXPORT___.push([module.id, ".body[data-v-593a5798]{position:fixed;z-index:1999;left:0;top:0;height:100%;width:420px;background-color:#fff;transition:all 0.5s;box-shadow:2px 3px 3px 0 rgba(0,0,0,0.1)}.btn-toggle[data-v-593a5798]{transition:all 0.5s;border-radius:30px 0 0 30px;width:30px;height:60px;background-color:#0078d4;cursor:pointer;position:absolute;right:0;top:50%;transform:translateY(-50%);text-align:center;z-index:2999}.btn-toggle svg[data-v-593a5798]{height:20px;width:20px;position:absolute;right:5px;top:20px;transition:all 0.5s}.body-hide[data-v-593a5798]{left:-420px;box-shadow:2px 3px 3px 0 rgba(0,0,0,0)}.body-hide .btn-toggle[data-v-593a5798]{border-radius:0 30px 30px 0;right:-30px}.body-hide .btn-toggle svg[data-v-593a5798]{transform:rotate(180deg)}\n", ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ 296:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(645);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__);
// Imports

var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default()(function(i){return i[1]});
// Module
___CSS_LOADER_EXPORT___.push([module.id, "\n.app-container[data-v-62c87fde] {\r\n  height: 100%;\n}\n.el-scrollbar[data-v-62c87fde] {\r\n  height: 100%;\n}\n.box .el-scrollbar__wrap[data-v-62c87fde] {\r\n  overflow: scroll;\r\n  width: 110%;\r\n  height: 120%;\n}\n.blank[data-v-62c87fde] {\r\n  height: 100px;\n}\n.sub-container[data-v-62c87fde] {\r\n  margin-top: 20px;\n}\n.sub-title[data-v-62c87fde] {\r\n  margin-bottom: 15px;\n}\n.btn-group-files[data-v-62c87fde] {\r\n  margin-top: 20px;\r\n  margin-bottom: 10px;\n}\r\n", ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ 645:
/***/ ((module) => {



/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
// eslint-disable-next-line func-names
module.exports = function (cssWithMappingToString) {
  var list = []; // return the list of modules as css string

  list.toString = function toString() {
    return this.map(function (item) {
      var content = cssWithMappingToString(item);

      if (item[2]) {
        return "@media ".concat(item[2], " {").concat(content, "}");
      }

      return content;
    }).join("");
  }; // import a list of modules into the list
  // eslint-disable-next-line func-names


  list.i = function (modules, mediaQuery, dedupe) {
    if (typeof modules === "string") {
      // eslint-disable-next-line no-param-reassign
      modules = [[null, modules, ""]];
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

/***/ }),

/***/ 379:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



var isOldIE = function isOldIE() {
  var memo;
  return function memorize() {
    if (typeof memo === 'undefined') {
      // Test for IE <= 9 as proposed by Browserhacks
      // @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
      // Tests for existence of standard globals is to allow style-loader
      // to operate correctly into non-standard environments
      // @see https://github.com/webpack-contrib/style-loader/issues/177
      memo = Boolean(window && document && document.all && !window.atob);
    }

    return memo;
  };
}();

var getTarget = function getTarget() {
  var memo = {};
  return function memorize(target) {
    if (typeof memo[target] === 'undefined') {
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
  };
}();

var stylesInDom = [];

function getIndexByIdentifier(identifier) {
  var result = -1;

  for (var i = 0; i < stylesInDom.length; i++) {
    if (stylesInDom[i].identifier === identifier) {
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
    var index = getIndexByIdentifier(identifier);
    var obj = {
      css: item[1],
      media: item[2],
      sourceMap: item[3]
    };

    if (index !== -1) {
      stylesInDom[index].references++;
      stylesInDom[index].updater(obj);
    } else {
      stylesInDom.push({
        identifier: identifier,
        updater: addStyle(obj, options),
        references: 1
      });
    }

    identifiers.push(identifier);
  }

  return identifiers;
}

function insertStyleElement(options) {
  var style = document.createElement('style');
  var attributes = options.attributes || {};

  if (typeof attributes.nonce === 'undefined') {
    var nonce =  true ? __webpack_require__.nc : 0;

    if (nonce) {
      attributes.nonce = nonce;
    }
  }

  Object.keys(attributes).forEach(function (key) {
    style.setAttribute(key, attributes[key]);
  });

  if (typeof options.insert === 'function') {
    options.insert(style);
  } else {
    var target = getTarget(options.insert || 'head');

    if (!target) {
      throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");
    }

    target.appendChild(style);
  }

  return style;
}

function removeStyleElement(style) {
  // istanbul ignore if
  if (style.parentNode === null) {
    return false;
  }

  style.parentNode.removeChild(style);
}
/* istanbul ignore next  */


var replaceText = function replaceText() {
  var textStore = [];
  return function replace(index, replacement) {
    textStore[index] = replacement;
    return textStore.filter(Boolean).join('\n');
  };
}();

function applyToSingletonTag(style, index, remove, obj) {
  var css = remove ? '' : obj.media ? "@media ".concat(obj.media, " {").concat(obj.css, "}") : obj.css; // For old IE

  /* istanbul ignore if  */

  if (style.styleSheet) {
    style.styleSheet.cssText = replaceText(index, css);
  } else {
    var cssNode = document.createTextNode(css);
    var childNodes = style.childNodes;

    if (childNodes[index]) {
      style.removeChild(childNodes[index]);
    }

    if (childNodes.length) {
      style.insertBefore(cssNode, childNodes[index]);
    } else {
      style.appendChild(cssNode);
    }
  }
}

function applyToTag(style, options, obj) {
  var css = obj.css;
  var media = obj.media;
  var sourceMap = obj.sourceMap;

  if (media) {
    style.setAttribute('media', media);
  } else {
    style.removeAttribute('media');
  }

  if (sourceMap && typeof btoa !== 'undefined') {
    css += "\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))), " */");
  } // For old IE

  /* istanbul ignore if  */


  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    while (style.firstChild) {
      style.removeChild(style.firstChild);
    }

    style.appendChild(document.createTextNode(css));
  }
}

var singleton = null;
var singletonCounter = 0;

function addStyle(obj, options) {
  var style;
  var update;
  var remove;

  if (options.singleton) {
    var styleIndex = singletonCounter++;
    style = singleton || (singleton = insertStyleElement(options));
    update = applyToSingletonTag.bind(null, style, styleIndex, false);
    remove = applyToSingletonTag.bind(null, style, styleIndex, true);
  } else {
    style = insertStyleElement(options);
    update = applyToTag.bind(null, style, options);

    remove = function remove() {
      removeStyleElement(style);
    };
  }

  update(obj);
  return function updateStyle(newObj) {
    if (newObj) {
      if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap) {
        return;
      }

      update(obj = newObj);
    } else {
      remove();
    }
  };
}

module.exports = function (list, options) {
  options = options || {}; // Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
  // tags it will allow on a page

  if (!options.singleton && typeof options.singleton !== 'boolean') {
    options.singleton = isOldIE();
  }

  list = list || [];
  var lastIdentifiers = modulesToDom(list, options);
  return function update(newList) {
    newList = newList || [];

    if (Object.prototype.toString.call(newList) !== '[object Array]') {
      return;
    }

    for (var i = 0; i < lastIdentifiers.length; i++) {
      var identifier = lastIdentifiers[i];
      var index = getIndexByIdentifier(identifier);
      stylesInDom[index].references--;
    }

    var newLastIdentifiers = modulesToDom(newList, options);

    for (var _i = 0; _i < lastIdentifiers.length; _i++) {
      var _identifier = lastIdentifiers[_i];

      var _index = getIndexByIdentifier(_identifier);

      if (stylesInDom[_index].references === 0) {
        stylesInDom[_index].updater();

        stylesInDom.splice(_index, 1);
      }
    }

    lastIdentifiers = newLastIdentifiers;
  };
};

/***/ }),

/***/ 223:
/***/ ((module) => {

module.exports = element-ui;

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
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {

;// CONCATENATED MODULE: external "Vue"
const external_Vue_namespaceObject = Vue;
var external_Vue_default = /*#__PURE__*/__webpack_require__.n(external_Vue_namespaceObject);
;// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/app.vue?vue&type=template&id=5ef48958&scoped=true&
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", { staticClass: "app" }, [_c("PluginDrawer")], 1)
}
var staticRenderFns = []
render._withStripped = true


;// CONCATENATED MODULE: ./src/app.vue?vue&type=template&id=5ef48958&scoped=true&

;// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/PluginDrawer.vue?vue&type=template&id=593a5798&scoped=true&
var PluginDrawervue_type_template_id_593a5798_scoped_true_render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    [
      _c(
        "div",
        { staticClass: "body", class: { "body-hide": _vm.isHide } },
        [
          _c("Header"),
          _vm._v(" "),
          _c("PluginPanel", {
            ref: "panel",
            on: { onOpenAriaDialog: _vm.handleOpenAriaDialog }
          }),
          _vm._v(" "),
          _c(
            "div",
            { staticClass: "btn-toggle", on: { click: _vm.hide } },
            [_c("ArrowIcon")],
            1
          )
        ],
        1
      ),
      _vm._v(" "),
      _c("AriaConfigDialog", { ref: "ariaDialog" })
    ],
    1
  )
}
var PluginDrawervue_type_template_id_593a5798_scoped_true_staticRenderFns = []
PluginDrawervue_type_template_id_593a5798_scoped_true_render._withStripped = true


;// CONCATENATED MODULE: ./src/components/PluginDrawer.vue?vue&type=template&id=593a5798&scoped=true&

;// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/Header.vue?vue&type=template&id=61dd7a3d&scoped=true&
var Headervue_type_template_id_61dd7a3d_scoped_true_render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    { staticClass: "header" },
    [
      _c("i", { staticClass: "el-icon-link" }),
      _vm._v(" "),
      _c("h3", [_vm._v(_vm._s(_vm.AppName))]),
      _vm._v(" "),
      _c("el-tag", [_vm._v("v" + _vm._s(_vm.AppVersion))])
    ],
    1
  )
}
var Headervue_type_template_id_61dd7a3d_scoped_true_staticRenderFns = []
Headervue_type_template_id_61dd7a3d_scoped_true_render._withStripped = true


;// CONCATENATED MODULE: ./src/components/Header.vue?vue&type=template&id=61dd7a3d&scoped=true&

;// CONCATENATED MODULE: ./src/config/index.js
const AppName = "OneDrive 文件下载直链"
const AppVersion = "1.2.6"
const AppEnv = "production"
const isDev = AppEnv === 'development'


;// CONCATENATED MODULE: ./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/Header.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//



/* harmony default export */ const Headervue_type_script_lang_js_ = ({
  name: 'Header',
  data() {
    return {
      AppName: AppName,
      AppVersion: AppVersion,
    }
  }
});

;// CONCATENATED MODULE: ./src/components/Header.vue?vue&type=script&lang=js&
 /* harmony default export */ const components_Headervue_type_script_lang_js_ = (Headervue_type_script_lang_js_); 
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js
var injectStylesIntoStyleTag = __webpack_require__(379);
var injectStylesIntoStyleTag_default = /*#__PURE__*/__webpack_require__.n(injectStylesIntoStyleTag);
// EXTERNAL MODULE: ./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/sass-loader/dist/cjs.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/Header.vue?vue&type=style&index=0&id=61dd7a3d&lang=scss&scoped=true&
var Headervue_type_style_index_0_id_61dd7a3d_lang_scss_scoped_true_ = __webpack_require__(75);
;// CONCATENATED MODULE: ./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/sass-loader/dist/cjs.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/Header.vue?vue&type=style&index=0&id=61dd7a3d&lang=scss&scoped=true&

            

var options = {};

options.insert = "head";
options.singleton = false;

var update = injectStylesIntoStyleTag_default()(Headervue_type_style_index_0_id_61dd7a3d_lang_scss_scoped_true_/* default */.Z, options);



/* harmony default export */ const components_Headervue_type_style_index_0_id_61dd7a3d_lang_scss_scoped_true_ = (Headervue_type_style_index_0_id_61dd7a3d_lang_scss_scoped_true_/* default.locals */.Z.locals || {});
;// CONCATENATED MODULE: ./src/components/Header.vue?vue&type=style&index=0&id=61dd7a3d&lang=scss&scoped=true&

;// CONCATENATED MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
/* globals __VUE_SSR_CONTEXT__ */

// IMPORTANT: Do NOT use ES2015 features in this file (except for modules).
// This module is a runtime utility for cleaner component module output and will
// be included in the final webpack user bundle.

function normalizeComponent (
  scriptExports,
  render,
  staticRenderFns,
  functionalTemplate,
  injectStyles,
  scopeId,
  moduleIdentifier, /* server only */
  shadowMode /* vue-cli only */
) {
  // Vue.extend constructor export interop
  var options = typeof scriptExports === 'function'
    ? scriptExports.options
    : scriptExports

  // render functions
  if (render) {
    options.render = render
    options.staticRenderFns = staticRenderFns
    options._compiled = true
  }

  // functional template
  if (functionalTemplate) {
    options.functional = true
  }

  // scopedId
  if (scopeId) {
    options._scopeId = 'data-v-' + scopeId
  }

  var hook
  if (moduleIdentifier) { // server build
    hook = function (context) {
      // 2.3 injection
      context =
        context || // cached call
        (this.$vnode && this.$vnode.ssrContext) || // stateful
        (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext) // functional
      // 2.2 with runInNewContext: true
      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__
      }
      // inject component styles
      if (injectStyles) {
        injectStyles.call(this, context)
      }
      // register component module identifier for async chunk inferrence
      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier)
      }
    }
    // used by ssr in case component is cached and beforeCreate
    // never gets called
    options._ssrRegister = hook
  } else if (injectStyles) {
    hook = shadowMode
      ? function () {
        injectStyles.call(
          this,
          (options.functional ? this.parent : this).$root.$options.shadowRoot
        )
      }
      : injectStyles
  }

  if (hook) {
    if (options.functional) {
      // for template-only hot-reload because in that case the render fn doesn't
      // go through the normalizer
      options._injectStyles = hook
      // register for functional component in vue file
      var originalRender = options.render
      options.render = function renderWithStyleInjection (h, context) {
        hook.call(context)
        return originalRender(h, context)
      }
    } else {
      // inject component registration as beforeCreate hook
      var existing = options.beforeCreate
      options.beforeCreate = existing
        ? [].concat(existing, hook)
        : [hook]
    }
  }

  return {
    exports: scriptExports,
    options: options
  }
}

;// CONCATENATED MODULE: ./src/components/Header.vue



;


/* normalize component */

var component = normalizeComponent(
  components_Headervue_type_script_lang_js_,
  Headervue_type_template_id_61dd7a3d_scoped_true_render,
  Headervue_type_template_id_61dd7a3d_scoped_true_staticRenderFns,
  false,
  null,
  "61dd7a3d",
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "src/components/Header.vue"
/* harmony default export */ const Header = (component.exports);
;// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/icons/ArrowIcon.vue?vue&type=template&id=41f57a04&scoped=true&
var ArrowIconvue_type_template_id_41f57a04_scoped_true_render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "svg",
    {
      staticClass: "icon",
      attrs: {
        t: "1589962875590",
        viewBox: "0 0 1024 1024",
        version: "1.1",
        xmlns: "http://www.w3.org/2000/svg",
        "p-id": "2601"
      }
    },
    [
      _c("path", {
        attrs: {
          d:
            "M730.020653 1018.946715l91.277028-89.978692a16.760351 16.760351 0 0 0 5.114661-11.803064 15.343983 15.343983 0 0 0-5.114661-11.803064l-400.123871-393.435467L821.691117 118.254899a17.075099 17.075099 0 0 0 0-23.606129L730.020653 4.670079a17.232473 17.232473 0 0 0-23.999564 0L202.030255 500.08402a16.445603 16.445603 0 0 0-4.721226 11.803064 15.265296 15.265296 0 0 0 5.114661 11.803064l503.597399 495.413941a17.153786 17.153786 0 0 0 23.999564 0z m0 0",
          fill: "#FFFFFF",
          "p-id": "2602"
        }
      })
    ]
  )
}
var ArrowIconvue_type_template_id_41f57a04_scoped_true_staticRenderFns = []
ArrowIconvue_type_template_id_41f57a04_scoped_true_render._withStripped = true


;// CONCATENATED MODULE: ./src/icons/ArrowIcon.vue?vue&type=template&id=41f57a04&scoped=true&

;// CONCATENATED MODULE: ./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/icons/ArrowIcon.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ const ArrowIconvue_type_script_lang_js_ = ({
  name: "ArrowIcon"
});

;// CONCATENATED MODULE: ./src/icons/ArrowIcon.vue?vue&type=script&lang=js&
 /* harmony default export */ const icons_ArrowIconvue_type_script_lang_js_ = (ArrowIconvue_type_script_lang_js_); 
;// CONCATENATED MODULE: ./src/icons/ArrowIcon.vue





/* normalize component */
;
var ArrowIcon_component = normalizeComponent(
  icons_ArrowIconvue_type_script_lang_js_,
  ArrowIconvue_type_template_id_41f57a04_scoped_true_render,
  ArrowIconvue_type_template_id_41f57a04_scoped_true_staticRenderFns,
  false,
  null,
  "41f57a04",
  null
  
)

/* hot reload */
if (false) { var ArrowIcon_api; }
ArrowIcon_component.options.__file = "src/icons/ArrowIcon.vue"
/* harmony default export */ const ArrowIcon = (ArrowIcon_component.exports);
;// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/PluginPanel.vue?vue&type=template&id=62c87fde&scoped=true&
var PluginPanelvue_type_template_id_62c87fde_scoped_true_render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    { staticClass: "app-container" },
    [
      _c("el-scrollbar", [
        _c(
          "div",
          { staticClass: "sub-container" },
          [
            _c(
              "div",
              { staticClass: "btn-group-files" },
              [
                this.cookie !== ""
                  ? _c(
                      "el-button",
                      {
                        attrs: { type: "primary", size: "mini" },
                        on: {
                          click: function($event) {
                            return _vm.handleIdm()
                          }
                        }
                      },
                      [_vm._v("IDM 下载\n        ")]
                    )
                  : _vm._e(),
                _vm._v(" "),
                this.cookie !== ""
                  ? _c(
                      "el-button",
                      {
                        attrs: { type: "primary", size: "mini" },
                        on: {
                          click: function($event) {
                            return _vm.handleAria()
                          }
                        }
                      },
                      [_vm._v("Aria 下载\n        ")]
                    )
                  : _vm._e(),
                _vm._v(" "),
                _c(
                  "el-button",
                  {
                    attrs: { size: "mini" },
                    on: {
                      click: function($event) {
                        return _vm.handleCopyFile()
                      }
                    }
                  },
                  [_vm._v("复制链接")]
                ),
                _vm._v(" "),
                _c(
                  "el-tooltip",
                  {
                    staticClass: "item",
                    attrs: {
                      effect: "dark",
                      content: "不太好用，建议优先使用 IDM 或 Aria 推送",
                      placement: "top-start"
                    }
                  },
                  [
                    _c(
                      "el-button",
                      {
                        attrs: { size: "mini" },
                        on: {
                          click: function($event) {
                            return _vm.handleBatchDownload()
                          }
                        }
                      },
                      [_vm._v("批量下载")]
                    )
                  ],
                  1
                )
              ],
              1
            ),
            _vm._v(" "),
            _c(
              "el-table",
              {
                ref: "filesTable",
                staticStyle: { width: "100%" },
                attrs: { data: _vm.fileList, "tooltip-effect": "dark" },
                on: { "selection-change": _vm.handleSelectionChange }
              },
              [
                _c("el-table-column", {
                  attrs: { type: "selection", width: "55" }
                }),
                _vm._v(" "),
                _c("el-table-column", {
                  attrs: { prop: "filename", label: "文件名" }
                }),
                _vm._v(" "),
                _c("el-table-column", {
                  attrs: { label: "操作" },
                  scopedSlots: _vm._u([
                    {
                      key: "default",
                      fn: function(scope) {
                        return [
                          _c(
                            "el-button",
                            {
                              attrs: { type: "primary", size: "mini" },
                              on: {
                                click: function($event) {
                                  return _vm.handleDownload(
                                    scope.row.directLink
                                  )
                                }
                              }
                            },
                            [_vm._v("下载\n            ")]
                          ),
                          _vm._v(" "),
                          _c(
                            "el-button",
                            {
                              attrs: { size: "mini" },
                              on: {
                                click: function($event) {
                                  return _vm.handleCopyLink(
                                    scope.row.directLink
                                  )
                                }
                              }
                            },
                            [_vm._v("复制链接\n            ")]
                          )
                        ]
                      }
                    }
                  ])
                })
              ],
              1
            )
          ],
          1
        ),
        _vm._v(" "),
        _c("div", { staticClass: "sub-container" }, [
          _c("h3", { staticClass: "sub-title" }, [_vm._v("Cookie 信息")]),
          _vm._v(" "),
          this.cookie === ""
            ? _c(
                "div",
                { staticClass: "not-tampermonkey-beta" },
                [
                  _c("el-alert", {
                    attrs: {
                      title: "无法获得 Cookie 信息",
                      type: "info",
                      description:
                        "由于您没有使用 Tampermonkey Beta，因此无法自动获得 Cookie。请在“开发者选项-Application-Cookie”中，\n          复制 FedAuth 对应的值。然后在 AriaNG 的“自定义请求头”填写：Cookie: FedAuth=复制的值",
                      "show-icon": "",
                      closable: false
                    }
                  })
                ],
                1
              )
            : _vm._e(),
          _vm._v(" "),
          this.cookie !== ""
            ? _c(
                "div",
                { staticClass: "tampermonkey-beta" },
                [
                  _c("el-alert", {
                    staticStyle: { "margin-bottom": "15px" },
                    attrs: {
                      title: "Cookie 信息",
                      type: "success",
                      description: "下载时在 AriaNG 的“自定义请求头”填写",
                      "show-icon": "",
                      closable: false
                    }
                  }),
                  _vm._v(" "),
                  _c("el-input", {
                    attrs: { type: "textarea", rows: 3, placeholder: "Cookie" },
                    model: {
                      value: _vm.cookie,
                      callback: function($$v) {
                        _vm.cookie = $$v
                      },
                      expression: "cookie"
                    }
                  }),
                  _vm._v(" "),
                  _c(
                    "div",
                    { staticClass: "btn-group-files" },
                    [
                      _c(
                        "el-button",
                        {
                          attrs: { type: "primary" },
                          on: {
                            click: function($event) {
                              return _vm.handleCopyCookie()
                            }
                          }
                        },
                        [_vm._v("复制")]
                      )
                    ],
                    1
                  )
                ],
                1
              )
            : _vm._e()
        ]),
        _vm._v(" "),
        _c("div", { staticClass: "sub-container" }, [
          _c("h3", { staticClass: "sub-title" }, [_vm._v("设置")]),
          _vm._v(" "),
          _c(
            "div",
            { staticClass: "btn-group-files" },
            [
              _c(
                "el-button",
                {
                  on: {
                    click: function($event) {
                      return _vm.handleConfigAria()
                    }
                  }
                },
                [_vm._v("配置 Aria RPC")]
              )
            ],
            1
          )
        ]),
        _vm._v(" "),
        _c("div", { staticClass: "blank" })
      ])
    ],
    1
  )
}
var PluginPanelvue_type_template_id_62c87fde_scoped_true_staticRenderFns = []
PluginPanelvue_type_template_id_62c87fde_scoped_true_render._withStripped = true


;// CONCATENATED MODULE: ./src/components/PluginPanel.vue?vue&type=template&id=62c87fde&scoped=true&

;// CONCATENATED MODULE: ./src/logic/mock.js
/**
 * 获得文件列表
 * @param allowCache 是否允许缓存
 * @returns {Promise<(boolean|*[])[]|boolean[]>} [是否新数据, 数据]
 */
const getFileList = async (allowCache) => {
    let ret = [];
    for (let i = 0; i < 20; i++) {
        ret.push({
            filename: '文件名1.rar',
            directLink: 'https://aaaaaaaaaaaaaaaaaaaa.bbb/ccccc.ddddd?eeeeeeeeeee'
        })
    }
    return [true, ret];
};

/**
 * 获得 Cookie Mock
 * @returns {Promise<unknown>}
 */
const getCookie = async () => {
    return "Cookie: FedAuth=";
};

/**
 * 复制到剪切板
 * @returns {Promise<boolean>}
 */
const setClipboard = async () => {
    return true;
}

/**
 * 取得 Aria 配置
 * @returns {{downloadPath: string, apiBase: string, token: string}|null}
 */
const getAriaConfig = () => {
    if (!window._aria_config) {
        return null;
    }
    return window._aria_config;
};

/**
 * 设置 Aria 配置
 * @param conf
 */
const setAriaConfig = (conf) => {
    console.log('设置新的 Aria 配置：', JSON.stringify(conf));
    window._aria_config = conf;
};

/* harmony default export */ const mock = ({
    getFileList,
    getCookie,
    setClipboard,
    getAriaConfig,
    setAriaConfig
});
;// CONCATENATED MODULE: ./src/logic/actual.js
let cachedUrl = null,
    cachedFileList = null;

/**
 * 获得文件列表
 * @param allowCache 是否允许缓存
 * @returns {Promise<(boolean|*[])[]|boolean[]>} [是否新数据, 数据]
 */
const actual_getFileList = async (allowCache) => {
    let fileList = [];

    // 解析路径参数
    let url = document.location;
    let host = url.host;
    let param = new URLSearchParams(url.search);
    let loc = param.get('id');

    // 检查 Cache
    if (allowCache) {
        if (url.search === cachedUrl) {
            console.log("从缓存中解析：", cachedUrl);
            return [false, cachedFileList];
        }
    }

    // 请求文件列表
    let response = await fetch(`https://${host}${loc}`, {
        method: 'PROPFIND',
        credentials: 'include'
    });
    if (!response.ok) {
        // 失败
        if (response.status !== 404) {
            throw new Error(`无法解析OneDrive文件列表: ${response.status}`);
        }
        // 获取单文件信息
        let directLink = encodeURI(`https://${host}${loc}`);
        let parts = loc.split('/');
        let filename = parts[parts.length - 1];
        // 单个文件
        fileList.push({filename, directLink});
    } else {
        // 成功：多个文件
        // 解析返回
        let xmlRaw = await response.text();
        let parser = new DOMParser();
        let xmlDoc = parser.parseFromString(xmlRaw, "text/xml");
        let fileEls = xmlDoc.getElementsByTagName('D:response');
        for (const el of fileEls) {
            let isFolderEl = el.getElementsByTagName('D:isFolder');
            // 当前不支持递归查找，所以跳过文件夹
            if (isFolderEl.length >= 1 && isFolderEl[0].textContent === 't') {
                continue;
            }
            // 获得文件 URL
            let hrefEl = el.getElementsByTagName('D:href');
            let directLink = "";
            if (hrefEl.length >= 1) {
                // Sharepoint 返回中包含 Unicode 字符，需要转义
                directLink = encodeURI(hrefEl[0].textContent);
                directLink = directLink.replaceAll('%25', '%');
            }
            // 获得文件名
            let nameEl = el.getElementsByTagName('D:displayname');
            let filename = "";
            if (nameEl.length >= 1) {
                filename = nameEl[0].textContent;
            }
            // 拼接结果
            fileList.push({filename, directLink});
        }
    }

    // 缓存
    cachedUrl = url.search;
    cachedFileList = fileList;
    return [true, fileList];
};

/**
 * 获得 Cookie 信息
 * @returns {Promise<unknown>}
 */
const getCookieNative = (param) => {
    return new Promise(function (resolve, reject) {
        GM_cookie.list(param, (cookie, error) => {
            if (error) {
                reject(error);
                return;
            }
            console.log(cookie);
            if (cookie.length > 0) {
                resolve(cookie[0].value);
            } else {
                resolve(null);
            }
        });
    });
};

/**
 * 获得 Cookie
 * @returns {Promise<unknown>}
 */
const actual_getCookie = async () => {
    let host = document.location.host;
    const cookieKeys = [
        {name: 'FedAuth', domain: host}, // 防止多站点之间 Cookie 混淆
        {name: 'CCSInfo', domain: '.sharepoint.com'}, // 海外版
        {name: 'rtFa', domain: '.sharepoint.com'},
        {name: 'CCSInfo', domain: '.sharepoint.cn'}, // 世纪互联
        {name: 'rtFa', domain: '.sharepoint.cn'},
    ];
    let cookies = await Promise.all(cookieKeys.map(getCookieNative));
    let cookie = 'cookie: ';
    cookieKeys.forEach((param, idx) => {
        let value = cookies[idx];
        if (value) {
            cookie += `${param.name}=${value}; `;
        }
    });
    console.log("获得 Cookie：", cookies);
    return cookie;
};

/**
 * 复制到剪切板
 * @returns {Promise<boolean>}
 */
const actual_setClipboard = (val) => {
    return new Promise(function (resolve) {
        GM_setClipboard(val, "text");
        resolve(true);
    });
}

const KEY_ARIA_CONF = "aria_conf";

/**
 * 取得 Aria 配置
 * @returns {{downloadPath: string, apiBase: string, token: string}}
 */
const actual_getAriaConfig = () => {
    let json = GM_getValue(KEY_ARIA_CONF, "null");
    return JSON.parse(json);
};

/**
 * 设置 Aria 配置
 * @param conf
 */
const actual_setAriaConfig = (conf) => {
    GM_setValue(KEY_ARIA_CONF, JSON.stringify(conf));
};

/* harmony default export */ const actual = ({
    getFileList: actual_getFileList,
    getCookie: actual_getCookie,
    setClipboard: actual_setClipboard,
    getAriaConfig: actual_getAriaConfig,
    setAriaConfig: actual_setAriaConfig
});

;// CONCATENATED MODULE: ./src/logic/index.js




let selected = actual;
// 开发环境启用 Mock
if (isDev) {
    selected = mock;
}

// 函数
const logic_getFileList = selected.getFileList;
const logic_getCookie = selected.getCookie;
const logic_setClipboard = selected.setClipboard;

/**
 * 构造 IDM 下载列表
 * @param fileLists
 * @param cookie
 * @returns {string}
 */
const buildEf2File = (fileLists, cookie) => {
    return fileLists
        .map(link => `<\r\n${link}\r\n${cookie}\r\n>`)
        .join("\r\n") + "\r\n\r\n";
};

const logic_getAriaConfig = selected.getAriaConfig;
const logic_setAriaConfig = selected.setAriaConfig;

/**
 * 发送 Aria RPC 下载请求
 * @param fileLists
 * @param cookie
 */
const sendAriaRequest = async (fileLists, cookie) => {
    const conf = logic_getAriaConfig();
    if (!conf) {
        return "no_config";
    }
    // 构造 RPC Payload
    let params = {header: [cookie]};
    if (conf.downloadPath.length > 0) {
        params.dir = conf.downloadPath;
    }
    // 发送
    const downloadSingle = async (link) => {
        let payload = {
            jsonrpc: "2.0",
            method: "aria2.addUri",
            id: "sharepoint-list-plugin",
            params: [
                `token:${conf.token}`,
                [link],
                params
            ]
        };
        console.log("发送 Aria RPC：", conf.apiBase, JSON.stringify(payload));
        if (isDev) {
            let headers = new Headers();
            headers.append('Content-Type', 'application/json;charset=UTF-8');
            let response = await fetch(conf.apiBase, {
                method: 'POST',
                body: JSON.stringify(payload),
                headers
            });
            if (!response.ok) {
                throw new Error(response.statusText);
            }
            return await response.json();
        } else {
            // 由于 Mixed-Content，所以只能用 GM_xmlhttpRequest 请求
            return await new Promise(function (resolve, reject) {
                GM_xmlhttpRequest({
                    method: 'POST',
                    responseType: 'json',
                    url: conf.apiBase,
                    data: JSON.stringify(payload),
                    timeout: 3000,
                    onload(res) {
                        if (res.status === 200) {
                            if (res.response.result) {
                                // 正常返回
                                resolve(res.response);
                            } else {
                                // 其它错误
                                reject(`下载错误！${res.response.message}`);
                            }
                        } else {
                            reject(`创建任务失败！${res.responseText}`);
                            console.error("创建任务失败！", res);
                        }
                    },
                    ontimeout(res) {
                        reject("连接超时！");
                        console.error("连接超时！", res);
                    },
                    onerror(res) {
                        reject("无法发送 Aria 下载请求！请尝试添加服务器路径到用户域名白名单。");
                        console.error("无法发送 Aria 下载请求！", res);
                    }
                });
            });
        }
    };
    return Promise.all(fileLists.map(downloadSingle));
};

;// CONCATENATED MODULE: ./src/utils/index.js
/**
 * 加载样式
 * @param {String} url
 */
const loadStyle = (url) => {
    const head = document.getElementsByTagName('head')[0];
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = url;
    link.media = 'all';
    head.appendChild(link);
}

/**
 * 触发文本文件下载
 * @param content
 * @param filename
 */
const downloadClob = (content, filename) => {
    let elDownload = document.createElement('a');
    elDownload.download = filename;
    elDownload.style.display = 'none';
    let blob = new Blob([content]);
    elDownload.href = URL.createObjectURL(blob);
    document.body.appendChild(elDownload);
    elDownload.click();
    document.body.removeChild(elDownload);
};
;// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/AriaConfigDialog.vue?vue&type=template&id=93e08cfa&scoped=true&
var AriaConfigDialogvue_type_template_id_93e08cfa_scoped_true_render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "el-dialog",
    {
      attrs: { title: "配置 Aria RPC", visible: _vm.visible },
      on: {
        "update:visible": function($event) {
          _vm.visible = $event
        }
      }
    },
    [
      _c(
        "el-form",
        { attrs: { model: _vm.form } },
        [
          _c(
            "el-form-item",
            { attrs: { label: "Aria RPC 地址" } },
            [
              _c("el-input", {
                attrs: { autocomplete: "off" },
                model: {
                  value: _vm.form.apiBase,
                  callback: function($$v) {
                    _vm.$set(_vm.form, "apiBase", $$v)
                  },
                  expression: "form.apiBase"
                }
              })
            ],
            1
          ),
          _vm._v(" "),
          _c(
            "el-form-item",
            { attrs: { label: "Aria RPC Token" } },
            [
              _c("el-input", {
                attrs: { autocomplete: "off" },
                model: {
                  value: _vm.form.token,
                  callback: function($$v) {
                    _vm.$set(_vm.form, "token", $$v)
                  },
                  expression: "form.token"
                }
              })
            ],
            1
          ),
          _vm._v(" "),
          _c(
            "el-form-item",
            { attrs: { label: "下载位置" } },
            [
              _c("el-input", {
                attrs: { autocomplete: "off" },
                model: {
                  value: _vm.form.downloadPath,
                  callback: function($$v) {
                    _vm.$set(_vm.form, "downloadPath", $$v)
                  },
                  expression: "form.downloadPath"
                }
              })
            ],
            1
          )
        ],
        1
      ),
      _vm._v(" "),
      _c(
        "div",
        {
          staticClass: "dialog-footer",
          attrs: { slot: "footer" },
          slot: "footer"
        },
        [
          _c(
            "el-button",
            {
              on: {
                click: function($event) {
                  _vm.visible = false
                }
              }
            },
            [_vm._v("取 消")]
          ),
          _vm._v(" "),
          _c(
            "el-button",
            {
              attrs: { type: "primary" },
              on: {
                click: function($event) {
                  return _vm.handleConfirm()
                }
              }
            },
            [_vm._v("确 定")]
          )
        ],
        1
      )
    ],
    1
  )
}
var AriaConfigDialogvue_type_template_id_93e08cfa_scoped_true_staticRenderFns = []
AriaConfigDialogvue_type_template_id_93e08cfa_scoped_true_render._withStripped = true


;// CONCATENATED MODULE: ./src/components/AriaConfigDialog.vue?vue&type=template&id=93e08cfa&scoped=true&

;// CONCATENATED MODULE: ./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/AriaConfigDialog.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//



/* harmony default export */ const AriaConfigDialogvue_type_script_lang_js_ = ({
  name: "AriaConfigDialog",
  data() {
    return {
      visible: false,
      form: {
        apiBase: '',
        token: '',
        downloadPath: '',
      },
    };
  },
  mounted() {
    let conf = logic_getAriaConfig();
    if (conf != null) {
      this.form = conf;
    }
  },
  methods: {
    open() {
      this.visible = true;
    },
    handleConfirm() {
      // 关闭对话框
      this.visible = false;
      logic_setAriaConfig(this.form);
      this.$message.success("设置成功！");
    }
  }
});

;// CONCATENATED MODULE: ./src/components/AriaConfigDialog.vue?vue&type=script&lang=js&
 /* harmony default export */ const components_AriaConfigDialogvue_type_script_lang_js_ = (AriaConfigDialogvue_type_script_lang_js_); 
;// CONCATENATED MODULE: ./src/components/AriaConfigDialog.vue





/* normalize component */
;
var AriaConfigDialog_component = normalizeComponent(
  components_AriaConfigDialogvue_type_script_lang_js_,
  AriaConfigDialogvue_type_template_id_93e08cfa_scoped_true_render,
  AriaConfigDialogvue_type_template_id_93e08cfa_scoped_true_staticRenderFns,
  false,
  null,
  "93e08cfa",
  null
  
)

/* hot reload */
if (false) { var AriaConfigDialog_api; }
AriaConfigDialog_component.options.__file = "src/components/AriaConfigDialog.vue"
/* harmony default export */ const AriaConfigDialog = (AriaConfigDialog_component.exports);
;// CONCATENATED MODULE: ./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/PluginPanel.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//





/* harmony default export */ const PluginPanelvue_type_script_lang_js_ = ({
  name: "PluginPanel",
  components: {AriaConfigDialog: AriaConfigDialog},
  data() {
    return {
      fileList: null,
      cookie: null,
      multipleSelection: [],
    }
  },

  mounted() {
    this.loadFileList(true);
    this.loadCookie();
  },

  methods: {
    loadFileList(silent) {
      logic_getFileList(true).then(data => {
        const [isNew, fileList] = data;
        this.fileList = fileList;
        // 全选
        if (isNew) {
          this.$nextTick(() => {
            this.$refs.filesTable.clearSelection();
            this.$refs.filesTable.toggleAllSelection();
          });
        }
      }).catch(e => {
        console.log("无法读取文件列表", e);
        if (!silent) {
          this.$message.error(`读取文件列表失败！${e}`);
        }
      })
    },
    loadCookie() {
      logic_getCookie().then(data => {
        this.cookie = data;
      }).catch(e => {
        console.log("无法读取 Cookie", e);
        this.cookie = "";
      })
    },
    getSelectedLinks() {
      return this.multipleSelection.map(obj => obj.directLink);
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleCopyFile() {
      let links = this.getSelectedLinks();
      if (links.length < 1) {
        this.$message.error("请选择要下载的文件！");
        return;
      }
      logic_setClipboard(links.join("\n")).then(() => {
        this.$message.success("复制成功！");
      });
    },
    handleCopyCookie() {
      logic_setClipboard(this.cookie).then(() => {
        this.$message.success("复制成功！");
      });
    },
    handleDownload(url) {
      window.open(url, "_blank");
    },
    handleCopyLink(url) {
      logic_setClipboard(url).then(() => {
        this.$message.success("复制成功！");
      });
    },
    handleBatchDownload() {
      let links = this.getSelectedLinks();
      if (links.length < 1) {
        this.$message.error("请选择要下载的文件！");
        return;
      }
      links.forEach(link => window.open(link, "_blank"));
    },
    handleIdm() {
      let ef2 = buildEf2File(this.getSelectedLinks(), this.cookie);
      downloadClob(ef2, 'download.ef2');
      this.$message.success("成功！请在 IDM 中导入此文件下载");
    },
    handleAria() {
      sendAriaRequest(this.getSelectedLinks(), this.cookie)
          .then(ret => {
            // 检查是否成功
            if (ret === "no_config") {
              this.$message.warning("还没配置过 Aria RPC，请先配置！");
              this.$emit('onOpenAriaDialog');
              return;
            }
            this.$message.success("成功推送至 Aria！")
          })
          .catch(e => {
            // 报错
            this.$message.error(`推送失败！${e}`);
          });
    },
    handleConfigAria() {
      this.$emit('onOpenAriaDialog');
    }
  }
});

;// CONCATENATED MODULE: ./src/components/PluginPanel.vue?vue&type=script&lang=js&
 /* harmony default export */ const components_PluginPanelvue_type_script_lang_js_ = (PluginPanelvue_type_script_lang_js_); 
// EXTERNAL MODULE: ./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/PluginPanel.vue?vue&type=style&index=0&id=62c87fde&scoped=true&lang=css&
var PluginPanelvue_type_style_index_0_id_62c87fde_scoped_true_lang_css_ = __webpack_require__(296);
;// CONCATENATED MODULE: ./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/PluginPanel.vue?vue&type=style&index=0&id=62c87fde&scoped=true&lang=css&

            

var PluginPanelvue_type_style_index_0_id_62c87fde_scoped_true_lang_css_options = {};

PluginPanelvue_type_style_index_0_id_62c87fde_scoped_true_lang_css_options.insert = "head";
PluginPanelvue_type_style_index_0_id_62c87fde_scoped_true_lang_css_options.singleton = false;

var PluginPanelvue_type_style_index_0_id_62c87fde_scoped_true_lang_css_update = injectStylesIntoStyleTag_default()(PluginPanelvue_type_style_index_0_id_62c87fde_scoped_true_lang_css_/* default */.Z, PluginPanelvue_type_style_index_0_id_62c87fde_scoped_true_lang_css_options);



/* harmony default export */ const components_PluginPanelvue_type_style_index_0_id_62c87fde_scoped_true_lang_css_ = (PluginPanelvue_type_style_index_0_id_62c87fde_scoped_true_lang_css_/* default.locals */.Z.locals || {});
;// CONCATENATED MODULE: ./src/components/PluginPanel.vue?vue&type=style&index=0&id=62c87fde&scoped=true&lang=css&

;// CONCATENATED MODULE: ./src/components/PluginPanel.vue



;


/* normalize component */

var PluginPanel_component = normalizeComponent(
  components_PluginPanelvue_type_script_lang_js_,
  PluginPanelvue_type_template_id_62c87fde_scoped_true_render,
  PluginPanelvue_type_template_id_62c87fde_scoped_true_staticRenderFns,
  false,
  null,
  "62c87fde",
  null
  
)

/* hot reload */
if (false) { var PluginPanel_api; }
PluginPanel_component.options.__file = "src/components/PluginPanel.vue"
/* harmony default export */ const PluginPanel = (PluginPanel_component.exports);
;// CONCATENATED MODULE: ./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/PluginDrawer.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
//
//
//
//






/* harmony default export */ const PluginDrawervue_type_script_lang_js_ = ({
  name: 'PluginDrawer',
  components: {AriaConfigDialog: AriaConfigDialog, PluginPanel: PluginPanel, ArrowIcon: ArrowIcon, Header: Header},
  data() {
    return {
      isHide: true,
    }
  },
  methods: {
    hide() {
      this.isHide = !this.isHide;
      // 打开侧边时重载文件列表
      if (!this.isHide) {
        this.$refs.panel.loadFileList(false);
      }
    },
    handleOpenAriaDialog() {
      this.$refs.ariaDialog.open();
    },
  },
});

;// CONCATENATED MODULE: ./src/components/PluginDrawer.vue?vue&type=script&lang=js&
 /* harmony default export */ const components_PluginDrawervue_type_script_lang_js_ = (PluginDrawervue_type_script_lang_js_); 
// EXTERNAL MODULE: ./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/sass-loader/dist/cjs.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/PluginDrawer.vue?vue&type=style&index=0&id=593a5798&lang=scss&scoped=true&
var PluginDrawervue_type_style_index_0_id_593a5798_lang_scss_scoped_true_ = __webpack_require__(205);
;// CONCATENATED MODULE: ./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/sass-loader/dist/cjs.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/PluginDrawer.vue?vue&type=style&index=0&id=593a5798&lang=scss&scoped=true&

            

var PluginDrawervue_type_style_index_0_id_593a5798_lang_scss_scoped_true_options = {};

PluginDrawervue_type_style_index_0_id_593a5798_lang_scss_scoped_true_options.insert = "head";
PluginDrawervue_type_style_index_0_id_593a5798_lang_scss_scoped_true_options.singleton = false;

var PluginDrawervue_type_style_index_0_id_593a5798_lang_scss_scoped_true_update = injectStylesIntoStyleTag_default()(PluginDrawervue_type_style_index_0_id_593a5798_lang_scss_scoped_true_/* default */.Z, PluginDrawervue_type_style_index_0_id_593a5798_lang_scss_scoped_true_options);



/* harmony default export */ const components_PluginDrawervue_type_style_index_0_id_593a5798_lang_scss_scoped_true_ = (PluginDrawervue_type_style_index_0_id_593a5798_lang_scss_scoped_true_/* default.locals */.Z.locals || {});
;// CONCATENATED MODULE: ./src/components/PluginDrawer.vue?vue&type=style&index=0&id=593a5798&lang=scss&scoped=true&

;// CONCATENATED MODULE: ./src/components/PluginDrawer.vue



;


/* normalize component */

var PluginDrawer_component = normalizeComponent(
  components_PluginDrawervue_type_script_lang_js_,
  PluginDrawervue_type_template_id_593a5798_scoped_true_render,
  PluginDrawervue_type_template_id_593a5798_scoped_true_staticRenderFns,
  false,
  null,
  "593a5798",
  null
  
)

/* hot reload */
if (false) { var PluginDrawer_api; }
PluginDrawer_component.options.__file = "src/components/PluginDrawer.vue"
/* harmony default export */ const PluginDrawer = (PluginDrawer_component.exports);
;// CONCATENATED MODULE: ./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/app.vue?vue&type=script&lang=js&
//
//
//
//
//
//




/* harmony default export */ const appvue_type_script_lang_js_ = ({
  name: 'app',
  components: {
    PluginDrawer: PluginDrawer,
  },
  data() {
    return {
      AppName: AppName,
      AppVersion: AppVersion,
    }
  },
});

;// CONCATENATED MODULE: ./src/app.vue?vue&type=script&lang=js&
 /* harmony default export */ const src_appvue_type_script_lang_js_ = (appvue_type_script_lang_js_); 
// EXTERNAL MODULE: ./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/sass-loader/dist/cjs.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/app.vue?vue&type=style&index=0&id=5ef48958&lang=scss&scoped=true&
var appvue_type_style_index_0_id_5ef48958_lang_scss_scoped_true_ = __webpack_require__(857);
;// CONCATENATED MODULE: ./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/sass-loader/dist/cjs.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/app.vue?vue&type=style&index=0&id=5ef48958&lang=scss&scoped=true&

            

var appvue_type_style_index_0_id_5ef48958_lang_scss_scoped_true_options = {};

appvue_type_style_index_0_id_5ef48958_lang_scss_scoped_true_options.insert = "head";
appvue_type_style_index_0_id_5ef48958_lang_scss_scoped_true_options.singleton = false;

var appvue_type_style_index_0_id_5ef48958_lang_scss_scoped_true_update = injectStylesIntoStyleTag_default()(appvue_type_style_index_0_id_5ef48958_lang_scss_scoped_true_/* default */.Z, appvue_type_style_index_0_id_5ef48958_lang_scss_scoped_true_options);



/* harmony default export */ const lib_vue_loader_options_src_appvue_type_style_index_0_id_5ef48958_lang_scss_scoped_true_ = (appvue_type_style_index_0_id_5ef48958_lang_scss_scoped_true_/* default.locals */.Z.locals || {});
;// CONCATENATED MODULE: ./src/app.vue?vue&type=style&index=0&id=5ef48958&lang=scss&scoped=true&

;// CONCATENATED MODULE: ./src/app.vue



;


/* normalize component */

var app_component = normalizeComponent(
  src_appvue_type_script_lang_js_,
  render,
  staticRenderFns,
  false,
  null,
  "5ef48958",
  null
  
)

/* hot reload */
if (false) { var app_api; }
app_component.options.__file = "src/app.vue"
/* harmony default export */ const app = (app_component.exports);
// EXTERNAL MODULE: ./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./src/styles/global.scss
var global = __webpack_require__(452);
;// CONCATENATED MODULE: ./src/styles/global.scss

            

var global_options = {};

global_options.insert = "head";
global_options.singleton = false;

var global_update = injectStylesIntoStyleTag_default()(global/* default */.Z, global_options);



/* harmony default export */ const styles_global = (global/* default.locals */.Z.locals || {});
;// CONCATENATED MODULE: ./src/main.js






loadStyle('https://cdn.staticfile.org/element-ui/2.14.1/theme-chalk/index.css')


const id = `app_vue_${Date.now()}`
const root = document.createElement('div')
root.id = id
document.body.appendChild(root)

if (isDev) {
    const ElementUI = __webpack_require__(223)
    external_Vue_default().use(ElementUI)
}

new (external_Vue_default())({
    el: `#${id}`,
    render: h => h(app)
})

})();

/******/ })()
;