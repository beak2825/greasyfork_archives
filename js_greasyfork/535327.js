// ==UserScript==
// @name         browse.wf关键词高亮
// @namespace    http://tampermonkey.net/
// @version      6
// @license      MIT
// @description  高亮显示歼灭/虚空/捕获等任务类型关键词
// @author       Sariabell
// @match        https://browse.wf/live
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/535327/browsewf%E5%85%B3%E9%94%AE%E8%AF%8D%E9%AB%98%E4%BA%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/535327/browsewf%E5%85%B3%E9%94%AE%E8%AF%8D%E9%AB%98%E4%BA%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置关键词及其颜色
    const keywords = [
        { word: "歼灭", color: "red" },
        { word: "虚空", color: "lightblue" },
        { word: "捕获", color: "gray" },
        { word: "中断", color: "brown" },
        { word: "防御", color: "#074d26" }
    ];

    // 黑名单完整匹配词
    const blacklist = ["虚空洪流", "虚空决战", "虚空覆涌", "移动防御"];

    // 创建样式表
    const style = document.createElement('style');
    style.textContent = `
        .wf-highlight {
            padding: 0 2px;
            border-radius: 3px;
            font-weight: bold;
        }
    `;
    document.head.appendChild(style);

    // 转义正则特殊字符
    function escapeRegExp(str) {
        return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    // 创建优化的正则表达式
    const keywordRegex = new RegExp(
        keywords
            .sort((a, b) => b.word.length - a.word.length) // 优先匹配长词
            .map(k => escapeRegExp(k.word))
            .join('|'),
        'gi'
    );

    // 创建预编译的正则表达式
    const blacklistRegex = new RegExp(
        `(${blacklist.map(escapeRegExp).join('|')})`,
        'gi'
    );

    // 高亮处理函数
    function highlightNode(node) {
        // 前置安全检查
        if (!shouldProcessNode(node)) return;

        // 黑名单检测
        if (blacklistRegex.test(node.textContent)) {
            console.debug('跳过黑名单内容:', node.textContent.trim());
            return;
        }

        const tempDiv = document.createElement('div');
        let highlighted = false;

        const newContent = node.textContent.replace(keywordRegex, match => {
            const keyword = keywords.find(k => k.word.toLowerCase() === match.toLowerCase());
            if (!keyword) return match;

            highlighted = true;
            return `<span class="wf-highlight" style="background:${keyword.color}">${match}</span>`;
        });

        if (highlighted) {
            tempDiv.innerHTML = newContent;
            const parent = node.parentNode;
            parent.replaceChild(tempDiv, node);

            // 将临时div的内容提升到父节点中
            while (tempDiv.firstChild) {
                parent.insertBefore(tempDiv.firstChild, tempDiv);
            }
            parent.removeChild(tempDiv);
        }
    }

    // 节点处理资格验证
    function shouldProcessNode(node) {
        return (
            node.nodeType === Node.TEXT_NODE &&
            node.parentNode &&
            node.parentNode.nodeType === Node.ELEMENT_NODE &&
            !['SCRIPT', 'STYLE', 'TEXTAREA'].includes(node.parentNode.tagName) &&
            node.textContent.trim().length > 0
        );
    }

    // 递归遍历DOM
    function walkDOM(node) {
        console.log('walk dom');
        let currentNode = node;
        while (currentNode) {
            if (currentNode.nodeType === Node.ELEMENT_NODE) {
                // 优先处理子节点
                if (currentNode.childNodes.length > 0) {
                    walkDOM(currentNode.firstChild);
                }

                // 处理Shadow DOM
                if (currentNode.shadowRoot) {
                    walkDOM(currentNode.shadowRoot);
                }
            }
            highlightNode(currentNode);
            currentNode = currentNode.nextSibling;
        }
    }

    // 监听DOM变化
    const observer = new MutationObserver(mutations => {
        observer.disconnect();
        mutations.forEach(mutation => {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach(node => {
                    walkDOM(node);
                });
            }
        });
        observer.observe(document.body, observerConfig);
    });

    const observerConfig = {
        childList: true,
        subtree: true,
        characterData: true,
        attributes: false
    };

    // 初始高亮
    walkDOM(document.body);
    observer.observe(document.body, observerConfig);

    // 兼容Shadow DOM
    const originalAttachShadow = Element.prototype.attachShadow;
    Element.prototype.attachShadow = function() {
        const shadowRoot = originalAttachShadow.apply(this, arguments);
        setTimeout(() => walkDOM(shadowRoot), 0);
        return shadowRoot;
    };
})();