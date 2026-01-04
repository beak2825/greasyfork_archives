// ==UserScript==
// @name         CSGO饰品2D/3D对比
// @namespace    https://github.com/qianjiachun
// @version      2024.05.31.02
// @description  使用图像处理技术对CSGO饰品网站上的皮肤进行对比，可以快速分辨出饰品细微的差异，不用再手动来回切换对比了。同时显示饰品上架时间和修改时间。
// @author       小淳
// @match        *://buff.163.com/goods*
// @match        *://buff.163.com/3d_inspect/cs2?compare=true*
// @match        *://spect.fp.ps.netease.com/*
// @match        *://buff.163.com/compare3d*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        GM_setClipboard
// @grant        unsafeWindow
// @run-at       document-start
// @require      https://fastly.jsdelivr.net/npm/notice.js@0.4.0/dist/notice.js
// @require      https://lib.baomitu.com/vue/3.0.11/vue.global.prod.js
// @require      https://fastly.jsdelivr.net/npm/comparison-slider@1.1.0/dist/comparison-slider.min.js
// @require      https://fastly.jsdelivr.net/npm/canvas-compare@3.0.0/src/canvas-compare.min.js
// @require      https://fastly.jsdelivr.net/npm/@vueform/slider@2.0.4/dist/slider.global.js
// @downloadURL https://update.greasyfork.org/scripts/427277/CSGO%E9%A5%B0%E5%93%812D3D%E5%AF%B9%E6%AF%94.user.js
// @updateURL https://update.greasyfork.org/scripts/427277/CSGO%E9%A5%B0%E5%93%812D3D%E5%AF%B9%E6%AF%94.meta.js
// ==/UserScript==

unsafeWindow.hookList = [];
unsafeWindow.hookCallback = function (xhr) {
    // console.log(xhr);
}
function addXMLRequestCallback(callback){
    var oldSend, i;
    if( XMLHttpRequest.callbacks ) {
        XMLHttpRequest.callbacks.push( callback );
    } else {
        XMLHttpRequest.callbacks = [callback];
        oldSend = XMLHttpRequest.prototype.send;
        XMLHttpRequest.prototype.send = function(){
            for( i = 0; i < XMLHttpRequest.callbacks.length; i++ ) {
                XMLHttpRequest.callbacks[i]( this );
            }
            oldSend.apply(this, arguments);
        }
    }
}
if (location.href.indexOf("goods") !== -1) {
    addXMLRequestCallback( function( xhr ) {
        xhr.addEventListener("load", function(){
            if ( xhr.readyState == 4 && xhr.status == 200 ) {
                unsafeWindow.hookList.push(xhr);
                unsafeWindow.hookCallback(xhr);
            }
        });
    });
}
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
/******/ 	__webpack_require__.p = "/dist/";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 31);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = Vue;

/***/ }),
/* 1 */
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

  if (sourceMap && btoa) {
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
/* 2 */
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

/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = VueformSlider;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

var api = __webpack_require__(1);
            var content = __webpack_require__(14);

            content = content.__esModule ? content.default : content;

            if (typeof content === 'string') {
              content = [[module.i, content, '']];
            }

var options = {};

options.insert = "head";
options.singleton = false;

var update = api(content, options);



module.exports = content.locals || {};

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

var api = __webpack_require__(1);
            var content = __webpack_require__(16);

            content = content.__esModule ? content.default : content;

            if (typeof content === 'string') {
              content = [[module.i, content, '']];
            }

var options = {};

options.insert = "head";
options.singleton = false;

var update = api(content, options);



module.exports = content.locals || {};

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

var api = __webpack_require__(1);
            var content = __webpack_require__(26);

            content = content.__esModule ? content.default : content;

            if (typeof content === 'string') {
              content = [[module.i, content, '']];
            }

var options = {};

options.insert = "head";
options.singleton = false;

var update = api(content, options);



module.exports = content.locals || {};

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

var api = __webpack_require__(1);
            var content = __webpack_require__(28);

            content = content.__esModule ? content.default : content;

            if (typeof content === 'string') {
              content = [[module.i, content, '']];
            }

var options = {};

options.insert = "head";
options.singleton = false;

var update = api(content, options);



module.exports = content.locals || {};

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

var api = __webpack_require__(1);
            var content = __webpack_require__(30);

            content = content.__esModule ? content.default : content;

            if (typeof content === 'string') {
              content = [[module.i, content, '']];
            }

var options = {};

options.insert = "head";
options.singleton = false;

var update = api(content, options);



module.exports = content.locals || {};

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

var api = __webpack_require__(1);
            var content = __webpack_require__(10);

            content = content.__esModule ? content.default : content;

            if (typeof content === 'string') {
              content = [[module.i, content, '']];
            }

var options = {};

options.insert = "head";
options.singleton = false;

var update = api(content, options);



module.exports = content.locals || {};

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(2);
exports = ___CSS_LOADER_API_IMPORT___(false);
// Module
exports.push([module.i, ".noticejs-top{top:0;width:100%!important}.noticejs-top .item{border-radius:0!important;margin:0!important}.noticejs-topRight{top:10px;right:10px}.noticejs-topLeft{top:10px;left:10px}.noticejs-topCenter{top:10px;left:50%;transform:translate(-50%)}.noticejs-middleLeft,.noticejs-middleRight{right:10px;top:50%;transform:translateY(-50%)}.noticejs-middleLeft{left:10px}.noticejs-middleCenter{top:50%;left:50%;transform:translate(-50%,-50%)}.noticejs-bottom{bottom:0;width:100%!important}.noticejs-bottom .item{border-radius:0!important;margin:0!important}.noticejs-bottomRight{bottom:10px;right:10px}.noticejs-bottomLeft{bottom:10px;left:10px}.noticejs-bottomCenter{bottom:10px;left:50%;transform:translate(-50%)}.noticejs{font-family:Helvetica Neue,Helvetica,Arial,sans-serif}.noticejs .item{margin:0 0 10px;border-radius:3px;overflow:hidden}.noticejs .item .close{float:right;font-size:18px;font-weight:700;line-height:1;color:#fff;text-shadow:0 1px 0 #fff;opacity:1;margin-right:7px}.noticejs .item .close:hover{opacity:.5;color:#000}.noticejs .item a{color:#fff;border-bottom:1px dashed #fff}.noticejs .item a,.noticejs .item a:hover{text-decoration:none}.noticejs .success{background-color:#64ce83}.noticejs .success .noticejs-heading{background-color:#3da95c;color:#fff;padding:10px}.noticejs .success .noticejs-body{color:#fff;padding:10px}.noticejs .success .noticejs-body:hover{visibility:visible!important}.noticejs .success .noticejs-content{visibility:visible}.noticejs .info{background-color:#3ea2ff}.noticejs .info .noticejs-heading{background-color:#067cea;color:#fff;padding:10px}.noticejs .info .noticejs-body{color:#fff;padding:10px}.noticejs .info .noticejs-body:hover{visibility:visible!important}.noticejs .info .noticejs-content{visibility:visible}.noticejs .warning{background-color:#ff7f48}.noticejs .warning .noticejs-heading{background-color:#f44e06;color:#fff;padding:10px}.noticejs .warning .noticejs-body{color:#fff;padding:10px}.noticejs .warning .noticejs-body:hover{visibility:visible!important}.noticejs .warning .noticejs-content{visibility:visible}.noticejs .error{background-color:#e74c3c}.noticejs .error .noticejs-heading{background-color:#ba2c1d;color:#fff;padding:10px}.noticejs .error .noticejs-body{color:#fff;padding:10px}.noticejs .error .noticejs-body:hover{visibility:visible!important}.noticejs .error .noticejs-content{visibility:visible}.noticejs .progressbar{width:100%}.noticejs .progressbar .bar{width:1%;height:30px;background-color:#4caf50}.noticejs .success .noticejs-progressbar{width:100%;background-color:#64ce83;margin-top:-1px}.noticejs .success .noticejs-progressbar .noticejs-bar{width:100%;height:5px;background:#3da95c}.noticejs .info .noticejs-progressbar{width:100%;background-color:#3ea2ff;margin-top:-1px}.noticejs .info .noticejs-progressbar .noticejs-bar{width:100%;height:5px;background:#067cea}.noticejs .warning .noticejs-progressbar{width:100%;background-color:#ff7f48;margin-top:-1px}.noticejs .warning .noticejs-progressbar .noticejs-bar{width:100%;height:5px;background:#f44e06}.noticejs .error .noticejs-progressbar{width:100%;background-color:#e74c3c;margin-top:-1px}.noticejs .error .noticejs-progressbar .noticejs-bar{width:100%;height:5px;background:#ba2c1d}@keyframes noticejs-fadeOut{0%{opacity:1}to{opacity:0}}.noticejs-fadeOut{animation-name:noticejs-fadeOut}@keyframes noticejs-modal-in{to{opacity:.3}}@keyframes noticejs-modal-out{to{opacity:0}}.noticejs-rtl .noticejs-heading{direction:rtl}.noticejs-rtl .close{float:left!important;margin-left:7px;margin-right:0!important}.noticejs-rtl .noticejs-content{direction:rtl}.noticejs{position:fixed;z-index:10050;width:320px}.noticejs ::-webkit-scrollbar{width:8px}.noticejs ::-webkit-scrollbar-button{width:8px;height:5px}.noticejs ::-webkit-scrollbar-track{border-radius:10px}.noticejs ::-webkit-scrollbar-thumb{background:hsla(0,0%,100%,.5);border-radius:10px}.noticejs ::-webkit-scrollbar-thumb:hover{background:#fff}.noticejs-modal{position:fixed;width:100%;height:100%;background-color:#000;z-index:10000;opacity:.3;left:0;top:0}.noticejs-modal-open{opacity:0;animation:noticejs-modal-in .3s ease-out}.noticejs-modal-close{animation:noticejs-modal-out .3s ease-out;animation-fill-mode:forwards}", ""]);
// Exports
module.exports = exports;


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

var api = __webpack_require__(1);
            var content = __webpack_require__(12);

            content = content.__esModule ? content.default : content;

            if (typeof content === 'string') {
              content = [[module.i, content, '']];
            }

var options = {};

options.insert = "head";
options.singleton = false;

var update = api(content, options);



module.exports = content.locals || {};

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(2);
exports = ___CSS_LOADER_API_IMPORT___(false);
// Module
exports.push([module.i, ".el-button {\r\n    display: inline-block;\r\n    line-height: 1;\r\n    white-space: nowrap;\r\n    cursor: pointer;\r\n    background: #fff;\r\n    border: 1px solid #dcdfe6;\r\n    color: #606266;\r\n    -webkit-appearance: none;\r\n    text-align: center;\r\n    box-sizing: border-box;\r\n    outline: none;\r\n    margin: 0;\r\n    transition: .1s;\r\n    font-weight: 500;\r\n    -moz-user-select: none;\r\n    -webkit-user-select: none;\r\n    -ms-user-select: none;\r\n    padding: 12px 20px;\r\n    font-size: 14px;\r\n    border-radius: 4px;\r\n}\r\n\r\n.el-button--primary {\r\n    color: #fff;\r\n    background-color: #409eff;\r\n    border-color: #409eff;\r\n}\r\n\r\n.el-button--primary:hover {\r\n    background: #66b1ff;\r\n    border-color: #66b1ff;\r\n    color: #fff;\r\n}\r\n\r\n.el-button.is-disabled, .el-button.is-disabled:focus, .el-button.is-disabled:hover {\r\n    color: #c0c4cc;\r\n    cursor: not-allowed;\r\n    background-image: none;\r\n    background-color: #fff;\r\n    border-color: #ebeef5;\r\n}\r\n\r\n.el-button--success {\r\n    color: #fff;\r\n    background-color: #67c23a;\r\n    border-color: #67c23a;\r\n}\r\n.el-button--success:hover {\r\n    background: #85ce61;\r\n    border-color: #85ce61;\r\n    color: #fff;\r\n}\r\n\r\n.el-button--danger {\r\n    color: #fff;\r\n    background-color: #f56c6c;\r\n    border-color: #f56c6c;\r\n}\r\n\r\n.el-button--danger:hover {\r\n    background: #f78989;\r\n    border-color: #f78989;\r\n    color: #fff;\r\n}\r\n\r\n.el-button--warning {\r\n    color: #fff;\r\n    background-color: #e6a23c;\r\n    border-color: #e6a23c;\r\n}\r\n\r\n.el-button--warning:focus, .el-button--warning:hover {\r\n    background: #ebb563;\r\n    border-color: #ebb563;\r\n    color: #fff;\r\n}", ""]);
// Exports
module.exports = exports;


/***/ }),
/* 13 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _node_modules_style_loader_dist_cjs_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_dist_stylePostLoader_js_node_modules_vue_loader_dist_index_js_ref_8_0_SkinInfo_vue_vue_type_style_index_0_id_c03073cc_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4);
/* harmony import */ var _node_modules_style_loader_dist_cjs_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_dist_stylePostLoader_js_node_modules_vue_loader_dist_index_js_ref_8_0_SkinInfo_vue_vue_type_style_index_0_id_c03073cc_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_cjs_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_dist_stylePostLoader_js_node_modules_vue_loader_dist_index_js_ref_8_0_SkinInfo_vue_vue_type_style_index_0_id_c03073cc_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__);
/* unused harmony reexport * */


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(2);
exports = ___CSS_LOADER_API_IMPORT___(false);
// Module
exports.push([module.i, "\n.imgWrap[data-v-c03073cc] {\r\n    text-align: center;\r\n    background: url(https://buff.163.com/static/images/item_bg.png);\r\n    background-size: cover;\r\n    width: 88px;\r\n    height: 66px;\n}\n.imgWrap img[data-v-c03073cc] {\r\n    width: 66px;\r\n    height: 66px;\r\n    max-width: 88px;\n}\n.imgWrap .view-btn[data-v-c03073cc] {\r\n    display: block;\r\n    width: 48px;\r\n    position: relative;\r\n    top: -22px;\r\n    left: 2px;\r\n    color: white !important;\n}\n.infoWrap[data-v-c03073cc] {\r\n    margin-left: 15px;\r\n    display: flex;\r\n    flex-direction: column;\r\n    text-align: left;\r\n    justify-content: flex-end;\n}\r\n", ""]);
// Exports
module.exports = exports;


