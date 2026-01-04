// ==UserScript==
// @name         谷歌重定向
// @version      1.0.0
// @description  hk -> jp
// @author       sakura-flutter
// @namespace    https://github.com/sakura-flutter/tampermonkey-scripts
// @license      GPL-3.0
// @compatible   chrome Latest
// @compatible   firefox Latest
// @compatible   edge Latest
// @run-at       document-start
// @noframes
// @match        https://www.google.com.hk/search*
// @downloadURL https://update.greasyfork.org/scripts/422838/%E8%B0%B7%E6%AD%8C%E9%87%8D%E5%AE%9A%E5%90%91.user.js
// @updateURL https://update.greasyfork.org/scripts/422838/%E8%B0%B7%E6%AD%8C%E9%87%8D%E5%AE%9A%E5%90%91.meta.js
// ==/UserScript==

/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
var __webpack_exports__ = {};


const url = new URL(location);
url.hostname = 'www.google.co.jp';
location.replace(url);
/******/ })()
;