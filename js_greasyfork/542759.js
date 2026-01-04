// ==UserScript==
// @name         知乎屏蔽词修改器
// @namespace    http://tampermonkey.net/
// @version      2025-07-16
// @description  仅对网页版知乎推荐页生效
// @author       You
// @match        https://www.zhihu.com/
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/542759/%E7%9F%A5%E4%B9%8E%E5%B1%8F%E8%94%BD%E8%AF%8D%E4%BF%AE%E6%94%B9%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/542759/%E7%9F%A5%E4%B9%8E%E5%B1%8F%E8%94%BD%E8%AF%8D%E4%BF%AE%E6%94%B9%E5%99%A8.meta.js
// ==/UserScript==

(function() {
     'use strict';

        // 要屏蔽的关键词
    const BLOCK_KEYWORDS = ['男','女','父亲','母亲'];
    // 目标问题的父容器选择器
    const QUESTION_CONTAINER_SELECTOR = '.ContentItem';
    // 标题元素选择器
    const TITLE_SELECTOR = '.ContentItem-title a';
    // 处理单个问题元素
    function processQuestionElement(element) {
        const titleElement = element.querySelector(TITLE_SELECTOR);
        if (titleElement) {
            const title = titleElement.textContent.trim();
            // 检查标题是否包含任意关键词
            if (BLOCK_KEYWORDS.some(keyword => title.includes(keyword))) {
                // 隐藏整个问题块，模拟广告屏蔽效果
                element.style.display = 'none';
                console.log(`已屏蔽问题: ${title}`);
            }
        }
    }
    // 处理所有可见的问题元素
    function processAllQuestions() {
        document.querySelectorAll(QUESTION_CONTAINER_SELECTOR).forEach(processQuestionElement);
    }
    // 页面加载完成后处理现有问题
    window.addEventListener('load', processAllQuestions);
    // 监听DOM变化，处理动态加载的内容
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.addedNodes.length) {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1) { // 确保是元素节点
                        if (node.matches(QUESTION_CONTAINER_SELECTOR)) {
                            processQuestionElement(node);
                        } else {
                            // 检查新增节点的子节点
                            node.querySelectorAll(QUESTION_CONTAINER_SELECTOR).forEach(processQuestionElement);
                        }
                    }
                });
            }
        });
    });
    // 开始观察DOM变化
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();