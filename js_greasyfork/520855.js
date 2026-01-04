// ==UserScript==
// @name         bing百度贴吧跳转
// @namespace    http://tampermonkey.net/
// @version      2024-12-17
// @description  解决bing搜索时部分百度贴吧跳转到jump.bdimg.com网址导致未登录问题
// @author       chino
// @match        https://jump2.bdimg.com/*
// @match        https://jump.bdimg.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bdimg.com
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/520855/bing%E7%99%BE%E5%BA%A6%E8%B4%B4%E5%90%A7%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/520855/bing%E7%99%BE%E5%BA%A6%E8%B4%B4%E5%90%A7%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';
        location.href=location.href.replace('jump.bdimg','tieba.baidu').replace('jump2.bdimg','tieba.baidu')
})();