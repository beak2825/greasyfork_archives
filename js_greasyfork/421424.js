// ==UserScript==
// @name         SZU mailbox
// @namespace    http://tampermonkey.net/
// @version      1.1.5
// @description  在深圳大学校务信箱中添加了评论和回复以及一些辅助的功能
// @author       nut
// @match        https://www1.szu.edu.cn/mailbox/view.asp*
// @match        https://www1.szu.edu.cn/mailbox/list.asp*
// @match        https://www1.szu.edu.cn/
// @match        https://www1.szu.edu.cn/mailbox/
// @require      https://cdn.jsdelivr.net/npm/vue@2.6.11/dist/vue.min.js
// @require      https://cdn.jsdelivr.net/npm/element-ui@2.15.0/lib/index.js
// @run-at       document-body
// @downloadURL https://update.greasyfork.org/scripts/421424/SZU%20mailbox.user.js
// @updateURL https://update.greasyfork.org/scripts/421424/SZU%20mailbox.meta.js
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
/******/ 	return __webpack_require__(__webpack_require__.s = 9);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


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
    var nonce =  true ? __webpack_require__.nc : undefined;

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
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


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
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__);
// Imports

var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default()(function(i){return i[1]});
// Module
___CSS_LOADER_EXPORT___.push([module.i, "\n.avatar[data-v-2248e212] {\n  margin-top: 5px;\n  width: 32px;\n  height: 32px;\n}\n.iconfont-hover[data-v-2248e212] {\n  color: #95adc5;\n}\n.iconfont-hover[data-v-2248e212]:hover {\n  color: #409EFF;\n}\n.iconfont-after[data-v-2248e212] {\n  color: #409EFF;\n}\n.reply-delete>div[data-v-2248e212]:nth-of-type(2) {\n  visibility: hidden;\n}\n.reply-delete:hover>div[data-v-2248e212]:nth-of-type(2) {\n  visibility: visible;\n}\n", ""]);
// Exports
/* harmony default export */ __webpack_exports__["a"] = (___CSS_LOADER_EXPORT___);


/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__);
// Imports

var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default()(function(i){return i[1]});
// Module
___CSS_LOADER_EXPORT___.push([module.i, "\n.userName[data-v-7b21d707] {\n  position: relative;\n  right: 4px;\n  width: 84px;\n  font-size: 12px;\n  color: #0b66c0;\n  margin: 7px 0 9px 0;\n}\n.avatar[data-v-7b21d707] {\n  margin-top: 12px;\n  width: 76px;\n  height: 76px;\n}\n.commentContent[data-v-7b21d707] {\n  min-height: 97px;\n}\n.iconfont-hover[data-v-7b21d707] {\n  color: #95adc5;\n}\n.iconfont-hover[data-v-7b21d707]:hover {\n  color: #409EFF;\n}\n.iconfont-after[data-v-7b21d707] {\n  color: #409EFF;\n}\n.comment-delete>div[data-v-7b21d707]:nth-of-type(3) {\n  visibility: hidden;\n}\n.comment-delete:hover>div[data-v-7b21d707]:nth-of-type(3) {\n  visibility: visible;\n}\n", ""]);
// Exports
/* harmony default export */ __webpack_exports__["a"] = (___CSS_LOADER_EXPORT___);


/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__);
// Imports

var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default()(function(i){return i[1]});
// Module
___CSS_LOADER_EXPORT___.push([module.i, "\n.point-lt[data-v-60235313] {\n  top: -10px;\n  left: -10px;\n  cursor: nw-resize;\n}\n.point-lb[data-v-60235313] {\n  bottom: -10px;\n  left: -10px;\n  cursor: sw-resize;\n}\n.point-rt[data-v-60235313] {\n  top: -10px;\n  right: -10px;\n  cursor: ne-resize;\n}\n.point-rb[data-v-60235313] {\n  bottom: -10px;\n  right: -10px;\n  cursor: se-resize;\n}\n.drag-point[data-v-60235313] {\n  display: inline-block;\n  width: 10px;\n  height: 10px;\n  background-color: #409eff;\n  /* border: 1px solid rgb(0, 17, 255); */\n  position: absolute;\n  -webkit-box-sizing: border-box;\n  box-sizing: border-box;\n}\n.anti-shadow-move[data-v-60235313] {\n  position: absolute;\n  cursor: move;\n}\n.anti-shadow-img[data-v-60235313] {\n  position: absolute;\n}\n.anti-shadow-pic[data-v-60235313] {\n  position: absolute;\n  overflow: hidden;\n}\n.anti-shadow[data-v-60235313] {\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none;\n  position: absolute;\n  z-index: 10;\n  cursor: crosshair;\n}\n.shadow-pic[data-v-60235313] {\n  position: absolute;\n  width: 240px;\n  height: 240px;\n  background-color: rgba(0, 0, 0, .5);\n}\n.view-img[data-v-60235313] {\n  position: absolute;\n}\n.view-pic[data-v-60235313] {\n  width: 190px;\n  height: 190px;\n  position: absolute;\n  overflow: hidden;\n}\n.picView[data-v-60235313] {\n  display: inline-flex;\n  width: 200px;\n  height: 200px;\n  border-radius: 5px;\n  border: 2px solid #c4c4c4;\n  text-align: center;\n  justify-content: center;\n  align-items: center;\n}\n.picBox[data-v-60235313] {\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none;\n  display: inline-flex;\n  width: 250px;\n  height: 250px;\n  border-radius: 5px;\n  border: 2px solid #c4c4c4;\n  text-align: center;\n  justify-content: center;\n  align-items: center;\n  cursor: pointer;\n}\n.picBox[data-v-60235313]:hover,\n.picView[data-v-60235313]:hover {\n  border: 2px solid #409eff;\n}\n", ""]);
// Exports
/* harmony default export */ __webpack_exports__["a"] = (___CSS_LOADER_EXPORT___);


/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__);
// Imports

var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default()(function(i){return i[1]});
// Module
___CSS_LOADER_EXPORT___.push([module.i, "\n.msgBox[data-v-527e7582] {\n  height: 335px;\n  width: 310px;\n}\n.scrollBox[data-v-527e7582] {\n  height: 260px;\n  overflow: scroll;\n}\n.avatar[data-v-527e7582] {\n  width: 32px;\n  height: 32px;\n}\n.scrollBox[data-v-527e7582]::-webkit-scrollbar {\n  /*滚动条整体样式*/\n  width: 5px;\n  /*高宽分别对应横竖滚动条的尺寸*/\n  height: 1px;\n}\n.scrollBox[data-v-527e7582]::-webkit-scrollbar-thumb {\n  /*滚动条里面小方块*/\n  border-radius: 10px;\n  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);\n  background: #bebebe;\n}\n.scrollBox[data-v-527e7582]::-webkit-scrollbar-track {\n  /*滚动条里面轨道*/\n  box-shadow: inset 0 0 5px rgba(175, 175, 175, 0.534);\n  border-radius: 10px;\n  background: #ffffff;\n}\n.msg-loging[data-v-527e7582] {\n  text-align: center;\n  font-size: 14px;\n  color: #868686;\n}\n.msgfade-enter-active[data-v-527e7582],\n.msgfade-leave-active[data-v-527e7582] {\n  transition: opacity .2s;\n}\n.msgfade-enter[data-v-527e7582],\n.msgfade-leave-to[data-v-527e7582] {\n  opacity: 0;\n}\n", ""]);
// Exports
/* harmony default export */ __webpack_exports__["a"] = (___CSS_LOADER_EXPORT___);


/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__);
// Imports

var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default()(function(i){return i[1]});
// Module
___CSS_LOADER_EXPORT___.push([module.i, "\n.sidebar[data-v-12898b5e] {\n  top: 225px;\n  left: 0;\n  position: fixed;\n  /* z-index: 2022; */\n  z-index: 2000;\n}\n.sidebar[data-v-12898b5e] .el-tooltip {\n  line-height: 24px;\n}\n", ""]);
// Exports
/* harmony default export */ __webpack_exports__["a"] = (___CSS_LOADER_EXPORT___);


/***/ }),
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__);
// Imports

var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default()(function(i){return i[1]});
// Module
___CSS_LOADER_EXPORT___.push([module.i, "\nbody {\n  overflow-y: scroll;\n}\n.el-tooltip__popper span {\n  color: #ffffff;\n  font-size: 12px;\n  line-height: 100%;\n}\n.el-message-box__btns span {\n  color: #000000;\n  font-size: 12px;\n  line-height: 100%;\n}\n.buttonSelect span {\n  color: #fff;\n  font-family: 微软雅黑;\n  font-size: 14px;\n  line-height: 100%;\n}\n.text-buttonSelect span {\n  color: #409eff;\n  font-family: 微软雅黑;\n  font-size: 14px;\n  line-height: 100%;\n}\n.text-buttonSelect:hover span {\n  color: #7cbbff;\n}\n.text-buttonSelect:active span {\n  color: #006dda;\n}\n.text-dangerous-buttonSelect span {\n  color: #f56c6c;\n  font-family: 微软雅黑;\n  font-size: 14px;\n  line-height: 100%;\n}\n.text-dangerous-buttonSelect:active span {\n  color: #d33d3d;\n}\n.text-buttonSelect-mini span {\n  color: #409eff;\n  font-family: 微软雅黑;\n  font-size: 12px;\n  line-height: 100%;\n}\n.text-buttonSelect-mini span:hover {\n  color: #7cbbff;\n}\n.text-buttonSelect-mini:active span {\n  color: #006dda;\n}\n.text-link>a:hover {\n  text-decoration: none;\n}\n.text-link span {\n  color: #409eff;\n  font-family: 微软雅黑;\n  font-size: 14px;\n  line-height: 1.4;\n}\n.text-link span:hover {\n  color: #7cbbff;\n}\n.navfade-enter-active,\n.navfade-leave-active {\n  transition: opacity 0.8s;\n}\n.navfade-enter,\n.navfade-leave-to {\n  opacity: 0;\n}\n", ""]);
// Exports
/* harmony default export */ __webpack_exports__["a"] = (___CSS_LOADER_EXPORT___);


