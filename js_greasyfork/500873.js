// ==UserScript==
// @name         ChatGPT额外的复制代码按钮
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  在生成的代码下，添加一个“复制代码”按钮，对于程序员格外友好。它将不会复制除代码以外的非代码文本。
// @author       狐狸的狐狸画
// @match        https://chatgpt.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/500873/ChatGPT%E9%A2%9D%E5%A4%96%E7%9A%84%E5%A4%8D%E5%88%B6%E4%BB%A3%E7%A0%81%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/500873/ChatGPT%E9%A2%9D%E5%A4%96%E7%9A%84%E5%A4%8D%E5%88%B6%E4%BB%A3%E7%A0%81%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const processedPreTags = new Set();

    function copyButtonToAfterPre() {
        const preElements = document.querySelectorAll('pre');
        preElements.forEach(pre => {
            if (processedPreTags.has(pre)) return; // 跳过已处理的 <pre> 标签

            const buttons = pre.querySelectorAll('button');
            buttons.forEach(button => {
                if (button.textContent.includes('复制代码')) {
                    const clonedButton = button.cloneNode(true);
                    // 为克隆的按钮添加事件监听器，模拟原始功能
                    clonedButton.addEventListener('click', () => {
                        const codeContent = pre.querySelector('code') ? pre.querySelector('code').textContent : pre.textContent; // 如果找不到 code 标签则回退到 pre.textContent
                        navigator.clipboard.writeText(codeContent).then(() => {
                            console.log('代码已复制!');
                            const originalText = clonedButton.textContent;
                            clonedButton.textContent = '已复制！';
                            setTimeout(() => {
                                clonedButton.textContent = originalText;
                            }, 1000); // 1秒后恢复原始文本
                        }).catch(err => {
                            console.log('复制失败: ', err);
                        });
                    });
                    pre.insertAdjacentElement('afterend', clonedButton);
                    processedPreTags.add(pre); // 标记这个 <pre> 已经被处理
                }
            });
        });
    }

    // 创建一个 MutationObserver 来监控 DOM 变化
    const observer = new MutationObserver(mutations => {
        mutations.forEach(() => {
            copyButtonToAfterPre();
        });
    });

    // 配置观察器以监听子节点和子树的变化
    observer.observe(document.body, { childList: true, subtree: true });

    // 初始执行以覆盖任何已存在的 <pre> 元素
    copyButtonToAfterPre();
})();
