// ==UserScript==
// @name         incopat占满全屏
// @namespace    http://www.incopat.com/
// @version      0.2
// @description  去除incoPat检索结果页面、IPC分类查询页面两侧的空白，有效利用宽屏显示器
// @author       You
// @include      *incopat.com/*
// @grant        GM_addStyle
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/397821/incopat%E5%8D%A0%E6%BB%A1%E5%85%A8%E5%B1%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/397821/incopat%E5%8D%A0%E6%BB%A1%E5%85%A8%E5%B1%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';
    GM_addStyle(".middle,#container{width:100% !important;}");
    GM_addStyle(".floor_con, #container{width:100% !important;}");
})();