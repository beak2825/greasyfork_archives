// ==UserScript==
// @name          AI Chat TOC (多平台 AI 对话目录助手)
// @namespace     http://tampermonkey.net/
// @version       2.0
// @description   模仿 Notion 目录交互，默认横线缩略，鼠标悬停展开目录
// @author        John Qu
// @license       MIT
// @match         https://chat.openai.com/*
// @match         https://chatgpt.com/*
// @match         https://gemini.google.com/*
// @match         https://claude.ai/*
// @grant         none
// @downloadURL https://update.greasyfork.org/scripts/544990/AI%20Chat%20TOC%20%28%E5%A4%9A%E5%B9%B3%E5%8F%B0%20AI%20%E5%AF%B9%E8%AF%9D%E7%9B%AE%E5%BD%95%E5%8A%A9%E6%89%8B%29.user.js
// @updateURL https://update.greasyfork.org/scripts/544990/AI%20Chat%20TOC%20%28%E5%A4%9A%E5%B9%B3%E5%8F%B0%20AI%20%E5%AF%B9%E8%AF%9D%E7%9B%AE%E5%BD%95%E5%8A%A9%E6%89%8B%29.meta.js
// ==/UserScript==

(function () {
    'use strict';


    let messageSelector = '';
    let textSelector = '';

    switch (window.location.hostname) {
        case 'gemini.google.com':
            messageSelector = '.query-content';
            textSelector = '.query-text';
            break;
        case 'chat.openai.com':
        case 'chatgpt.com':
            messageSelector = 'div[data-message-author-role="user"]';
            textSelector = 'div.whitespace-pre-wrap';
            break;
        case 'claude.ai':
            messageSelector = 'div[data-testid="user-message"]';
            textSelector = 'p[class="whitespace-pre-wrap break-words"]';
            break;
    }




    // 创建目录容器
    const tocContainer = document.createElement('div');
    tocContainer.id = 'user-toc-container';
    tocContainer.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        width: 40px; /* 默认宽度，用于显示横线缩略图 */
        max-height: 80vh;
        overflow-y: hidden; /* 默认隐藏滚动条 */
        background: #f7f7f8;
        border: 1px solid #dcdcdc;
        box-shadow: 0 4px 14px rgba(0,0,0,0.1);
        font-size: 14px;
        z-index: 9999;
        padding: 12px;
        border-radius: 8px;
        user-select: none;
        transition: width 0.3s ease-in-out, overflow-y 0.3s ease-in-out; /* 添加过渡效果 */
        display: flex;
        flex-direction: column;
        justify-content: center; /* 垂直居中横线 */
        align-items: center; /* 水平居中横线 */
    `;

    // 创建横线缩略图容器
    const thumbnailContainer = document.createElement('div');
    thumbnailContainer.id = 'toc-thumbnail';
    thumbnailContainer.style.cssText = `
        display: flex;
        flex-direction: column;
        gap: 4px; /* 横线之间的间距 */
        width: 100%;
        height: 100%;
        justify-content: center;
        align-items: center;
    `;

    // 初始创建几条横线
    for (let i = 0; i < 4; i++) { // 可以根据需要调整横线的数量
        const line = document.createElement('div');
        line.style.cssText = `
            width: 24px;
            height: 2px;
            background-color: #ccc;
            border-radius: 1px;
        `;
        thumbnailContainer.appendChild(line);
    }
    tocContainer.appendChild(thumbnailContainer);


    // 目录列表容器
    const list = document.createElement('ul');
    list.style.cssText = `
        list-style: none;
        padding-left: 0;
        margin: 0;
        display: none; /* 默认隐藏 */
        width: 100%; /* 确保列表在展开时撑满容器 */
    `;
    tocContainer.appendChild(list);
    document.body.appendChild(tocContainer);

    // 鼠标悬停和离开事件
    tocContainer.addEventListener('mouseenter', () => {
        tocContainer.style.width = '320px'; // 展开时的宽度
        tocContainer.style.justifyContent = 'flex-start'; // 列表展开后顶部对齐
        tocContainer.style.alignItems = 'flex-start'; // 列表展开后左侧对齐
        thumbnailContainer.style.display = 'none'; // 隐藏横线缩略图
        list.style.display = 'block'; // 显示目录列表
        tocContainer.style.overflowY = 'auto'; // 允许滚动
        updateTOC(); // 每次展开时更新目录，确保最新
    });

    tocContainer.addEventListener('mouseleave', () => {
        tocContainer.style.width = '40px'; // 收起时的宽度
        tocContainer.style.justifyContent = 'center'; // 收起时横线垂直居中
        tocContainer.style.alignItems = 'center'; // 收起时横线水平居中
        thumbnailContainer.style.display = 'flex'; // 显示横线缩略图
        list.style.display = 'none'; // 隐藏目录列表
        tocContainer.style.overflowY = 'hidden'; // 隐藏滚动条
    });

    function updateTOC() {
        console.log('firstele',document.querySelectorAll(`${messageSelector}`))
        list.textContent = '';
        // 筛选出非空的用户消息，并过滤掉只包含空格、换行或空字符串的元素
        const userMessages = Array.from(document.querySelectorAll(`${messageSelector}`)).filter(msgEl => {
            const contentDiv =  msgEl.querySelector(`${textSelector}`);
            return contentDiv && contentDiv.innerText.trim();
        });
        console.log('hello world3', userMessages)
        let index = 0;

        userMessages.forEach((msgEl) => {
            const contentDiv = msgEl.querySelector(`${textSelector}`);
            if (contentDiv && contentDiv.innerText.trim()) {
                index++;
                const fullText = contentDiv.innerText.trim();
                const shortText = fullText.slice(0, 60).replace(/\n/g, ' ');

                const li = document.createElement('li');
                li.style.cssText = 'margin-bottom: 6px;';

                const anchor = document.createElement('a');
                anchor.textContent = `${index}. ${shortText}${fullText.length > 60 ? '…' : ''}`;
                anchor.title = fullText;
                anchor.href = '#';
                anchor.style.cssText = `
                    display: inline-block;
                    width: 100%;
                    color: #0f79d0;
                    text-decoration: none;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                `;
                anchor.onclick = (e) => {
                    e.preventDefault();
                    msgEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
                };

                li.appendChild(anchor);
                list.appendChild(li);
            }
        });
    }

    // 调整聊天内容区域宽度
    function resizeChat() {
        const chatContainer = document.querySelector('div.relative.flex.h-full.max-w-full.flex-1.flex-col');
        if (chatContainer) {
             chatContainer.style.cssText = `
              max-width: 1200px; /* 调整最大宽度 */
              margin: 0 auto; /* 居中显示 */
              flex: 1; /* 保持 flex 属性 */
             `;
        }
    }

    // 页面加载和URL变化时更新目录
    window.addEventListener('load', () => setTimeout(() => {
        console.log('hello world!!!')
        updateTOC();
        resizeChat();
    }, 500)); // 延迟执行，确保页面元素加载完毕

    let lastUrl = location.href;
    new MutationObserver(() => {
        const currentUrl = location.href;
        if (currentUrl !== lastUrl) {
            lastUrl = currentUrl;
            setTimeout(updateTOC, 1000); // URL变化时延迟更新
        }
    }).observe(document.body, { childList: true, subtree: true });

    // 监听用户消息数量变化，实时更新目录
    const userListContainer = document.querySelector('main');
    let lastUserCount = 0;
    if (userListContainer) {
        new MutationObserver(() => {
            const currentCount = document.querySelectorAll(`${messageSelector}`).length;
            if (currentCount !== lastUserCount) {
                lastUserCount = currentCount;
                setTimeout(updateTOC, 500); // 用户消息数量变化时延迟更新
            }
        }).observe(userListContainer, { childList: true, subtree: true });
    }
})();