/***/ }),
/* 8 */
/***/ (function(module, exports) {

module.exports = Vue;

/***/ }),
/* 9 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./src/function/utils.js
/* harmony default export */ var utils = ({
  getQueryVariable(variable) {
    const query = window.location.search.substring(1);
    const vars = query.split("&");
    for (let i = 0; i < vars.length; i++) {
      const pair = vars[i].split("=");
      if (pair[0] == variable) {
        return pair[1];
      }
    }
    return (false);
  },
  getPostID() {
    let postPath = document.querySelector("body > table > tbody > tr:nth-child(2) > td > table > tbody > tr:nth-child(3) > td > table > tbody > tr:nth-child(1) > td > table > tbody > tr > td:nth-child(1) > a:nth-child(2)")
    const query = postPath.search.substring(1);
    const vars = query.split("&");
    for (let i = 0; i < vars.length; i++) {
      const pair = vars[i].split("=");
      if (pair[0] == "id") {
        return pair[1];
      }
    }
    return (false);
  },
  loadInit() {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = 'https://cdn.jsdelivr.net/npm/element-ui@2.15.0/lib/theme-chalk/index.min.css';
    link.media = 'all';
    document.head.appendChild(link);

    const oMeta = document.createElement('meta');
    oMeta.content = 'no-referrer';
    oMeta.name = 'referrer';
    document.head.appendChild(oMeta);

    let father = document.getElementById('testVueToTamper') ||
      document.querySelector("body > table > tbody > tr:nth-child(2) > td > table > tbody > tr:nth-child(3) > td > table > tbody > tr:nth-child(2) > td")
    if (!this.getQueryVariable("id")) {
      father = document.body
    }

    const divApp = document.createElement('div')
    divApp.id = 'app'
    father.append(divApp)
  },
  getLength(str) {
    const ele = document.getElementById('textLength')
    ele.textContent = str
    const length = ele.clientWidth
    ele.textContent = ''
    return Math.ceil(length / 664) * 23
  },
  getLength14Size(str) {
    const ele = document.getElementById('textLength')
    ele.textContent = str
    const length = ele.clientWidth
    ele.textContent = ''
    return length
  },
  getASPSESSION() {
    if (false)
      {}
    let cookieStr = document.cookie.split('; ');
    let cookies = "null";
    let isFirst = true;
    for (let i = 0; i < cookieStr.length; i++) {
      if (cookieStr[i].indexOf("ASPSESSION") !== -1) {
        if (isFirst) {
          cookies = cookieStr[i];
          isFirst = false;
        } else {
          cookies += '---' + cookieStr[i];
        }
      }
    }
    return cookies
  },
  async httpJsonMethod(method, url, data) {
    url = "https://mailbox.nutvii.top/" + url
    const xml = new XMLHttpRequest();
    xml.withCredentials = true
    let str = '';
    let isFirst = true;
    for (const i in data) {
      if (isFirst) {
        isFirst = false;
        if (method == 'GET' || method == 'DELETE') {
          str += '?'
        }
        str += i + '=' + data[i]
      } else str += '&' + i + '=' + data[i]
    }

    if (method == 'GET' || method == 'DELETE') {
      xml.open(method, url + str);
      xml.send(null);
    } else if (method == 'POST') {
      xml.open(method, url);
      xml.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
      xml.send(str);
    }
    return new Promise((resolve, reject) => {
      xml.onload = () => {
        if (xml.status == 200) {
          resolve(JSON.parse(xml.responseText))
        } else reject(xml.responseText);
      }
    })
  },

  async httpHtmlMethod(method, url, data, charset) {
    const xml = new XMLHttpRequest();
    xml.withCredentials = true
    let str = '';
    let isFirst = true;
    for (const i in data) {
      if (isFirst) {
        isFirst = false;
        if (method == 'GET' || method == 'DELETE') {
          str += '?'
        }
        str += i + '=' + data[i]
      } else str += '&' + i + '=' + data[i]
    }

    if (method == 'GET' || method == 'DELETE') {
      xml.open(method, url + str);
      if (charset != undefined)
        xml.overrideMimeType("text/html;charset=" + charset)
      xml.send(null);
    } else if (method == 'POST') {
      xml.open(method, url);
      xml.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
      xml.send(str);
    }
    return new Promise((resolve, reject) => {
      xml.onload = () => {
        if (xml.status == 200) {
          resolve(xml.responseText)
        } else reject(xml.responseText);
      }
    })
  },
});
// EXTERNAL MODULE: external "Vue"
var external_Vue_ = __webpack_require__(8);
var external_Vue_default = /*#__PURE__*/__webpack_require__.n(external_Vue_);

// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./src/App.vue?vue&type=template&id=7ba5bd90&
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    { staticStyle: { width: "960px", margin: "0 auto" } },
    [
      _c(
        "transition",
        { attrs: { name: "navfade" } },
        [
          _c("SideBar", {
            directives: [
              {
                name: "show",
                rawName: "v-show",
                value: _vm.navOut,
                expression: "navOut"
              }
            ]
          })
        ],
        1
      ),
      _vm._v(" "),
      _vm.showURL == 1 ? _c("Comment") : _vm._e(),
      _vm._v(" "),
      _c("div", {
        staticStyle: {
          "font-family": "Microsoft Yahei",
          "white-space": "normal",
          position: "fixed",
          "z-index": "-1",
          bottom: "0",
          opacity: "0",
          height: "0",
          "font-size": "14px"
        },
        attrs: { id: "textLength" }
      })
    ],
    1
  )
}
var staticRenderFns = []
render._withStripped = true


// CONCATENATED MODULE: ./src/App.vue?vue&type=template&id=7ba5bd90&

// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./src/views/Forum/Comment.vue?vue&type=template&id=7b21d707&scoped=true&
var Commentvue_type_template_id_7b21d707_scoped_true_render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    { staticStyle: { width: "960px" } },
    [
      _vm.$root.POSTID != 0
        ? _c(
            "el-main",
            {
              staticClass: "my_table",
              staticStyle: { width: "90%", padding: "0" }
            },
            [
              _c(
                "el-table",
                {
                  directives: [
                    {
                      name: "loading",
                      rawName: "v-loading",
                      value: _vm.loading,
                      expression: "loading"
                    }
                  ],
                  attrs: {
                    "header-cell-style": _vm.headerStyle,
                    stripe: false,
                    data: _vm.comment,
                    "cell-style": _vm.columnStyle
                  }
                },
                [
                  _c("el-table-column", {
                    attrs: {
                      align: "center",
                      label: "评论:" + _vm.total,
                      width: "96"
                    },
                    scopedSlots: _vm._u(
                      [
                        {
                          key: "default",
                          fn: function(scope) {
                            return [
                              _c(
                                "el-col",
                                [
                                  _c("el-image", {
                                    staticClass: "avatar",
                                    attrs: {
                                      src:
                                        scope.row.creator.avatar ||
                                        _vm.$root.NULLAVATAR,
                                      fit: "cover",
                                      lazy: ""
                                    }
                                  })
                                ],
                                1
                              ),
                              _vm._v(" "),
                              _c("el-col", { staticClass: "userName" }, [
                                _vm._v(_vm._s(scope.row.creator.user))
                              ])
                            ]
                          }
                        }
                      ],
                      null,
                      false,
                      2774389383
                    )
                  }),
                  _vm._v(" "),
                  _c("el-table-column", {
                    attrs: { label: "content" },
                    scopedSlots: _vm._u(
                      [
                        {
                          key: "header",
                          fn: function(scope) {
                            return [
                              _c(
                                "el-row",
                                { attrs: { type: "flex", align: "middle" } },
                                [
                                  _c("el-col", { attrs: { span: 18 } }),
                                  _vm._v(" "),
                                  _c(
                                    "el-col",
                                    { attrs: { span: 3 } },
                                    [
                                      _c(
                                        "el-button",
                                        {
                                          staticClass: "buttonSelect",
                                          attrs: {
                                            size: "small",
                                            type: "primary"
                                          },
                                          on: {
                                            click: function($event) {
                                              return _vm.postComment()
                                            }
                                          }
                                        },
                                        [_vm._v("评论")]
                                      )
                                    ],
                                    1
                                  ),
                                  _vm._v(" "),
                                  _c(
                                    "el-col",
                                    { attrs: { span: 3 } },
                                    [
                                      _c(
                                        "el-button",
                                        {
                                          staticClass: "buttonSelect",
                                          attrs: {
                                            size: "small",
                                            type: "primary"
                                          },
                                          on: {
                                            click: function($event) {
                                              return _vm.getComment()
                                            }
                                          }
                                        },
                                        [_vm._v("刷新")]
                                      )
                                    ],
                                    1
                                  ),
                                  _vm._v(" "),
                                  _c(
                                    "el-col",
                                    { attrs: { span: 3 } },
                                    [
                                      _c(
                                        "el-button",
                                        {
                                          staticClass: "buttonSelect",
                                          attrs: {
                                            size: "small",
                                            disabled: true,
                                            type: "primary"
                                          },
                                          on: {
                                            click: function($event) {
                                              return _vm.sortComment(
                                                scope.$index,
                                                scope.row
                                              )
                                            }
                                          }
                                        },
                                        [
                                          _vm._v(
                                            "\n                按时间:\n                " +
                                              _vm._s(
                                                _vm.sort == "id" ? "旧" : "新"
                                              )
                                          )
                                        ]
                                      )
                                    ],
                                    1
                                  )
                                ],
                                1
                              )
                            ]
                          }
                        },
                        {
                          key: "default",
                          fn: function(scope) {
                            return [
                              _c("div", { staticClass: "commentContent" }, [
                                _vm._v(_vm._s(scope.row.content))
                              ]),
                              _vm._v(" "),
                              _c(
                                "el-row",
                                {
                                  staticClass: "comment-delete",
                                  attrs: { type: "flex", align: "middle" }
                                },
                                [
                                  _c("el-col", { attrs: { span: 2 } }, [
                                    _c(
                                      "div",
                                      { staticStyle: { "min-width": "27px" } },
                                      [
                                        _vm._v(
                                          "\n                " +
                                            _vm._s(scope.row.level + "楼") +
                                            "\n              "
                                        )
                                      ]
                                    )
                                  ]),
                                  _vm._v(" "),
                                  _c("el-col", { attrs: { span: 17 } }, [
                                    _vm._v(
                                      "\n              " +
                                        _vm._s(
                                          scope.row.time.substring(0, 10)
                                        ) +
                                        "\n              " +
                                        _vm._s(
                                          scope.row.time.substring(11, 16)
                                        ) +
                                        "\n            "
                                    )
                                  ]),
                                  _vm._v(" "),
                                  _c(
                                    "el-col",
                                    { attrs: { span: 2 } },
                                    [
                                      _c(
                                        "el-row",
                                        {
                                          attrs: {
                                            type: "flex",
                                            justify: "center",
                                            align: "middle"
                                          }
                                        },
                                        [
                                          _vm.$root.UUID ==
                                          scope.row.creator.uuid
                                            ? _c(
                                                "el-button",
                                                {
                                                  staticClass:
                                                    "text-dangerous-buttonSelect",
                                                  attrs: {
                                                    size: "mini",
                                                    type: "text"
                                                  },
                                                  on: {
                                                    click: function($event) {
                                                      return _vm.deleteComment(
                                                        scope.row.id,
                                                        scope.$index
                                                      )
                                                    }
                                                  }
                                                },
                                                [
                                                  _vm._v(
                                                    "\n                  删除\n                "
                                                  )
                                                ]
                                              )
                                            : _vm._e()
                                        ],
                                        1
                                      )
                                    ],
                                    1
                                  ),
                                  _vm._v(" "),
                                  _c(
                                    "el-col",
                                    { attrs: { span: 2 } },
                                    [
                                      _c(
                                        "el-button",
                                        {
                                          staticStyle: { padding: "0" },
                                          attrs: { size: "mini", type: "text" },
                                          on: {
                                            click: function($event) {
                                              return _vm.likeIt(
                                                scope.row.id,
                                                scope.$index
                                              )
                                            }
                                          }
                                        },
                                        [
                                          !scope.row.isLike
                                            ? _c("i", {
                                                staticClass:
                                                  "iconfont icon0_like1 iconfont-hover",
                                                staticStyle: {
                                                  "font-size": "22px"
                                                }
                                              })
                                            : _c("i", {
                                                staticClass:
                                                  "iconfont icon0_like2 iconfont-after",
                                                staticStyle: {
                                                  "font-size": "22px"
                                                }
                                              }),
                                          _vm._v(" "),
                                          _c(
                                            "font",
                                            {
                                              staticStyle: {
                                                "font-size": "12px",
                                                position: "relative",
                                                top: "-2px",
                                                color: "#aaaaaa"
                                              }
                                            },
                                            [_vm._v(_vm._s(scope.row.like))]
                                          )
                                        ],
                                        1
                                      )
                                    ],
                                    1
                                  ),
                                  _vm._v(" "),
                                  _c(
                                    "el-col",
                                    { attrs: { span: 3 } },
                                    [
                                      _c(
                                        "el-badge",
                                        {
                                          attrs: {
                                            hidden: !scope.row.replies.total,
                                            value: scope.row.replies.total,
                                            type: "primary"
                                          }
                                        },
                                        [
                                          _c(
                                            "el-button",
                                            {
                                              staticClass: "buttonSelect",
                                              attrs: {
                                                size: "mini",
                                                type: "primary"
                                              },
                                              on: {
                                                click: function($event) {
                                                  return _vm.popReply(
                                                    scope.$index
                                                  )
                                                }
                                              }
                                            },
                                            [_vm._v("回复\n                ")]
                                          )
                                        ],
                                        1
                                      )
                                    ],
                                    1
                                  )
                                ],
                                1
                              ),
                              _vm._v(" "),
                              _c(
                                "el-row",
                                [
                                  _c("Reply", {
                                    attrs: {
                                      limit: _vm.limit,
                                      commentObj: scope.row
                                    }
                                  })
                                ],
                                1
                              )
                            ]
                          }
                        }
                      ],
                      null,
                      false,
                      2835275137
                    )
                  })
                ],
                1
              ),
              _vm._v(" "),
              _c("el-pagination", {
                staticStyle: {
                  "text-align": "center",
                  margin: "10px 0 10px 0"
                },
                attrs: {
                  background: "",
                  layout: "prev, pager, next",
                  total: _vm.total,
                  "current-page": _vm.currentPage,
                  "page-size": _vm.limit
                },
                on: {
                  "update:currentPage": function($event) {
                    _vm.currentPage = $event
                  },
                  "update:current-page": function($event) {
                    _vm.currentPage = $event
                  },
                  "current-change": function($event) {
                    return _vm.getComment()
                  }
                }
              }),
              _vm._v(" "),
              _c(
                "el-card",
                [
                  _c(
                    "el-row",
                    { staticStyle: { "margin-bottom": "10px" } },
                    [
                      _c("el-input", {
                        attrs: {
                          type: "textarea",
                          autosize: { minRows: 3 },
                          placeholder: "请写下你的评论"
                        },
                        model: {
                          value: _vm.content,
                          callback: function($$v) {
                            _vm.content = $$v
                          },
                          expression: "content"
                        }
                      })
                    ],
                    1
                  ),
                  _vm._v(" "),
                  _c(
                    "el-row",
                    { attrs: { type: "flex", align: "middle" } },
                    [
                      _c(
                        "el-col",
                        { attrs: { span: 2, offset: 20 } },
                        [
                          _c(
                            "el-checkbox",
                            {
                              model: {
                                value: _vm.isAnonymous,
                                callback: function($$v) {
                                  _vm.isAnonymous = $$v
                                },
                                expression: "isAnonymous"
                              }
                            },
                            [_vm._v("匿名")]
                          )
                        ],
                        1
                      ),
                      _vm._v(" "),
                      _c(
                        "el-col",
                        { attrs: { span: 2 } },
                        [
                          _c(
                            "el-button",
                            {
                              staticClass: "buttonSelect",
                              attrs: { size: "mini", type: "primary" },
                              on: {
                                click: function($event) {
                                  return _vm.commentSubmit()
                                }
                              }
                            },
                            [_vm._v("发送")]
                          )
                        ],
                        1
                      )
                    ],
                    1
                  ),
                  _vm._v(" "),
                  _c("div", {
                    staticStyle: { position: "relative", top: "76px" },
                    attrs: { id: "commentEdit" }
                  })
                ],
                1
              )
            ],
            1
          )
        : _vm._e()
    ],
    1
  )
}
var Commentvue_type_template_id_7b21d707_scoped_true_staticRenderFns = []
Commentvue_type_template_id_7b21d707_scoped_true_render._withStripped = true


