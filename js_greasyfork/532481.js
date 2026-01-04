// ==UserScript==
// @name         按需加载 MathJax（数学公式自渲染）
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  仅在检测到页面中存在数学公式时才加载 MathJax 并进行渲染，支持动态内容和格式容错。
// @author       KiwiFruit
// @match        *://*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/532481/%E6%8C%89%E9%9C%80%E5%8A%A0%E8%BD%BD%20MathJax%EF%BC%88%E6%95%B0%E5%AD%A6%E5%85%AC%E5%BC%8F%E8%87%AA%E6%B8%B2%E6%9F%93%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/532481/%E6%8C%89%E9%9C%80%E5%8A%A0%E8%BD%BD%20MathJax%EF%BC%88%E6%95%B0%E5%AD%A6%E5%85%AC%E5%BC%8F%E8%87%AA%E6%B8%B2%E6%9F%93%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /* global MathJax */

    // 如果已经加载 MathJax，则跳过
    if (typeof MathJax !== 'undefined') {
        console.log('MathJax 已经加载，跳过重复加载。');
        return;
    }

    let mathjaxLoaded = false;

    // 跳过不处理公式的标签
    const skipTags = ['SCRIPT', 'STYLE', 'NOSCRIPT', 'PRE', 'TEXTAREA', 'CODE'];

    // 安全地检测是否包含未转义的 $ 或 $$ 公式（兼容不规范写法，但避免误判）
    function hasMathContent() {
        // 1. 检查是否存在 MathJax 脚本标签
        if (document.querySelector('script[type="math/tex"], script[type="math/tex; mode=display"]')) {
            return true;
        }

        // 2. 遍历所有文本节点
        const walker = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_TEXT,
            {
                acceptNode: function (node) {
                    const parent = node.parentElement;
                    if (parent && skipTags.includes(parent.tagName)) {
                        return NodeFilter.FILTER_SKIP;
                    }
                    return NodeFilter.FILTER_ACCEPT;
                }
            },
            false
        );

        // 手动模拟“非转义 $”检测（避免使用后瞻断言以兼容 Safari 等）
        function hasUnescapedDollar(text) {
            let i = 0;
            while (i < text.length) {
                const idx = text.indexOf('$', i);
                if (idx === -1) break;
                // 检查是否为转义：\$ 不算
                if (idx === 0 || text[idx - 1] !== '\\') {
                    return true;
                }
                i = idx + 1;
            }
            return false;
        }

        while (walker.nextNode()) {
            const text = walker.currentNode.textContent;
            if (hasUnescapedDollar(text)) {
                return true;
            }
        }
        return false;
    }

    // 加载 MathJax 并配置
    function loadMathJax() {
        if (mathjaxLoaded) return;
        mathjaxLoaded = true;

        window.MathJax = {
            tex: {
                inlineMath: [['$', '$']],
                displayMath: [['$$', '$$']],
                processEscapes: true, // 支持 \$ 转义
            },
            options: {
                skipHtmlTags: ['script', 'noscript', 'style', 'textarea', 'pre', 'code'],
                ignoreHtmlClass: 'tex2jax_ignore'
            }
        };

        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js';
        script.async = true;

        script.onload = function () {
            console.log('MathJax 加载完成，开始渲染数学公式...');
            MathJax.typesetPromise().catch(err => console.error('MathJax 渲染失败:', err));

            // 暴露全局重渲染函数（供其他脚本或调试使用）
            window.typesetMath = () => {
                if (typeof MathJax !== 'undefined') {
                    MathJax.typesetPromise().catch(console.error);
                }
            };
        };

        script.onerror = function () {
            console.error('MathJax 加载失败，请检查网络连接或 CDN 地址。');
            alert('数学公式渲染失败：无法加载 MathJax，请检查网络连接。');
        };

        document.head.appendChild(script);
    }

    // 防抖函数
    function debounce(func, wait) {
        let timeout;
        return function (...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }

    // 尝试检测并加载 MathJax
    function tryLoadIfNeeded() {
        if (mathjaxLoaded || typeof MathJax !== 'undefined') return;
        if (hasMathContent()) {
            loadMathJax();
        }
    }

    // 初始检测（异步，避免阻塞）
    setTimeout(tryLoadIfNeeded, 0);

    // 监听后续 DOM 变化（适用于 SPA、动态加载内容等）
    const observer = new MutationObserver(debounce(tryLoadIfNeeded, 600));
    observer.observe(document.body, { childList: true, subtree: true });
})();