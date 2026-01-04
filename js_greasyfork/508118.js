// ==UserScript==
// @name         inoreader 添加 Mathjax
// @namespace    http://tampermonkey.net/
// @version      0.1
// @license       CC-BY-NC-ND-4.0
// @description  添加 Mathjax 支持
// @author       You
// @match        *://*.inoreader.com/*
// @icon         https://www.inoreader.com/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/508118/inoreader%20%E6%B7%BB%E5%8A%A0%20Mathjax.user.js
// @updateURL https://update.greasyfork.org/scripts/508118/inoreader%20%E6%B7%BB%E5%8A%A0%20Mathjax.meta.js
// ==/UserScript==

window.MathJax = {
    tex: { inlineMath: [['$', '$'], ['\\(', '\\)']] }
};

function renderMathJax() {
    window.MathJax.typeset();
}

(function () {
    let script = document.createElement('script');
    script.type = "text/javascript";
    script.src = 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js';
    script.async = true;
    document.head.appendChild(script);

    script.onload = () => {
        MathJax.startup.promise.then(() => {
            // 初次渲染
            renderMathJax();

            // 使用 MutationObserver 监控内容变化
            const observer = new MutationObserver((mutationsList) => {
                let shouldRender = false;
                for (let mutation of mutationsList) {
                    if (mutation.type === 'childList') {
                        shouldRender = true;
                        break;
                    }
                }
                if (shouldRender) {
                    renderMathJax(); // 仅在有变动时渲染
                }
            });

            // 观察整个文档的子节点变动
            observer.observe(document.body, { childList: true, subtree: true });
        });
    };

    let sidebar = document.querySelector(".sidebar_fieldset");
    if (sidebar) {
        sidebar.classList.add('notranslate');
    }
})();
