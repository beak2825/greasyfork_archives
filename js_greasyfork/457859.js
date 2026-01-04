// ==UserScript==
// @name         抖音直播优化
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  删除礼物栏，删除右下角问号
// @author       yt
// @match        *://*.douyin.com/*
// @match        https://live.douyin.com/*
// @require      http://cdn.staticfile.org/jquery/2.1.4/jquery.min.js
// @require      https://apps.bdimg.com/libs/jquery/2.1.4/jquery.min.js
// @compatible   chrome
// @compatible   firefox
// @compatible   edge
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addValueChangeListener
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/457859/%E6%8A%96%E9%9F%B3%E7%9B%B4%E6%92%AD%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/457859/%E6%8A%96%E9%9F%B3%E7%9B%B4%E6%92%AD%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==
/* globals $*/

(function() {
    'use strict';

    // Your code here...
    window.addEventListener('load',function() {
        setTimeout(function() {
            //删除底部礼物栏
            $('.aqK_4_5U').remove();
            //删除右下角问号
            $('.ktqnV51p').remove();
        }, 1000);
        
    },false)
})();