// CONCATENATED MODULE: ./src/views/Forum/Comment.vue?vue&type=template&id=7b21d707&scoped=true&

// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./src/views/Forum/Reply.vue?vue&type=template&id=2248e212&scoped=true&
var Replyvue_type_template_id_2248e212_scoped_true_render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("el-collapse-transition", [
    _c(
      "div",
      {
        directives: [
          {
            name: "show",
            rawName: "v-show",
            value: _vm.commentObj.reply.showReply,
            expression: "commentObj.reply.showReply"
          }
        ],
        staticStyle: { "margin-top": "10px" }
      },
      [
        _c(
          "el-table",
          {
            directives: [
              {
                name: "loading",
                rawName: "v-loading",
                value: _vm.commentObj.reply.loading,
                expression: "commentObj.reply.loading"
              }
            ],
            attrs: {
              data: _vm.commentObj.replies.replies,
              "show-header": false,
              "cell-style": _vm.replycolumnStyle
            }
          },
          [
            _c("el-table-column", {
              attrs: { align: "center", width: "52", label: "head" },
              scopedSlots: _vm._u([
                {
                  key: "default",
                  fn: function(item) {
                    return [
                      _c("el-image", {
                        staticClass: "avatar",
                        attrs: {
                          src: item.row.creator.avatar || _vm.$root.NULLAVATAR,
                          fit: "cover",
                          lazy: ""
                        }
                      })
                    ]
                  }
                }
              ])
            }),
            _vm._v(" "),
            _c("el-table-column", {
              attrs: { label: "content" },
              scopedSlots: _vm._u([
                {
                  key: "default",
                  fn: function(item) {
                    return [
                      _c(
                        "el-row",
                        { style: "height:" + item.row.height + "px" },
                        [
                          _c("font", { staticStyle: { color: "#0b66c0" } }, [
                            _vm._v(_vm._s(item.row.creator.user))
                          ]),
                          _vm._v(_vm._s(": ") + "\n            "),
                          item.row.replied
                            ? _c(
                                "font",
                                [
                                  _vm._v("\n              @"),
                                  _c(
                                    "font",
                                    { staticStyle: { color: "#0b66c0" } },
                                    [_vm._v(_vm._s(item.row.replied.user))]
                                  ),
                                  _vm._v(_vm._s(": ") + "\n            ")
                                ],
                                1
                              )
                            : _vm._e(),
                          _vm._v(
                            "\n            " +
                              _vm._s(item.row.content) +
                              "\n          "
                          )
                        ],
                        1
                      ),
                      _vm._v(" "),
                      _c(
                        "el-row",
                        {
                          staticClass: "reply-delete",
                          staticStyle: { height: "23px" },
                          attrs: {
                            type: "flex",
                            align: "middle",
                            justify: "end"
                          }
                        },
                        [
                          _c("el-col", { attrs: { span: 16 } }, [
                            _c(
                              "div",
                              { staticStyle: { "min-width": "27px" } },
                              [
                                _vm._v(
                                  "\n                " +
                                    _vm._s(item.row.level + "层") +
                                    "\n              "
                                )
                              ]
                            )
                          ]),
                          _vm._v(" "),
                          _c(
                            "el-col",
                            { attrs: { span: 1 } },
                            [
                              _c(
                                "el-row",
                                {
                                  staticStyle: {
                                    position: "relation",
                                    left: "10px"
                                  },
                                  attrs: {
                                    type: "flex",
                                    justify: "center",
                                    align: "middle"
                                  }
                                },
                                [
                                  _vm.$root.UUID == item.row.creator.uuid
                                    ? _c(
                                        "el-button",
                                        {
                                          staticClass:
                                            "text-dangerous-buttonSelect",
                                          staticStyle: {
                                            padding: "0",
                                            "margin-bottom": "2px"
                                          },
                                          attrs: { type: "text" },
                                          on: {
                                            click: function($event) {
                                              return _vm.deleteReply(
                                                item.row.id,
                                                item.$index
                                              )
                                            }
                                          }
                                        },
                                        [_vm._v(" 删除\n                ")]
                                      )
                                    : _vm._e()
                                ],
                                1
                              )
                            ],
                            1
                          ),
                          _vm._v(" "),
                          _c(
                            "el-col",
                            {
                              staticStyle: {
                                "font-family":
                                  "Avenir, Helvetica, Arial, sans-serif"
                              },
                              attrs: { span: 6 }
                            },
                            [
                              _c(
                                "el-row",
                                {
                                  attrs: {
                                    type: "flex",
                                    justify: "center",
                                    align: "middle"
                                  }
                                },
                                [
                                  _c(
                                    "div",
                                    { staticStyle: { "margin-left": "10px" } },
                                    [
                                      _vm._v(
                                        "\n                  " +
                                          _vm._s(
                                            item.row.time.substring(0, 10)
                                          ) +
                                          "\n                  " +
                                          _vm._s(
                                            item.row.time.substring(11, 16)
                                          ) +
                                          "\n                "
                                      )
                                    ]
                                  )
                                ]
                              )
                            ],
                            1
                          ),
                          _vm._v(" "),
                          _c(
                            "el-col",
                            { attrs: { span: 2 } },
                            [
                              _c(
                                "el-button",
                                {
                                  staticStyle: { padding: "0" },
                                  attrs: { size: "mini", type: "text" },
                                  on: {
                                    click: function($event) {
                                      return _vm.likeIt(
                                        item.row.id,
                                        item.$index
                                      )
                                    }
                                  }
                                },
                                [
                                  !item.row.isLike
                                    ? _c("i", {
                                        staticClass:
                                          "iconfont icon0_like1 iconfont-hover",
                                        staticStyle: { "font-size": "16px" }
                                      })
                                    : _c("i", {
                                        staticClass:
                                          "iconfont icon0_like2 iconfont-after",
                                        staticStyle: { "font-size": "16px" }
                                      }),
                                  _vm._v(" "),
                                  _c(
                                    "font",
                                    {
                                      staticStyle: {
                                        "font-size": "12px",
                                        position: "relative",
                                        top: "-1px",
                                        color: "#aaaaaa"
                                      }
                                    },
                                    [_vm._v(_vm._s(item.row.like))]
                                  )
                                ],
                                1
                              )
                            ],
                            1
                          ),
                          _vm._v(" "),
                          _c(
                            "el-col",
                            { attrs: { span: 2 } },
                            [
                              _c(
                                "el-button",
                                {
                                  staticClass: "text-buttonSelect",
                                  staticStyle: {
                                    padding: "0",
                                    "margin-bottom": "2px"
                                  },
                                  attrs: { type: "text" },
                                  on: {
                                    click: function($event) {
                                      return _vm.postReply(
                                        item.row.level,
                                        item.row.creator.user,
                                        item.row.id
                                      )
                                    }
                                  }
                                },
                                [_vm._v("回复\n              ")]
                              )
                            ],
                            1
                          )
                        ],
                        1
                      )
                    ]
                  }
                }
              ])
            })
          ],
          1
        ),
        _vm._v(" "),
        _c(
          "el-row",
          { attrs: { type: "flex", align: "middle", justify: "end" } },
          [
            _c(
              "el-col",
              [
                _vm.commentObj.replies.total != 0
                  ? _c("el-pagination", {
                      attrs: {
                        small: "",
                        layout: "prev, pager, next",
                        total: _vm.commentObj.replies.total,
                        "current-page": _vm.commentObj.reply.currentPage,
                        "page-size": _vm.limit
                      },
                      on: {
                        "update:currentPage": function($event) {
                          return _vm.$set(
                            _vm.commentObj.reply,
                            "currentPage",
                            $event
                          )
                        },
                        "update:current-page": function($event) {
                          return _vm.$set(
                            _vm.commentObj.reply,
                            "currentPage",
                            $event
                          )
                        },
                        "current-change": function($event) {
                          return _vm.getReply()
                        }
                      }
                    })
                  : _vm._e()
              ],
              1
            ),
            _vm._v(" "),
            _c(
              "el-col",
              { attrs: { span: 3 } },
              [
                _c(
                  "el-button",
                  {
                    staticClass: "text-buttonSelect",
                    staticStyle: { padding: "0" },
                    attrs: { type: "text" },
                    on: {
                      click: function($event) {
                        return _vm.postReply(
                          0,
                          _vm.commentObj.creator.user,
                          _vm.commentObj.id
                        )
                      }
                    }
                  },
                  [_vm._v("\n          回复楼主\n        ")]
                )
              ],
              1
            )
          ],
          1
        ),
        _vm._v(" "),
        _c(
          "el-collapse-transition",
          [
            _c(
              "el-card",
              {
                directives: [
                  {
                    name: "show",
                    rawName: "v-show",
                    value: _vm.commentObj.reply.showInput,
                    expression: "commentObj.reply.showInput"
                  }
                ]
              },
              [
                _c(
                  "el-row",
                  { staticStyle: { "margin-bottom": "10px" } },
                  [
                    _c(
                      "el-input",
                      {
                        attrs: { placeholder: "请写下你的回复" },
                        model: {
                          value: _vm.commentObj.reply.content,
                          callback: function($$v) {
                            _vm.$set(_vm.commentObj.reply, "content", $$v)
                          },
                          expression: "commentObj.reply.content"
                        }
                      },
                      [
                        _vm.commentObj.reply.number
                          ? _c("template", { slot: "prepend" }, [
                              _vm._v(
                                _vm._s("@" + _vm.commentObj.reply.repliedUser)
                              )
                            ])
                          : _vm._e()
                      ],
                      2
                    )
                  ],
                  1
                ),
                _vm._v(" "),
                _c(
                  "el-row",
                  { attrs: { type: "flex", align: "middle" } },
                  [
                    _c(
                      "el-col",
                      { attrs: { span: 3, offset: 18 } },
                      [
                        _c(
                          "el-checkbox",
                          {
                            model: {
                              value: _vm.commentObj.reply.isAnonymous,
                              callback: function($$v) {
                                _vm.$set(
                                  _vm.commentObj.reply,
                                  "isAnonymous",
                                  $$v
                                )
                              },
                              expression: "commentObj.reply.isAnonymous"
                            }
                          },
                          [_vm._v("匿名")]
                        )
                      ],
                      1
                    ),
                    _vm._v(" "),
                    _c(
                      "el-col",
                      { attrs: { span: 2 } },
                      [
                        _c(
                          "el-button",
                          {
                            staticClass: "buttonSelect",
                            attrs: { size: "mini", type: "primary" },
                            on: {
                              click: function($event) {
                                return _vm.replySubmit()
                              }
                            }
                          },
                          [_vm._v("\n              发送\n            ")]
                        )
                      ],
                      1
                    )
                  ],
                  1
                )
              ],
              1
            )
          ],
          1
        )
      ],
      1
    )
  ])
}
var Replyvue_type_template_id_2248e212_scoped_true_staticRenderFns = []
Replyvue_type_template_id_2248e212_scoped_true_render._withStripped = true


