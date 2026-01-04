// ==UserScript==
// @name         GitHub 增强工具栏
// @namespace    https://github.com/txy-sky
// @icon         https://github.com/favicons/favicon.svg
// @version      1.5.0
// @description  在 Github 网站顶部显示 Github.dev 和 DeepWiki 和 ZreadAi 按钮，方便更好地查看代码。当按钮过多时自动切换为图标模式。
// @author       Txy-Sky
// @match        https://github.com/*
// @run-at       document-end
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/544826/GitHub%20%E5%A2%9E%E5%BC%BA%E5%B7%A5%E5%85%B7%E6%A0%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/544826/GitHub%20%E5%A2%9E%E5%BC%BA%E5%B7%A5%E5%85%B7%E6%A0%8F.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 添加全局样式以修复按钮样式
    const style = `
        .custom-github-button {
            margin: 0 4px;
            display: flex;
            align-items: center;
            height: 28px;
        }
        .custom-github-button .octicon {
            margin-right: 4px;
            vertical-align: text-bottom;
        }
        .custom-github-button.icon-only .octicon {
            margin-right: 0;
        }
        .pagehead-actions > li {
            margin-right: 8px;
        }
    `;

    // 注入样式到页面
    const styleElement = document.createElement('style');
    styleElement.textContent = style;
    document.head.appendChild(styleElement);

    // 等待元素出现的函数
    function waitForElement(selector, timeout = 10000) {
        return new Promise((resolve, reject) => {
            const element = document.querySelector(selector);
            if (element) {
                resolve(element);
                return;
            }

            const observer = new MutationObserver((mutations, obs) => {
                const element = document.querySelector(selector);
                if (element) {
                    obs.disconnect();
                    resolve(element);
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });

            // 超时处理
            setTimeout(() => {
                observer.disconnect();
                reject(new Error(`Element ${selector} not found within ${timeout}ms`));
            }, timeout);
        });
    }

    // 查找按钮容器的函数，提高兼容性
    async function findButtonContainer() {
        // 尝试多个可能的选择器
        const selectors = [
            'ul.pagehead-actions',
            '.pagehead-actions',
            '.file-navigation .d-flex',
            'nav[aria-label="Repository"] .d-flex'
        ];

        for (const selector of selectors) {
            const element = document.querySelector(selector);
            if (element) return element;
        }

        return null;
    }

    // 检测现有按钮数量的函数
    function countExistingButtons(container) {
        if (!container) return 0;
        
        // 计算现有按钮数量，排除我们即将添加的按钮
        const existingButtons = container.querySelectorAll('li:not(#githubdevButton):not(#zreadaiButton):not(#deepwikiButton)');
        return existingButtons.length;
    }

    // 统一按钮创建函数，支持仅图标模式
    function createCustomButton(id, url, iconHtml, text, iconOnly = false) {
        const li = document.createElement('li');
        li.id = id;
        li.className = 'd-flex';
        li.style.marginRight = '8px';

        const a = document.createElement('a');
        a.href = url;
        a.className = iconOnly ? 'btn btn-sm custom-github-button icon-only' : 'btn btn-sm custom-github-button';
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        
        if (iconOnly) {
            a.innerHTML = iconHtml;
            a.title = text; // 添加 tooltip 显示完整文本
        } else {
            a.innerHTML = `${iconHtml}<span>${text}</span>`;
        }

        li.appendChild(a);
        return li;
    }

    // 创建 Github.dev 按钮
    function createGithubDevButton(iconOnly = false) {
        const githubdevUrl = `https://github.dev${location.pathname}${location.search}${location.hash}`;
        const iconHtml = `<img class="octicon" width="16" height="16" src="https://github.com/favicons/favicon-codespaces.svg" />`;
        return createCustomButton('githubdevButton', githubdevUrl, iconHtml, 'Github.dev', iconOnly);
    }

    // 创建 ZreadAi 按钮
    function createZreadAiButton(iconOnly = false) {
        const zreadAiUrl = `https://zread.ai${location.pathname}${location.search}${location.hash}`;
        const iconHtml = `<svg aria-hidden="true" viewBox="0 0 32 32" version="1.1" width="16" height="16" class="octicon">
            <path d="M9.91922 3.2002H4.47922C3.77229 3.2002 3.19922 3.77327 3.19922 4.4802V9.9202C3.19922 10.6271 3.77229 11.2002 4.47922 11.2002H9.91922C10.6261 11.2002 11.1992 10.6271 11.1992 9.9202V4.4802C11.1992 3.77327 10.6261 3.2002 9.91922 3.2002Z" fill="currentColor"></path>
            <path d="M9.91922 20.7998H4.47922C3.77229 20.7998 3.19922 21.3729 3.19922 22.0798V27.5198C3.19922 28.2267 3.77229 28.7998 4.47922 28.7998H9.91922C10.6261 28.7998 11.1992 28.2267 11.1992 27.5198V22.0798C11.1992 21.3729 10.6261 20.7998 9.91922 20.7998Z" fill="currentColor"></path>
            <path d="M27.5208 3.2002H22.0808C21.3739 3.2002 20.8008 3.77327 20.8008 4.4802V9.9202C20.8008 10.6271 21.3739 11.2002 22.0808 11.2002H27.5208C28.2277 11.2002 28.8008 10.6271 28.8008 9.9202V4.4802C28.8008 3.77327 28.2277 3.2002 27.5208 3.2002Z" fill="currentColor"></path>
            <path d="M8 24L24 8L8 24Z" fill="currentColor"></path>
            <path d="M8 24L24 8" stroke="currentColor" stroke-width="2" stroke-linecap="round"></path>
        </svg>`;
        return createCustomButton('zreadaiButton', zreadAiUrl, iconHtml, 'ZreadAi', iconOnly);
    }

    // 创建 DeepWiki 按钮
    function createDeepWikiButton(iconOnly = false) {
        const deepwikiUrl = `https://deepwiki.com${location.pathname}${location.search}${location.hash}`;
        const iconHtml = `<svg class="octicon" xmlns="http://www.w3.org/2000/svg" viewBox="110 110 460 500" width="16" height="16">
            <path d="M418.73,332.37c9.84-5.68,22.07-5.68,31.91,0l25.49,14.71c.82.48,1.69.8,2.58,1.06.19.06.37.11.55.16.87.21,1.76.34,2.65.35.04,0,.08.02.13.02.1,0,.19-.03.29-.04.83-.02,1.64-.13,2.45-.32.14-.03.28-.05.42-.09.87-.24,1.7-.59,2.5-1.03.08-.04.17-.06.25-.1l50.97-29.43c3.65-2.11,5.9-6.01,5.9-10.22v-58.86c0-4.22-2.25-8.11-5.9-10.22l-50.97-29.43c-3.65-2.11-8.15-2.11-11.81,0l-50.97,29.43c-.08.04-.13.11-.2.16-.78.48-1.51,1.02-2.15,1.66-.1.1-.18.21-.28.31-.57.6-1.08,1.26-1.51,1.97-.07.12-.15.22-.22.34-.44.77-.77,1.6-1.03,2.47-.05.19-.1.37-.14.56-.22.89-.37,1.81-.37,2.76v29.43c0,11.36-6.11,21.95-15.95,27.63-9.84,5.68-22.06,5.68-31.91,0l-25.49-14.71c-.82-.48-1.69-.8-2.57-1.06-.19-.06-.37-.11-.56-.16-.88-.21-1.76-.34-2.65-.34-.13,0-.26.02-.4.02-.84.02-1.66.13-2.47.32-.13.03-.27.05-.4.09-.87.24-1.71.6-2.51,1.04-.08.04-.16.06-.24.1l-50.97,29.43c-3.65,2.11-5.9,6.01-5.9,10.22v58.86c0,4.22,2.25,8.11,5.9,10.22l50.97,29.43c.08.04.17.06.24.1.8.44,1.64.79,2.5,1.03.14.04.28.06.42.09.81.19,1.62.3,2.45.32.1,0,.19.04.29.04.04,0,.08-.02.13-.02.89,0,1.77-.13,2.65-.35.19-.04.37-.1.56-.16.88-.26,1.75-.59,2.58-1.06l25.49-14.71c9.84-5.68,22.06-5.68,31.91,0,9.84,5.68,15.95,16.27,15.95,27.63v29.43c0,.95.15,1.87.37,2.76.05.19.09.37.14.56.25.86.59,1.69,1.03,2.47.07.12.15.22.22.34.43.71.94,1.37,1.51,1.97.1.1.18.21.28.31.65.63,1.37,1.18,2.15,1.66.07.04.13.11.2.16l50.97,29.43c1.83,1.05,3.86,1.58,5.9,1.58s4.08-.53,5.9-1.58l50.97-29.43c3.65-2.11,5.9-6.01,5.9-10.22v-58.86c0-4.22-2.25-8.11-5.9-10.22l-50.97-29.43c-.08-.04-.16-.06-.24-.1-.8-.44-1.64-.8-2.51-1.04-.13-.04-.26-.05-.39-.09-.82-.2-1.65-.31-2.49-.33-.13,0-.25-.02-.38-.02-.89,0-1.78.13-2.66.35-.18.04-.36.1-.54.15-.88.26-1.75.59-2.58,1.07l-25.49,14.72c-9.84,5.68-22.07,5.68-31.9,0-9.84-5.68-15.95-16.27-15.95-27.63s6.11-21.95,15.95-27.63Z" fill="rgb(33, 193, 154)"></path>
            <path d="M141.09,317.65l50.97,29.43c1.83,1.05,3.86,1.58,5.9,1.58s4.08-.53,5.9-1.58l50.97-29.43c.08-.04.13-.11.2-.16.78-.48,1.51-1.02,2.15-1.66.1-.1.18-.21.28-.31.57-.6,1.08-1.26,1.51-1.97.07-.12.15-.22.22-.34.44-.77.77-1.6,1.03-2.47.05-.19.1-.37.14-.56.22-.89.37-1.81.37-2.76v-29.43c0-11.36,6.11-21.95,15.96-27.63s22.06-5.68,31.91,0l25.49,14.71c.82.48,1.69.8,2.57,1.06.19.06.37.11.56.16.87.21,1.76.34,2.64.35.04,0,.09.02.13.02.1,0,.19-.04.29-.04.83-.02,1.65-.13,2.45-.32.14-.03.28-.05.41-.09.87-.24,1.71-.6,2.51-1.04.08-.04.16-.06.24-.1l50.97-29.43c3.65-2.11,5.9-6.01,5.9-10.22v-58.86c0-4.22-2.25-8.11-5.9-10.22l-50.97-29.43c-3.65-2.11-8.15-2.11-11.81,0l-50.97,29.43c-.08.04-.13.11-.2.16-.78.48-1.51,1.02-2.15,1.66-.1.1-.18.21-.28.31-.57.6-1.08,1.26-1.51,1.97-.07.12-.15.22-.22.34-.44.77-.77,1.6-1.03,2.47-.05.19-.1.37-.14.56-.22.89-.37,1.81-.37,2.76v29.43c0,11.36-6.11,21.95-15.95,27.63-9.84,5.68-22.07,5.68-31.91,0l-25.49-14.71c-.82-.48-1.69-.8-2.58-1.06-.19-.06-.37-.11-.55-.16-.88-.21-1.76-.34-2.65-.35-.13,0-.26.02-.4.02-.83.02-1.66.13-2.47.32-.13.03-.27.05-.4.09-.87.24-1.71.6-2.51,1.04-.08.04-.16.06-.24.1l-50.97,29.43c-3.65,2.11-5.9,6.01-5.9,10.22v58.86c0,4.22,2.25,8.11,5.9,10.22Z" fill="rgb(57, 105, 202)"></path>
            <path d="M396.88,484.35l-50.97-29.43c-.08-.04-.17-.06-.24-.1-.8-.44-1.64-.79-2.51-1.03-.14-.04-.27-.06-.41-.09-.81-.19-1.64-.3-2.47-.32-.13,0-.26-.02-.39-.02-.89,0-1.78.13-2.66.35-.18.04-.36.1-.54.15-.88.26-1.76.59-2.58,1.07l-25.49,14.72c-9.84,5.68-22.06,5.68-31.9,0-9.84-5.68-15.96-16.27-15.96-27.63v-29.43c0-.95-.15-1.87-.37-2.76-.05-.19-.09-.37-.14-.56-.25-.86-.59-1.69-1.03-2.47-.07-.12-.15-.22-.22-.34-.43-.71-.94-1.37-1.51-1.97-.1-.1-.18-.21-.28-.31-.65-.63-1.37-1.18-2.15-1.66-.07-.04-.13-.11-.2-.16l-50.97-29.43c-3.65-2.11-8.15-2.11-11.81,0l-50.97,29.43c-3.65,2.11-5.9,6.01-5.9,10.22v58.86c0,4.22,2.25,8.11,5.9,10.22l50.97,29.43c.08.04.17.06.25.1.8.44,1.63.79,2.5,1.03.14.04.29.06.43.09.8.19,1.61.3,2.43.32.1,0,.2.04.3.04.04,0,.09-.02.13-.02.88,0,1.77-.13,2.64-.34.19-.04.37-.1.56-.16.88-.26,1.75-.59,2.57-1.06l25.49-14.71c9.84-5.68,22.06-5.68,31.91,0,9.84,5.68,15.95,16.27,15.95,27.63v29.43c0,.95.15,1.87.37,2.76.05.19.09.37.14.56.25.86.59,1.69,1.03,2.47.07.12.15.22.22.34.43.71.94,1.37,1.51,1.97.1.1.18.21.28.31.65.63,1.37,1.18,2.15,1.66.07.04.13.11.2.16l50.97,29.43c1.83,1.05,3.86,1.58,5.9,1.58s4.08-.53,5.9-1.58l50.97-29.43c3.65-2.11,5.9-6.01,5.9-10.22v-58.86c0-4.22-2.25-8.11-5.9-10.22Z" fill="rgb(2, 148, 222)"></path>
        </svg>`;
        return createCustomButton('deepwikiButton', deepwikiUrl, iconHtml, 'DeepWiki', iconOnly);
    }

    // 统一处理按钮创建和添加的函数
    async function addButtons() {
        try {
            // 查找合适的按钮容器
            const buttonContainer = await findButtonContainer();
            if (!buttonContainer) {
                console.log('GitHub按钮脚本：找不到合适的按钮容器');
                return;
            }

            // 移除可能已存在的按钮
            const existingButtons = document.querySelectorAll('#githubdevButton, #zreadaiButton, #deepwikiButton');
            existingButtons.forEach(btn => btn.remove());

            // 检测现有按钮数量，决定是否使用仅图标模式
            const existingButtonCount = countExistingButtons(buttonContainer);
            const iconOnly = existingButtonCount > 3;

            // 创建按钮并添加到容器
            const deepWikiButton = createDeepWikiButton(iconOnly);
            const zreadAiButton = createZreadAiButton(iconOnly);
            const githubDevButton = createGithubDevButton(iconOnly);

            // 使用正确的顺序添加按钮，保证它们显示在最前面
            buttonContainer.insertBefore(deepWikiButton, buttonContainer.firstChild);
            buttonContainer.insertBefore(zreadAiButton, buttonContainer.firstChild);
            buttonContainer.insertBefore(githubDevButton, buttonContainer.firstChild);
        } catch (error) {
            console.log('GitHub按钮脚本：添加按钮时发生错误', error);
        }
    }

    // 防抖函数
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // 使用防抖的按钮添加函数
    const debouncedAddButtons = debounce(addButtons, 300);

    // 页面加载完成后执行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', debouncedAddButtons);
    } else {
        // 页面已经加载完成，延迟执行以确保所有元素都渲染完成
        setTimeout(debouncedAddButtons, 100);
    }

    // 监听 PJAX/Turbo 导航事件
    document.addEventListener("pjax:end", debouncedAddButtons);
    document.addEventListener("turbo:load", debouncedAddButtons); // 增加 Turbo 事件支持

    // 监听 URL 变化
    let currentUrl = location.href;
    const observer = new MutationObserver(() => {
        if (location.href !== currentUrl) {
            currentUrl = location.href;
            setTimeout(debouncedAddButtons, 500);
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });
})();
