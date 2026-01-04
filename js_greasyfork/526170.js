// ==UserScript==
// @name         屏蔽百度AI智能回答
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  屏蔽百度搜索结果中的AI智能回答
// @author       祀尘
// @match        https://www.baidu.com/*
// @grant        GM_addStyle
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/526170/%E5%B1%8F%E8%94%BD%E7%99%BE%E5%BA%A6AI%E6%99%BA%E8%83%BD%E5%9B%9E%E7%AD%94.user.js
// @updateURL https://update.greasyfork.org/scripts/526170/%E5%B1%8F%E8%94%BD%E7%99%BE%E5%BA%A6AI%E6%99%BA%E8%83%BD%E5%9B%9E%E7%AD%94.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 添加CSS样式以预先隐藏AI智能回答的元素
    GM_addStyle(`
        .cr-content, .result-op, .result-card {
            display: none !important;
        }
    `);

    // 函数用于移除AI智能回答的元素
    function removeAIAnswers() {
        // 通过查找特定的CSS类名来定位AI智能回答的容器
        const aiAnswers = document.querySelectorAll('.cr-content, .result-op, .result-card');
        aiAnswers.forEach(element => {
            element.remove(); // 移除这些元素
        });
    }

    // 在 DOMContentLoaded 事件触发时调用函数移除AI智能回答
    document.addEventListener('DOMContentLoaded', removeAIAnswers);

    // 动态内容加载时（例如滚动或分页）也调用函数移除AI智能回答
    const observer = new MutationObserver(removeAIAnswers);
    observer.observe(document.body, { childList: true, subtree: true });
})();