/***/ }),
/* 15 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _node_modules_style_loader_dist_cjs_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_dist_stylePostLoader_js_node_modules_vue_loader_dist_index_js_ref_8_0_CompareList_vue_vue_type_style_index_0_id_8a9384f8_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5);
/* harmony import */ var _node_modules_style_loader_dist_cjs_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_dist_stylePostLoader_js_node_modules_vue_loader_dist_index_js_ref_8_0_CompareList_vue_vue_type_style_index_0_id_8a9384f8_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_cjs_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_dist_stylePostLoader_js_node_modules_vue_loader_dist_index_js_ref_8_0_CompareList_vue_vue_type_style_index_0_id_8a9384f8_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__);
/* unused harmony reexport * */


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(2);
exports = ___CSS_LOADER_API_IMPORT___(false);
// Module
exports.push([module.i, "\n.compare__table[data-v-8a9384f8] {\r\n    width: 100%;\r\n    margin-bottom: 1rem;\r\n    color: rgb(29,30,35);\r\n    border-collapse: collapse;\r\n    border-spacing: 0;\r\n    text-align: center;\n}\n.compare__table th[data-v-8a9384f8], .compare__table td[data-v-8a9384f8]{\r\n    border: 1px solid #dee2e6;\r\n    padding: .75rem;\n}\n.compare__table thead th[data-v-8a9384f8]{\r\n    color: #fff;\r\n    background-color: #343a40;\r\n    border-color: #454d55;\n}\n.compare__table tbody[data-v-8a9384f8] {\r\n    display: block;\r\n    height: 400px;\r\n    overflow-y: scroll;\r\n    overflow-x: hidden;\n}\n.compare__table thead[data-v-8a9384f8],\r\n.compare__table tbody tr[data-v-8a9384f8] {\r\n    display: table;\r\n    width: 100%;\r\n    table-layout: fixed;\n}\n.compare__table thead[data-v-8a9384f8] {\r\n    width: calc( 100% - 4px)\n}\n.compare__table tbody tr[data-v-8a9384f8]:hover {\r\n    background: rgb(245,245,245);\n}\n.list-footer[data-v-8a9384f8]{\r\n    text-align: right;\n}\r\n", ""]);
// Exports
module.exports = exports;


/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

var api = __webpack_require__(1);
            var content = __webpack_require__(18);

            content = content.__esModule ? content.default : content;

            if (typeof content === 'string') {
              content = [[module.i, content, '']];
            }

var options = {};

options.insert = "head";
options.singleton = false;

var update = api(content, options);



module.exports = content.locals || {};

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(2);
exports = ___CSS_LOADER_API_IMPORT___(false);
// Module
exports.push([module.i, ".compare__wrap {\r\n    position: absolute;\r\n    z-index: 1015;\r\n}\r\n\r\n.compare__mask {\r\n    width: 100%;\r\n    height: 100%;\r\n    background-color: rgba(0, 0, 0, 0.6);\r\n}\r\n\r\n.compare__dialog {\r\n    padding: 10px;\r\n    width: 800px;\r\n    height: 500px;\r\n    background-color: white;\r\n    position: fixed;\r\n    left: 0;\r\n    right: 0;\r\n    top: 250px;\r\n    margin: auto;\r\n    box-shadow: 0px 0px 10px 0px #888888;\r\n    border-radius: 10px;\r\n}", ""]);
// Exports
module.exports = exports;


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

var api = __webpack_require__(1);
            var content = __webpack_require__(20);

            content = content.__esModule ? content.default : content;

            if (typeof content === 'string') {
              content = [[module.i, content, '']];
            }

var options = {};

options.insert = "head";
options.singleton = false;

var update = api(content, options);



module.exports = content.locals || {};

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(2);
exports = ___CSS_LOADER_API_IMPORT___(false);
// Module
exports.push([module.i, "* {\r\n    padding: 0;\r\n    margin: 0;\r\n}\r\n\r\n.compare3d__iframe {\r\n    width: 100%;\r\n    height: 100vh;\r\n    border: 0px solid white;\r\n}\r\n\r\n.compare3d__tips {\r\n    position: fixed;\r\n    color: rgba(255, 255, 255, 0.6);\r\n    font-size: 14px;\r\n    top: 70px;\r\n    left: 10px;\r\n    cursor: default;\r\n    user-select: none;\r\n}\r\n\r\n.compare3d__watermark {\r\n    position: fixed;\r\n    right: 10px;\r\n    top: 70px;\r\n    color: rgba(255, 255, 255, 0.6);\r\n    z-index: 1;\r\n    cursor: pointer;\r\n    font-size: 24px;\r\n    user-select: none;\r\n}", ""]);
// Exports
module.exports = exports;


/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

var api = __webpack_require__(1);
            var content = __webpack_require__(22);

            content = content.__esModule ? content.default : content;

            if (typeof content === 'string') {
              content = [[module.i, content, '']];
            }

var options = {};

options.insert = "head";
options.singleton = false;

var update = api(content, options);



module.exports = content.locals || {};

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(2);
exports = ___CSS_LOADER_API_IMPORT___(false);
// Module
exports.push([module.i, ".t_Left {\r\n    position: relative;\r\n}\r\n\r\n.ex-time {\r\n    position: absolute;\r\n    margin-top: -35px;\r\n    width: 100%;\r\n    text-align: right;\r\n    color: gray;\r\n    font-size: 12px;\r\n}\r\n\r\n.ex-time span{\r\n    margin-right: 10px;\r\n}", ""]);
// Exports
module.exports = exports;


/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

var api = __webpack_require__(1);
            var content = __webpack_require__(24);

            content = content.__esModule ? content.default : content;

            if (typeof content === 'string') {
              content = [[module.i, content, '']];
            }

var options = {};

options.insert = "head";
options.singleton = false;

var update = api(content, options);



module.exports = content.locals || {};

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(2);
exports = ___CSS_LOADER_API_IMPORT___(false);
// Module
exports.push([module.i, "*,body {\r\n    padding: 0;\r\n    margin: 0;\r\n}\r\n\r\nhtml, body {\r\n    width: 100%;\r\n    height: 100%;\r\n}\r\n\r\n.pdl-10 {\r\n    padding-left: 10px;\r\n}\r\n\r\n.pdl-20 {\r\n    padding-left: 20px;\r\n}\r\n\r\n.wrap {\r\n    display: flex;\r\n    width: 100%;\r\n    height: 100%;\r\n}\r\n\r\n.compare2d__watermark {\r\n    position: fixed;\r\n    right: 10px;\r\n    top: 10px;\r\n    color: rgba(255, 255, 255, 0.6);\r\n    z-index: 1;\r\n    cursor: pointer;\r\n    font-size: 24px;\r\n    user-select: none;\r\n}\r\n\r\n.skin1-info {\r\n    position: fixed;\r\n    left: 260px;\r\n    bottom: 10px;\r\n    color: rgba(255, 255, 255, 0.5);\r\n    z-index: 1;\r\n    cursor: pointer;\r\n    font-size: 16px;\r\n}\r\n\r\n.skin2-info {\r\n    position: fixed;\r\n    right: 10px;\r\n    bottom: 10px;\r\n    color: rgba(255, 255, 255, 0.5);\r\n    z-index: 1;\r\n    cursor: pointer;\r\n    font-size: 16px;\r\n}\r\n\r\n.menu {\r\n    background-color: rgb(29,30,35);\r\n    cursor: default;\r\n    height: 100%;\r\n    flex: 0 0 250px;\r\n    color: rgba(255, 255, 255, 0.7);\r\n    font-size: 16px;\r\n    font-family: \"微软雅黑\";\r\n    user-select:none;\r\n}\r\n\r\n.view {\r\n    width: 100%;\r\n    height: 100%;\r\n    flex: 1;\r\n}\r\n\r\n.menu__title {\r\n    text-align: center;\r\n    font-size: 30px;\r\n    font-weight: 600;\r\n    margin-top: 15px;\r\n    margin-bottom: 30px;\r\n    color: #f6ca9d;\r\n}\r\n\r\n.sub__view {\r\n    margin-bottom: 30px;\r\n}\r\n\r\n.view__title {\r\n    font-size: 26px;\r\n    font-weight: 600;\r\n    margin-bottom: 10px;\r\n    color: rgba(255, 255, 255, 0.9);\r\n}\r\n\r\n.view__item {\r\n    cursor: pointer;\r\n    height: 56px;\r\n    line-height: 56px;\r\n}\r\n\r\n.view__item:hover {\r\n    background-color: rgb(23,24,28);\r\n}\r\n\r\n.is-active {\r\n    background-color: rgb(23,24,28);\r\n    color: white;\r\n}\r\n\r\n.texture__title {\r\n    font-size: 26px;\r\n    font-weight: 600;\r\n    margin-bottom: 10px;\r\n    color: rgba(255, 255, 255, 0.9);\r\n}\r\n\r\n.texture__item {\r\n    cursor: pointer;\r\n    height: 56px;\r\n    line-height: 56px;\r\n}\r\n\r\n.texture__item:hover {\r\n    background-color: rgb(23,24,28);\r\n}", ""]);
// Exports
module.exports = exports;


/***/ }),
/* 25 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _node_modules_style_loader_dist_cjs_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_dist_stylePostLoader_js_node_modules_vue_loader_dist_index_js_ref_8_0_Compare_vue_vue_type_style_index_0_id_23fa4444_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(6);
/* harmony import */ var _node_modules_style_loader_dist_cjs_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_dist_stylePostLoader_js_node_modules_vue_loader_dist_index_js_ref_8_0_Compare_vue_vue_type_style_index_0_id_23fa4444_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_cjs_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_dist_stylePostLoader_js_node_modules_vue_loader_dist_index_js_ref_8_0_Compare_vue_vue_type_style_index_0_id_23fa4444_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__);
/* unused harmony reexport * */


