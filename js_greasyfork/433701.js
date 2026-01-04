// ==UserScript==
// @name         Remove baidu-translate desktop ad / 移除百度翻译桌面版/APP广告
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  remove baidu-translate desktop ad / 移除百度翻译桌面版广告
// @author       TheBeacon
// @match        https://fanyi.baidu.com/*
// @icon         https://www.google.com/s2/favicons?domain=baidu.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/433701/Remove%20baidu-translate%20desktop%20ad%20%20%E7%A7%BB%E9%99%A4%E7%99%BE%E5%BA%A6%E7%BF%BB%E8%AF%91%E6%A1%8C%E9%9D%A2%E7%89%88APP%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/433701/Remove%20baidu-translate%20desktop%20ad%20%20%E7%A7%BB%E9%99%A4%E7%99%BE%E5%BA%A6%E7%BF%BB%E8%AF%91%E6%A1%8C%E9%9D%A2%E7%89%88APP%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var test = document.getElementsByClassName("desktop-guide")[0];
    test.classList.add("desktop-guide-hide");
})();