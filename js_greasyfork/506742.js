// ==UserScript==
// @name         复制ChatGPT的LaTex公式（Word文档专用）
// @namespace  http://tampermonkey.net/
// @version      1.1.1
// @license      GPLv3
// @description  双击网页中的LaTeX公式，将其复制到剪切板，粘贴到Word文档中自动转为公式编辑器
// @description:en Double click the LaTeX formula in the webpage, copy it to the clipboard, paste it into a Word document, and it will automatically convert to a formula editor
// @author       Chsengni
// @match        *://*.wikipedia.org/*
// @match        *://*.zhihu.com/*
// @match        *://*.chatgpt.com/*
// @match        *://*.moonshot.cn/*
// @match        *://*.stackexchange.com/*
// @require     https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js
// @downloadURL https://update.greasyfork.org/scripts/506742/%E5%A4%8D%E5%88%B6ChatGPT%E7%9A%84LaTex%E5%85%AC%E5%BC%8F%EF%BC%88Word%E6%96%87%E6%A1%A3%E4%B8%93%E7%94%A8%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/506742/%E5%A4%8D%E5%88%B6ChatGPT%E7%9A%84LaTex%E5%85%AC%E5%BC%8F%EF%BC%88Word%E6%96%87%E6%A1%A3%E4%B8%93%E7%94%A8%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 插入样式表
    const css = `
        .latex-tooltip { position: fixed; background-color: rgba(0, 0, 0, 0.7); color: #fff; padding: 5px 10px; border-radius: 5px; font-size: 11px; z-index: 1000; opacity: 0; transition: opacity 0.2s; pointer-events: none; }
        .latex-copy-success { position: fixed; bottom: 10%; left: 50%; transform: translateX(-50%); background-color: rgba(0, 0, 0, 0.7); color: #fff; padding: 10px 20px; border-radius: 5px; font-size: 12px; z-index: 1000; opacity: 0; transition: opacity 0.2s; pointer-events: none; }
    `;
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = css;
    document.head.appendChild(styleSheet);

    // 创建提示框元素
    const tooltip = document.createElement('div');
    tooltip.classList.add('latex-tooltip');
    document.body.appendChild(tooltip);

    // 创建复制功能
    function copyToClip(text) {
        const input = document.createElement("input");
        input.setAttribute("value", text);
        document.body.appendChild(input);
        input.select();
        document.execCommand("copy");
        document.body.removeChild(input);
    }

    // 创建 LaTeX 复制功能
    function copyMLToClip(latexInput) {
        // Reset MathJax
        MathJax.texReset();
        // Convert LaTeX to MathML
        MathJax.tex2mmlPromise(latexInput).then(function(mathML) {
            // Copy the MathML to clipboard
            copyToClip(mathML);
            showCopySuccessTooltip();
        }).catch(function(error) {
            console.error(error);
        });
    }

    // 获取对象和公式方法
    function getTarget(url) {
        const targets = {
            'wikipedia.org': { elementSelector: 'span.mwe-math-element', getLatexString: el => el.querySelector('math').getAttribute('alttext') },
            'zhihu.com': { elementSelector: 'span.ztext-math', getLatexString: el => el.getAttribute('data-tex') },
            'chatgpt.com': { elementSelector: 'span.katex', getLatexString: el => el.querySelector('annotation').textContent },
            'moonshot.cn': { elementSelector: 'span.katex', getLatexString: el => el.querySelector('annotation').textContent },
            'stackexchange.com': { elementSelector: 'span.math-container', getLatexString: el => el.querySelector('script').textContent }
        };

        for (const [key, value] of Object.entries(targets)) {
            if (url.includes(key)) {
                return value;
            }
        }
        return null;
    }

    // 绑定事件到元素
    function addHandler() {
        const target = getTarget(window.location.href);
        if (!target) return;

        document.querySelectorAll(target.elementSelector).forEach(element => {
            const latexString = target.getLatexString(element);

            element.addEventListener('mouseenter', function () {
                element.style.cursor = "pointer";
                tooltip.textContent = latexString;
                const rect = element.getBoundingClientRect();
                tooltip.style.left = `${rect.left}px`;
                tooltip.style.top = `${rect.top - tooltip.offsetHeight - 5}px`;
                tooltip.style.opacity = '0.8';
            });

            element.addEventListener('mouseleave', function () {
                element.style.cursor = "auto";
                tooltip.style.opacity = '0';
            });

            element.addEventListener('dblclick', function() {
                copyMLToClip(latexString);
                window.getSelection().removeAllRanges();
            });
        });
    }

    // 显示复制成功提示
    function showCopySuccessTooltip() {
        const copyTooltip = document.createElement("div");
        copyTooltip.className = "latex-copy-success";
        copyTooltip.innerText = "已复制LaTeX公式";
        document.body.appendChild(copyTooltip);
        setTimeout(() => {
            copyTooltip.style.opacity = "0";
            setTimeout(() => {
                document.body.removeChild(copyTooltip);
            }, 200);
        }, 1000);
    }

    // 监听页面加载或变化，绑定事件
    document.addEventListener('DOMContentLoaded', addHandler);
    new MutationObserver(addHandler).observe(document.documentElement, { childList: true, subtree: true });
})();
