// ==UserScript==
// @name         小狼多多跟价功能监测提醒
// @license calmwolf
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  监测拼多多商家网站上是否有"开启自动跟价功能"文字并弹窗提醒
// @match        https://mms.pinduoduo.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/500245/%E5%B0%8F%E7%8B%BC%E5%A4%9A%E5%A4%9A%E8%B7%9F%E4%BB%B7%E5%8A%9F%E8%83%BD%E7%9B%91%E6%B5%8B%E6%8F%90%E9%86%92.user.js
// @updateURL https://update.greasyfork.org/scripts/500245/%E5%B0%8F%E7%8B%BC%E5%A4%9A%E5%A4%9A%E8%B7%9F%E4%BB%B7%E5%8A%9F%E8%83%BD%E7%9B%91%E6%B5%8B%E6%8F%90%E9%86%92.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 监听页面加载完成事件
    window.addEventListener('load', function() {
        setTimeout(function() {
            var pageText = document.body.innerText;
            if (pageText.includes('开启自动跟价功能')) {
                alert('检测到"开启自动跟价功能,注意闭坑，生意兴隆！"');
            }
        }, 4000);  // 等待 4 秒，您可以根据实际情况调整时间
    });
})();