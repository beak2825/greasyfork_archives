// ==UserScript==
// @name         中国大学MOOC去水印
// @namespace    BlingCc
// @version      1.0
// @description  去除中国大学MOOC网站的水印
// @author       Cc
// @match        https://www.icourse163.org/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/527463/%E4%B8%AD%E5%9B%BD%E5%A4%A7%E5%AD%A6MOOC%E5%8E%BB%E6%B0%B4%E5%8D%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/527463/%E4%B8%AD%E5%9B%BD%E5%A4%A7%E5%AD%A6MOOC%E5%8E%BB%E6%B0%B4%E5%8D%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function removeWaterContent() {
        var waterContent = document.getElementById("waterContent");
        if (waterContent) {
            waterContent.remove();
        }
    }

    // 每隔10秒钟执行一次删除操作
    setInterval(removeWaterContent, 10000);
})();