// ==UserScript==
// @name         cnbeta网排版
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  cnbeta排版
// @author       foolmos
// @match        https://www.cnbeta.com.tw/articles/*
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/466987/cnbeta%E7%BD%91%E6%8E%92%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/466987/cnbeta%E7%BD%91%E6%8E%92%E7%89%88.meta.js
// ==/UserScript==
 
GM_addStyle(".cnbeta-side-box, .article-share-code { display:none !important;}");
GM_addStyle(".cnbeta-update { width:75% !important;margin-left:15% !important;}");
GM_addStyle("p { font-size:18px !important;margin:0 0 35px 0 !important;line-height:1.9 !important;}");

 
(function() {
    'use strict';
 
    // Your code here...
})();
