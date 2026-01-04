// ==UserScript==
// @name         百度网盘自动点击
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  如果链接包含密码，点击链接后自动提取文件
// @author       黄敬鑫
// @license      MIT
// @match        https://pan.baidu.com/*
// @downloadURL https://update.greasyfork.org/scripts/498168/%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/498168/%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 全局属性
    let url = window.location.href;

    //-----------------百度网盘-----------------
    // 自动点击
    if (url.includes("pan.baidu")) {
        if(document.querySelector('#accessCode').value.length === 4){document.querySelector('#submitBtn').click()}

    }


})()