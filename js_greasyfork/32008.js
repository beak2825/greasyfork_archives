// ==UserScript==
// @name                Pixiv搜索结果排序 | Pixiv search sort
// @name:zh-TW          Pixiv搜索結果排序 | Pixiv search sort
// @description         Pixiv搜索结果按收藏数从大到小排序，适配[TS] Pixiv++ V3 | Pixiv search result sort by bookmark count.
// @description:zh-TW   Pixiv搜索結果按收藏數從大到小排序，適配[TS] Pixiv++ V3 | Pixiv search result sort by bookmark count.
// @icon                https://www.pixiv.net/favicon.ico
// @version             0.4.1
// @author              olOwOlo
// @namespace           https://olowolo.com
// @homepage            https://github.com/olOwOlo/script/tree/master/pixiv-search-sort
// @supportURL          https://github.com/olOwOlo/script
// @license             MIT
// @match               *://www.pixiv.net/search.php?*
// @run-at              document-start
// @grant               none
// @downloadURL https://update.greasyfork.org/scripts/32008/Pixiv%E6%90%9C%E7%B4%A2%E7%BB%93%E6%9E%9C%E6%8E%92%E5%BA%8F%20%7C%20Pixiv%20search%20sort.user.js
// @updateURL https://update.greasyfork.org/scripts/32008/Pixiv%E6%90%9C%E7%B4%A2%E7%BB%93%E6%9E%9C%E6%8E%92%E5%BA%8F%20%7C%20Pixiv%20search%20sort.meta.js
// ==/UserScript==
//
/*
 * Copyright (c) 2017 olOwOlo
 * Released under the MIT License.
 * ***********************
 * ***** Release Note *****
 * 0.4.1 - 修复：P 站更新
 * 0.4.0 - P站已更新，现在只支持单页排序
 * 0.3.0 - 为兼容最新ECMAScript标准，使用babel与webpack处理脚本，可读性更好的源码可于Github查看
 */
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
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
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
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(1);


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    return sortInContainer(0);
  });

  /**
   * sort in one page
   * @param index
   * @param rest
   */
  function sortInContainer(index) {
    var rest = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 6;

    var containers = document.querySelectorAll('#js-react-search-mid > div');
    if (containers.length !== 0) {
      var container = containers[index];
      var itemsArray = Array.from(container.children);
      itemsArray.sort(function (a, b) {
        return getBookmarkCount(b) - getBookmarkCount(a);
      }).forEach(function (item) {
        return container.appendChild(item);
      });
    } else if (rest > 0) {
      myLog('Container Not Found. Rest time is ' + rest);
      setTimeout(function () {
        return sortInContainer(index, rest - 1);
      }, 500);
    }
  }

  /**
   * return the bookmark-count
   * @param item
   * @returns {number}
   */
  function getBookmarkCount(item) {
    var bookmarkCount = item.getElementsByClassName('bookmark-count')[0];
    return typeof bookmarkCount === 'undefined' ? 0 : Number(bookmarkCount.text);
  }

  var DEBUG = false;
  function myLog(message) {
    if (DEBUG) console.log(message);
  }
})();

/***/ })
/******/ ]);