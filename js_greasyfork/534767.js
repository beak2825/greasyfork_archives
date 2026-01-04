// ==UserScript==
// @name         Reddit Deep Expand All Comments
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  彻底展开Reddit所有层级的折叠回复（含动态加载和年龄验证）
// @author       YourName
// @match        *://*.reddit.com/r/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/534767/Reddit%20Deep%20Expand%20All%20Comments.user.js
// @updateURL https://update.greasyfork.org/scripts/534767/Reddit%20Deep%20Expand%20All%20Comments.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 增强型选择器配置
    const SELECTORS = {
        topLevelLoader: '.s1okktje-0, ._2EF2J', // 适配新版UI
        commentLoader: '.MoreComments, .CommentTree__loadMore, ._1rZYMD_4xY3gRcSS6p',
        nestedComment: '.Comment__body, .RichText, ._1qeIAg34p0eE6jFuHr',
        ageGate: '.NSFWCheckbox'
    };

    // 智能延迟配置
    const DELAYS = {
        initial: 1000,
        load: 1500,
        recursive: 500
    };

    // 状态管理
    let isLoading = false;
    let processedElements = new Set();

    // 增强的DOM观察器
    const createObserver = (target) => {
        return new MutationObserver((mutations) => {
            mutations.forEach(() => {
                traverseDOM(target);
            });
        }).observe(target, {
            childList: true,
            subtree: true,
            characterData: true
        });
    };

    // 递归展开算法
    const deepExpand = (element) => {
        if (processedElements.has(element)) return;
        processedElements.add(element);

        // 处理年龄验证
        const nsfwCheck = element.querySelector(SELECTORS.ageGate);
        if (nsfwCheck) {
            simulateClick(nsfwCheck);
            simulateClick(nsfwCheck); // 二次确认
        }

        // 处理折叠回复
        const loader = element.querySelector(SELECTORS.commentLoader);
        if (loader && !isLoading) {
            isLoading = true;
            simulateClick(loader);
            setTimeout(() => {
                isLoading = false;
                deepExpand(element);
            }, DELAYS.load);
        }

        // 继续深入遍历
        const children = element.querySelectorAll('*');
        children.forEach(child => deepExpand(child));
    };

    // 模拟点击操作
    const simulateClick = (element) => {
        const clickEvent = new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            view: window
        });
        element.dispatchEvent(clickEvent);
        console.log(`Expanded: ${element.outerHTML.slice(0, 50)}...`);
    };

    // 智能遍历算法
    const traverseDOM = (root) => {
        const walker = document.createTreeWalker(
            root,
            NodeFilter.SHOW_ELEMENT,
            {
                acceptNode: (node) => {
                    return !processedElements.has(node) && 
                           (node.matches(SELECTORS.commentLoader) || 
                            node.querySelector(SELECTORS.commentLoader));
                }
            }
        );

        let node;
        while (node = walker.nextNode()) {
            deepExpand(node);
        }
    };

    // 主执行流程
    const init = () => {
        // 初始加载
        setTimeout(() => {
            const topLoaders = document.querySelectorAll(SELECTORS.topLevelLoader);
            topLoaders.forEach(loader => {
                simulateClick(loader);
                setTimeout(() => traverseDOM(document.body), DELAYS.initial);
            });

            // 监听动态加载
            createObserver(document.body);
        }, DELAYS.initial);
    };

    // 启动脚本
    window.addEventListener('DOMContentLoaded', init);
    window.addEventListener('scroll', () => {
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 500) {
            simulateClick(document.querySelector(SELECTORS.topLevelLoader));
        }
    });
})();