/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(2);
exports = ___CSS_LOADER_API_IMPORT___(false);
// Module
exports.push([module.i, "\n.panel[data-v-23fa4444] {\r\n    width: 250px;\r\n    height: 45px;\r\n    background-color: rgba(255, 255, 255, 0.2);\r\n    position: fixed;\r\n    left: 0;\r\n    bottom: 0;\r\n    z-index: 1;\r\n    padding: 10px;\r\n    box-sizing: border-box;\r\n    color: rgba(255,255,255,0.7);\n}\n.panel__slider[data-v-23fa4444] {\r\n    display: inline-block;\r\n    width: 160px;\n}\n.panel__option[data-v-23fa4444] {\r\n    margin-bottom: 10px;\n}\n.panel__option[data-v-23fa4444]:last-child {\r\n    margin-bottom: 0px;\n}\r\n", ""]);
// Exports
module.exports = exports;


/***/ }),
/* 27 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _style_loader_dist_cjs_js_css_loader_dist_cjs_js_vue_loader_dist_stylePostLoader_js_default_css_vue_type_style_index_0_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(7);
/* harmony import */ var _style_loader_dist_cjs_js_css_loader_dist_cjs_js_vue_loader_dist_stylePostLoader_js_default_css_vue_type_style_index_0_lang_css__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_style_loader_dist_cjs_js_css_loader_dist_cjs_js_vue_loader_dist_stylePostLoader_js_default_css_vue_type_style_index_0_lang_css__WEBPACK_IMPORTED_MODULE_0__);
/* unused harmony reexport * */


/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(2);
exports = ___CSS_LOADER_API_IMPORT___(false);
// Module
exports.push([module.i, ".slider-target,.slider-target *{-webkit-touch-callout:none;-webkit-tap-highlight-color:rgba(0,0,0,0);-webkit-user-select:none;touch-action:none;-ms-user-select:none;-moz-user-select:none;user-select:none;box-sizing:border-box}.slider-target{position:relative}.slider-base,.slider-connects{width:100%;height:100%;position:relative;z-index:1}.slider-connects{overflow:hidden;z-index:0}.slider-connect,.slider-origin{will-change:transform;position:absolute;z-index:1;top:0;right:0;-ms-transform-origin:0 0;-webkit-transform-origin:0 0;-webkit-transform-style:preserve-3d;transform-origin:0 0;transform-style:flat}.slider-connect{height:100%;width:100%}.slider-origin{height:10%;width:10%}.slider-txt-dir-rtl.slider-horizontal .slider-origin{left:0;right:auto}.slider-vertical .slider-origin{width:0}.slider-horizontal .slider-origin{height:0}.slider-handle{-webkit-backface-visibility:hidden;backface-visibility:hidden;position:absolute}.slider-touch-area{height:100%;width:100%}.slider-state-tap .slider-connect,.slider-state-tap .slider-origin{transition:transform .3s}.slider-state-drag *{cursor:inherit!important}.slider-horizontal{height:6px}.slider-horizontal .slider-handle{width:16px;height:16px;top:-6px;right:-8px}.slider-vertical{width:6px;height:300px}.slider-vertical .slider-handle{width:16px;height:16px;top:-8px;right:-6px}.slider-txt-dir-rtl.slider-horizontal .slider-handle{left:-8px;right:auto}.slider-base{background-color:#d4e0e7}.slider-base,.slider-connects{border-radius:3px}.slider-connect{background:#41b883;cursor:pointer}.slider-draggable{cursor:ew-resize}.slider-vertical .slider-draggable{cursor:ns-resize}.slider-handle{width:16px;height:16px;border-radius:50%;background:#fff;border:0;right:-8px;box-shadow:.5px .5px 2px 1px rgba(0,0,0,.32);cursor:-webkit-grab;cursor:grab}.slider-handle:focus{outline:none}.slider-active{box-shadow:.5px .5px 2px 1px rgba(0,0,0,.42);cursor:-webkit-grabbing;cursor:grabbing}[disabled] .slider-connect{background:#b8b8b8}[disabled].slider-handle,[disabled] .slider-handle,[disabled].slider-target{cursor:not-allowed}[disabled] .slider-tooltip{background:#b8b8b8;border-color:#b8b8b8}.slider-tooltip{position:absolute;display:block;font-size:14px;font-weight:500;white-space:nowrap;padding:2px 5px;min-width:20px;text-align:center;color:#fff;border-radius:5px;border:1px solid #41b883;background:#41b883}.slider-horizontal .slider-tooltip{transform:translate(-50%);left:50%;bottom:24px}.slider-horizontal .slider-tooltip:before{content:\"\";position:absolute;bottom:-10px;left:50%;width:0;height:0;border:5px solid transparent;border-top-color:inherit;transform:translate(-50%)}.slider-vertical .slider-tooltip{transform:translateY(-50%);top:50%;right:24px}.slider-vertical .slider-tooltip:before{content:\"\";position:absolute;right:-10px;top:50%;width:0;height:0;border:5px solid transparent;border-left-color:inherit;transform:translateY(-50%)}.slider-horizontal .slider-origin>.slider-tooltip{transform:translate(50%);left:auto;bottom:14px}.slider-vertical .slider-origin>.slider-tooltip{transform:translateY(-18px);top:auto;right:18px}.slider-pips,.slider-pips *{box-sizing:border-box}.slider-pips{position:absolute;color:#999}.slider-value{position:absolute;white-space:nowrap;text-align:center}.slider-value-sub{color:#ccc;font-size:10px}.slider-marker{position:absolute;background:#ccc}.slider-marker-large,.slider-marker-sub{background:#aaa}.slider-pips-horizontal{padding:10px 0;height:80px;top:100%;left:0;width:100%}.slider-value-horizontal{transform:translate(-50%,50%)}.slider-rtl .slider-value-horizontal{transform:translate(50%,50%)}.slider-marker-horizontal.slider-marker{margin-left:-1px;width:2px;height:5px}.slider-marker-horizontal.slider-marker-sub{height:10px}.slider-marker-horizontal.slider-marker-large{height:15px}.slider-pips-vertical{padding:0 10px;height:100%;top:0;left:100%}.slider-value-vertical{transform:translateY(-50%);padding-left:25px}.slider-rtl .slider-value-vertical{transform:translateY(50%)}.slider-marker-vertical.slider-marker{width:5px;height:2px;margin-top:-1px}.slider-marker-vertical.slider-marker-sub{width:10px}.slider-marker-vertical.slider-marker-large{width:15px}", ""]);
// Exports
module.exports = exports;


/***/ }),
/* 29 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _node_modules_style_loader_dist_cjs_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_dist_stylePostLoader_js_node_modules_vue_loader_dist_index_js_ref_8_0_Diff_vue_vue_type_style_index_1_id_45eea504_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(8);
/* harmony import */ var _node_modules_style_loader_dist_cjs_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_dist_stylePostLoader_js_node_modules_vue_loader_dist_index_js_ref_8_0_Diff_vue_vue_type_style_index_1_id_45eea504_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_cjs_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_dist_stylePostLoader_js_node_modules_vue_loader_dist_index_js_ref_8_0_Diff_vue_vue_type_style_index_1_id_45eea504_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__);
/* unused harmony reexport * */


/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(2);
exports = ___CSS_LOADER_API_IMPORT___(false);
// Module
exports.push([module.i, "\n.panel[data-v-45eea504] {\r\n    width: 250px;\r\n    height: 110px;\r\n    background-color: rgba(255, 255, 255, 0.2);\r\n    position: fixed;\r\n    left: 0;\r\n    bottom: 0;\r\n    z-index: 1;\r\n    padding: 10px;\r\n    box-sizing: border-box;\r\n    color: rgba(255,255,255,0.7);\n}\n.panel__slider[data-v-45eea504] {\r\n    display: inline-block;\r\n    width: 160px;\n}\n.panel__option[data-v-45eea504] {\r\n    margin-bottom: 10px;\n}\n.panel__option[data-v-45eea504]:last-child {\r\n    margin-bottom: 0px;\n}\r\n", ""]);
// Exports
module.exports = exports;


