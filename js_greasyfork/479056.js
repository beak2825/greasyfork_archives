// ==UserScript==
// @name         自动跳转脚本
// @namespace    明明不远
// @version      1.0
// @description  如果当前网页为指定 IP 地址，则在5秒后访问另一个网页
// @match        http://123.123.123.123/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/479056/%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/479056/%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 检查当前网页的地址是否为指定 IP 地址
    if (window.location.hostname === '123.123.123.123') {
        // 等待5秒后跳转到另一个网页
        setTimeout(function() {
            window.location.href = 'http://10.224.1.2';
        }, 5000);
    }
})();