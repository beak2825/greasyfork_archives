// ==UserScript==
// @name         关键词屏蔽B站抽奖动态  ["抽奖", "中奖"]
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  屏蔽B站动态页中包含特定关键词的动态，关键词可以自定义
// @author       冉  （我不会写代码，这个程序是我用deepseek的大语言模型写的）
// @match        https://t.bilibili.com/*
// @match        https://space.bilibili.com/*/dynamic
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/498357/%E5%85%B3%E9%94%AE%E8%AF%8D%E5%B1%8F%E8%94%BDB%E7%AB%99%E6%8A%BD%E5%A5%96%E5%8A%A8%E6%80%81%20%20%5B%22%E6%8A%BD%E5%A5%96%22%2C%20%22%E4%B8%AD%E5%A5%96%22%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/498357/%E5%85%B3%E9%94%AE%E8%AF%8D%E5%B1%8F%E8%94%BDB%E7%AB%99%E6%8A%BD%E5%A5%96%E5%8A%A8%E6%80%81%20%20%5B%22%E6%8A%BD%E5%A5%96%22%2C%20%22%E4%B8%AD%E5%A5%96%22%5D.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 定义要屏蔽的关键词
    const keywords = ["抽奖", "中奖","自定义需要屏蔽的关键词"]; //可以自己修改关键词

    // 创建一个函数来检查和屏蔽包含关键词的动态
    function filterDynamics() {
        const dynamics = document.querySelectorAll('.bili-dyn-item__main');

        dynamics.forEach(dyn => {
            const content = dyn.textContent.toLowerCase();
            if (keywords.some(keyword => content.includes(keyword.toLowerCase()))) {
                dyn.style.display = 'none';
            }
        });
    }

    // 初始化过滤
    filterDynamics();

    // 使用MutationObserver来监听页面的变化，以便在动态加载时进行过滤
    const observer = new MutationObserver(filterDynamics);
    observer.observe(document.body, { childList: true, subtree: true });
})();