/***/ }),
/* 31 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./src/pages/buff/packages/AddButton/apis/index.js
function getAssetIdInfo(assetid) {
    return fetch('https://buff.163.com/api/market/csgo_inspect_3d?assetid=' + assetid,{
		method: 'GET',
		mode: 'no-cors',
		// cache: 'default',
		// credentials: 'include',
	})
}
// EXTERNAL MODULE: ./src/utils/Notice/Notice.css
var Notice = __webpack_require__(9);

// CONCATENATED MODULE: ./src/utils/index.js
// 公共


function getStrMiddle(str, before, after) {
    // 取中间文本
	let m = str.match(new RegExp(before + '(.*?)' + after));
	return m ? m[1] : false;
}

function showMessage(msg, type) {
	// type: success[green] error[red] warning[orange] info[blue]
	new NoticeJs({
		text: msg,
		type: type,
		position: 'bottomRight',
	}).show();
}

function getBase64(imgUrl, callback) {
	window.URL = window.URL || window.webkitURL;
	var xhr = new XMLHttpRequest();
	xhr.open("get", imgUrl, true);
	xhr.responseType = "blob";
	xhr.onload = function () {
		if (this.status == 200) {
			var blob = this.response;
			let oFileReader = new FileReader();
			oFileReader.onloadend = function (e) {
				let base64 = e.target.result;
				callback(base64);
			};
			oFileReader.readAsDataURL(blob);
		}
	}
	xhr.send();
}

// 模拟鼠标按住拖动
function createMouseEvent(eventName, ofsx, ofsy) {
	let evt = document.createEvent('MouseEvents');
	evt = new MouseEvent(eventName, {
		clientX: ofsx,
		clientY: ofsy,
		bubbles: true
	})
	evt.isMessage = true;
	return evt
};

function setMouseMove(dom, x, y) {
	dom.dispatchEvent(createMouseEvent("mousedown"));
	dom.dispatchEvent(createMouseEvent("mousemove", x, y));
	dom.dispatchEvent(createMouseEvent("mouseup"));
}

// 获取URL参数
function getQueryString(name) {
    let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    let r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
}

function dateFormat(fmt, date) {
	let o = {
		"M+": date.getMonth() + 1,
		"d+": date.getDate(),
		"h+": date.getHours(),
		"m+": date.getMinutes(),
		"s+": date.getSeconds(),
		"q+": Math.floor((date.getMonth() + 3) / 3),
		"S": date.getMilliseconds()
	};
	if (/(y+)/.test(fmt))
		fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
	for (let k in o)
		if (new RegExp("(" + k + ")").test(fmt))
			fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
	return fmt;
}
// CONCATENATED MODULE: ./src/utils/DomHook/DomHook.js
class DomHook {
    constructor(selector, isSubtree, callback) {
        this.selector = selector;
        this.isSubtree = isSubtree;
        let targetNode = document.querySelector(this.selector);
        if (targetNode == null) {
            return;
        }
        let observer = new MutationObserver(function(mutations) {
            callback(mutations);
        });
        this.observer = observer;
        this.observer.observe(targetNode, { attributes: true, childList: true, subtree: this.isSubtree });
    }
    closeHook() {
        this.observer.disconnect();
    }
}


// CONCATENATED MODULE: ./src/utils/DomHook/index.js



// CONCATENATED MODULE: ./src/pages/buff/packages/AddButton/index.js





let skinImg // 皮肤图片地址
let skinName // 皮肤名字
const LIST_MAX = 50 // 对比列表最多存放数

function init() {
    initDom();
    initFunc();
    let hook = new DomHook(".detail-tab-cont", false, (m => {
        for (let i = 0; i < m[0].addedNodes.length; i++) {
            let item = m[0].addedNodes[i];
            if (item.id == "market-selling-list") {
                initDom();
                initFunc();
                break;
            }
        }
    }))
}

function initDom() {
    initDom_addBtn();
    // initDom_CopyBtn();
}

function initDom_addBtn() {
    skinImg = getSkinImg();
    skinName = getSkinName();
    let domList = document.getElementsByClassName("ctag btn_action_link");
    for (let i = 0; i < domList.length; i++) {
        let parentDom = domList[i].parentNode;
        let trDom = domList[i].parentNode.parentNode.parentNode.parentNode;
        let assetid = domList[i].getAttribute("data-assetid");
        let inspectUrl = trDom.getElementsByClassName("csgo_inspect_img_btn")[0].getAttribute("data-inspecturl");
        if (!trDom.getElementsByClassName("btn-buy-order")[0]) {
            // 有自己上架的饰品
            continue;
        }
        let price = trDom.getElementsByClassName("btn-buy-order")[0].getAttribute("data-price");
        let shopDom = trDom.getElementsByClassName("j_shoptip_handler")[0];
        let shopHref = shopDom.href;
        let shopImg = shopDom.getElementsByClassName("user-avatar")[0].src;
        let shopName = shopDom.innerText;
        
        if (assetid) {
            let dom = document.createElement("a");
            dom.className = "ctag compare-btn";
            dom.setAttribute("assetid", assetid);
            dom.setAttribute("inspecturl", inspectUrl);
            dom.setAttribute("price", price);
            dom.setAttribute("shop_href", shopHref);
            dom.setAttribute("shop_img", shopImg);
            dom.setAttribute("shop_name", shopName);
            dom.innerHTML = `<b><i class="icon"><svg t="1621435629962" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="10682" width="16" height="16"><path d="M896 452.48l-211.2-122.88a32 32 0 0 0-16-4.48 32.64 32.64 0 0 0-16 4.48l-53.76 30.72v-60.16a32 32 0 0 0-16-27.52l-211.2-122.88a31.36 31.36 0 0 0-16-4.48 32 32 0 0 0-16 4.48L128 272a32 32 0 0 0-16 27.52V544a32 32 0 0 0 16 27.52l211.2 122.88a32 32 0 0 0 16 4.48 32.64 32.64 0 0 0 16-4.48l21.76-12.16V608l-37.76 21.76-179.84-104.32V320l180.48-105.6L535.68 320V526.08l-46.08 26.88v-55.04l14.08-8.32V416l-64 35.84a32 32 0 0 0-16 27.52V723.84a32 32 0 0 0 16 27.52l211.84 122.88a32 32 0 0 0 32 0l212.48-121.6a32 32 0 0 0 16-27.52V480a32 32 0 0 0-16-27.52z m-48.64 256l-179.84 103.68L488.32 704V626.56l94.08-54.4a32 32 0 0 0 16-27.52V434.56l69.76-40.32 179.84 104.32z" fill="#040c32" p-id="10683"></path></svg></i></b>加入对比`;
            parentDom.appendChild(dom);
        }
    }
}

function initDom_CopyBtn() {
    let domList = document.getElementsByClassName("pic-cont item-detail-img");
    for (let i = 0; i < domList.length; i++) {
        let trDom = domList[i].parentNode.parentNode;
        let parentDom = trDom.getElementsByClassName("csgo_value")[0];
        let sell_order_id = domList[i].getAttribute("data-orderid");
        let assetid = domList[i].getAttribute("data-assetid");
        let appid = domList[i].getAttribute("data-appid");
        let classid = domList[i].getAttribute("data-classid");
        let instanceid = domList[i].getAttribute("data-instanceid");

        let dom = document.createElement("a");
        dom.style.marginLeft = "5px";
        dom.className = "ctag copylink-btn";
        dom.setAttribute("assetid", assetid);
        dom.setAttribute("instanceid", instanceid);
        dom.setAttribute("appid", appid);
        dom.setAttribute("classid", classid);
        dom.setAttribute("sell_order_id", sell_order_id);
        dom.innerHTML = `<b><i class="icon">
        <svg t="1639763479087" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3348" width="16" height="16"><path d="M184.61 839.39a273 273 0 0 1 0-386.08l78.49-78.49a8 8 0 0 1 11.31 0l39.6 39.6a8 8 0 0 1 0 11.31L236.75 503c-78.13 78.14-79.4 207.24-1.3 285.42 78.36 78.44 205.93 78.46 284.33 0.07L598.27 710a8 8 0 0 1 11.31 0l39.6 39.6a8 8 0 0 1 0 11.31l-78.49 78.49a273 273 0 0 1-386.08 0zM749.59 649.18L710 609.58a8 8 0 0 1 0-11.31L787.25 521c78.13-78.14 79.4-207.24 1.3-285.42-78.36-78.44-205.93-78.46-284.33-0.07L425.73 314a8 8 0 0 1-11.31 0l-39.6-39.6a8 8 0 0 1 0-11.31l78.49-78.49a273 273 0 1 1 386.08 386.09l-78.49 78.49a8 8 0 0 1-11.31 0z" fill="#264097" p-id="3349"></path><path d="M328.149823 644.936246m5.656854-5.656854l305.470129-305.470129q5.656854-5.656854 11.313709 0l39.59798 39.597979q5.656854 5.656854 0 11.313709l-305.47013 305.470129q-5.656854 5.656854-11.313708 0l-39.59798-39.597979q-5.656854-5.656854 0-11.313709Z" fill="#264097" p-id="3350"></path></svg>
        </i></b>检视链接`;
        parentDom.appendChild(dom);
    }
}

function initFunc() {
    let domList = document.getElementsByClassName("compare-btn");
    for (let i = 0; i < domList.length; i++) {
        domList[i].addEventListener("click", () => {
            let assetid = domList[i].getAttribute("assetid");
            let inspectUrl = domList[i].getAttribute("inspecturl");
            let price = domList[i].getAttribute("price");
            let shopHref = domList[i].getAttribute("shop_href");
            let shopImg = domList[i].getAttribute("shop_img");
            let shopName = domList[i].getAttribute("shop_name");
            onClickAddButton({
                assetid: assetid,
                inspectUrl: inspectUrl,
                price: price,
                shopHref: shopHref,
                shopImg: shopImg,
                shopName: shopName
            });
        })
    }

    let domListCopy = document.getElementsByClassName("copylink-btn");
    for (let i = 0; i < domListCopy.length; i++) {
        domListCopy[i].addEventListener("click", () => {
            let assetid = domListCopy[i].getAttribute("assetid");
            let instanceid = domListCopy[i].getAttribute("instanceid");
            let appid = domListCopy[i].getAttribute("appid");
            let classid = domListCopy[i].getAttribute("classid");
            let sell_order_id = domListCopy[i].getAttribute("sell_order_id");
            let text = `https://buff.163.com/market/m/item_detail?game=csgo&assetid=${assetid}&classid=${classid}&instanceid=${instanceid}&sell_order_id=${sell_order_id}`
            GM_setClipboard(text);
            showMessage("复制成功，可粘贴至社区服检视", "success");
        })
    }
}

function onClickAddButton(info) {
    // GM_deleteValue("CompareList");
    // return
    getAssetIdInfo(info.assetid).then(res => {
        return res.json();
    }).then(ret => {
        if (ret.code === "Error") {
            showMessage("解析该饰品失败，暂不支持3D", "error");
            return;
        }
        let obj = getSkinData(ret.data);
        obj.assetid = info.assetid;
        obj.price = info.price;
        obj.inspectUrl = info.inspectUrl;
        obj.shopHref = info.shopHref;
        obj.shopImg = info.shopImg;
        obj.shopName = info.shopName;
        if (obj) {
            if (saveData2CompareList(obj)) {
                showMessage("加入对比列表成功", "success");
            } else {
                showMessage("该饰品已存在于对比列表", "error");
            }
        } else {
            showMessage("加入对比列表失败", "error");
        }
        
    }).catch(err => {
        console.log(err);
    })
}

function getSkinData(data) {
    // 构造对比列表里的饰品对象信息
    let ret = data;
    if (data) {
        let i = 1;
        let textureList = [];
        for (const key in data.texture_url) {
            textureList.push({id: key, url: data.texture_url[key]});
        }
        // while (`texture_${i}` in data.texture_url) {
        //     if (i > 1000) {
        //         // 熔断
        //         break;
        //     }
        //     textureList.push({id: `texture_${i}`, url: data.texture_url[`texture_${i}`]});
        //     i++;
        // }
        ret.textures = textureList;
        ret.name = skinName;
        ret.img_url = skinImg;
        ret.update_time = new Date().getTime();
    }
    return ret;
}

function getSkinImg() {
    return document.getElementsByClassName("t_Center")[1].getElementsByTagName("img")[0].src;
}

function getSkinName() {
    let ret = "";
    let parent = document.getElementsByClassName("cru-goods");
    for (let i = 0; i < parent.length; i++) {
        let item = parent[i];
        ret += item.innerText;
    }
    return ret;
}

function saveData2CompareList(data) {
    let value = GM_getValue("CompareList") || "[]";
    let compareList = JSON.parse(value);

    let isExist = false;
    for (let i = 0; i < compareList.length; i++) {
        if (data.assetid == compareList[i].assetid) {
            isExist = true;
            break;
        }
    }
    if (isExist) {
        return false;
    }
    if (compareList.length > LIST_MAX) {
        compareList.pop(); // 删除最后一个
    }
    compareList.unshift(data); // 插入到第一个
    
    let text = JSON.stringify(compareList);
    GM_setValue("CompareList", text);
    return true;
}

/* harmony default export */ var AddButton = ({
    init
});
// EXTERNAL MODULE: external "Vue"
var external_Vue_ = __webpack_require__(0);

// CONCATENATED MODULE: ./node_modules/vue-loader/dist/templateLoader.js??ref--5!./node_modules/vue-loader/dist??ref--8-0!./src/pages/buff/packages/CompareList/views/CompareList.vue?vue&type=template&id=8a9384f8&scoped=true

const _withId = /*#__PURE__*/Object(external_Vue_["withScopeId"])("data-v-8a9384f8")

Object(external_Vue_["pushScopeId"])("data-v-8a9384f8")
const _hoisted_1 = { class: "compare__table" }
const _hoisted_2 = /*#__PURE__*/Object(external_Vue_["createVNode"])("thead", null, [
  /*#__PURE__*/Object(external_Vue_["createVNode"])("tr", null, [
    /*#__PURE__*/Object(external_Vue_["createVNode"])("th", { width: "7%" }),
    /*#__PURE__*/Object(external_Vue_["createVNode"])("th", null, "饰品"),
    /*#__PURE__*/Object(external_Vue_["createVNode"])("th", { width: "25%" }, "卖家"),
    /*#__PURE__*/Object(external_Vue_["createVNode"])("th", { width: "15%" }, "检视")
  ])
], -1 /* HOISTED */)
const _hoisted_3 = { width: "7%" }
const _hoisted_4 = {
  width: "25%",
  style: {"text-align":"left"}
}
const _hoisted_5 = { width: "15%" }
const _hoisted_6 = /*#__PURE__*/Object(external_Vue_["createVNode"])("b", null, [
  /*#__PURE__*/Object(external_Vue_["createVNode"])("i", { class: "icon icon_3d" })
], -1 /* HOISTED */)
const _hoisted_7 = /*#__PURE__*/Object(external_Vue_["createTextVNode"])("3D检视")
const _hoisted_8 = /*#__PURE__*/Object(external_Vue_["createVNode"])("b", null, [
  /*#__PURE__*/Object(external_Vue_["createVNode"])("i", { class: "icon icon_game" })
], -1 /* HOISTED */)
const _hoisted_9 = /*#__PURE__*/Object(external_Vue_["createTextVNode"])("社区服检视")
const _hoisted_10 = { class: "list-footer" }
const _hoisted_11 = /*#__PURE__*/Object(external_Vue_["createVNode"])("span", null, "全部删除", -1 /* HOISTED */)
const _hoisted_12 = /*#__PURE__*/Object(external_Vue_["createVNode"])("span", null, "删除选中", -1 /* HOISTED */)
const _hoisted_13 = /*#__PURE__*/Object(external_Vue_["createVNode"])("span", null, "2D对比", -1 /* HOISTED */)
const _hoisted_14 = /*#__PURE__*/Object(external_Vue_["createVNode"])("span", null, "3D对比", -1 /* HOISTED */)
Object(external_Vue_["popScopeId"])()

