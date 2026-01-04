// ==UserScript==
// @name         文本选中高亮相同内容
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  在网页中选中一些文字时，自动将页面中相同的文字高亮显示
// @author       damu
// @match        *://*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/538509/%E6%96%87%E6%9C%AC%E9%80%89%E4%B8%AD%E9%AB%98%E4%BA%AE%E7%9B%B8%E5%90%8C%E5%86%85%E5%AE%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/538509/%E6%96%87%E6%9C%AC%E9%80%89%E4%B8%AD%E9%AB%98%E4%BA%AE%E7%9B%B8%E5%90%8C%E5%86%85%E5%AE%B9.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let lastHighlightClass = 'tm-highlighted-text';

    function removeHighlights() {
        document.querySelectorAll('.' + lastHighlightClass).forEach(el => {
            const parent = el.parentNode;
            parent.replaceChild(document.createTextNode(el.textContent), el);
            parent.normalize(); // 合并相邻文本节点
        });
    }

    function highlightText(text) {
        if (!text || text.trim().length < 2) return;
        const regex = new RegExp(text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');

        // 获取当前选中的范围
        const selection = window.getSelection();
        const selectedNode = selection.anchorNode; // 获取选区起点所在的节点

        const treeWalker = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_TEXT,
            {
                acceptNode: function (node) {
                    // 过滤掉脚本、样式、隐藏元素、表单控件等
                    const parent = node.parentNode;
                    if (!parent || !parent.offsetParent) return NodeFilter.FILTER_REJECT;
                    const tag = parent.nodeName.toLowerCase();
                    if (['script', 'style', 'textarea', 'input', 'button', 'select'].includes(tag))
                        return NodeFilter.FILTER_REJECT;

                    // 如果是当前选中的文本节点，则跳过
                    if (node === selectedNode) return NodeFilter.FILTER_REJECT;

                    return NodeFilter.FILTER_ACCEPT;
                }
            },
            false
        );

        let node;
        while (node = treeWalker.nextNode()) {
            const matches = [...node.textContent.matchAll(regex)];
            if (matches.length === 0) continue;

            let currentNode = node;
            matches.reverse().forEach(match => {
                const start = match.index;
                const end = start + match[0].length;

                const before = currentNode.textContent.slice(0, start);
                const matched = currentNode.textContent.slice(start, end);
                const after = currentNode.textContent.slice(end);

                const span = document.createElement('span');
                span.textContent = matched;
                span.className = lastHighlightClass;
                span.style.backgroundColor = 'yellow';
                span.style.color = 'black';

                const afterNode = document.createTextNode(after);
                const matchedNode = span;
                const beforeNode = document.createTextNode(before);

                const parent = currentNode.parentNode;
                parent.insertBefore(afterNode, currentNode.nextSibling);
                parent.insertBefore(matchedNode, afterNode);
                parent.insertBefore(beforeNode, matchedNode);
                parent.removeChild(currentNode);

                currentNode = beforeNode;
            });
        }
    }

    document.addEventListener('mouseup', () => {
        setTimeout(() => {
            const selection = window.getSelection();
            const selectedText = selection.toString().trim();
            removeHighlights();
            if (selectedText.length >= 2) {
                highlightText(selectedText);
            }
        }, 10); // 延迟以确保 selection 获取正确
    });
})();
