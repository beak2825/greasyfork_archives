// ==UserScript==
// @name         Disable LaTeX Rendering
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  阻止LaTeX渲染并显示原始代码
// @author       YourName
// @match        *://*/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/526918/Disable%20LaTeX%20Rendering.user.js
// @updateURL https://update.greasyfork.org/scripts/526918/Disable%20LaTeX%20Rendering.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 阻止MathJax自动渲染
    window.MathJax = {
        startup: { typeset: false },
        tex: {
            inlineMath: [['@@', '@@']], // 无效定界符
            displayMath: [['@@@', '@@@']]
        }
    };

    // 阻止KaTeX自动渲染
    document.addEventListener('DOMContentLoaded', function() {
        if (window.renderMathInElement) {
            window.renderMathInElement = function() {};
        }
    });

    // 显示原始LaTeX代码
    window.addEventListener('DOMContentLoaded', function() {
        // 处理MathJax和KaTeX的公式容器
        const replaceWithOriginal = (selector, contentAttr) => {
            document.querySelectorAll(selector).forEach(element => {
                const code = document.createElement('pre');
                code.textContent = element.getAttribute(contentAttr);
                code.style.color = 'black';
                code.style.backgroundColor = '#f0f0f0';
                code.style.padding = '5px';
                element.replaceWith(code);
            });
        };

        // 处理MathJax公式
        replaceWithOriginal('[data-original-content]', 'data-original-content');
        
        // 处理KaTeX公式
        replaceWithOriginal('[data-original]', 'data-original');

        // 处理<script>公式标签
        document.querySelectorAll('script[type^="math/tex"]').forEach(script => {
            const pre = document.createElement('pre');
            pre.textContent = script.textContent;
            pre.style.color = 'black';
            pre.style.backgroundColor = '#f0f0f0';
            pre.style.padding = '5px';
            script.replaceWith(pre);
        });

        // 处理行内公式定界符
        document.body.innerHTML = document.body.innerHTML
            .replace(/\\\(/g, 'LATEX-INLINE-START')
            .replace(/\\\)/g, 'LATEX-INLINE-END')
            .replace(/\\\[/g, 'LATEX-DISPLAY-START')
            .replace(/\\\]/g, 'LATEX-DISPLAY-END');
    });

    // 动态内容处理
    new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    node.innerHTML = node.innerHTML
                        .replace(/\\\(/g, 'LATEX-INLINE-START')
                        .replace(/\\\)/g, 'LATEX-INLINE-END')
                        .replace(/\\\[/g, 'LATEX-DISPLAY-START')
                        .replace(/\\\]/g, 'LATEX-DISPLAY-END');
                }
            });
        });
    }).observe(document.body, {
        childList: true,
        subtree: true
    });
})();
