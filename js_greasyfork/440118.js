// ==UserScript==
// @name         Douban Anti-Redirect
// @name:zh-CN   豆瓣防跳转
// @run-at       document-start
// @version      0.31
// @description  append new param after url!
// @author       LavaC
// @match        *://*.douban.com/note/*
// @icon         https://www.google.com/s2/favicons?domain=douban.com
// @grant        none
// @license MIT

// @namespace http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/440118/Douban%20Anti-Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/440118/Douban%20Anti-Redirect.meta.js
// ==/UserScript==
(function() {
    'use strict';
    var queryString=window.location.search
    if(!~queryString.indexOf('_dtcc')){
        window.location.search+=`${!!queryString?'&':'?'}_dtcc=1`
    }
})();