const render = /*#__PURE__*/_withId((_ctx, _cache, $props, $setup, $data, $options) => {
  const _component_skin_info = Object(external_Vue_["resolveComponent"])("skin-info")

  return (Object(external_Vue_["openBlock"])(), Object(external_Vue_["createBlock"])("div", null, [
    Object(external_Vue_["createVNode"])("table", _hoisted_1, [
      _hoisted_2,
      Object(external_Vue_["createVNode"])("tbody", null, [
        (Object(external_Vue_["openBlock"])(true), Object(external_Vue_["createBlock"])(external_Vue_["Fragment"], null, Object(external_Vue_["renderList"])(_ctx.compareList, (item, index) => {
          return (Object(external_Vue_["openBlock"])(), Object(external_Vue_["createBlock"])("tr", {
            key: item.assetid
          }, [
            Object(external_Vue_["createVNode"])("td", _hoisted_3, [
              Object(external_Vue_["withDirectives"])(Object(external_Vue_["createVNode"])("input", {
                type: "checkbox",
                id: item.assetid,
                value: item.assetid,
                "onUpdate:modelValue": _cache[1] || (_cache[1] = $event => (_ctx.checkedList = $event))
              }, null, 8 /* PROPS */, ["id", "value"]), [
                [external_Vue_["vModelCheckbox"], _ctx.checkedList]
              ])
            ]),
            Object(external_Vue_["createVNode"])("td", null, [
              Object(external_Vue_["createVNode"])(_component_skin_info, {
                assetid: item.assetid,
                imgUrl: item.img_url,
                viewUrl: item.inspectUrl,
                skinName: item.name,
                skinSeed: item.asset_info.paintseed,
                skinWear: item.asset_info.paintwear
              }, null, 8 /* PROPS */, ["assetid", "imgUrl", "viewUrl", "skinName", "skinSeed", "skinWear"])
            ]),
            Object(external_Vue_["createVNode"])("td", _hoisted_4, [
              Object(external_Vue_["createVNode"])("a", {
                href: item.shopHref,
                class: "j_shoptip_handler",
                target: "_blank"
              }, [
                Object(external_Vue_["createVNode"])("img", {
                  src: item.shopImg,
                  width: "30",
                  height: "30",
                  class: "user-thum"
                }, null, 8 /* PROPS */, ["src"]),
                Object(external_Vue_["createTextVNode"])(" " + Object(external_Vue_["toDisplayString"])(item.shopName), 1 /* TEXT */)
              ], 8 /* PROPS */, ["href"])
            ]),
            Object(external_Vue_["createVNode"])("td", _hoisted_5, [
              Object(external_Vue_["createVNode"])("a", {
                class: "ctag btn_3d",
                "data-assetid": item.assetid
              }, [
                _hoisted_6,
                _hoisted_7
              ], 8 /* PROPS */, ["data-assetid"]),
              Object(external_Vue_["createVNode"])("a", {
                class: "ctag btn_game_cms",
                "data-assetid": item.assetid,
                target: "_blank"
              }, [
                _hoisted_8,
                _hoisted_9
              ], 8 /* PROPS */, ["data-assetid"])
            ])
          ]))
        }), 128 /* KEYED_FRAGMENT */))
      ])
    ]),
    Object(external_Vue_["createVNode"])("div", _hoisted_10, [
      Object(external_Vue_["createVNode"])("button", {
        onClick: _cache[2] || (_cache[2] = (...args) => (_ctx.onClickClear && _ctx.onClickClear(...args))),
        type: "button",
        class: "el-button el-button--danger",
        style: {"margin-right":"10px","width":"100px"}
      }, [
        _hoisted_11
      ]),
      Object(external_Vue_["createVNode"])("button", {
        onClick: _cache[3] || (_cache[3] = (...args) => (_ctx.onClickDelete && _ctx.onClickDelete(...args))),
        type: "button",
        class: "el-button el-button--warning",
        style: {"margin-right":"10px","width":"100px"}
      }, [
        _hoisted_12
      ]),
      Object(external_Vue_["createVNode"])("button", {
        onClick: _cache[4] || (_cache[4] = (...args) => (_ctx.onClickCompare2d && _ctx.onClickCompare2d(...args))),
        type: "button",
        class: "el-button el-button--primary compare2d-btn",
        style: {"margin-right":"10px","width":"100px"}
      }, [
        _hoisted_13
      ]),
      Object(external_Vue_["createVNode"])("button", {
        onClick: _cache[5] || (_cache[5] = (...args) => (_ctx.onClickCompare3d && _ctx.onClickCompare3d(...args))),
        type: "button",
        class: "el-button el-button--success compare3d-btn",
        style: {"width":"100px"}
      }, [
        _hoisted_14
      ])
    ])
  ]))
})
// CONCATENATED MODULE: ./src/pages/buff/packages/CompareList/views/CompareList.vue?vue&type=template&id=8a9384f8&scoped=true

// EXTERNAL MODULE: ./src/global/styles/index.css
var styles = __webpack_require__(11);

// CONCATENATED MODULE: ./node_modules/vue-loader/dist/templateLoader.js??ref--5!./node_modules/vue-loader/dist??ref--8-0!./src/pages/buff/packages/CompareList/components/SkinInfo.vue?vue&type=template&id=c03073cc&scoped=true

const SkinInfovue_type_template_id_c03073cc_scoped_true_withId = /*#__PURE__*/Object(external_Vue_["withScopeId"])("data-v-c03073cc")

Object(external_Vue_["pushScopeId"])("data-v-c03073cc")
const SkinInfovue_type_template_id_c03073cc_scoped_true_hoisted_1 = { style: {"display":"flex"} }
const SkinInfovue_type_template_id_c03073cc_scoped_true_hoisted_2 = { class: "imgWrap" }
const SkinInfovue_type_template_id_c03073cc_scoped_true_hoisted_3 = { class: "infoWrap" }
const SkinInfovue_type_template_id_c03073cc_scoped_true_hoisted_4 = { style: {"font-weight":"600"} }
const SkinInfovue_type_template_id_c03073cc_scoped_true_hoisted_5 = { style: {"font-size":"12px","color":"#959595"} }
const SkinInfovue_type_template_id_c03073cc_scoped_true_hoisted_6 = { style: {"font-size":"12px","color":"#959595"} }
const SkinInfovue_type_template_id_c03073cc_scoped_true_hoisted_7 = { class: "wear" }
const SkinInfovue_type_template_id_c03073cc_scoped_true_hoisted_8 = { class: "wear-pointer" }
const SkinInfovue_type_template_id_c03073cc_scoped_true_hoisted_9 = /*#__PURE__*/Object(external_Vue_["createStaticVNode"])("<div class=\"progress\" style=\"margin-bottom:5px;\" data-v-c03073cc><div class=\"progress-bar progress-bar-fn\" style=\"width:7%;\" title=\"崭新出厂\" data-v-c03073cc></div><div class=\"progress-bar progress-bar-success\" style=\"width:8%;\" title=\"略有磨损\" data-v-c03073cc></div><div class=\"progress-bar progress-bar-warning\" style=\"width:23%;\" title=\"久经沙场\" data-v-c03073cc></div><div class=\"progress-bar progress-bar-danger\" style=\"width:7%;\" title=\"破损不堪\" data-v-c03073cc></div><div class=\"progress-bar progress-bar-bs\" style=\"width:55%;\" title=\"战痕累累\" data-v-c03073cc></div></div>", 1)
Object(external_Vue_["popScopeId"])()

const SkinInfovue_type_template_id_c03073cc_scoped_true_render = /*#__PURE__*/SkinInfovue_type_template_id_c03073cc_scoped_true_withId((_ctx, _cache, $props, $setup, $data, $options) => {
  return (Object(external_Vue_["openBlock"])(), Object(external_Vue_["createBlock"])("div", SkinInfovue_type_template_id_c03073cc_scoped_true_hoisted_1, [
    Object(external_Vue_["createVNode"])("div", SkinInfovue_type_template_id_c03073cc_scoped_true_hoisted_2, [
      Object(external_Vue_["createVNode"])("img", { src: _ctx.imgUrl }, null, 8 /* PROPS */, ["src"]),
      Object(external_Vue_["createVNode"])("a", {
        href: "javascript:;",
        class: "shalow-btn shalow-btn-green csgo-inspect-view view-btn",
        "data-assetid": _ctx.assetid,
        "data-inspecturl": _ctx.viewUrl,
        "data-inspectversion": "10",
        "data-inspectsize": "2560x3538",
        "data-contextid": "2"
      }, "检视图", 8 /* PROPS */, ["data-assetid", "data-inspecturl"])
    ]),
    Object(external_Vue_["createVNode"])("div", SkinInfovue_type_template_id_c03073cc_scoped_true_hoisted_3, [
      Object(external_Vue_["createVNode"])("div", SkinInfovue_type_template_id_c03073cc_scoped_true_hoisted_4, Object(external_Vue_["toDisplayString"])(_ctx.skinName), 1 /* TEXT */),
      Object(external_Vue_["createVNode"])("div", SkinInfovue_type_template_id_c03073cc_scoped_true_hoisted_5, "模板：" + Object(external_Vue_["toDisplayString"])(_ctx.skinSeed), 1 /* TEXT */),
      Object(external_Vue_["createVNode"])("div", SkinInfovue_type_template_id_c03073cc_scoped_true_hoisted_6, "磨损：" + Object(external_Vue_["toDisplayString"])(_ctx.skinWear), 1 /* TEXT */),
      Object(external_Vue_["createVNode"])("div", SkinInfovue_type_template_id_c03073cc_scoped_true_hoisted_7, [
        Object(external_Vue_["createVNode"])("div", SkinInfovue_type_template_id_c03073cc_scoped_true_hoisted_8, [
          Object(external_Vue_["createVNode"])("div", {
            class: "wear-pointer-icon",
            style: `left: ${Number(_ctx.skinWear*100)}%`
          }, null, 4 /* STYLE */)
        ]),
        SkinInfovue_type_template_id_c03073cc_scoped_true_hoisted_9
      ])
    ])
  ]))
})
// CONCATENATED MODULE: ./src/pages/buff/packages/CompareList/components/SkinInfo.vue?vue&type=template&id=c03073cc&scoped=true

// CONCATENATED MODULE: ./node_modules/vue-loader/dist??ref--8-0!./src/pages/buff/packages/CompareList/components/SkinInfo.vue?vue&type=script&lang=js


/* harmony default export */ var SkinInfovue_type_script_lang_js = (Object(external_Vue_["defineComponent"])({
    props: [
        "imgUrl",  // 图片地址
        "viewUrl", // 检视地址
        "skinName", // 皮肤名
        "skinWear", // 皮肤磨损
        "skinSeed", // 皮肤模板
        "assetid", // 皮肤id
        ], 
    setup(props, ctx) {
        return {
        };
    },
}));

// CONCATENATED MODULE: ./src/pages/buff/packages/CompareList/components/SkinInfo.vue?vue&type=script&lang=js
 
// EXTERNAL MODULE: ./src/pages/buff/packages/CompareList/components/SkinInfo.vue?vue&type=style&index=0&id=c03073cc&scoped=true&lang=css
var SkinInfovue_type_style_index_0_id_c03073cc_scoped_true_lang_css = __webpack_require__(13);

// CONCATENATED MODULE: ./src/pages/buff/packages/CompareList/components/SkinInfo.vue





SkinInfovue_type_script_lang_js.render = SkinInfovue_type_template_id_c03073cc_scoped_true_render
SkinInfovue_type_script_lang_js.__scopeId = "data-v-c03073cc"

/* harmony default export */ var SkinInfo = (SkinInfovue_type_script_lang_js);
// CONCATENATED MODULE: ./node_modules/vue-loader/dist??ref--8-0!./src/pages/buff/packages/CompareList/views/CompareList.vue?vue&type=script&lang=js