// CONCATENATED MODULE: ./src/views/Forum/Reply.vue?vue&type=template&id=2248e212&scoped=true&

// CONCATENATED MODULE: ./node_modules/vue-loader/lib??vue-loader-options!./src/views/Forum/Reply.vue?vue&type=script&lang=js&
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



/* harmony default export */ var Replyvue_type_script_lang_js_ = ({
  props: {
    limit: Number,
    commentObj: Object
  },
  mounted() {
    let idTime = setInterval(() => {
      if (this.$root.UUID != -1) clearInterval(idTime)
    }, 250)
  },
  methods: {
    likeIt(id, index) {
      let isLike = this.commentObj.replies.replies[index].isLike
      if (!isLike) {
        utils.httpJsonMethod('POST', 'addlike/', {
          'id': id,
          'type': 'reply'
        }).then(() => {
          this.commentObj.replies.replies[index].like++;
          this.commentObj.replies.replies[index].isLike = !isLike;
        }).catch(e => {
          this.$message.error(e)
        })
      } else {
        utils.httpJsonMethod('POST', 'cancelike/', {
          'id': id,
          'type': 'reply'
        }).then(() => {
          this.commentObj.replies.replies[index].like--;
          this.commentObj.replies.replies[index].isLike = !isLike;
        }).catch(e => {
          this.$message.error(e)
        })
      }
    },
    getReply() {
      this.commentObj.reply.loading = true
      utils.httpJsonMethod('GET', 'reply/', {
        'commentId': this.commentObj.id,
        'limit': this.limit,
        'offset': this.commentObj.reply.currentPage,
      }).then((data) => {
        for (let i = 0; i < data.length; i++) {
          if (i == 'replies') {
            for (let j = 0; j < data[i].length; j++) {
              let str = data[i][j].creator.user + " :  "
              str += (data[i][j].replied ? ('@' + data[i][j].replied.user + ' : ') : "") + data[i][j].content
              this.$set(data[i][j], 'height', utils.getLength(str))
            }
          }
          this.commentObj.replies[i] = data[i]
        }
        this.commentObj.reply.loading = false
      }).catch((e) => {
        this.$message.error(e)
      })
    },
    postReply(level, repliedUser, repliedId) {
      if (this.commentObj.reply.showInput && level == this.commentObj.reply.number)
        this.commentObj.reply.showInput = false
      else this.commentObj.reply.showInput = true
      this.commentObj.reply.number = level
      this.commentObj.reply.repliedUser = repliedUser
      this.commentObj.reply.repliedId = repliedId
    },
    replySubmit() {
      if (this.commentObj.reply.content.length >= 2) {
        let postData = {
          'content': this.commentObj.reply.content,
          'isAnonymous': this.commentObj.reply.isAnonymous ? 1 : 0,
        }
        if (this.commentObj.reply.number == 0) postData['commentId'] = this.commentObj.reply.commentId
        else postData['repliedId'] = this.commentObj.reply.repliedId
        utils.httpJsonMethod('POST', 'reply/', postData).then((data) => {
          this.$message.success('回复成功')
          this.commentObj.replies.total++;
          if (Math.ceil((this.commentObj.replies.total) / 10) > this.commentObj.reply.currentPage) {
            this.commentObj.reply.currentPage = Math.ceil(this.commentObj.replies.total / 10)
            this.getReply()
          } else {
            let str = data.creator.user + " :  "
            str += (data.replied ? ('@' + data.replied.user + ' : ') : "") + data.content
            this.$set(data, 'height', utils.getLength(str))
            this.commentObj.replies.replies.push(data)
          }
          this.commentObj.reply.content = ''
          this.content = ''
        }).catch((e) => {
          this.$message.error(e)
        })
      } else {
        this.$message.error("字数少于2")
      }
    },
    deleteReply(id, index) {
      this.$confirm('确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        utils.httpJsonMethod('DELETE', 'reply/', {
          'id': id
        }).then((data) => {
          this.$message.success('删除成功')
          this.commentObj.replies.replies.splice(index, 1)
          this.commentObj.replies.total--;
        }).catch((e) => {
          this.$message.error(e)
        })
      })
    },
    replycolumnStyle() {
      return 'background:#f5f6f7;vertical-align:top;padding:5px;'
    },
  }
});

// CONCATENATED MODULE: ./src/views/Forum/Reply.vue?vue&type=script&lang=js&
 /* harmony default export */ var Forum_Replyvue_type_script_lang_js_ = (Replyvue_type_script_lang_js_); 
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js
var injectStylesIntoStyleTag = __webpack_require__(0);
var injectStylesIntoStyleTag_default = /*#__PURE__*/__webpack_require__.n(injectStylesIntoStyleTag);

// EXTERNAL MODULE: ./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/vue-loader/lib??vue-loader-options!./src/views/Forum/Reply.vue?vue&type=style&index=0&id=2248e212&scoped=true&lang=css&
var Replyvue_type_style_index_0_id_2248e212_scoped_true_lang_css_ = __webpack_require__(2);

// CONCATENATED MODULE: ./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/vue-loader/lib??vue-loader-options!./src/views/Forum/Reply.vue?vue&type=style&index=0&id=2248e212&scoped=true&lang=css&

            

var options = {};

options.insert = "head";
options.singleton = false;

var update = injectStylesIntoStyleTag_default()(Replyvue_type_style_index_0_id_2248e212_scoped_true_lang_css_["a" /* default */], options);



/* harmony default export */ var Forum_Replyvue_type_style_index_0_id_2248e212_scoped_true_lang_css_ = (Replyvue_type_style_index_0_id_2248e212_scoped_true_lang_css_["a" /* default */].locals || {});
// CONCATENATED MODULE: ./src/views/Forum/Reply.vue?vue&type=style&index=0&id=2248e212&scoped=true&lang=css&

// CONCATENATED MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
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

// CONCATENATED MODULE: ./src/views/Forum/Reply.vue






/* normalize component */

var component = normalizeComponent(
  Forum_Replyvue_type_script_lang_js_,
  Replyvue_type_template_id_2248e212_scoped_true_render,
  Replyvue_type_template_id_2248e212_scoped_true_staticRenderFns,
  false,
  null,
  "2248e212",
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "src/views/Forum/Reply.vue"
/* harmony default export */ var Reply = (component.exports);
// CONCATENATED MODULE: ./node_modules/vue-loader/lib??vue-loader-options!./src/views/Forum/Comment.vue?vue&type=script&lang=js&
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



/* harmony default export */ var Commentvue_type_script_lang_js_ = ({
  components: {
    Reply: Reply
  },
  data() {
    return {
      loading: true,
      currentPage: 1,
      total: 0,
      limit: 10,

      comment: [],
      sort: "id",
      input: '',
      content: '',
      isAnonymous: 0,
    }
  },
  mounted() {
    let idTime = setInterval(() => {
      if (this.$root.UUID != -1) {
        clearInterval(idTime)
        this.getComment()
      }
    }, 250)
  },
  methods: {
    likeIt(id, index) {
      let isLike = this.comment[index].isLike
      if (!isLike) {
        utils.httpJsonMethod('POST', 'addlike/', {
          'id': id,
          'type': 'comment'
        }).then(() => {
          this.comment[index].like++;
          this.comment[index].isLike = !isLike;
        }).catch(e => {
          this.$message.error(e)
        })
      } else {
        utils.httpJsonMethod('POST', 'cancelike/', {
          'id': id,
          'type': 'comment'
        }).then(() => {
          this.comment[index].like--;
          this.comment[index].isLike = !isLike;
        }).catch(e => {
          this.$message.error(e)
        })
      }
    },
    getComment() {
      this.loading = true;
      utils.httpJsonMethod('GET', 'comment/', {
        'postId': this.$root.POSTID,
        'limit': this.limit,
        'offset': this.currentPage,
      }).then((data) => {
        this.comment = data.comments
        for (let i = 0; i < this.comment.length; i++) {
          this.$set(this.comment[i], 'reply', {
            'commentId': this.comment[i].id,
            'content': '',
            'number': 0,
            'repliedId': this.comment[i].id,
            'isAnonymous': 0,
            'repliedUser': '',
            'showReply': false,
            'showInput': false,
            'loading': false,
            'currentPage': 1
          })
          const rArr = this.comment[i].replies.replies
          for (let j = 0; j < rArr.length; j++) {
            let str = rArr[j].creator.user + " :  "
            str += (rArr[j].replied ? ('@' + rArr[j].replied.user + ' : ') : "") + rArr[j].content
            this.$set(rArr[j], 'height', utils.getLength(str))
          }
          this.comment[i].reply.showReply = this.comment[i].replies.total != 0
        }
        this.total = data.total
        this.loading = false
      }).catch((e) => {
        this.$message.error(e)
      })
    },
    postComment() {
      document.getElementById("commentEdit").scrollIntoView({
        block: 'end',
        behavior: 'smooth'
      })
    },
    commentSubmit() {
      if (this.content.length >= 2) {
        utils.httpJsonMethod('POST', 'comment/', {
          'postId': this.$root.POSTID,
          'content': this.content,
          'isAnonymous': this.isAnonymous ? 1 : 0,
        }).then((data) => {
          this.$message.success('评论成功')
          this.total++;
          if (Math.ceil((this.total) / 10) > this.currentPage) {
            this.currentPage = Math.ceil(this.total / 10)
            this.getComment()
          } else {
            this.$set(data, 'reply', {
              'commentId': data.id,
              'content': '',
              'number': 0,
              'repliedId': data.id,
              'isAnonymous': 0,
              'repliedUser': '',
              'showReply': false,
              'showInput': false,
              'loading': false,
              'currentPage': 1
            })
            this.comment.push(data)
          }
          this.content = ''
        }).catch((e) => {
          this.$message.error(e)
        })
      } else {
        this.$message.error("字数少于2")
      }
    },
    deleteComment(id, index) {
      this.$confirm('确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        utils.httpJsonMethod('DELETE', 'comment/', {
          'id': id
        }).then((data) => {
          this.$message.success('删除成功')
          this.comment.splice(index, 1)
          this.total--;
        }).catch((e) => {
          this.$message.error(e)
        })
      })
    },
    popReply(index) {
      this.comment[index].reply.showReply = !this.comment[index].reply.showReply
    },
    sortComment(index, row) {
      this.sort = this.sort == 'id' ? '-id' : 'id';
      this.$set(this.comment, index, row)
      this.getComment()
    },
    columnStyle({
      columnIndex
    }) {
      if (columnIndex == 0) return 'background:#cddade;vertical-align:top;'
      else return 'background:#fff;vertical-align:top;'
    },
    headerStyle({
      columnIndex
    }) {
      if (columnIndex == 0) return 'background:#ebeef5;font-size: 14px;'
    }
  }
});

