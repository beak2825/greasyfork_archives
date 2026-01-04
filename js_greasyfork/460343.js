// ==UserScript==
// @name         多站合一音乐搜索-自动跳转
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  自动跳转
// @author       You
// @match        https://music.163.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=163.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/460343/%E5%A4%9A%E7%AB%99%E5%90%88%E4%B8%80%E9%9F%B3%E4%B9%90%E6%90%9C%E7%B4%A2-%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/460343/%E5%A4%9A%E7%AB%99%E5%90%88%E4%B8%80%E9%9F%B3%E4%B9%90%E6%90%9C%E7%B4%A2-%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let href = window.location.href;
    if (href.includes('https://music.163.com/#/song?')) {
        let url = 'http://music.wandhi.com/?url=' + encodeURIComponent(href);
        window.location.href = url;
    }
})();