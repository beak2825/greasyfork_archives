// ==UserScript==
// @name         小红书列表新窗口打开
// @namespace    http://www.junxiaopang.com/
// @version      0.2
// @description  在小红书列表的每篇笔记上添加悬浮按钮，点击可新窗口打开
// @author       俊小胖
// @match        https://www.xiaohongshu.com/*
// @grant        GM_addStyle
// @license      GPL
// @downloadURL https://update.greasyfork.org/scripts/541741/%E5%B0%8F%E7%BA%A2%E4%B9%A6%E5%88%97%E8%A1%A8%E6%96%B0%E7%AA%97%E5%8F%A3%E6%89%93%E5%BC%80.user.js
// @updateURL https://update.greasyfork.org/scripts/541741/%E5%B0%8F%E7%BA%A2%E4%B9%A6%E5%88%97%E8%A1%A8%E6%96%B0%E7%AA%97%E5%8F%A3%E6%89%93%E5%BC%80.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 添加自定义样式
    GM_addStyle(`
        .custom-new-window-btn {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: rgba(255, 80, 80, 0.9);
            color: white;
            border: none;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            font-size: 16px;
            cursor: pointer;
            opacity: 0;
            transition: opacity 0.3s;
            z-index: 100;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        }
        .cover-container:hover .custom-new-window-btn {
            opacity: 1;
        }
        .cover-container {
            position: relative;
            display: inline-block;
        }
        .custom-new-window-btn:hover {
            background-color: #ff4d4d;
        }
    `);
    setTimeout(() => {
        document.querySelector('#global > div.main-container > div.side-bar > ul > div.channel-list-content')?.insertAdjacentHTML('beforeend', '<li><div class="link-wrapper"><a href="https://mlink.cc/junxiaopang" target="_blank" rel="noopener" class=""><span class="channel" style="color:#ff2442">红薯搞钱群</span></a></div></li>');
    }, 1000);
    function processItems() {
        const domain = 'https://www.xiaohongshu.com';
        const items = document.querySelectorAll('#exploreFeeds section,#userPostedFeeds > section');

        items.forEach((section, index) => {
            const coverLink = section.querySelector('a.cover.mask.ld');
            if (!coverLink || coverLink.dataset.processed) return;

            // 标记已处理，避免重复处理
            coverLink.dataset.processed = 'true';

            // 获取完整链接
            const href = coverLink.getAttribute('href');
            if (!href) return;
            const fullUrl = domain + href;

            // 创建容器
            const container = document.createElement('div');
            container.className = 'cover-container';

            // 包装原始链接
            coverLink.parentNode.insertBefore(container, coverLink);
            container.appendChild(coverLink);

            // 创建悬浮按钮
            const newWindowBtn = document.createElement('button');
            newWindowBtn.className = 'custom-new-window-btn';
            newWindowBtn.title = '在新窗口打开';
            newWindowBtn.innerHTML = '↗';

            // 添加点击事件
            newWindowBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                window.open(fullUrl, '_blank', 'noopener,noreferrer');
            });

            container.appendChild(newWindowBtn);
        });
    }

    // 初始处理
    processItems();

    // 使用MutationObserver监听动态加载的内容
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.addedNodes.length) {
                processItems();
            }
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // 设置定时器处理可能的延迟加载
    const interval = setInterval(() => {
        processItems();
    }, 2000);

    // 10秒后清除定时器
    setTimeout(() => {
        clearInterval(interval);
    }, 10000);
})();