// ==UserScript==
// @name         toutiao排版
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  toutiao重排版
// @author       foolmos
// @match        https://www.toutiao.com/article/*
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/464544/toutiao%E6%8E%92%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/464544/toutiao%E6%8E%92%E7%89%88.meta.js
// ==/UserScript==
 
GM_addStyle(".right-sidebar, .left-sidebar, .footer-wrapper { display:none !important;}");
GM_addStyle(".show-monitor { width:780px !important;margin-left:12% !important;}");
GM_addStyle("p { margin:40px 0 !important;line-height:2.2em !important;font-size:18.5px !important;}");
GM_addStyle("strong span { font-size:18.5px !important;}");
GM_addStyle("p  span { font-size:18.5px !important;}");


(function() {
    'use strict';
 
    // Your code here...
})();