// ==UserScript==
// @name         屏蔽知乎问题标题
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  自动屏蔽网页版知乎的问题标题
// @author       你
// @license      MIT; https://opensource.org/licenses/MIT
// @match        https://www.zhihu.com/question/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/536155/%E5%B1%8F%E8%94%BD%E7%9F%A5%E4%B9%8E%E9%97%AE%E9%A2%98%E6%A0%87%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/536155/%E5%B1%8F%E8%94%BD%E7%9F%A5%E4%B9%8E%E9%97%AE%E9%A2%98%E6%A0%87%E9%A2%98.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 屏蔽问题标题的函数
    function hideQuestionTitle() {
        // 选择QuestionHeader-title元素
        const titleElement = document.querySelector('h1.QuestionHeader-title');

        // 如果找到元素，则隐藏它
        if (titleElement) {
            titleElement.style.display = 'none';
            console.log('知乎问题标题已被屏蔽');
        }
    }

    // 初始加载时执行屏蔽
    hideQuestionTitle();

    // 使用Mutation Observer监听DOM变化，处理动态加载的内容
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            // 检查新增的节点
            if (mutation.addedNodes.length) {
                hideQuestionTitle();
            }
        });
    });

    // 开始观察文档变化
    observer.observe(document.body, {
        childList: true,      // 观察子节点的添加和删除
        subtree: true         // 观察所有后代节点
    });
})();