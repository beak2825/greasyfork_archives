// ==UserScript==
// @name         MathJax Support
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  为网页添加MathJax支持，优化性能
// @author       Snowballl11
// @license      MIT
// @match        *://*/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/512429/MathJax%20Support.user.js
// @updateURL https://update.greasyfork.org/scripts/512429/MathJax%20Support.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 如果MathJax已经存在，直接返回
    if (window.MathJax) return;

    // 创建MathJax配置
    window.MathJax = {
        tex: {
            inlineMath: [['$', '$'], ['\\(', '\\)']],
            displayMath: [['$$', '$$'], ['\\[', '\\]']],
            processEscapes: true
        },
        options: {
            skipHtmlTags: ['script', 'noscript', 'style', 'textarea', 'pre', 'code']
        }
    };

    // 创建并插入MathJax脚本
    var script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js';
    script.async = true;
    document.head.appendChild(script);

    // MathJax加载完成后的处理
    script.onload = function() {
        // 尝试找到文章内容的容器元素
        var contentContainer = document.querySelector('#article-content') ||
                               document.querySelector('.post-content') ||
                               document.querySelector('article') ||
                               document.body;

        // 如果找到了容器元素，立即对其中的内容进行渲染
        if (contentContainer && typeof MathJax !== 'undefined') {
            MathJax.typeset([contentContainer]);
        }
    };
})();

/*
MIT License

Copyright (c) [2024] [Snowballl11]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/