// CONCATENATED MODULE: ./src/views/Forum/Comment.vue?vue&type=script&lang=js&
 /* harmony default export */ var Forum_Commentvue_type_script_lang_js_ = (Commentvue_type_script_lang_js_); 
// EXTERNAL MODULE: ./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/vue-loader/lib??vue-loader-options!./src/views/Forum/Comment.vue?vue&type=style&index=0&id=7b21d707&scoped=true&lang=css&
var Commentvue_type_style_index_0_id_7b21d707_scoped_true_lang_css_ = __webpack_require__(3);

// CONCATENATED MODULE: ./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/vue-loader/lib??vue-loader-options!./src/views/Forum/Comment.vue?vue&type=style&index=0&id=7b21d707&scoped=true&lang=css&

            

var Commentvue_type_style_index_0_id_7b21d707_scoped_true_lang_css_options = {};

Commentvue_type_style_index_0_id_7b21d707_scoped_true_lang_css_options.insert = "head";
Commentvue_type_style_index_0_id_7b21d707_scoped_true_lang_css_options.singleton = false;

var Commentvue_type_style_index_0_id_7b21d707_scoped_true_lang_css_update = injectStylesIntoStyleTag_default()(Commentvue_type_style_index_0_id_7b21d707_scoped_true_lang_css_["a" /* default */], Commentvue_type_style_index_0_id_7b21d707_scoped_true_lang_css_options);



/* harmony default export */ var Forum_Commentvue_type_style_index_0_id_7b21d707_scoped_true_lang_css_ = (Commentvue_type_style_index_0_id_7b21d707_scoped_true_lang_css_["a" /* default */].locals || {});
// CONCATENATED MODULE: ./src/views/Forum/Comment.vue?vue&type=style&index=0&id=7b21d707&scoped=true&lang=css&

// CONCATENATED MODULE: ./src/views/Forum/Comment.vue






/* normalize component */

var Comment_component = normalizeComponent(
  Forum_Commentvue_type_script_lang_js_,
  Commentvue_type_template_id_7b21d707_scoped_true_render,
  Commentvue_type_template_id_7b21d707_scoped_true_staticRenderFns,
  false,
  null,
  "7b21d707",
  null
  
)

/* hot reload */
if (false) { var Comment_api; }
Comment_component.options.__file = "src/views/Forum/Comment.vue"
/* harmony default export */ var Comment = (Comment_component.exports);
// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./src/views/layout/SideBar.vue?vue&type=template&id=12898b5e&scoped=true&
var SideBarvue_type_template_id_12898b5e_scoped_true_render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    [
      _c(
        "div",
        { staticClass: "sidebar" },
        [
          _c(
            "el-menu",
            {
              attrs: { "default-active": _vm.active, collapse: true },
              on: { select: _vm.selectIcon }
            },
            [
              _c(
                "el-popover",
                { attrs: { placement: "right-start" } },
                [
                  _vm.popoverVisible && _vm.$root.UUID
                    ? _c("MessageBox")
                    : _vm._e(),
                  _vm._v(" "),
                  _c(
                    "el-menu-item",
                    {
                      attrs: { slot: "reference", index: "1" },
                      slot: "reference"
                    },
                    [
                      _c(
                        "el-badge",
                        {
                          staticStyle: { top: "16px" },
                          attrs: {
                            hidden: !(_vm.$root.MESSAGE + _vm.$root.LIKE),
                            value: _vm.$root.MESSAGE + _vm.$root.LIKE,
                            max: 99
                          }
                        },
                        [
                          _c("el-image", {
                            staticStyle: { width: "24px", height: "24px" },
                            attrs: {
                              src: _vm.$root.AVATAR || _vm.$root.NULLAVATAR
                            }
                          })
                        ],
                        1
                      ),
                      _vm._v(" "),
                      _c("span", { attrs: { slot: "title" }, slot: "title" }, [
                        _vm._v(_vm._s(_vm.$root.NICKNAME))
                      ])
                    ],
                    1
                  )
                ],
                1
              ),
              _vm._v(" "),
              _c("el-menu-item", { attrs: { index: "2" } }, [
                _c("i", {
                  staticClass: "el-icon-edit-outline",
                  staticStyle: { position: "relative", top: "16px" }
                }),
                _vm._v(" "),
                _c("span", { attrs: { slot: "title" }, slot: "title" }, [
                  _vm._v("修改昵称")
                ])
              ]),
              _vm._v(" "),
              _c("el-menu-item", { attrs: { index: "3" } }, [
                _c("i", {
                  staticClass: "el-icon-picture-outline",
                  staticStyle: { position: "relative", top: "16px" }
                }),
                _vm._v(" "),
                _c("span", { attrs: { slot: "title" }, slot: "title" }, [
                  _vm._v("修改头像")
                ])
              ]),
              _vm._v(" "),
              _c("el-menu-item", { attrs: { index: "4" } }, [
                _c("i", {
                  staticClass: "el-icon-warning-outline",
                  staticStyle: { position: "relative", top: "16px" }
                }),
                _vm._v(" "),
                _c("span", { attrs: { slot: "title" }, slot: "title" }, [
                  _vm._v("提交反馈")
                ])
              ])
            ],
            1
          )
        ],
        1
      ),
      _vm._v(" "),
      _c(
        "el-dialog",
        {
          attrs: {
            align: "left",
            title: "选择头像(不要涩图)",
            visible: _vm.dialogVisible,
            width: "590px",
            "close-on-click-modal": false
          },
          on: {
            "update:visible": function($event) {
              _vm.dialogVisible = $event
            }
          }
        },
        [
          _c("Picture"),
          _vm._v(" "),
          _c(
            "span",
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
                      _vm.dialogVisible = false
                    }
                  }
                },
                [_vm._v("关闭")]
              )
            ],
            1
          )
        ],
        1
      )
    ],
    1
  )
}
var SideBarvue_type_template_id_12898b5e_scoped_true_staticRenderFns = []
SideBarvue_type_template_id_12898b5e_scoped_true_render._withStripped = true


// CONCATENATED MODULE: ./src/views/layout/SideBar.vue?vue&type=template&id=12898b5e&scoped=true&

// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./src/views/layout/Picture.vue?vue&type=template&id=60235313&scoped=true&
var Picturevue_type_template_id_60235313_scoped_true_render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    [
      _c(
        "el-row",
        [
          _c(
            "el-col",
            { attrs: { span: 12 } },
            [
              _vm.showPic
                ? _c("div", { staticClass: "picBox" }, [
                    _c("img", {
                      style:
                        "height:" +
                        240 * _vm.imgHRate +
                        "px;width:" +
                        240 * _vm.imgWRate +
                        "px",
                      attrs: { src: _vm.img64 }
                    }),
                    _vm._v(" "),
                    _c("div", { staticClass: "shadow-pic" }),
                    _vm._v(" "),
                    _c(
                      "div",
                      { staticClass: "anti-shadow", style: _vm.theWidthMove },
                      [
                        _c(
                          "div",
                          {
                            staticClass: "anti-shadow-pic",
                            style: _vm.shadowWH
                          },
                          [
                            _c("img", {
                              staticClass: "anti-shadow-img",
                              style:
                                "height:" +
                                240 * _vm.imgHRate +
                                "px;width:" +
                                240 * _vm.imgWRate +
                                "px;top:" +
                                -_vm.cutTop +
                                "px;left:" +
                                -_vm.cutLeft +
                                "px;",
                              attrs: { src: _vm.img64 }
                            })
                          ]
                        ),
                        _vm._v(" "),
                        _c(
                          "div",
                          {
                            staticClass: "anti-shadow-move",
                            style: _vm.shadowWH,
                            on: { mousedown: _vm.clickBox }
                          },
                          [
                            _c("span", {
                              staticClass: "drag-point point-lt",
                              on: {
                                mousedown: function(e) {
                                  _vm.dragBox(e, 1)
                                }
                              }
                            }),
                            _vm._v(" "),
                            _c("span", {
                              staticClass: "drag-point point-rb",
                              on: {
                                mousedown: function(e) {
                                  _vm.dragBox(e, 4)
                                }
                              }
                            })
                          ]
                        )
                      ]
                    )
                  ])
                : _c(
                    "div",
                    { staticClass: "picBox", on: { click: _vm.inputFile } },
                    [
                      _c("i", {
                        staticClass: "el-icon-plus",
                        staticStyle: { "font-size": "28px" }
                      })
                    ]
                  ),
              _vm._v(" "),
              _c(
                "el-row",
                [
                  _vm.showPic
                    ? _c(
                        "el-button",
                        {
                          staticClass: "buttonSelect",
                          staticStyle: { margin: "5px 30%" },
                          attrs: { size: "small", type: "primary" },
                          on: { click: _vm.inputFile }
                        },
                        [_vm._v("重新选择")]
                      )
                    : _vm._e()
                ],
                1
              ),
              _vm._v(" "),
              _c("input", {
                ref: "file_input",
                staticStyle: { display: "none" },
                attrs: {
                  type: "file",
                  name: "image",
                  accept: "image/png,image/jpg,image/jpeg"
                },
                on: { change: _vm.getFile }
              })
            ],
            1
          ),
          _vm._v(" "),
          _c(
            "el-col",
            {
              attrs: {
                type: "flex",
                justify: "center",
                align: "middle",
                span: 12
              }
            },
            [
              _c("el-row", [_vm._v("头像预览")]),
              _vm._v(" "),
              _c("el-row", [
                _c("div", { staticClass: "picView" }, [
                  _c("div", { staticClass: "view-pic" }, [
                    _c("img", {
                      staticClass: "view-img",
                      style: _vm.viewpic,
                      attrs: { src: _vm.img64 }
                    })
                  ])
                ])
              ]),
              _vm._v(" "),
              _c(
                "el-row",
                [
                  _c(
                    "el-button",
                    {
                      staticClass: "buttonSelect",
                      attrs: { size: "small", type: "primary" },
                      on: { click: _vm.submitPic }
                    },
                    [_vm._v("提交")]
                  )
                ],
                1
              )
            ],
            1
          )
        ],
        1
      )
    ],
    1
  )
}
var Picturevue_type_template_id_60235313_scoped_true_staticRenderFns = []
Picturevue_type_template_id_60235313_scoped_true_render._withStripped = true


