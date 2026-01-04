// ==UserScript==
// @name         6Z网站隐藏反拦截弹窗
// @version      1.0
// @description  6Z网站隐藏反拦截弹窗。
// @author       DeepSeek
// @match        https://blog.6ziz.com/*
// @grant        none
// @run-at       document-start
// @namespace https://greasyfork.org/users/452911
// @downloadURL https://update.greasyfork.org/scripts/531563/6Z%E7%BD%91%E7%AB%99%E9%9A%90%E8%97%8F%E5%8F%8D%E6%8B%A6%E6%88%AA%E5%BC%B9%E7%AA%97.user.js
// @updateURL https://update.greasyfork.org/scripts/531563/6Z%E7%BD%91%E7%AB%99%E9%9A%90%E8%97%8F%E5%8F%8D%E6%8B%A6%E6%88%AA%E5%BC%B9%E7%AA%97.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建并立即启动MutationObserver
    const observer = new MutationObserver(mutations => {
        for (const mutation of mutations) {
            for (const node of mutation.addedNodes) {
                if (node.nodeType === 1) checkAndHide(node);
            }
        }
    });

    // 检查并隐藏元素
    function checkAndHide(element) {
        const style = getComputedStyle(element);
        if ((style.zIndex === '2147483647' || parseInt(style.zIndex) === 2147483647) &&
            (style.width === '100%' || style.width === '100vw') &&
            (style.height === '100%' || style.height === '100vh')) {
            element.style.display = 'none';
            element.remove();
        }
        
        // 检查子元素
        for (const child of element.children) {
            checkAndHide(child);
        }
    }

    // 立即开始观察文档
    observer.observe(document, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['style']
    });

    // 初始检查
    if (document.documentElement) {
        checkAndHide(document.documentElement);
    }
})();