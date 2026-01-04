// ==UserScript==
// @name         包图网-免登录
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  包图网的免登录脚本
// @author       AuraService
// @match        *://ibaotu.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/513290/%E5%8C%85%E5%9B%BE%E7%BD%91-%E5%85%8D%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/513290/%E5%8C%85%E5%9B%BE%E7%BD%91-%E5%85%8D%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 删除所有类名为 re-popbox login-popbox-detail-new 的元素
    const elements = document.querySelectorAll('.re-popbox.login-popbox-detail-new');
    elements.forEach(element => {
        element.remove();
    });

    // 清空 body 的 style
    document.body.style.cssText = '';
})();
