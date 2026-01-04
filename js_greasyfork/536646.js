// ==UserScript==
// @name         Enhance English Reading Experience
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Add spaces after commas and periods in <p> tags for better English reading experience
// @author       Dragontx
// @license      MIT
// @icon         https://www.google.com/s2/favicons?domain=example.com
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/536646/Enhance%20English%20Reading%20Experience.user.js
// @updateURL https://update.greasyfork.org/scripts/536646/Enhance%20English%20Reading%20Experience.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 缓存已处理的p标签，标签页级
    const enhancedSet = new Set();

    function enhanceParagraphs() {
        const paragraphs = document.querySelectorAll('p');
        // console.log('[EnhanceEnglish] 检测到', paragraphs.length, '个<p>标签');
        let enhancedCount = 0;
        paragraphs.forEach(p => {
            if (!enhancedSet.has(p)) {
                // 只处理纯文本节点，保留标签结构
                function processNode(node) {
                    if (node.nodeType === Node.TEXT_NODE) {
                        // 替换英文逗号和句号后的空格，但跳过数字中的逗号和句号
                        const nbsp3 = '\u00A0\u00A0\u00A0';
                        const nbsp7 = '\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0';
                        let text = node.textContent;
                        // 处理非数字之间的逗号
                        text = text.replace(/([^0-9]),(?!\s*[0-9])/g, '$1,' + nbsp3);
                        // 处理非数字之间的句号
                        text = text.replace(/([^0-9])\.(?!\s*[0-9])/g, '$1.' + nbsp7);
                        node.textContent = text;
                    } else if (node.nodeType === Node.ELEMENT_NODE) {
                        node.childNodes.forEach(processNode);
                    }
                }
                p.childNodes.forEach(processNode);
                enhancedSet.add(p);
            }
        });
        // console.log('[EnhanceEnglish] 本次处理新增', enhancedCount, '个<p>');
    }

    // 延迟加载文本的处理
    let scrollTimeout = null;
    function onScroll() {
        if (scrollTimeout) clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            // console.log('[EnhanceEnglish] 触发滚动增量处理');
            enhanceParagraphs();
        }, 300);
    }

    // 页面加载后处理一次
    window.addEventListener('DOMContentLoaded', () => {
        // console.log('[EnhanceEnglish] DOMContentLoaded');
        enhanceParagraphs();
    });
    // 监听滚动事件，增量处理新出现的p标签
    window.addEventListener('scroll', onScroll, { passive: true });
    // 监听DOM变动（如SPA、异步加载）
    const observer = new MutationObserver(() => {
        // console.log('[EnhanceEnglish] MutationObserver触发');
        enhanceParagraphs();
    });
    observer.observe(document.body, { childList: true, subtree: true });
})();
