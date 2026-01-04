// ==UserScript==
// @name         标注平台内容复制
// @namespace    http://cq.net/
// @version      0.3
// @description  在页面上添加按钮，一键复制多个内容
// @author       cq
// @match        *://qgpt-mark.skyeye.qianxin-inc.cn/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/503073/%E6%A0%87%E6%B3%A8%E5%B9%B3%E5%8F%B0%E5%86%85%E5%AE%B9%E5%A4%8D%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/503073/%E6%A0%87%E6%B3%A8%E5%B9%B3%E5%8F%B0%E5%86%85%E5%AE%B9%E5%A4%8D%E5%88%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 添加复制按钮的通用函数
    function addCopyButton(h4Selector, preSelector) {
        const h4Element = document.querySelector(h4Selector);
        const preElement = document.querySelector(preSelector);

        if (h4Element && preElement) {
            if (document.querySelector(`.copy-btn[data-selector='${h4Selector}']`)) return;

            const copyButton = document.createElement('button');
            copyButton.className = 'copy-btn';
            copyButton.style.marginLeft = '10px';
            copyButton.style.border = 'none';
            copyButton.style.background = 'transparent';
            copyButton.style.cursor = 'pointer';
            copyButton.style.color = '#B0C4DE';
            copyButton.setAttribute('data-selector', h4Selector);

            // SVG 图标
            copyButton.innerHTML = `
            <svg t="1723193786265" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4244" width="15" height="15"><path d="M928 256H768V96c0-17.066667-14.933333-32-32-32h-640C78.933333 64 64 78.933333 64 96v640c0 17.066667 14.933333 32 32 32H256v160c0 17.066667 14.933333 32 32 32h640c17.066667 0 32-14.933333 32-32v-640c0-17.066667-14.933333-32-32-32zM128 704V128h576v128H288c-17.066667 0-32 14.933333-32 32V704H128z m768 192H320V320h576v576z" fill="#212121" p-id="4245"></path></svg>
            `;

            h4Element.appendChild(copyButton);

            copyButton.addEventListener('click', () => {
                const textToCopy = preElement.textContent.trim();
                //console.log(`准备复制的内容 (Selector: ${preSelector}):`, textToCopy);

                const textArea = document.createElement('textarea');
                textArea.value = textToCopy;
                document.body.appendChild(textArea);
                textArea.select();
                try {
                    document.execCommand('copy');
                    showCopiedMessage(h4Element);
                } catch (e) {
                    console.error('复制失败:', e);
                }
                document.body.removeChild(textArea);
            });
        } else {
            setTimeout(() => addCopyButton(h4Selector, preSelector), 1000);
        }
    }

    // 显示已复制消息
    function showCopiedMessage(element) {
        const message = document.createElement('span');
        message.textContent = '已复制';
        message.style.marginLeft = '10px';
        message.style.color = '#B0C4DE';
        element.appendChild(message);
        setTimeout(() => message.remove(), 2000);
    }

    // 初始化复制按钮
    function initCopyButtons() {
        addCopyButton(
            '#pane-base > div > div > div > div:nth-child(3) > h4:nth-child(1)',
            '#pane-base > div > div > div > div:nth-child(3) > div:nth-child(2) > pre'
        );
        addCopyButton(
            '#pane-base > div > div > div > div:nth-child(3) > h4:nth-child(3)',
            '#pane-base > div > div > div > div:nth-child(3) > div:nth-child(4) > pre'
        );
        addCopyButton(
            '#pane-base > div > div > div > div:nth-child(3) > h4:nth-child(5)',
            '#pane-base > div > div > div > div:nth-child(3) > div:nth-child(6) > pre'
        );
        addCopyButton(
            '#pane-base > div > div > div > div:nth-child(3) > h4:nth-child(7)',
            '#pane-base > div > div > div > div:nth-child(3) > div:nth-child(8) > pre'
        );
    }

    // 监听页面导航变化
    function observePageChanges() {
        const observer = new MutationObserver(initCopyButtons);
        observer.observe(document.body, { childList: true, subtree: true });
    }

    // 延迟执行，确保页面完全加载
    window.addEventListener('load', () => {
        initCopyButtons();
        observePageChanges();
    });
})();