// CONCATENATED MODULE: ./src/views/layout/Picture.vue?vue&type=template&id=60235313&scoped=true&

// CONCATENATED MODULE: ./node_modules/vue-loader/lib??vue-loader-options!./src/views/layout/Picture.vue?vue&type=script&lang=js&
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


/* harmony default export */ var Picturevue_type_script_lang_js_ = ({
  data() {
    return {
      imgObj: null,
      img64: '',
      imgWRate: 1,
      imgHRate: 1,
      showPic: false,
      cutHeight: 50,
      cutWidth: 50,
      cutTop: 50,
      cutLeft: 50,
    }
  },
  methods: {
    inputFile() {
      this.$refs.file_input.dispatchEvent(new MouseEvent('click'))
    },
    getFile() {
      const inputFile = this.$refs.file_input.files[0]
      if (inputFile) {
        if (inputFile.type !== 'image/jpeg' && inputFile.type !== 'image/png' && inputFile.type !== 'image/gif') {
          this.$message.error('不是有效的图片文件！');
          return;
        }
        var reader = new FileReader();
        reader.that = this
        reader.onload = function () {
          reader.that.img64 = reader.result;
          let img = new Image();
          img.onload = function () {
            reader.that.imgObj = img
            if (this.width / this.height <= 1) reader.that.imgWRate = this.width / this.height
            else reader.that.imgHRate = this.height / this.width
          };
          img.src = reader.result;
          reader.that.imgWRate = 1
          reader.that.imgHRate = 1
          reader.that.cutHeight = 50
          reader.that.cutWidth = 50
          reader.that.cutTop = 50
          reader.that.cutLeft = 50
          reader.that.showPic = true
          reader.that.imgObj = null
        }
        reader.readAsDataURL(inputFile);
      } else {
        return;
      }
    },
    submitPic() {
      if (this.imgObj) {
        var canvas = document.createElement('canvas');
        var context = canvas.getContext('2d');

        var sourceX = this.cutLeft / 240 * this.imgObj.width;
        var sourceY = this.cutTop / 240 * this.imgObj.height;
        var sourceWidth = this.cutWidth / (240 * this.imgWRate) * this.imgObj.width;
        var sourceHeight = this.cutHeight / (240 * this.imgHRate) * this.imgObj.height;

        canvas.width = sourceWidth
        canvas.height = sourceHeight

        context.drawImage(this.imgObj, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, sourceWidth, sourceHeight);
        var res = canvas.toDataURL((/data:(.*?);/g.exec(this.img64) || ['', 'image/jpeg'])[1]); // base64
        
        utils.httpJsonMethod('POST', 'media/setavatar/', {
          'base64': encodeURIComponent(res)
        }).then(res => {
          let that = this
          setTimeout(() => {
            that.$root.AVATAR = res.url
          }, 200)
          this.$message.success('更换头像成功')
        }).catch((e) => {
          this.$message.error(e)
        })
      }
    },
    clickBox(e) {
      let that = this
      let baseY = that.cutTop - e.clientY
      let baseX = that.cutLeft - e.clientX
      document.onmousemove = (e) => {
        let tempY = baseY + e.clientY
        let tempX = baseX + e.clientX
        if (tempY < 0) that.cutTop = 0
        else if (240 * that.imgHRate - that.cutHeight < tempY)
          that.cutTop = 240 * that.imgHRate - that.cutHeight
        else that.cutTop = tempY

        if (tempX < 0) that.cutLeft = 0
        else if (240 * that.imgWRate - that.cutHeight < tempX)
          that.cutLeft = 240 * that.imgWRate - that.cutHeight
        else that.cutLeft = tempX
      }
      document.onmouseup = (e) => {
        document.onmousemove = null
        document.onmouseup = null
      }
    },
    dragBox(e, pos) {
      e.stopPropagation()
      if (pos == 1) {
        let that = this
        let baseX = e.clientX + that.cutWidth
        document.onmousemove = (e) => {
          let tempW = baseX - e.clientX
          let preWidth = that.cutWidth
          if (tempW < 8) {
            that.cutHeight = that.cutWidth = 8
          } else if (that.cutTop !== 0 && that.cutLeft < tempW - preWidth)
            that.cutHeight = that.cutWidth = preWidth + that.cutLeft
          else if (that.cutTop < tempW - that.cutHeight)
            that.cutHeight = that.cutWidth = that.cutHeight + that.cutTop
          else that.cutHeight = that.cutWidth = tempW

          that.cutLeft += preWidth - that.cutWidth
          that.cutTop += preWidth - that.cutWidth
        }
      } else if (pos == 4) {
        let that = this
        let baseX = e.clientX - that.cutWidth
        document.onmousemove = (e) => {
          let tempW = e.clientX - baseX
          if (tempW < 8) that.cutHeight = that.cutWidth = 8
          else if (Math.abs(that.cutWidth + that.cutTop - 240 * that.imgHRate) > 0.01 &&
            240 * that.imgWRate - that.cutLeft < tempW)
            that.cutHeight = that.cutWidth = 240 * that.imgWRate - that.cutLeft
          else if (240 * that.imgHRate - that.cutTop < tempW)
            that.cutHeight = that.cutWidth = 240 * that.imgHRate - that.cutTop
          else that.cutHeight = that.cutWidth = tempW
        }
      }
      document.onmouseup = (e) => {
        document.onmousemove = null
        document.onmouseup = null
      }
    }
  },
  computed: {
    shadowWH() {
      let str = ''
      str += 'height:' + this.cutHeight + 'px;'
      str += 'width:' + this.cutWidth + 'px;'
      str += 'top:' + this.cutTop + 'px;'
      str += 'left:' + this.cutLeft + 'px;'
      return str
    },
    viewpic() {
      let val = {
        'width': 0,
        'height': 0,
        'top': 0,
        'left': 0,
      }
      val.height = 240 / this.cutHeight * 190 * this.imgHRate
      val.width = 240 / this.cutWidth * 190 * this.imgWRate
      val.top = -val.height * this.cutTop / 240
      val.left = -val.width * this.cutLeft / 240
      let str = ''
      for (const i in val) {
        str += i + ':' + val[i] + 'px;'
      }
      return str
    },
    theWidthMove() {
      let val = {
        'width': 0,
        'height': 0,
        'top': 0,
        'left': 0,
      }
      val.left = (1 - this.imgWRate) * 120 + 7
      val.top = (1 - this.imgHRate) * 120 + 7
      val.width = 240 * this.imgWRate;
      val.height = 240 * this.imgHRate;
      let str = ''
      for (const i in val) {
        str += i + ':' + val[i] + 'px;'
      }
      return str
    }
  }
});

// CONCATENATED MODULE: ./src/views/layout/Picture.vue?vue&type=script&lang=js&
 /* harmony default export */ var layout_Picturevue_type_script_lang_js_ = (Picturevue_type_script_lang_js_); 
// EXTERNAL MODULE: ./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/vue-loader/lib??vue-loader-options!./src/views/layout/Picture.vue?vue&type=style&index=0&id=60235313&scoped=true&lang=css&
var Picturevue_type_style_index_0_id_60235313_scoped_true_lang_css_ = __webpack_require__(4);

// CONCATENATED MODULE: ./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/vue-loader/lib??vue-loader-options!./src/views/layout/Picture.vue?vue&type=style&index=0&id=60235313&scoped=true&lang=css&

            

var Picturevue_type_style_index_0_id_60235313_scoped_true_lang_css_options = {};

Picturevue_type_style_index_0_id_60235313_scoped_true_lang_css_options.insert = "head";
Picturevue_type_style_index_0_id_60235313_scoped_true_lang_css_options.singleton = false;

var Picturevue_type_style_index_0_id_60235313_scoped_true_lang_css_update = injectStylesIntoStyleTag_default()(Picturevue_type_style_index_0_id_60235313_scoped_true_lang_css_["a" /* default */], Picturevue_type_style_index_0_id_60235313_scoped_true_lang_css_options);



/* harmony default export */ var layout_Picturevue_type_style_index_0_id_60235313_scoped_true_lang_css_ = (Picturevue_type_style_index_0_id_60235313_scoped_true_lang_css_["a" /* default */].locals || {});
// CONCATENATED MODULE: ./src/views/layout/Picture.vue?vue&type=style&index=0&id=60235313&scoped=true&lang=css&

// CONCATENATED MODULE: ./src/views/layout/Picture.vue






/* normalize component */

var Picture_component = normalizeComponent(
  layout_Picturevue_type_script_lang_js_,
  Picturevue_type_template_id_60235313_scoped_true_render,
  Picturevue_type_template_id_60235313_scoped_true_staticRenderFns,
  false,
  null,
  "60235313",
  null
  
)

