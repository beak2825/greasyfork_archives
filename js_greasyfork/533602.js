// ==UserScript==
// @name         Highlight Trump Name & Hide Cursor on Hover on Whitehouse.gov (For Accessibility)
// @name:zh-CN   高亮白宫网站上的特朗普名字，并在悬停时隐藏光标 (视障辅助)
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Highlights mentions of Donald J. Trump on www.whitehouse.gov with bold/larger font and hides the cursor when hovering over them for better visibility.
// @description:zh-CN 在 www.whitehouse.gov 网站上将“Donald J. Trump”及其变体的字体加粗加大，并在鼠标悬停时隐藏光标，以提高可见性。
// @author       Lyragosa
// @match        *://www.whitehouse.gov/*
// @grant        GM_addStyle
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/533602/Highlight%20Trump%20Name%20%20Hide%20Cursor%20on%20Hover%20on%20Whitehousegov%20%28For%20Accessibility%29.user.js
// @updateURL https://update.greasyfork.org/scripts/533602/Highlight%20Trump%20Name%20%20Hide%20Cursor%20on%20Hover%20on%20Whitehousegov%20%28For%20Accessibility%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 配置 ---
    const highlightStyleClass = 'highlighted-trump-name-vz'; // 自定义CSS类名，避免冲突
    const patternsToHighlight = [
        /\bPresident\s+Donald\s+J\.\s+Trump\b/gi, // President Donald J. Trump
        /\bPresident\s+Trump\b/gi,              // President Trump
        /\bDonald\s+J\.\s+Trump\b/gi,          // Donald J. Trump
        /\bTrump\b/gi                         // 单独的 "Trump"
    ];
    // --- CSS 样式 ---
    // 更新：增加了 :hover 规则来隐藏光标
    const cssStyle = `
        .${highlightStyleClass} {
            font-weight: bold !important;
            font-size: 1.2em !important; /* 比周围文字大20% */
            /* 可以添加其他样式 */
        }
        /* 新增：当鼠标悬停在高亮的span上时，隐藏光标 */
        .${highlightStyleClass}:hover {
            cursor: none !important;
        }
    `;

    // --- 注入CSS样式 ---
    GM_addStyle(cssStyle);

    // --- 核心处理函数 ---
    function highlightTextInNode(node) {
        const walker = document.createTreeWalker(
            node,
            NodeFilter.SHOW_TEXT,
            {
                acceptNode: function(textNode) {
                    if (textNode.parentNode.nodeName === 'SCRIPT' || textNode.parentNode.nodeName === 'STYLE') {
                        return NodeFilter.FILTER_REJECT;
                    }
                    if (textNode.parentNode.classList.contains(highlightStyleClass)) {
                        return NodeFilter.FILTER_REJECT;
                    }
                    if (textNode.nodeValue.trim() === '') {
                        return NodeFilter.FILTER_SKIP;
                    }
                    for (const pattern of patternsToHighlight) {
                        pattern.lastIndex = 0;
                        if (pattern.test(textNode.nodeValue)) {
                            return NodeFilter.FILTER_ACCEPT;
                        }
                    }
                    return NodeFilter.FILTER_SKIP;
                }
            },
            false
        );

        let textNode;
        const nodesToProcess = [];
        while(textNode = walker.nextNode()) {
            nodesToProcess.push(textNode);
        }

        for (const nodeToProcess of nodesToProcess) {
            let currentNode = nodeToProcess;
            let nodeReplaced = false; // 标记节点是否已被替换

            for (const pattern of patternsToHighlight) {
                if (nodeReplaced) break; // 如果节点已被替换，跳过后续模式对此节点的处理

                pattern.lastIndex = 0;
                let match;
                let lastIndex = 0;
                const fragment = document.createDocumentFragment();
                let foundMatchInPattern = false;

                while ((match = pattern.exec(currentNode.nodeValue)) !== null) {
                    foundMatchInPattern = true;
                    const matchedText = match[0];
                    const matchIndex = match.index;

                    if (matchIndex > lastIndex) {
                        fragment.appendChild(document.createTextNode(currentNode.nodeValue.substring(lastIndex, matchIndex)));
                    }

                    const span = document.createElement('span');
                    span.className = highlightStyleClass;
                    span.textContent = matchedText;
                    fragment.appendChild(span);

                    lastIndex = pattern.lastIndex;
                 }

                 if (foundMatchInPattern) {
                     if (lastIndex < currentNode.nodeValue.length) {
                         fragment.appendChild(document.createTextNode(currentNode.nodeValue.substring(lastIndex)));
                     }
                     if (currentNode.parentNode) {
                         currentNode.parentNode.replaceChild(fragment, currentNode);
                         nodeReplaced = true; // 标记此原始节点已被替换
                     }
                 }
            }
        }
    }

    // --- 初始执行 ---
    highlightTextInNode(document.body);

    // --- 监听DOM变化 (处理动态加载的内容) ---
    const observer = new MutationObserver(function(mutationsList) {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                mutation.addedNodes.forEach(function(addedNode) {
                    if (addedNode.nodeType === Node.ELEMENT_NODE) {
                        // 检查添加的节点本身或其父节点是否是高亮节点，避免递归触发
                        if (!addedNode.classList || !addedNode.classList.contains(highlightStyleClass)) {
                             if (!addedNode.parentNode || !addedNode.parentNode.classList || !addedNode.parentNode.classList.contains(highlightStyleClass)){
                                highlightTextInNode(addedNode);
                            }
                        }
                    }
                });
            }
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

})();