// ==UserScript==
// @name         Better Mathjax For 124OJ
// @namespace    http://tampermonkey.net/
// @version      1.1.2
// @description  强制加载新的 MathJax CDN 确保公式正确渲染
// @author       GGapa
// @match        *://124.221.194.184/*
// @license      MIT
// @grant        none
// @icon         https://ex124oj.pond.ink/images/icon.png
// @downloadURL https://update.greasyfork.org/scripts/512826/Better%20Mathjax%20For%20124OJ.user.js
// @updateURL https://update.greasyfork.org/scripts/512826/Better%20Mathjax%20For%20124OJ.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const newCDN = 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js';

    function forceLoadMathJax() {
        console.log('强制替换 MathJax CDN...');

        // 删除页面上所有旧的 MathJax 脚本
        document.querySelectorAll('script[src*="MathJax"]').forEach(script => script.remove());

        // 添加新的 MathJax 脚本
        const script = document.createElement('script');
        script.src = newCDN;
        script.async = true;

        // 配置 MathJax
        window.MathJax = {
            tex: {
                inlineMath: [['$', '$'], ['\\(', '\\)']],
                displayMath: [['$$', '$$'], ['\\[', '\\]']]
            },
            options: {
                skipHtmlTags: ['script', 'noscript', 'style', 'textarea', 'pre'],
                processEscapes: true
            },
            startup: {
                ready: () => {
                    console.log('MathJax 已加载');
                    MathJax.startup.defaultReady();
                    MathJax.typesetPromise().then(() => {
                        console.log('公式已成功渲染');
                    }).catch(err => console.error('渲染出错:', err));
                }
            }
        };

        document.head.appendChild(script);
    }

    // 强制加载新的 MathJax，无论是否已有加载
    forceLoadMathJax();
})();
