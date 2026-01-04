// ==UserScript==
// @name         52破解自动收起论坛规则
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  自动收起 onclick="toggle_collapse('forum_rules_16')" 的元素
// @author       你自己
// @match        https://www.52pojie.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/530177/52%E7%A0%B4%E8%A7%A3%E8%87%AA%E5%8A%A8%E6%94%B6%E8%B5%B7%E8%AE%BA%E5%9D%9B%E8%A7%84%E5%88%99.user.js
// @updateURL https://update.greasyfork.org/scripts/530177/52%E7%A0%B4%E8%A7%A3%E8%87%AA%E5%8A%A8%E6%94%B6%E8%B5%B7%E8%AE%BA%E5%9D%9B%E8%A7%84%E5%88%99.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 等待页面加载完成
    window.addEventListener('load', function() {
        // 查找所有 onclick 属性为 toggle_collapse('forum_rules_16') 的元素
        const elements = document.querySelectorAll('[onclick="toggle_collapse(\'forum_rules_16\')"]');
        elements.forEach(function(element) {
            // 模拟点击事件来收起元素
            element.click();
        });
    });
})();