/* hot reload */
if (false) { var Picture_api; }
Picture_component.options.__file = "src/views/layout/Picture.vue"
/* harmony default export */ var Picture = (Picture_component.exports);
// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./src/views/layout/MessageBox.vue?vue&type=template&id=527e7582&scoped=true&
var MessageBoxvue_type_template_id_527e7582_scoped_true_render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    { staticClass: "msgBox" },
    [
      _c(
        "el-row",
        {
          staticStyle: { "margin-bottom": "10px" },
          attrs: { type: "flex", justify: "center", align: "middle" }
        },
        [
          _c(
            "el-col",
            { attrs: { span: 9 } },
            [
              _c(
                "el-row",
                [
                  _c(
                    "el-radio-group",
                    {
                      attrs: { size: "small" },
                      model: {
                        value: _vm.radio,
                        callback: function($$v) {
                          _vm.radio = $$v
                        },
                        expression: "radio"
                      }
                    },
                    [
                      _c(
                        "el-badge",
                        {
                          staticStyle: { "z-index": "3100" },
                          attrs: {
                            hidden: !_vm.$root.MESSAGE,
                            value: _vm.$root.MESSAGE,
                            max: 99
                          }
                        },
                        [
                          _c("el-radio-button", { attrs: { label: "1" } }, [
                            _vm._v("回复")
                          ])
                        ],
                        1
                      ),
                      _vm._v(" "),
                      _c(
                        "el-badge",
                        {
                          attrs: {
                            hidden: !_vm.$root.LIKE,
                            value: _vm.$root.LIKE,
                            max: 99
                          }
                        },
                        [
                          _c("el-radio-button", { attrs: { label: "2" } }, [
                            _vm._v("点赞")
                          ])
                        ],
                        1
                      )
                    ],
                    1
                  )
                ],
                1
              )
            ],
            1
          )
        ],
        1
      ),
      _vm._v(" "),
      _c(
        "el-row",
        { staticClass: "scrollBox" },
        [
          _c("transition", { attrs: { name: "msgfade" } }, [
            _c(
              "div",
              {
                directives: [
                  {
                    name: "show",
                    rawName: "v-show",
                    value: _vm.radio == 1,
                    expression: "radio==1"
                  },
                  {
                    name: "infinite-scroll",
                    rawName: "v-infinite-scroll",
                    value: _vm.load,
                    expression: "load"
                  }
                ],
                staticStyle: { overflow: "visible" },
                attrs: { "infinite-scroll-delay": "350" }
              },
              [
                _vm._l(_vm.replyMsg.arr, function(item, index) {
                  return _c(
                    "div",
                    { key: index },
                    [
                      _c(
                        "el-card",
                        [
                          _c(
                            "el-row",
                            [
                              _c(
                                "el-col",
                                { attrs: { span: 4 } },
                                [
                                  _c(
                                    "el-badge",
                                    {
                                      attrs: {
                                        "is-dot": "",
                                        hidden: item.isread
                                      }
                                    },
                                    [
                                      _c("el-image", {
                                        staticClass: "avatar",
                                        attrs: {
                                          src:
                                            item.creator.avatar ||
                                            _vm.$root.NULLAVATAR,
                                          fit: "cover",
                                          lazy: ""
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
                                "el-col",
                                { attrs: { span: 20 } },
                                [
                                  _c("el-row", [
                                    _c("strong", [
                                      _vm._v(_vm._s(item.creator.user))
                                    ]),
                                    _vm._v(
                                      _vm._s(" 回复了你") + "\n                "
                                    )
                                  ]),
                                  _vm._v(" "),
                                  _c(
                                    "el-row",
                                    { staticStyle: { "font-size": "12px" } },
                                    [
                                      _vm._v(
                                        "\n                  " +
                                          _vm._s(
                                            item.time.substring(5, 10) +
                                              " " +
                                              item.time.substring(11, 16)
                                          ) +
                                          "\n                "
                                      )
                                    ]
                                  )
                                ],
                                1
                              )
                            ],
                            1
                          ),
                          _vm._v(" "),
                          _c("el-row", [
                            _vm._v(
                              "\n              " +
                                _vm._s(item.reply.content) +
                                "\n            "
                            )
                          ]),
                          _vm._v(" "),
                          _c(
                            "el-row",
                            { staticClass: "text-link" },
                            [
                              _c(
                                "el-link",
                                {
                                  attrs: {
                                    type: "primary",
                                    href:
                                      "https://www1.szu.edu.cn/mailbox/view.asp?id=" +
                                      item.reply.post_id,
                                    target: "_blank"
                                  },
                                  nativeOn: {
                                    click: function($event) {
                                      return _vm.readReply(item.id, index)
                                    }
                                  }
                                },
                                [
                                  _vm._v(
                                    "\n                " +
                                      _vm._s(item.reply.post)
                                  )
                                ]
                              )
                            ],
                            1
                          )
                        ],
                        1
                      )
                    ],
                    1
                  )
                }),
                _vm._v(" "),
                _vm.replyMsg.loging
                  ? _c(
                      "el-card",
                      {
                        directives: [
                          {
                            name: "loading",
                            rawName: "v-loading",
                            value: _vm.replyMsg.loging,
                            expression: "replyMsg.loging"
                          }
                        ]
                      },
                      [
                        _c("div", { staticClass: "msg-loging" }, [
                          _vm._v("获取中")
                        ])
                      ]
                    )
                  : _c("el-card", [
                      _c("div", { staticClass: "msg-loging" }, [
                        _vm._v("到底了")
                      ])
                    ])
              ],
              2
            )
          ]),
          _vm._v(" "),
          _c("transition", { attrs: { name: "msgfade" } }, [
            _c(
              "div",
              {
                directives: [
                  {
                    name: "show",
                    rawName: "v-show",
                    value: _vm.radio == 2,
                    expression: "radio==2"
                  }
                ]
              },
              [_c("el-card", [_vm._v("\n          开发中\n        ")])],
              1
            )
          ])
        ],
        1
      ),
      _vm._v(" "),
      _c(
        "el-row",
        {
          staticStyle: { "margin-top": "10px" },
          attrs: { type: "flex", align: "middle", justify: "end" }
        },
        [
          _c(
            "el-col",
            { attrs: { span: 6 } },
            [
              _c(
                "el-button",
                {
                  staticClass: "text-buttonSelect-mini",
                  attrs: { type: "text", size: "mini" },
                  on: {
                    click: function($event) {
                      return _vm.readReply()
                    }
                  }
                },
                [_vm._v("全部收取")]
              )
            ],
            1
          )
        ],
        1
      )
    ],
    1
  )
}
var MessageBoxvue_type_template_id_527e7582_scoped_true_staticRenderFns = []
MessageBoxvue_type_template_id_527e7582_scoped_true_render._withStripped = true


// CONCATENATED MODULE: ./src/views/layout/MessageBox.vue?vue&type=template&id=527e7582&scoped=true&

// CONCATENATED MODULE: ./node_modules/vue-loader/lib??vue-loader-options!./src/views/layout/MessageBox.vue?vue&type=script&lang=js&
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


/* harmony default export */ var MessageBoxvue_type_script_lang_js_ = ({
  data() {
    return {
      radio: "1",
      replyMsg: {
        currentPage: 1,
        total: -1,
        limit: 4,
        cache: 0,
        loging: true,
        arr: []
      }
    };
  },
  mounted() {
    this.getReplyMsg();
  },
  methods: {
    load() {
      if (this.replyMsg.arr.length >= this.replyMsg.total) {
        this.replyMsg.loging = false
        return;
      }
      this.getReplyMsg();
    },
    getReplyMsg() {
      utils.httpJsonMethod('GET', 'msg/bereply/', {
        'limit': this.replyMsg.limit,
        'offset': this.replyMsg.currentPage,
      }).then((data) => {
        this.replyMsg.total = data.total;
        this.replyMsg.currentPage++;
        for (let i = 0; i < data.msg.length; i++) {
          // 处理多次相同请求
          let str = localStorage.getItem(data.msg[i].reply.post_id);
          if (str == "wait") {
            // 轮询
            let timeInter = setInterval(() => {
              str = localStorage.getItem(data.msg[i].reply.post_id);
              if (str != "wait") {
                this.replyMsg.arr.push(data.msg[i])
                this.$set(data.msg[i].reply, 'post', str)
                // 轮询退出
                clearInterval(timeInter)
              }
            }, 50)
          } else if (str) {
            this.replyMsg.arr.push(data.msg[i])
            this.$set(data.msg[i].reply, 'post', str)
          } else {
            // 先到者获取一个wait标志锁
            localStorage.setItem(data.msg[i].reply.post_id, 'wait')
            utils.httpHtmlMethod("GET", "/mailbox/view.asp", {
              "id": data.msg[i].reply.post_id
            }, "gb2312").then((res) => {
              this.replyMsg.arr.push(data.msg[i])

              // 获取适合长度的字符串
              str = this.getStr(str, res)

              localStorage.setItem(data.msg[i].reply.post_id, str)
              this.$set(data.msg[i].reply, 'post', str)
            })
          }
        }
      })
    },
    readReply(id, index) {
      let data = {
        'all': 1
      }
      if (id) {
        if (this.replyMsg.arr[index].isread) return;
        data = {
          'id': id
        }
      }
      utils.httpJsonMethod('POST', 'msg/bereply/', data).then((res) => {
        if (data.all) {
          this.$message.success(res.result)
          for (let i = 0; i < this.replyMsg.arr.length; i++) {
            if (!this.replyMsg.arr[i].isread) {
              this.replyMsg.arr[i].isread = true
              this.$root.MESSAGE--;
            }
          }
        } else if (!this.replyMsg.arr[index].isread) {
          this.replyMsg.arr[index].isread = true
          this.$root.MESSAGE--;
        }
      }).catch((e) => {
        this.$message.error(e)
      })
    },
    getStr(str, res) {
      str = '详情页: ' + res.match(/(<title>=?)(.*?)(?=<\/title>)/)[2].slice(0, -8)

      let fontLength = utils.getLength14Size(str)
      if (fontLength > 263) {
        str = str.substring(0, Math.floor(str.length * (263 - 10.13) /
          fontLength))
        fontLength = utils.getLength14Size(str)
        while (fontLength > 263 - 10.13) {
          str = str.substring(0, str.length - 1)
          fontLength = utils.getLength14Size(str)
        }
        str += "..."
      }
      return str
    }
  }
});

// CONCATENATED MODULE: ./src/views/layout/MessageBox.vue?vue&type=script&lang=js&
 /* harmony default export */ var layout_MessageBoxvue_type_script_lang_js_ = (MessageBoxvue_type_script_lang_js_); 
// EXTERNAL MODULE: ./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/vue-loader/lib??vue-loader-options!./src/views/layout/MessageBox.vue?vue&type=style&index=0&id=527e7582&scoped=true&lang=css&
var MessageBoxvue_type_style_index_0_id_527e7582_scoped_true_lang_css_ = __webpack_require__(5);

// CONCATENATED MODULE: ./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/vue-loader/lib??vue-loader-options!./src/views/layout/MessageBox.vue?vue&type=style&index=0&id=527e7582&scoped=true&lang=css&

            

var MessageBoxvue_type_style_index_0_id_527e7582_scoped_true_lang_css_options = {};

MessageBoxvue_type_style_index_0_id_527e7582_scoped_true_lang_css_options.insert = "head";
MessageBoxvue_type_style_index_0_id_527e7582_scoped_true_lang_css_options.singleton = false;

var MessageBoxvue_type_style_index_0_id_527e7582_scoped_true_lang_css_update = injectStylesIntoStyleTag_default()(MessageBoxvue_type_style_index_0_id_527e7582_scoped_true_lang_css_["a" /* default */], MessageBoxvue_type_style_index_0_id_527e7582_scoped_true_lang_css_options);



/* harmony default export */ var layout_MessageBoxvue_type_style_index_0_id_527e7582_scoped_true_lang_css_ = (MessageBoxvue_type_style_index_0_id_527e7582_scoped_true_lang_css_["a" /* default */].locals || {});
// CONCATENATED MODULE: ./src/views/layout/MessageBox.vue?vue&type=style&index=0&id=527e7582&scoped=true&lang=css&

// CONCATENATED MODULE: ./src/views/layout/MessageBox.vue






/* normalize component */

var MessageBox_component = normalizeComponent(
  layout_MessageBoxvue_type_script_lang_js_,
  MessageBoxvue_type_template_id_527e7582_scoped_true_render,
  MessageBoxvue_type_template_id_527e7582_scoped_true_staticRenderFns,
  false,
  null,
  "527e7582",
  null
  
)

/* hot reload */
if (false) { var MessageBox_api; }
MessageBox_component.options.__file = "src/views/layout/MessageBox.vue"
/* harmony default export */ var MessageBox = (MessageBox_component.exports);
// CONCATENATED MODULE: ./node_modules/vue-loader/lib??vue-loader-options!./src/views/layout/SideBar.vue?vue&type=script&lang=js&
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




/* harmony default export */ var SideBarvue_type_script_lang_js_ = ({
  components: {
    Picture: Picture,
    MessageBox: MessageBox
  },
  data() {
    return {
      active: '1',
      dialogVisible: false,
      popoverVisible: false,
    };
  },
  methods: {
    selectIcon(index) {
      this.active = index
      if (index == 1) this.popoverVisible = true
      else if (index == 2) this.setNickname()
      else if (index == 3) this.dialogVisible = true
      else if (index == 4) this.debug()
    },
    setNickname() {
      this.$prompt('请输入要修改的昵称', '注意长度', {
        closeOnClickModal: false,
        distinguishCancelAndClose: true,
        confirmButtonText: '确定修改',
        cancelButtonText: '清空已存在昵称',
        inputValidator: (value) => {
          if (value.length > 12) return false
          return true
        },
        inputErrorMessage: '长度过长'
      }).then(({
        value
      }) => {
        utils.httpJsonMethod("POST", "setnickname/", {
          'nickname': value
        }).then((data) => {
          this.$root.NICKNAME = data['nickname']
          this.$message({
            type: 'success',
            message: '修改成功 ' + data.nickname
          });
        }).catch((e) => {
          this.$message.error(e)
        })
      }).catch((action) => {
        if (action === 'cancel')
          utils.httpJsonMethod("POST", "setnickname/", {
            'empty': 'empty'
          }).then((data) => {
            this.$root.NICKNAME = data['user']
            this.$message({
              type: 'success',
              message: '清空昵称成功'
            });
          })
      });
    },
    debug() {
      this.$alert('发送到邮箱1972404126@qq.com', '问题反馈', {
        confirmButtonText: '确定'
      });
    }
  }
});

// CONCATENATED MODULE: ./src/views/layout/SideBar.vue?vue&type=script&lang=js&
 /* harmony default export */ var layout_SideBarvue_type_script_lang_js_ = (SideBarvue_type_script_lang_js_); 
// EXTERNAL MODULE: ./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/vue-loader/lib??vue-loader-options!./src/views/layout/SideBar.vue?vue&type=style&index=0&id=12898b5e&scoped=true&lang=css&
var SideBarvue_type_style_index_0_id_12898b5e_scoped_true_lang_css_ = __webpack_require__(6);

// CONCATENATED MODULE: ./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/vue-loader/lib??vue-loader-options!./src/views/layout/SideBar.vue?vue&type=style&index=0&id=12898b5e&scoped=true&lang=css&

            

var SideBarvue_type_style_index_0_id_12898b5e_scoped_true_lang_css_options = {};

SideBarvue_type_style_index_0_id_12898b5e_scoped_true_lang_css_options.insert = "head";
SideBarvue_type_style_index_0_id_12898b5e_scoped_true_lang_css_options.singleton = false;

var SideBarvue_type_style_index_0_id_12898b5e_scoped_true_lang_css_update = injectStylesIntoStyleTag_default()(SideBarvue_type_style_index_0_id_12898b5e_scoped_true_lang_css_["a" /* default */], SideBarvue_type_style_index_0_id_12898b5e_scoped_true_lang_css_options);



/* harmony default export */ var layout_SideBarvue_type_style_index_0_id_12898b5e_scoped_true_lang_css_ = (SideBarvue_type_style_index_0_id_12898b5e_scoped_true_lang_css_["a" /* default */].locals || {});
// CONCATENATED MODULE: ./src/views/layout/SideBar.vue?vue&type=style&index=0&id=12898b5e&scoped=true&lang=css&

// CONCATENATED MODULE: ./src/views/layout/SideBar.vue






/* normalize component */

var SideBar_component = normalizeComponent(
  layout_SideBarvue_type_script_lang_js_,
  SideBarvue_type_template_id_12898b5e_scoped_true_render,
  SideBarvue_type_template_id_12898b5e_scoped_true_staticRenderFns,
  false,
  null,
  "12898b5e",
  null
  
)

/* hot reload */
if (false) { var SideBar_api; }
SideBar_component.options.__file = "src/views/layout/SideBar.vue"
/* harmony default export */ var SideBar = (SideBar_component.exports);
// CONCATENATED MODULE: ./src/function/change.js


/* harmony default export */ var change = ({
    changePrePage(root, vue) {
        root.POSTID = utils.getPostID()
        let prePage, nextPage;
        prePage = document.getElementById('prePage') ||
            document.querySelector("body > table > tbody > tr:nth-child(2) > td > table > tbody > tr:nth-child(3) > td > table > tbody > tr:nth-child(1) > td > table > tbody > tr > td:nth-child(1) > a:nth-child(1)")

        nextPage = document.getElementById('nextPage') ||
            document.querySelector("body > table > tbody > tr:nth-child(2) > td > table > tbody > tr:nth-child(3) > td > table > tbody > tr:nth-child(1) > td > table > tbody > tr > td:nth-child(1) > a:nth-child(2)")
        this.hotLoad(prePage, nextPage, root, vue)
    },

    hotLoad(prePage, nextPage, root, vue) {
        this.changeInter(prePage, nextPage, root, prePage, vue)
        this.changeInter(prePage, nextPage, root, nextPage, vue)
    },

    changeInter(prePage, nextPage, root, currentPage, vue) {
        let search = currentPage.search
        let url = currentPage.href

        currentPage.href = "javascript:void(0);"
        currentPage.onclick = () => {
            utils.httpHtmlMethod("GET", url, {}, "gb2312").then((res) => {
                vue.showURL = 0;

                let html = res.match(/width="90%" bgcolor="#FFFFFF">([\s\S]*?)<\/table>/)[1];
                let id = res.matchAll(/\[<a href="(.*?)"/g)

                let changeTable =
                    document.querySelector("body > table > tbody > tr:nth-child(2) > td > table > tbody > tr:nth-child(3) > td > table > tbody > tr:nth-child(2) > td > table")
                if (changeTable) {
                    changeTable.innerHTML = html
                }

                prePage.href = (id.next()).value[1];
                nextPage.href = (id.next()).value[1];
                root.POSTID = utils.getPostID()

                window.history.pushState({
                    table: html,
                    prePage: prePage.href,
                    nextPage: nextPage.href,
                    postid: root.POSTID
                }, document.title, search);

                document.title = res.match(/(<title>=?)(.*?)(?=<\/title>)/)[2]

                vue.$nextTick(function () {
                    vue.showURL = 1;
                })
                this.hotLoad(prePage, nextPage, root, vue)
            })
        }
    },

    popstateListen(event, root, vue) {
        root.POSTID = event.state.postid

        let prePage, nextPage;
        prePage = document.getElementById('prePage') ||
            document.querySelector("body > table > tbody > tr:nth-child(2) > td > table > tbody > tr:nth-child(3) > td > table > tbody > tr:nth-child(1) > td > table > tbody > tr > td:nth-child(1) > a:nth-child(1)")

        nextPage = document.getElementById('nextPage') ||
            document.querySelector("body > table > tbody > tr:nth-child(2) > td > table > tbody > tr:nth-child(3) > td > table > tbody > tr:nth-child(1) > td > table > tbody > tr > td:nth-child(1) > a:nth-child(2)")

        prePage.href = event.state.prePage
        nextPage.href = event.state.nextPage

        let changeTable =
            document.querySelector("body > table > tbody > tr:nth-child(2) > td > table > tbody > tr:nth-child(3) > td > table > tbody > tr:nth-child(2) > td > table")
        if (changeTable) {
            changeTable.innerHTML = event.state.table
        }

        this.hotLoad(prePage, nextPage, root, vue)
    }
});
// CONCATENATED MODULE: ./node_modules/vue-loader/lib??vue-loader-options!./src/App.vue?vue&type=script&lang=js&
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






/* harmony default export */ var Appvue_type_script_lang_js_ = ({
  name: "App",
  components: {
    Comment: Comment,
    SideBar: SideBar,
  },
  data() {
    return {
      showURL: 0,
      navOut: false,
    };
  },
  beforeMount() {
    setTimeout(() => {
      this.navOut = true;
    }, 0);
    let linkElm = document.createElement("link");
    linkElm.setAttribute("rel", "stylesheet");
    linkElm.setAttribute("type", "text/css");
    linkElm.setAttribute(
      "href",
      "https://at.alicdn.com/t/font_2377626_16z07jla638g.css"
    );
    document.head.appendChild(linkElm);

    let a = document.querySelector(
      "body > table > tbody > tr:nth-child(1) > td > table > tbody > tr:nth-child(3) > td:nth-child(1) > table > tbody > tr:nth-child(1) > td > a:nth-child(3)"
    );
    a &&
      (a.onclick = () => {
        utils.httpJsonMethod("GET", "logout/", {});
      });

    if (false) {}
    else
      utils
      .httpHtmlMethod(
        "GET",
        "https://www1.szu.edu.cn/baoxiu/111.asp", {},
        "gb2312"
      )
      .then((res) => {
        if (res.match(/(学工号(.*?))<\/b>/g)) {
          this.getMsg();
        } else {
          this.$root.UUID = 0;
        }
      });
    if (utils.getQueryVariable("id")) {
      this.showURL = 1;
      change.changePrePage(this.$root, this);
      window.onpopstate = (e) => {
        this.showURL = 0;
        change.popstateListen(e, this.$root, this)
        this.$nextTick(function () {
          this.showURL = 1;
        })
      }
    }
  },
  methods: {
    getMsg() {
      utils
        .httpJsonMethod("POST", "login/", {
          ASP: utils.getASPSESSION(),
        })
        .then((data) => {
          this.$root.AVATAR = data.avatar;
          this.$root.UUID = data.uuid;
          this.$root.NICKNAME = data.nickname;
          this.$root.MESSAGE = data.reply;
          this.$root.LIKE = 0;
        })
        .catch((e) => {
          this.$root.UUID = 0;
          this.$message.error(e);
        });
    },
  },
});

// CONCATENATED MODULE: ./src/App.vue?vue&type=script&lang=js&
 /* harmony default export */ var src_Appvue_type_script_lang_js_ = (Appvue_type_script_lang_js_); 
// EXTERNAL MODULE: ./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/vue-loader/lib??vue-loader-options!./src/App.vue?vue&type=style&index=0&lang=css&
var Appvue_type_style_index_0_lang_css_ = __webpack_require__(7);

// CONCATENATED MODULE: ./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/vue-loader/lib??vue-loader-options!./src/App.vue?vue&type=style&index=0&lang=css&

            

var Appvue_type_style_index_0_lang_css_options = {};

Appvue_type_style_index_0_lang_css_options.insert = "head";
Appvue_type_style_index_0_lang_css_options.singleton = false;

var Appvue_type_style_index_0_lang_css_update = injectStylesIntoStyleTag_default()(Appvue_type_style_index_0_lang_css_["a" /* default */], Appvue_type_style_index_0_lang_css_options);



/* harmony default export */ var lib_vue_loader_options_src_Appvue_type_style_index_0_lang_css_ = (Appvue_type_style_index_0_lang_css_["a" /* default */].locals || {});
// CONCATENATED MODULE: ./src/App.vue?vue&type=style&index=0&lang=css&

// CONCATENATED MODULE: ./src/App.vue






/* normalize component */

var App_component = normalizeComponent(
  src_Appvue_type_script_lang_js_,
  render,
  staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var App_api; }
App_component.options.__file = "src/App.vue"
/* harmony default export */ var App = (App_component.exports);
// CONCATENATED MODULE: ./src/main.js

utils.loadInit()




if (false) {}

new external_Vue_default.a({
  render: h => h(App),
  data() {
    return {
      UUID: -1,
      AVATAR: null,
      NICKNAME: "未登录",
      MESSAGE: 0,
      LIKE: 0,
      NULLAVATAR: 'https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png',
      POSTID: 0,
    }
  }
}).$mount('#app')

/***/ })
/******/ ]);