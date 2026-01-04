// ==UserScript==
// @name         FAMIS 移除輸入欄位的唯讀屬性
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  FAMIS 從特定的輸入欄位移除 readonly 屬性
// @author       Shanlan
// @match        https://famis.tais.cht.com.tw:8181/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/542600/FAMIS%20%E7%A7%BB%E9%99%A4%E8%BC%B8%E5%85%A5%E6%AC%84%E4%BD%8D%E7%9A%84%E5%94%AF%E8%AE%80%E5%B1%AC%E6%80%A7.user.js
// @updateURL https://update.greasyfork.org/scripts/542600/FAMIS%20%E7%A7%BB%E9%99%A4%E8%BC%B8%E5%85%A5%E6%AC%84%E4%BD%8D%E7%9A%84%E5%94%AF%E8%AE%80%E5%B1%AC%E6%80%A7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function removeReadonly() {
        const inputs = document.querySelectorAll('input[type="text"][readonly]');
        inputs.forEach(input => input.removeAttribute('readonly'));
    }

    // 頁面載入完成後執行
    window.addEventListener('load', removeReadonly);

    // 若頁面有動態載入內容，則每隔一段時間檢查並移除readonly
    setInterval(removeReadonly, 1000);
})();
