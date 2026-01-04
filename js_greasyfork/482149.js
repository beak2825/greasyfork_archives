// ==UserScript==
// @name         虫部落论坛背景去除
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Remove class attributes from all elements on https://www.chongbuluo.com/
// @author       Yunye
// @match        https://www.chongbuluo.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/482149/%E8%99%AB%E9%83%A8%E8%90%BD%E8%AE%BA%E5%9D%9B%E8%83%8C%E6%99%AF%E5%8E%BB%E9%99%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/482149/%E8%99%AB%E9%83%A8%E8%90%BD%E8%AE%BA%E5%9D%9B%E8%83%8C%E6%99%AF%E5%8E%BB%E9%99%A4.meta.js
// ==/UserScript==


(function() {
    'use strict';
    var body = document.querySelector('body');
    if (body) {
        body.removeAttribute('class');
    }
})();