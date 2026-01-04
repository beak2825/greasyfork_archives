// ==UserScript==
// @name         36kr排版
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  36kr重排版
// @author       foolmos
// @match        https://www.36kr.com/p/*
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/464542/36kr%E6%8E%92%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/464542/36kr%E6%8E%92%E7%89%88.meta.js
// ==/UserScript==
 
GM_addStyle(".kr-sider, .article-right-container { display:none !important;}");
GM_addStyle(".common-width { word-break: break-word;margin-left:-0% !important;width:132% !important;}");
GM_addStyle("p { font-size: 19px !important;width:830px !important;line-height:1.9 !important;}");


(function() {
    'use strict';
 
    // Your code here...
})();