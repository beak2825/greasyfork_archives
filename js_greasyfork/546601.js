// ==UserScript==
// @name         Gemini LaTeX Renderer Fix (Gemini LaTeX 渲染修复脚本)
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Finds unrendered LaTeX on the Gemini website and renders it correctly using the KaTeX library. (查找Gemini网站上未渲染的LaTeX代码，并使用KaTeX库进行正确渲染。)
// @author       QTM
// @match        https://gemini.google.com/*
// @grant        none
// @run-at       document-idle
// @require      https://cdn.jsdelivr.net/npm/katex@0.16.10/dist/katex.min.js
// @require      https://cdn.jsdelivr.net/npm/katex@0.16.10/dist/contrib/auto-render.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/546601/Gemini%20LaTeX%20Renderer%20Fix%20%28Gemini%20LaTeX%20%E6%B8%B2%E6%9F%93%E4%BF%AE%E5%A4%8D%E8%84%9A%E6%9C%AC%29.user.js
// @updateURL https://update.greasyfork.org/scripts/546601/Gemini%20LaTeX%20Renderer%20Fix%20%28Gemini%20LaTeX%20%E6%B8%B2%E6%9F%93%E4%BF%AE%E5%A4%8D%E8%84%9A%E6%9C%AC%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /**
     * 作为一名资深工程师，我知道一个好的解决方案不仅要能工作，还要优雅和高效。
     * 这个脚本的核心思想是利用Tampermonkey的 @require 指令预先加载KaTeX库，
     * 然后通过 MutationObserver 监控DOM的变化，对新增的节点进行LaTeX渲染。
     * 这样做比定时轮询（setInterval）的性能要好得多，也更现代化。
     */

    console.log('[Gemini LaTeX Fix] Script loaded. Waiting for page content.');

    // 1. 注入KaTeX的CSS样式表
    // KaTeX的JS库由 @require 加载了，但CSS样式需要我们手动注入到页面中。
    const katexCss = document.createElement('link');
    katexCss.rel = 'stylesheet';
    katexCss.href = 'https://cdn.jsdelivr.net/npm/katex@0.16.10/dist/katex.min.css';
    document.head.appendChild(katexCss);

    // 2. 定义渲染函数
    // 这个函数将会在指定的DOM元素上查找并渲染LaTeX。
    function renderLatexInElement(element) {
        if (!element || typeof element.querySelectorAll !== 'function') {
            return;
        }

        // 检查元素是否已经被处理过，避免重复渲染
        if (element.dataset.latexRendered) {
            return;
        }

        // 调用KaTeX的自动渲染函数
        // renderMathInElement 是由 auto-render.min.js 提供的全局函数
        renderMathInElement(element, {
            delimiters: [
                {left: '$$', right: '$$', display: true},  // 块级公式
                {left: '$', right: '$', display: false},   // 行内公式
                {left: '\\(', right: '\\)', display: false},
                {left: '\\[', right: '\\]', display: true}
            ],
            // 忽略在 <pre>, <code>, <textarea> 等标签内的内容
            ignoredTags: ['script', 'noscript', 'style', 'textarea', 'pre', 'code'],
            // 如果渲染出错，在控制台打印错误，而不是在页面上显示
            throwOnError: false
        });

        // 标记该元素已处理
        element.dataset.latexRendered = 'true';
    }

    // 3. 使用 MutationObserver 监控DOM变化
    // 这是处理像Gemini这样动态加载内容网站的关键技术。
    const observer = new MutationObserver((mutationsList, observer) => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                mutation.addedNodes.forEach(node => {
                    // 我们只关心元素节点，忽略文本节点等
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        // 检查节点本身及其所有子节点
                        renderLatexInElement(node);
                        node.querySelectorAll('*').forEach(child => renderLatexInElement(child));
                    }
                });
            }
        }
    });

    // 4. 启动监控
    // 我们需要找到一个稳定的、能够包裹所有聊天内容的父容器。
    // 经过分析，Gemini的主要内容区域通常在 <main> 标签内。
    // 为了确保万无一失，我们先等待这个容器出现。
    const observerConfig = {
        childList: true, // 监控子节点的增加或删除
        subtree: true    // 监控所有后代节点
    };

    const tryToObserve = setInterval(() => {
        const targetNode = document.querySelector('main');
        if (targetNode) {
            clearInterval(tryToObserve);
            console.log('[Gemini LaTeX Fix] Target container found. Starting MutationObserver.');
            // 首次加载时，对已存在内容进行一次渲染
            renderLatexInElement(targetNode);
            // 启动监控，以捕捉后续动态生成的内容
            observer.observe(targetNode, observerConfig);
        }
    }, 500); // 每500毫秒检查一次

})();