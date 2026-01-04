// ==UserScript==
// @name         sohu排版
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  sohu重排版
// @author       foolmos
// @match        https://www.sohu.com/a/*
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/465251/sohu%E6%8E%92%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/465251/sohu%E6%8E%92%E7%89%88.meta.js
// ==/UserScript==
 
GM_addStyle(".article-page #article-container .sidebar, .float-btn, .float-links { display: none !important;}");
GM_addStyle(".article-page #article-container .main { width: 75% !important;margin-left: 18% !important;}");
GM_addStyle("#mp-editor blockquote, #mp-editor h1, #mp-editor h2, #mp-editor h3, #mp-editor h4, #mp-editor h5, #mp-editor h6, #mp-editor ol, #mp-editor p, #mp-editor pre, #mp-editor ul { margin: .63em 0 1.8em 0;padding: 0;counter-reset: list-1 list-2 list-3 list-4 list-5 list-6 list-7 list-8 list-9;}");
GM_addStyle(" #mp-editor p, span {font-size: 20px !important;");
GM_addStyle(" img { transform:scale(0.8,0.8) !important;}");


(function() {
    'use strict';
 
    // Your code here...
})();


