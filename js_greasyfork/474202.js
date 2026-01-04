// ==UserScript==
// @name         去除水印
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  去除页面水印
// @author       twt
// @run-at       document-start
// @match        *://archery-hw.digiwincloud.com.cn/*
// @match        *://archery.digiwincloud.com.cn/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none 
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/474202/%E5%8E%BB%E9%99%A4%E6%B0%B4%E5%8D%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/474202/%E5%8E%BB%E9%99%A4%E6%B0%B4%E5%8D%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.MutationObserver = function() {};
    window.WebKitMutationObserver = function() {};
    window.onload = function() {
        var shuiyin = document.getElementById('wm_div_id');
        var body = shuiyin.parentNode;
        body.removeChild(shuiyin);
    };

})();