/* harmony default export */ var CompareListvue_type_script_lang_js = (Object(external_Vue_["defineComponent"])({
    components: {
        SkinInfo: SkinInfo
    },
    setup(props, ctx) {
        let compareList = Object(external_Vue_["ref"])([]);
        let checkedList = Object(external_Vue_["ref"])([]);

        const updateCompareList = () => {
            compareList.value = JSON.parse(GM_getValue("CompareList") || "[]") || [];
        }

        const onClickDelete = () => {
            for (let i = 0; i < checkedList.value.length; i++) {
                let item = checkedList.value[i];
                let index = getIndexByAssetId(item);
                // 删除元素
                compareList.value.splice(index, 1);
            }
            checkedList.value.length = 0;
            // 处理完后保存数据
            GM_setValue("CompareList", JSON.stringify(compareList.value));
            // 刷新列表
            updateCompareList();
        }

        const onClickClear = () => {
            if (confirm("是否全部删除？")) {
                GM_setValue("CompareList", "[]");
                updateCompareList();
                showMessage("全部删除成功", "success");
            }
        }

        const getIndexByAssetId = (assetid) => {
            let ret = -1;
            for (let i = 0; i < compareList.value.length; i++) {
                let item = compareList.value[i];
                if (item.assetid == assetid) {
                    ret = i;
                    break;
                }
            }
            return ret;
        }

        const onClickCompare2d = () => {
            if (checkedList.value.length == 2) {
                // 判断是不是同类饰品
                let compare2dData = [];
                let textureNum = 0;
                let isSame = true;
                for (let i = 0; i < checkedList.value.length; i++) {
                    let item = checkedList.value[i];
                    let index = getIndexByAssetId(item);
                    if (i == 0) {
                        textureNum = compareList.value[index].textures.length;
                    } else if (compareList.value[index].textures.length !== textureNum) {
                        isSame = false;
                        break;
                    }
                    compare2dData.push(compareList.value[index]);
                }

                if (isSame) {
                    GM_setValue("CompareList_2D", JSON.stringify(compare2dData));
                    window.open("https://spect.fp.ps.netease.com/compare2d");
                } else {
                    showMessage("【2D对比】请选择同类型的饰品", "error");
                }
                
            } else {
                showMessage("【2D对比】请选择2项", "error");
            }
        }

        const onClickCompare3d = () => {
            if (checkedList.value.length > 9) {
                showMessage("【3D对比】最多选择9项", "error");
                return;
            }
            let compare3dData = [];
            for (let i = 0; i < checkedList.value.length; i++) {
                let item = checkedList.value[i];
                let index = getIndexByAssetId(item);
                compare3dData.push(compareList.value[index]);
            }
            GM_setValue("CompareList_3D", JSON.stringify(compare3dData));
            window.open("https://buff.163.com/compare3d");
        }

        Object(external_Vue_["onMounted"])(() => {
            updateCompareList();
        })
        return {
            compareList,
            checkedList,

            onClickDelete, onClickCompare2d, onClickCompare3d, onClickClear
        }
    },
}));

// CONCATENATED MODULE: ./src/pages/buff/packages/CompareList/views/CompareList.vue?vue&type=script&lang=js
 
// EXTERNAL MODULE: ./src/pages/buff/packages/CompareList/views/CompareList.vue?vue&type=style&index=0&id=8a9384f8&scoped=true&lang=css
var CompareListvue_type_style_index_0_id_8a9384f8_scoped_true_lang_css = __webpack_require__(15);

// CONCATENATED MODULE: ./src/pages/buff/packages/CompareList/views/CompareList.vue





CompareListvue_type_script_lang_js.render = render
CompareListvue_type_script_lang_js.__scopeId = "data-v-8a9384f8"

/* harmony default export */ var CompareList = (CompareListvue_type_script_lang_js);
// CONCATENATED MODULE: ./src/pages/buff/packages/CompareList/views/index.js



// EXTERNAL MODULE: ./src/pages/buff/packages/CompareList/styles/index.css
var CompareList_styles = __webpack_require__(17);

// CONCATENATED MODULE: ./src/pages/buff/packages/CompareList/index.js




function CompareList_init() {
    CompareList_initDom();
    CompareList_initFunc();
    // createApp(CompareList).mount("#j_mybackpack");
}

function CompareList_initDom() {
    let a = document.createElement("li");
	a.className = "j_drop-handler";
    a.id = "comparelist"
    a.innerHTML = `<a href="javascript: void(0);"><strong>对比列表</strong></a> <i class="icon icon_new" style="display: none;"></i>`
	let b = document.querySelector(".nav > ul");
    b.appendChild(a);
}

function CompareList_initFunc() {
    let body = document.body;
    document.getElementById("comparelist").addEventListener("click", () => {
        onClickCloseCompareList();
        let a = document.createElement("div");
        a.className = "compare__wrap";
        a.style.width = `${body.offsetWidth}px`;
        a.style.height = `${body.offsetHeight}px`;
        a.innerHTML = `
        <div class="compare__dialog" id="compare__app">
        
        </div>
        <div class="compare__mask"></div>
        `
        body.insertBefore(a, body.childNodes[0]);

        document.getElementsByClassName("compare__mask")[0].addEventListener("click", () => {
            onClickCloseCompareList();
        });
        let app = Object(external_Vue_["createApp"])(CompareList);
        app.mount("#compare__app");
        
        // createApp(CompareList).mount("#compare__app");
        // createApp(CompareList).mount("#compare__app");
        // console.log(JSON.parse(GM_getValue("CompareList") || "[]"))
    });
}

function onClickCloseCompareList() {
    let lastDom = document.getElementsByClassName("compare__wrap")[0];
    if (lastDom) {
        lastDom.remove();
    }
}

/* harmony default export */ var packages_CompareList = ({
    init: CompareList_init
});
// EXTERNAL MODULE: ./src/pages/buff/packages/Compare3D/styles/index.css
var Compare3D_styles = __webpack_require__(19);

// CONCATENATED MODULE: ./src/pages/buff/packages/Compare3D/index.js


// 1. 收集所有的模型iframe
// 2. 给每个iframe设置拖拽事件
// 3. 将事件传给父页面
// 4. 父页面将事件传递给其他的子页面

function Compare3D_init() {
    clearDefaultHtml();
    Compare3D_initDom();
    initMessage(handleMessage);
    Compare3D_initFunc();
}

function clearDefaultHtml() {
    document.title = "CSGO饰品对比 - 3D";
    document.body.innerHTML = "";
    document.body.style.background = "";
    document.querySelectorAll("link").forEach(item => item.remove())
}

function getModelLinks() {
    let ret = [];
    let data = JSON.parse(GM_getValue("CompareList_3D") || "[]") || [];
    for (let i = 0; i < data.length; i++) {
        let item = data[i];
        ret.push("https://buff.163.com/3d_inspect/cs2?compare=true&assetid=" + item.assetid);
    }
    return ret;
}

function Compare3D_initDom() {
    let links = getModelLinks();
    let html = `
    <div class="compare3d__tips">
        <span>使用说明：</span>
        <br/>
        <span>1. 尽量以直线轨迹拖动，请勿按住来回拖动否则会不同步</span>
        <br/>
        <span>2. 按键盘1~9键可以快速切换模型</span>
        <br/>
        <span>3. 按回车键可让所有模型归位</span>
        <br/>
        <span>4. 请勿在F12下操作，否则会不同步</span>
        <br/>
        <span>5. 模型加载需要时间，请全部加载完再操作</span>
    </div>
    <div class="compare3d__watermark">
        <span>--By 小淳</span>
    </div>
    `;
    for (let i = 0; i < links.length; i++) {
        // id用于锚点跳转
        html += `<iframe id="model${i+1}" class="compare3d__iframe" src="${links[i]}&index=${i+1}"></iframe>`
    }
    let a = document.createElement("div");
	a.className = "compare3d__wrap";
    a.innerHTML = html;
    document.body.appendChild(a);
}

function Compare3D_initFunc() {
    // 父页面锚点快捷键实现
    document.addEventListener("keydown", e => {
        location.href = "https://buff.163.com/compare3d#model" + e.key;
    })

    document.getElementsByClassName("compare3d__watermark")[0].addEventListener("click", (e) => {
        e.stopPropagation();
        window.open("https://github.com/qianjiachun/csgo-skin-compare");
    })

    document.getElementsByClassName("compare3d__tips")[0].onclick = (e) => {
        e.stopPropagation();
    }
}

function initMessage(callback) {
    window.addEventListener("message", (e) => {
        callback(e.data);
    })
}

function handleMessage(msg) {
    let models = document.getElementsByClassName("compare3d__iframe");
    switch (msg.cmd) {
        case "keydown":
            // iframe按下键盘，用于锚点跳转
            if (msg.value == "Enter") {
                // 重置
                for (let i = 0; i < models.length; i++) {
                    postMessage(models[i].contentWindow, {
                        cmd: "reset",
                        value: 0
                    });
                }
            } else if (!isNaN(msg.value)) {
                location.href = "https://buff.163.com/compare3d#model" + msg.value;
            }
            break;
        case "rotate":
            // 得到旋转信息，旋转其他的model
            for (let i = 0; i < models.length; i++) {
                if (Number(msg.index) !== i+1) {
                    // 排除自己
                    postMessage(models[i].contentWindow, {
                        cmd: "rotate",
                        value: msg.value
                    });
                }
            }
            break;
        default:
            break;
    }
}

function postMessage(dom, msg) {
    dom.postMessage(msg);
}

/* harmony default export */ var Compare3D = ({
    init: Compare3D_init
});
// CONCATENATED MODULE: ./src/pages/buff/packages/Inspect3D/index.js
// 每个iframe的子页面


let Inspect3D_index;

let isMouseDown = false;
let mouseDownInfo = {};
let mouseMoveInfo = {};

function Inspect3D_init() {
    let t = setInterval(() => {
        let canvas = document.querySelector("canvas");
        if (canvas) {
            clearInterval(t);
            Inspect3D_index = getQueryString("index");
            Inspect3D_initMessage(Inspect3D_handleMessage);
            Inspect3D_initFunc();
        }
    }, 500);
}

function Inspect3D_initMessage(callback) {
    window.addEventListener("message", e => {
        callback(e.data);
    })
}

function Inspect3D_handleMessage(msg) {
    let dom = document.querySelector("canvas");
    switch (msg.cmd) {
        case "rotate":
            setMouseMove(dom, msg.value.x, msg.value.y);
            break;
        case "reset":
            buffManager.resetScene();
            break;
        default:
            break;
    }
}

function Inspect3D_initFunc() {
    let dom = document.querySelector("canvas");

    // 锚点切换
    window.addEventListener("keydown", e => {
        Inspect3D_postMessage({
            cmd: "keydown",
            value: e.key
        })
    })

    // 鼠标拖拽
    dom.addEventListener("mousedown", (e) => {
        if (e.isMessage) {
            return;
        }
        isMouseDown = true;
        mouseDownInfo = {
            x: e.pageX,
            y: e.pageY
        }
    })

    dom.addEventListener("mousemove", (e) => {
        if (e.isMessage) {
            return;
        }
        if (isMouseDown) {
            mouseMoveInfo = {
                x: e.pageX - mouseDownInfo.x,
                y: e.pageY - mouseDownInfo.y
            }
        }
    })

    document.body.addEventListener("mouseup", (e) => {
        if (e.isMessage) {
            return;
        }
        console.log(mouseMoveInfo)
        isMouseDown = false;
        Inspect3D_postMessage({
            cmd: "rotate",
            index: Inspect3D_index,
            value: mouseMoveInfo
        });
    })

    document.getElementById("pc").onclick = (e) => {
        // 阻止操作面板影响
        e.stopPropagation();
    }
}

function Inspect3D_postMessage(msg) {
    window.parent.postMessage(msg);
}

/* harmony default export */ var Inspect3D = ({
    init: Inspect3D_init
});
// EXTERNAL MODULE: ./src/pages/buff/packages/ShowTime/styles/index.css
var ShowTime_styles = __webpack_require__(21);

// CONCATENATED MODULE: ./src/pages/buff/packages/ShowTime/index.js



function ShowTime_init() {
    let hasValidRes = false;
    let timer = setInterval(() => {
        for (let i = unsafeWindow.hookList.length - 1; i >= 0; i--) {
            let item = unsafeWindow.hookList[i];
            if (item.responseURL.includes("goods/sell_order")) {
                clearInterval(timer);
                hasValidRes = true;
                break;
            }
        }
        if (!hasValidRes) {
            let marketShow = new unsafeWindow.marketShow();
            marketShow.init();
            return;
        }
        for (let i = unsafeWindow.hookList.length - 1; i >= 0; i--) {
            let item = unsafeWindow.hookList[i];
            if (item.responseURL.includes("goods/sell_order")) {
                let data = JSON.parse(item.responseText);
                insertDom(data.data.items)
                break;
            }
        }
        unsafeWindow.hookCallback = function (xhr) {
            if (xhr.responseURL.includes("goods/sell_order")) {
                let data = JSON.parse(xhr.responseText);
                insertDom(data.data.items)
            }
        }
    }, 500);
}

