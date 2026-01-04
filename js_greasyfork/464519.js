// ==UserScript==
// @name         sina网排版
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  sina网重排版
// @author       foolmos
// @match        https://news.sina.com.cn/*
// @match       https://t.cj.sina.com.cn/articles*
// @match       https://finance.sina.com.cn/*
// @match       https://k.sina.com.cn/article*
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/464519/sina%E7%BD%91%E6%8E%92%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/464519/sina%E7%BD%91%E6%8E%92%E7%89%88.meta.js
// ==/UserScript==
 
GM_addStyle(".article-content-right, .page-right-bar {  display:none !important;}");
GM_addStyle(".article-content-left { width:85% !important;margin-left:5% !important;}");
GM_addStyle("p { font-size:18.5px !important;line-height:2em !important;margin:54px 0 !important;}");
GM_addStyle(" img { transform:scale(0.8,0.8) !important;}");
 
(function() {
    'use strict';
 
    // Your code here...
})();