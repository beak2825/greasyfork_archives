// ==UserScript==
// @name         guokr排版
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  guokr重排版
// @author       foolmos
// @match        https://www.guokr.com/article/*
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/464543/guokr%E6%8E%92%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/464543/guokr%E6%8E%92%E7%89%88.meta.js
// ==/UserScript==
 
GM_addStyle(".author-info, .gPCnhJ .content, .iBCPFL { display:none !important;}");
GM_addStyle(".layout__Wrapper-zgzfsa-1.Article__StyleWrapper-sc-1dunux7-2.eflYNZ { margin-left:4% !important;}");
GM_addStyle("[data-darkreader-inline-bgcolor] { background-color: #3b3b3b00 !important;}");
GM_addStyle("p span { font-size:18.5px !important;line-height:2 !important;}");
GM_addStyle("p {font-size:18.5px !important;line-height:2 !important;}");
GM_addStyle("span { font-size:18.5px !important;line-height:2 !important;}");
GM_addStyle(".layout__Wrapper-zgzfsa-1.Article__StyleWrapper-sc-1dunux7-2.eflYNZ { min-width:850px !important;}");


(function() {
    'use strict';
 
    // Your code here...
})();