function insertDom(items) {
    let sellings = document.querySelectorAll(".list_tb_csgo .selling");
    
    for (let i = 0; i < sellings.length; i++) {
        let itemData = items[i];
        let id = sellings[i].id;
        let t_Lefts = sellings[i].querySelectorAll(".t_Left");
        let target = t_Lefts[t_Lefts.length - 1];
        if (!target) continue;
        if (!id.includes(itemData.id)) continue;
        let div = document.createElement("div");
        div.className = "ex-time";
        div.innerHTML = `${itemData.created_at ? "<span>上架: " + dateFormat("yyyy-MM-dd hh:mm:ss",new Date(itemData.created_at * 1000)) + "</span>" : ""}
        ${itemData.updated_at && itemData.created_at !== itemData.updated_at ? "<br/><span>更新: " + dateFormat("yyyy-MM-dd hh:mm:ss",new Date(itemData.updated_at * 1000)) + "</span>" : ""}`;
        target.insertBefore(div, target.childNodes[0]);
    }
}

/* harmony default export */ var ShowTime = ({
    init: ShowTime_init
});
// CONCATENATED MODULE: ./src/pages/buff/packages/index.js






function initPkg() {
    if (location.href.indexOf("goods") !== -1) {
        let timer = setInterval(() => {
            if (document.getElementsByClassName("j_shoptip_handler").length > 0) {
                if (unsafeWindow.hookList.length > 0) {
                    clearInterval(timer);
                    initMarket();
                } else {
                    // 调用网页自身的请求实现拦截
                    let marketShow = new unsafeWindow.marketShow();
                    marketShow.init();
                }
            }
        }, 300);
    } else if (location.href.indexOf("compare3d") !== -1) {
        initCompare3D();
    } else if (location.href.indexOf("3d_inspect/cs2") !== -1) {
        initInspect3D();
    }
}

function initMarket() {
    AddButton.init();
    packages_CompareList.init();
    ShowTime.init();
}

function initCompare3D() {
    Compare3D.init();
}

function initInspect3D() {
    Inspect3D.init();
}


// CONCATENATED MODULE: ./src/pages/buff/index.js



function beforeInit() {
}

function buff_init() {
    beforeInit();
    initPkg();
}

/* harmony default export */ var buff = ({
    init: buff_init
});
// EXTERNAL MODULE: ./src/pages/spect/packages/Compare2D/styles/index.css
var Compare2D_styles = __webpack_require__(23);

// CONCATENATED MODULE: ./node_modules/vue-loader/dist/templateLoader.js??ref--5!./node_modules/vue-loader/dist??ref--8-0!./src/pages/spect/packages/Compare2D/views/Compare.vue?vue&type=template&id=23fa4444&scoped=true

const Comparevue_type_template_id_23fa4444_scoped_true_withId = /*#__PURE__*/Object(external_Vue_["withScopeId"])("data-v-23fa4444")

Object(external_Vue_["pushScopeId"])("data-v-23fa4444")
const Comparevue_type_template_id_23fa4444_scoped_true_hoisted_1 = { class: "panel" }
const Comparevue_type_template_id_23fa4444_scoped_true_hoisted_2 = { class: "panel__option" }
const Comparevue_type_template_id_23fa4444_scoped_true_hoisted_3 = /*#__PURE__*/Object(external_Vue_["createVNode"])("span", null, "明亮度：", -1 /* HOISTED */)
Object(external_Vue_["popScopeId"])()

const Comparevue_type_template_id_23fa4444_scoped_true_render = /*#__PURE__*/Comparevue_type_template_id_23fa4444_scoped_true_withId((_ctx, _cache, $props, $setup, $data, $options) => {
  const _component_Slider = Object(external_Vue_["resolveComponent"])("Slider")

  return (Object(external_Vue_["openBlock"])(), Object(external_Vue_["createBlock"])("div", {
    class: "ComparisonSlider",
    style: _ctx.styleWrap
  }, [
    Object(external_Vue_["createVNode"])("div", Comparevue_type_template_id_23fa4444_scoped_true_hoisted_1, [
      Object(external_Vue_["createVNode"])("div", Comparevue_type_template_id_23fa4444_scoped_true_hoisted_2, [
        Comparevue_type_template_id_23fa4444_scoped_true_hoisted_3,
        Object(external_Vue_["createVNode"])(_component_Slider, {
          class: "panel__slider",
          modelValue: _ctx.brightnessValue,
          "onUpdate:modelValue": _cache[1] || (_cache[1] = $event => (_ctx.brightnessValue = $event)),
          tooltips: false,
          max: 20,
          step: -1,
          onUpdate: _ctx.onUpdateSliderBrightness
        }, null, 8 /* PROPS */, ["modelValue", "onUpdate"])
      ])
    ]),
    Object(external_Vue_["createVNode"])("div", {
      class: "ComparisonSlider__Before",
      style: _ctx.styleBefore,
      ref: "before"
    }, null, 4 /* STYLE */),
    Object(external_Vue_["createVNode"])("div", {
      class: "ComparisonSlider__After",
      style: _ctx.styleAfter,
      ref: "after"
    }, null, 4 /* STYLE */)
  ], 4 /* STYLE */))
})
// CONCATENATED MODULE: ./src/pages/spect/packages/Compare2D/views/Compare.vue?vue&type=template&id=23fa4444&scoped=true

// EXTERNAL MODULE: external "VueformSlider"
var external_VueformSlider_ = __webpack_require__(3);
var external_VueformSlider_default = /*#__PURE__*/__webpack_require__.n(external_VueformSlider_);

// CONCATENATED MODULE: ./node_modules/vue-loader/dist??ref--8-0!./src/pages/spect/packages/Compare2D/views/Compare.vue?vue&type=script&lang=js



// const Slider = require('@vueform/slider')
/* harmony default export */ var Comparevue_type_script_lang_js = (Object(external_Vue_["defineComponent"])({
    components: {
        Slider: external_VueformSlider_default.a
    },
    setup(props, ctx) {
        let brightnessValue = Object(external_Vue_["ref"])(1);
        let {proxy} = Object(external_Vue_["getCurrentInstance"])();
        let img1 = proxy.img1;
        let img2 = proxy.img2;
        let styleBefore = Object(external_Vue_["ref"])("");
        let styleAfter = Object(external_Vue_["ref"])("");
        let styleWrap = Object(external_Vue_["ref"])("");

        let before = Object(external_Vue_["ref"])(null);
        let after = Object(external_Vue_["ref"])(null);

        const onUpdateSliderBrightness = (v) => {
            before.value.style.filter = `brightness(${v})`;
            after.value.style.filter = `brightness(${v})`;
        }

        Object(external_Vue_["onMounted"])(() => {
            let img = new Image();
            img.src = img1
            img.onload = () => {
                let ratio = img.height / img.width;
                let width = document.getElementById("app").clientWidth;
                let height = width * ratio;
                document.getElementsByClassName("menu")[0].style.height = `${height}px`;
                styleWrap.value = `width:${width}px;height:${height}px;`
                styleBefore.value = `background-image: url(${img1})`;
                styleAfter.value = `background-image: url(${img2})`;
                Object(external_Vue_["nextTick"])(() => {
                    const comparisonSlider = new ComparisonSlider();
                })
            }
        })
        return {
            before,after,
            onUpdateSliderBrightness,
            styleBefore,
            styleAfter,
            styleWrap,
            brightnessValue
        };
    },
}));

// CONCATENATED MODULE: ./src/pages/spect/packages/Compare2D/views/Compare.vue?vue&type=script&lang=js
 
// EXTERNAL MODULE: ./src/pages/spect/packages/Compare2D/views/Compare.vue?vue&type=style&index=0&id=23fa4444&scoped=true&lang=css
var Comparevue_type_style_index_0_id_23fa4444_scoped_true_lang_css = __webpack_require__(25);

// CONCATENATED MODULE: ./src/pages/spect/packages/Compare2D/views/Compare.vue





Comparevue_type_script_lang_js.render = Comparevue_type_template_id_23fa4444_scoped_true_render
Comparevue_type_script_lang_js.__scopeId = "data-v-23fa4444"

/* harmony default export */ var Compare = (Comparevue_type_script_lang_js);
// CONCATENATED MODULE: ./node_modules/vue-loader/dist/templateLoader.js??ref--5!./node_modules/vue-loader/dist??ref--8-0!./src/pages/spect/packages/Compare2D/views/Diff.vue?vue&type=template&id=45eea504&scoped=true

const Diffvue_type_template_id_45eea504_scoped_true_withId = /*#__PURE__*/Object(external_Vue_["withScopeId"])("data-v-45eea504")

Object(external_Vue_["pushScopeId"])("data-v-45eea504")
const Diffvue_type_template_id_45eea504_scoped_true_hoisted_1 = { class: "panel" }
const Diffvue_type_template_id_45eea504_scoped_true_hoisted_2 = { class: "panel__option" }
const Diffvue_type_template_id_45eea504_scoped_true_hoisted_3 = /*#__PURE__*/Object(external_Vue_["createVNode"])("span", null, "明亮度：", -1 /* HOISTED */)
const Diffvue_type_template_id_45eea504_scoped_true_hoisted_4 = { class: "panel__option" }
const Diffvue_type_template_id_45eea504_scoped_true_hoisted_5 = /*#__PURE__*/Object(external_Vue_["createVNode"])("span", null, "分辨率：", -1 /* HOISTED */)
const Diffvue_type_template_id_45eea504_scoped_true_hoisted_6 = { class: "panel__option" }
const Diffvue_type_template_id_45eea504_scoped_true_hoisted_7 = /*#__PURE__*/Object(external_Vue_["createVNode"])("span", { style: {"margin-right":"16px"} }, "阈值：", -1 /* HOISTED */)
const Diffvue_type_template_id_45eea504_scoped_true_hoisted_8 = {
  style: {"filter":"brightness(10)"},
  ref: "canvas1"
}
Object(external_Vue_["popScopeId"])()

const Diffvue_type_template_id_45eea504_scoped_true_render = /*#__PURE__*/Diffvue_type_template_id_45eea504_scoped_true_withId((_ctx, _cache, $props, $setup, $data, $options) => {
  const _component_Slider = Object(external_Vue_["resolveComponent"])("Slider")

  return (Object(external_Vue_["openBlock"])(), Object(external_Vue_["createBlock"])("div", null, [
    Object(external_Vue_["createVNode"])("div", Diffvue_type_template_id_45eea504_scoped_true_hoisted_1, [
      Object(external_Vue_["createVNode"])("div", Diffvue_type_template_id_45eea504_scoped_true_hoisted_2, [
        Diffvue_type_template_id_45eea504_scoped_true_hoisted_3,
        Object(external_Vue_["createVNode"])(_component_Slider, {
          class: "panel__slider",
          modelValue: _ctx.brightnessValue,
          "onUpdate:modelValue": _cache[1] || (_cache[1] = $event => (_ctx.brightnessValue = $event)),
          tooltips: false,
          max: 20,
          step: -1,
          onUpdate: _ctx.onUpdateSliderBrightness
        }, null, 8 /* PROPS */, ["modelValue", "onUpdate"])
      ]),
      Object(external_Vue_["createVNode"])("div", Diffvue_type_template_id_45eea504_scoped_true_hoisted_4, [
        Diffvue_type_template_id_45eea504_scoped_true_hoisted_5,
        Object(external_Vue_["createVNode"])(_component_Slider, {
          class: "panel__slider",
          modelValue: _ctx.resolutionValue,
          "onUpdate:modelValue": _cache[2] || (_cache[2] = $event => (_ctx.resolutionValue = $event)),
          tooltips: false,
          max: 1,
          step: -1,
          onChange: _ctx.onUpdateSliderResolution
        }, null, 8 /* PROPS */, ["modelValue", "onChange"])
      ]),
      Object(external_Vue_["createVNode"])("div", Diffvue_type_template_id_45eea504_scoped_true_hoisted_6, [
        Diffvue_type_template_id_45eea504_scoped_true_hoisted_7,
        Object(external_Vue_["createVNode"])(_component_Slider, {
          class: "panel__slider",
          modelValue: _ctx.thresholdValue,
          "onUpdate:modelValue": _cache[3] || (_cache[3] = $event => (_ctx.thresholdValue = $event)),
          tooltips: false,
          max: 70,
          onChange: _ctx.onUpdateSliderThreshold
        }, null, 8 /* PROPS */, ["modelValue", "onChange"])
      ])
    ]),
    Object(external_Vue_["createVNode"])("div", Diffvue_type_template_id_45eea504_scoped_true_hoisted_8, null, 512 /* NEED_PATCH */)
  ]))
})
// CONCATENATED MODULE: ./src/pages/spect/packages/Compare2D/views/Diff.vue?vue&type=template&id=45eea504&scoped=true

