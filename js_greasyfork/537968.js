// ==UserScript==
// @name         Remove onselectstart for www.nuedc-training.com.cn
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  移除页面元素的 onselectstart="return false" 属性，恢复文本选择功能
// @author       QZLin
// @match        https://www.nuedc-training.com.cn/*
// @icon         https://icons.duckduckgo.com/ip2/nuedc-training.com.cn.ico
// @grant        none
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/537968/Remove%20onselectstart%20for%20wwwnuedc-trainingcomcn.user.js
// @updateURL https://update.greasyfork.org/scripts/537968/Remove%20onselectstart%20for%20wwwnuedc-trainingcomcn.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 主处理函数：移除元素及其子元素的 onselectstart 属性
    function removeOnSelectStart(element) {
        if (element.hasAttribute('onselectstart')) {
            element.removeAttribute('onselectstart');
        }

        // 递归处理所有子元素
        const children = element.children;
        for (let i = 0; i < children.length; i++) {
            removeOnSelectStart(children[i]);
        }
    }

    // 初始清理
    removeOnSelectStart(document.documentElement);

    // 创建 MutationObserver 监听 DOM 变化
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        removeOnSelectStart(node);
                    }
                });
            }
        });
    });

    // 开始观察整个文档
    observer.observe(document, {
        childList: true,
        subtree: true
    });

    // 额外处理动态框架内容
    document.querySelectorAll('iframe').forEach(iframe => {
        try {
            iframe.contentDocument && removeOnSelectStart(iframe.contentDocument.documentElement);
        } catch (e) {
            // 跨域 iframe 安全限制，无法访问
        }
    });

})();