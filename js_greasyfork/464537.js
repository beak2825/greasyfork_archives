// ==UserScript==
// @name         百科排版
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  百科重排版
// @author       foolmos
// @match        https://baike.baidu.com/item/*
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/464537/%E7%99%BE%E7%A7%91%E6%8E%92%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/464537/%E7%99%BE%E7%A7%91%E6%8E%92%E7%89%88.meta.js
// ==/UserScript==
 
GM_addStyle("#side {display:none !important;}");

GM_addStyle("span {font-size:20px !important;line-height:1.8 !important;}");
GM_addStyle("h3 {font-size:24px !important;}");
GM_addStyle("h2 {font-size:24px !important;}");
GM_addStyle("div[class*=mainContent] {margin-left:10% !important;width:850px !important;}");
GM_addStyle("div[class*=starMapMultiItemInfo] {line-height:20px !important; }");
GM_addStyle("div[class*=basicInfo] {background:none !important; }");

(function() {
    'use strict';
 
    // Your code here...
})();