// CONCATENATED MODULE: ./node_modules/vue-loader/dist??ref--8-0!./src/pages/spect/packages/Compare2D/views/Diff.vue?vue&type=script&lang=js




// const Slider = require('@vueform/slider')
/* harmony default export */ var Diffvue_type_script_lang_js = (Object(external_Vue_["defineComponent"])({
    components: {
        Slider: external_VueformSlider_default.a
    },
    setup(props, ctx) {
        let brightnessValue = Object(external_Vue_["ref"])(10);
        let resolutionValue = Object(external_Vue_["ref"])(1);
        let thresholdValue = Object(external_Vue_["ref"])(0);
        
        let {proxy} = Object(external_Vue_["getCurrentInstance"])();
        let img1Url = proxy.img1;
        let img2Url = proxy.img2;
        let img1 = Object(external_Vue_["ref"])(null);
        let img2 = Object(external_Vue_["ref"])(null);
        let canvas1 = Object(external_Vue_["ref"])(null);
        let imgDom = null;
        let ratio = 0;
        
        let params = Object(external_Vue_["ref"])({
            baseImageUrl: "",
            targetImageUrl: "",
            resolution: 1, // 0.01..1, optional, defaults to 1
            threshold: 0, // 0..255, optional, defaults to 0
            isNormalized: false // Boolean, optional, defaults to false
        })

        const onUpdateSliderBrightness = (v) => {
            canvas1.value.style.filter = `brightness(${v})`;
        }

        const onUpdateSliderResolution = (v) => {
            let obj = params.value;
            obj.resolution = v;
            updateDiffImg(obj);
        }

        const onUpdateSliderThreshold = (v) => {
            let obj = params.value;
            obj.threshold = v;
            updateDiffImg(obj);
        }

        const updateDiffImg = (option) => {
            showMessage("图片加载中...", "info");
            params.value = option;
            const promiseCompare = canvasCompare(params.value);

            promiseCompare.then(function (result) {
                // Do things with result
                if (imgDom) {
                    canvas1.value.removeChild(imgDom);
                }
                imgDom = result.producePreview();
                imgDom.width = document.getElementById("app").clientWidth;
                imgDom.height = imgDom.width * ratio;
                canvas1.value.appendChild(imgDom);
            });
        }

        const renderDiffImg = () => {
            let img = new Image();
            img.src = img1.value;
            img.onload = () => {
                ratio = img.height / img.width;
                document.getElementsByClassName("menu")[0].style.height = document.getElementById("app").clientWidth * ratio + "px";
                Object(external_Vue_["nextTick"])(() => {
                    updateDiffImg(params.value);
                })
            }
        }

        Object(external_Vue_["onMounted"])(() => {
            // return
            let img1Finished = false;
            let img2Finished = false;
            getBase64(img1Url, (base64) => {
                img1.value = base64;
                params.value.baseImageUrl = img1.value;
                img1Finished = true;
                if (img2Finished) {
                    renderDiffImg();
                }
            })
            getBase64(img2Url, (base64) => {
                img2.value = base64;
                params.value.targetImageUrl = img2.value;
                img2Finished = true;
                if (img1Finished) {
                    renderDiffImg();
                }
            })
        })
        return {
            canvas1,
            brightnessValue,resolutionValue,thresholdValue,
            onUpdateSliderBrightness,onUpdateSliderResolution,onUpdateSliderThreshold
        };
    },
}));

// CONCATENATED MODULE: ./src/pages/spect/packages/Compare2D/views/Diff.vue?vue&type=script&lang=js
 
// EXTERNAL MODULE: ./node_modules/@vueform/slider/themes/default.css?vue&type=style&index=0&lang=css
var defaultvue_type_style_index_0_lang_css = __webpack_require__(27);

// EXTERNAL MODULE: ./src/pages/spect/packages/Compare2D/views/Diff.vue?vue&type=style&index=1&id=45eea504&scoped=true&lang=css
var Diffvue_type_style_index_1_id_45eea504_scoped_true_lang_css = __webpack_require__(29);

// CONCATENATED MODULE: ./src/pages/spect/packages/Compare2D/views/Diff.vue






Diffvue_type_script_lang_js.render = Diffvue_type_template_id_45eea504_scoped_true_render
Diffvue_type_script_lang_js.__scopeId = "data-v-45eea504"

/* harmony default export */ var Diff = (Diffvue_type_script_lang_js);
// CONCATENATED MODULE: ./src/pages/spect/packages/Compare2D/views/index.js




// CONCATENATED MODULE: ./src/pages/spect/packages/Compare2D/index.js





let Compare2D_compareList = JSON.parse(GM_getValue("CompareList_2D") || "[]") || [];
let Compare2D_app;

function Compare2D_init() {
    Compare2D_initDom();
    initDom_Menu();
    Compare2D_initFunc();
}

function Compare2D_initDom() {
    let a = document.createElement("div");
	a.className = "wrap";
    a.innerHTML = `
    <div class="compare2d__watermark">
        <span>--By 小淳</span>
    </div>
    <div class="skin1-info">
        <span>${Compare2D_compareList[0].name}</span>
        <br/>
        <span>模板：${Compare2D_compareList[0].asset_info.paintseed}</span>
        <br/>
        <span>磨损：${Compare2D_compareList[0].asset_info.paintwear}</span>
    </div>
    <div class="skin2-info">
        <span>${Compare2D_compareList[1].name}</span>
        <br/>
        <span>模板：${Compare2D_compareList[1].asset_info.paintseed}</span>
        <br/>
        <span>磨损：${Compare2D_compareList[1].asset_info.paintwear}</span>
    </div>
    <div class="menu">
        <div class="menu__title">饰品2D对比</div>
        <div class="menu__sub">
            <div class="sub__view">
                <div class="view__title pdl-10">检视图</div>
                <div class="view__content">
                    <div class="view__item pdl-20" id="view__compare">【检视图】对比</div>
                    <div class="view__item pdl-20" id="view__diff">【检视图】差异</div>
                </div>
            </div>

            <div class="sub__texture">
                <div class="texture__title pdl-10">纹理图</div>
                <div class="texture__content">

                </div>
            </div>
        </div>
    </div>

    <div class="view" id="app">

    </div>
    `
	let b = document.body;
    b.appendChild(a);
}

function initDom_Menu() {
    let html_texture = ""; // 纹理图html
    let dom = document.getElementsByClassName("texture__content")[0];

    for (let i = 0; i < Compare2D_compareList[0].textures.length; i++) {
        // 纹理图
        html_texture += `
        <div class="texture__item pdl-20 texture__compare" id="texture__compare${i}">【纹理图${i+1}】对比</div>
        <div class="texture__item pdl-20 texture__diff" id="texture__diff${i}">【纹理图${i+1}】差异</div>
        `
    }
    dom.innerHTML = html_texture;
}

function Compare2D_initFunc() {
    let views = document.getElementsByClassName("view__item");
    let textures = document.getElementsByClassName("texture__item");
    // active事件
    for (let i = 0; i < views.length; i++) {
        views[i].addEventListener("click", () => {
            for (let j = 0; j < views.length; j++) {
                views[j].className = views[j].className.replace(" is-active", "");
            }
            for (let j = 0; j < textures.length; j++) {
                textures[j].className = textures[j].className.replace(" is-active", "");
            }
            views[i].className += " is-active";
        })
    }

    for (let i = 0; i < textures.length; i++) {
        textures[i].addEventListener("click", () => {
            for (let j = 0; j < views.length; j++) {
                views[j].className = views[j].className.replace(" is-active", "");
            }
            for (let j = 0; j < textures.length; j++) {
                textures[j].className = textures[j].className.replace(" is-active", "");
            }
            textures[i].className += " is-active";
        })
    }

    // 业务事件
    document.getElementById("view__compare").addEventListener("click", () => {
        // 检视图对比
        if (Compare2D_app) Compare2D_app.unmount();
        let img1 = Compare2D_compareList[0].inspectUrl;
        let img2 = Compare2D_compareList[1].inspectUrl;
        Compare2D_app = Object(external_Vue_["createApp"])(Compare);
        Compare2D_app.config.globalProperties.img1 = img1;
        Compare2D_app.config.globalProperties.img2 = img2;
        Compare2D_app.mount("#app");
    })
    document.getElementById("view__diff").addEventListener("click", () => {
        // 检视图差异
        if (Compare2D_app) Compare2D_app.unmount();
        let img1 = Compare2D_compareList[0].inspectUrl;
        let img2 = Compare2D_compareList[1].inspectUrl;
        Compare2D_app = Object(external_Vue_["createApp"])(Diff);
        Compare2D_app.config.globalProperties.img1 = img1;
        Compare2D_app.config.globalProperties.img2 = img2;
        Compare2D_app.mount("#app");
    })

    let texture_compare = document.getElementsByClassName("texture__compare");
    let texture_diff = document.getElementsByClassName("texture__diff");

    for (let i = 0; i < texture_compare.length; i++) {
        let item = texture_compare[i];
        item.addEventListener("click", () => {
            // 纹理图对比
            if (Compare2D_app) Compare2D_app.unmount();
            let img1 = Compare2D_compareList[0].textures[i].url;
            let img2 = Compare2D_compareList[1].textures[i].url;
            Compare2D_app = Object(external_Vue_["createApp"])(Compare);
            Compare2D_app.config.globalProperties.img1 = img1;
            Compare2D_app.config.globalProperties.img2 = img2;
            Compare2D_app.mount("#app");
        })
    }

    for (let i = 0; i < texture_diff.length; i++) {
        let item = texture_diff[i];
        item.addEventListener("click", () => {
            // 纹理图差异
            if (Compare2D_app) Compare2D_app.unmount();
            let img1 = Compare2D_compareList[0].textures[i].url;
            let img2 = Compare2D_compareList[1].textures[i].url;
            Compare2D_app = Object(external_Vue_["createApp"])(Diff);
            Compare2D_app.config.globalProperties.img1 = img1;
            Compare2D_app.config.globalProperties.img2 = img2;
            Compare2D_app.mount("#app");
        })
    }

    document.getElementsByClassName("compare2d__watermark")[0].addEventListener("click", () => {
        window.open("https://github.com/qianjiachun/csgo-skin-compare");
    })
}


/* harmony default export */ var Compare2D = ({
    init: Compare2D_init
});
// CONCATENATED MODULE: ./src/pages/spect/packages/index.js


function packages_initPkg() {
    Compare2D.init();
}


// CONCATENATED MODULE: ./src/pages/spect/index.js


function spect_beforeInit() {
    // 清除页面默认数据
    document.title = "CSGO饰品对比 - 2D";
    document.body.innerHTML = "";
}

function spect_init() {
    spect_beforeInit();
    packages_initPkg();
}

/* harmony default export */ var spect = ({
    init: spect_init
});
// CONCATENATED MODULE: ./src/pages/index.js
// import www from "./www"


/* harmony default export */ var pages = ({
    // www
    buff: buff,
    spect: spect
});
// CONCATENATED MODULE: ./src/router.js


function initRouter() {
    // 根据需求判断location对象的值，来选择使用哪个page
    if (location.href.indexOf("buff") !== -1) {
        pages.buff.init();
    }

    if (location.href.indexOf("spect") !== -1) {
        if (location.href.indexOf("compare2d") !== -1) {
            pages.spect.init();
        }
    }
}

// CONCATENATED MODULE: ./src/main.js

initRouter();


/***/ })
/******/ ]);
//# sourceMappingURL=main.js.map