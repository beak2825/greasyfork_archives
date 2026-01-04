// ==UserScript==
// @name         gongzhonghao排版
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  gongzhonghao重排版
// @author       foolmos
// @match        https://mp.weixin.qq.com/s/*
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/464533/gongzhonghao%E6%8E%92%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/464533/gongzhonghao%E6%8E%92%E7%89%88.meta.js
// ==/UserScript==
 
GM_addStyle("*{font-family: 黄煜臣拙黑 !important;}");
GM_addStyle("h1 { font-size:28px !important;}");
GM_addStyle("p, span, section { font-size:22px !important;line-height:38px !important;}");
GM_addStyle("div#img-content.rich_media_wrp { width:110% !important; left:-7% !important;}");
GM_addStyle(".rich_media_content img { transform:scale(0.8,0.8) !important;}");
GM_addStyle(".qr_code_pc { display:none !important;}");
 
(function() {
    'use strict';
 
    // Your code here...
})();