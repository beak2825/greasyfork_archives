// ==UserScript==
// @name         面试鸭自动进入沉浸模式
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  在面试鸭网站上自动点击沉浸模式按钮
// @author       Dhudean
// @match        https://www.mianshiya.com/bank/*/question/*
// @match        https://www.mianshiya.com/question/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/509749/%E9%9D%A2%E8%AF%95%E9%B8%AD%E8%87%AA%E5%8A%A8%E8%BF%9B%E5%85%A5%E6%B2%89%E6%B5%B8%E6%A8%A1%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/509749/%E9%9D%A2%E8%AF%95%E9%B8%AD%E8%87%AA%E5%8A%A8%E8%BF%9B%E5%85%A5%E6%B2%89%E6%B5%B8%E6%A8%A1%E5%BC%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 等待页面加载完成
    window.addEventListener('load', function() {
        // 设置一个定时器来确保按钮已经加载
        setTimeout(function() {
            // 查找具有指定类名的按钮
            var button = document.querySelector('.css-m4timi.ant-float-btn.immersion-float-btn.ant-float-btn-primary.ant-float-btn-circle');
            // 如果找到了按钮，则模拟点击事件
            if (button) {
                button.click();
            }
        }, 500); // 延迟时间可以根据实际情况调整
    });
})();
