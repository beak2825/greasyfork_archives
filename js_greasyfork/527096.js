// ==UserScript==
// @name         复制LaTex公式，支持ChatGPT/DeepSeek/wikipedia/知乎等多个网站
// @namespace    http://tampermonkey.net/
// @version      1.1.3
// @license      GPLv3
// @description  单击网页中的LaTeX公式，将其复制到剪切板，可以选择直接复制成mathtype对象或者是latex源码
// @description:en Click on the LaTeX formula on the webpage and copy it to the clipboard. You can choose to directly copy it as a mathtype object or the LaTeX source code
// @author       S1gn
// @match        *://*.wikipedia.org/*
// @match        *://*.zhihu.com/*
// @match        *://*.chatgpt.com/*
// @match        *://*.moonshot.cn/*
// @match        *://*.stackexchange.com/*
// @match        *://*.deepseek.com/*
// @icon         https://i.miji.bid/2025/02/16/97ff538f8b0b1b5a3c2f02ad179fd6ea.png
// @require      https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.jst
// @downloadURL https://update.greasyfork.org/scripts/527096/%E5%A4%8D%E5%88%B6LaTex%E5%85%AC%E5%BC%8F%EF%BC%8C%E6%94%AF%E6%8C%81ChatGPTDeepSeekwikipedia%E7%9F%A5%E4%B9%8E%E7%AD%89%E5%A4%9A%E4%B8%AA%E7%BD%91%E7%AB%99.user.js
// @updateURL https://update.greasyfork.org/scripts/527096/%E5%A4%8D%E5%88%B6LaTex%E5%85%AC%E5%BC%8F%EF%BC%8C%E6%94%AF%E6%8C%81ChatGPTDeepSeekwikipedia%E7%9F%A5%E4%B9%8E%E7%AD%89%E5%A4%9A%E4%B8%AA%E7%BD%91%E7%AB%99.meta.js
// ==/UserScript==



(function() {
    'use strict';

    // 插入样式表
    const css = `
        .latex-tooltip { position: fixed; background-color: rgba(0, 0, 0, 0.7); color: #fff; padding: 5px 10px; border-radius: 5px; font-size: 11px; z-index: 1000; opacity: 0; transition: opacity 0.2s; pointer-events: none; }
        .latex-copy-success { position: fixed; bottom: 10%; left: 50%; transform: translateX(-50%); background-color: rgba(0, 0, 0, 0.7); color: #fff; padding: 10px 20px; border-radius: 5px; font-size: 12px; z-index: 1000; opacity: 0; transition: opacity 0.2s; pointer-events: none; }
        .formula-buttons { position: fixed; top: 20px; right: 20px; z-index: 1000; }
        .formula-buttons button { margin: 5px; padding: 10px; font-size: 14px; cursor: pointer; }
    `;
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = css;
    document.head.appendChild(styleSheet);

    // 创建选择按钮
    const buttonContainer = document.createElement('div');
    buttonContainer.classList.add('formula-buttons');
    document.body.appendChild(buttonContainer);

    const types = ['LaTeX', 'MathML'];
    types.forEach(type => {
        const button = document.createElement('button');
        button.textContent = `copy ${type}`;
        button.addEventListener('click', () => {
            currentCopyType = type;
            alert(`selected：${type}`);
        });
        buttonContainer.appendChild(button);
    });

    let currentCopyType = 'LaTeX'; // 默认选择 LaTeX

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
            'wikipedia.org': {
                elementSelector: 'span.mwe-math-element',
                getLatexString: el => {
                    const math = el.querySelector('math');
                    return math ? math.getAttribute('alttext') : ''
                }
            },
            'zhihu.com': {
                elementSelector: 'span.ztext-math',
                getLatexString: el => el.getAttribute('data-tex') || ''
            },
            'chatgpt.com': {
                elementSelector: 'span.katex',
                getLatexString: el => {
                    const annotation = el.querySelector('annotation');
                    return annotation ? annotation.textContent : '';
                }
            },

            'deepseek.com': {
                elementSelector: 'span.katex',
                getLatexString: el => {
                    const annotation = el.querySelector('.katex-mathml annotation');
                    return annotation ? annotation.textContent : ''
                }
            },
            'moonshot.cn': {
                elementSelector: 'span.katex',
                getLatexString: el => {
                    const annotation = el.querySelector('.katex-html annotation');
                    return annotation ? annotation.textContent : ''
                }
            },
            'stackexchange.com': {
                elementSelector: 'span.math-container',
                getLatexString: el => {
                    const script = el.querySelector('script');
                    return script ? script.textContent : ''
                }
            }
            // 其他网站的规则同样类似
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

            element.addEventListener('click', function() {
                if (currentCopyType === 'LaTeX') {
                    copyToClip(latexString);
                } else if (currentCopyType === 'MathML') {
                    copyMLToClip(latexString);
                }

                showCopySuccessTooltip();
                window.getSelection().removeAllRanges();
            });
        });
    }

    // 显示复制成功提示
    function showCopySuccessTooltip() {
        const copyTooltip = document.createElement("div");
        copyTooltip.className = "latex-copy-success";
        copyTooltip.innerText = `copy ${currentCopyType} success!`;
        document.body.appendChild(copyTooltip);

        // 强制浏览器重绘，确保样式应用
        requestAnimationFrame(() => {
            copyTooltip.style.opacity = "1"; // 激活显示
        });

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
