// ==UserScript==
// @name         TexCopyer
// @namespace    http://tampermonkey.net/
// @version      1.2
// @license      GPLv3
// @description  双击网页中的LaTex公式，将其复制到剪切板
// @description:en Double click on a LaTeX formula on a webpage to copy it to the clipboard
// @author       yjy | blime
// @match        *://*.wikipedia.org/*
// @match        *://*.zhihu.com/*
// @match        *://*.chatgpt.com/*
// @match        *://*.moonshot.cn/*
// @match        *://*.stackexchange.com/*
// @match        *://*.kexue.fm/*
// @downloadURL https://update.greasyfork.org/scripts/511978/TexCopyer.user.js
// @updateURL https://update.greasyfork.org/scripts/511978/TexCopyer.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 插入样式表
    const css = `
        .latex-tooltip { position: fixed; background-color: rgba(0, 0, 0, 0.7); color: #fff; padding: 5px 10px; border-radius: 5px; font-size: 11px; z-index: 1000; opacity: 0; transition: opacity 0.2s; pointer-events: none; }
        .latex-copy-success { position: fixed; bottom: 10%; left: 50%; transform: translateX(-50%); background-color: rgba(0, 0, 0, 0.7); color: #fff; padding: 10px 20px; border-radius: 5px; font-size: 12px; z-index: 1000; transition: opacity 0.2s; pointer-events: none; }
    `;
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = css;
    document.head.appendChild(styleSheet);

    // 创建提示框元素
    const tooltip = document.createElement('div');
    tooltip.classList.add('latex-tooltip');
    document.body.appendChild(tooltip);

    // 获取对象和公式方法
    function getTarget(url) {
        let target = {elementSelector: '', getLatexString: null}
        // 格式化latex
        function formatLatex(input) {
            while (input.endsWith(' ') || input.endsWith('\\')) {
                input = input.slice(0, -1);
            }
            return '$' + input + '$';
        }
        if (url.includes('wikipedia.org')) {
            target.elementSelector = 'span.mwe-math-element';
            target.getLatexString = (element) => formatLatex(element.querySelector('math').getAttribute('alttext'));
            return target

        } else if (url.includes('zhihu.com')) {
            target.elementSelector = 'span.ztext-math';
            target.getLatexString = (element) => formatLatex(element.getAttribute('data-tex'));
            return target

        } else if (url.includes('chatgpt.com')) {
            target.elementSelector = 'span.katex';
            target.getLatexString = (element) => formatLatex(element.querySelector('annotation').textContent);
            return target
        } else if (url.includes('moonshot.cn')) {
            target.elementSelector = 'span.katex';
            target.getLatexString = (element) => formatLatex(element.querySelector('annotation').textContent);
            return target
        } else if (url.includes('stackexchange.com')) {
            target.elementSelector = 'span.math-container';
            target.getLatexString = (element) => formatLatex(element.querySelector('script').textContent);
            return target
        } else if (url.includes('kexue.fm')) {
            target.elementSelector = 'math';
            target.getLatexString = (element) => formatLatex(element.querySelector('annotation[encoding="application/x-tex"]').textContent);
            return target;
        }
        // 待添加更多网站的条件
        return null;
    }

    // 绑定事件到元素
    function addHandler() {
        let target = getTarget(window.location.href);
        if (!target) return;

        let tooltipTimeout;
        document.querySelectorAll(target.elementSelector).forEach(element => {
            element.addEventListener('mouseenter', function () {
                element.style.cursor = "pointer";
                tooltipTimeout = setTimeout(function () {
                    tooltip.textContent = getTarget(window.location.href).getLatexString(element);;
                    const rect = element.getBoundingClientRect();
                    tooltip.style.left = `${rect.left}px`;
                    tooltip.style.top = `${rect.top - tooltip.offsetHeight - 5}px`;
                    tooltip.style.display = 'block';
                    tooltip.style.opacity = '0.8';
                }, 1000); // 进入延迟1秒
            });

            element.addEventListener('mouseleave', function () {
                element.style.cursor = "auto";
                clearTimeout(tooltipTimeout);
                tooltip.style.display = 'none';
                tooltip.style.opacity = '0';
            });
            element.ondblclick = function() {
                const latexString = target.getLatexString(element)
                if (latexString !== null) {
                    console.log(`LaTeX copied: ${latexString}`) // for debug
                    navigator.clipboard.writeText(latexString).then(() => {
                        showCopySuccessTooltip();
                    });
                }
                // 取消网页上的选中状态(不是很优雅)
                window.getSelection().removeAllRanges();
            };
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
            }, 200); // 与transition时间匹配
        }, 1000); // 提示短时间后消失
    }

    // 监听页面加载或变化，绑定事件
    document.addEventListener('DOMContentLoaded', addHandler);
    new MutationObserver(addHandler).observe(document.documentElement, {childList: true, subtree: true});


})();