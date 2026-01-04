// ==UserScript==
// @name         Gitea Markdown Highlight
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Highlight all text within == == marks throughout the entire document
// @author       Noriu
// @match        https://git.noriu.cn/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/507554/Gitea%20Markdown%20Highlight.user.js
// @updateURL https://update.greasyfork.org/scripts/507554/Gitea%20Markdown%20Highlight.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 定义一个函数来高亮文本
    function highlightText(node) {
        // 使用正则表达式匹配“==文本==”格式
        const regex = /==\s*(.*?)\s*==/g;
        let match;

        // 检查节点是否为文本节点
        if (node.nodeType === Node.TEXT_NODE) {
            let lastIndex = 0;
            while ((match = regex.exec(node.nodeValue)) !== null) {
                const beforeText = document.createTextNode(node.nodeValue.substring(lastIndex, match.index));
                if (beforeText.length) {
                    node.parentNode.insertBefore(beforeText, node);
                }

                const span = document.createElement('span');
                span.style.backgroundColor = 'yellow'; // 设置背景颜色为黄色
                span.textContent = match[1]; // 包含匹配的文本
                node.parentNode.insertBefore(span, node);

                lastIndex = match.index + match[0].length;
            }

            // 添加剩余的文本
            const afterText = document.createTextNode(node.nodeValue.substring(lastIndex));
            if (afterText.length) {
                node.parentNode.insertBefore(afterText, node);
            }

            // 移除原始文本节点
            node.parentNode.removeChild(node);
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            // 特殊处理<p>标签
            if (node.tagName === 'P' && node.querySelector('span.ambiguous-code-point, span.char')) {
                // 合并所有子节点的文本内容
                let textContent = '';
                node.childNodes.forEach(child => {
                    textContent += child.textContent;
                });
                // 将合并后的文本内容替换原<p>标签内容
                const mergedText = document.createTextNode(textContent);
                node.innerHTML = '';
                node.appendChild(mergedText);
                // 重新调用highlightText处理合并后的文本
                highlightText(mergedText);
            } else {
                // 递归处理所有子节点
                node.childNodes.forEach(highlightText);
            }
        }
    }

    // 监听页面加载完成
    window.addEventListener('load', () => {
        document.body.childNodes.forEach(highlightText);
    });
})();