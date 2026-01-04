// ==UserScript==
// @name                Hide Claude.ai Sidebar
// @name:zh-CN          隐藏Claude.ai侧边栏
// @name:zh-TW          隱藏Claude.ai側邊欄
// @name:ja             Claude.aiサイドバーを非表示
// @namespace           http://tampermonkey.net/
// @version             241117
// @description         Hide the sidebar of Claude.ai and add a home button for better user experience
// @description:zh-CN   隐藏Claude.ai的侧边栏并添加首页按钮以获得更好的使用体验
// @description:zh-TW   隱藏Claude.ai的側邊欄並添加首頁按鈕以獲得更好的使用體驗
// @description:ja      Claude.aiのサイドバーを非表示にし、ホームボタンを追加して使いやすくします
// @author              laocao
// @match               https://claude.ai/*
// @grant               none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/517725/Hide%20Claudeai%20Sidebar.user.js
// @updateURL https://update.greasyfork.org/scripts/517725/Hide%20Claudeai%20Sidebar.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Add styles to hide sidebar and customize home button
    // 添加样式以隐藏侧边栏和自定义首页按钮
    const style = document.createElement('style');
    style.textContent = `
        /* Hide sidebar navigation
           隐藏侧边栏导航 */
        body > div:nth-child(3) > nav {
            display: none !important;
            width: 0 !important;
            opacity: 0 !important;
            pointer-events: none !important;
        }

        /* Make main content area full width
           让主内容区域占据全屏 */
        body > div:nth-child(3) > main {
            margin-left: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
        }

        /* Prevent sidebar-related animations and transitions
           防止侧边栏相关动画和过渡效果 */
        [class*="transition-"],
        [class*="transform-"] {
            transition: none !important;
            transform: none !important;
        }

        /* Home button styles
           首页按钮样式 */
        #homeButton {
            padding: 8px 12px;
            background-color: #2D3748;
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
            display: inline-flex;
            align-items: center;
            gap: 6px;
            transition: background-color 0.2s;
            margin-right: 8px;
            position: relative;
            z-index: 1;
        }

        #homeButton:hover {
            background-color: #4A5568;
        }
    `;
    document.head.appendChild(style);

    // Create home button with SVG icon
    // 创建带SVG图标的首页按钮
    const homeButton = document.createElement('button');
    homeButton.id = 'homeButton';
    homeButton.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256">
            <path d="M218.83,103.77l-80-75.48a1.14,1.14,0,0,1-.11-.11,16,16,0,0,0-21.53,0l-.11.11L37.17,103.77A16,16,0,0,0,32,115.55V208a16,16,0,0,0,16,16H96a16,16,0,0,0,16-16V160h32v48a16,16,0,0,0,16,16h48a16,16,0,0,0,16-16V115.55A16,16,0,0,0,218.83,103.77ZM208,208H160V160a16,16,0,0,0-16-16H112a16,16,0,0,0-16,16v48H48V115.55l.11-.1L128,40l79.9,75.43.11.1Z"/>
        </svg>
        ${
            {
                'zh-CN': '首页',
                'zh-TW': '首頁',
                'ja': 'ホーム'
            }[navigator.language] || 'Home'
        }
    `;
    homeButton.onclick = () => window.location.href = '/';

    // Check and insert button periodically
    // 定期检查并插入按钮
    function insertButton() {
        const targetDiv = document.querySelector('body > div:nth-child(3) > div > div > div:nth-child(1)');
        if (targetDiv && !document.getElementById('homeButton')) {
            targetDiv.insertBefore(homeButton, targetDiv.firstChild);
        }
    }

    // Execute after page load
    // 页面加载完成后执行
    window.addEventListener('load', () => {
        insertButton();
        // Check every 500ms for 10 seconds
        // 每500ms检查一次，持续10秒
        let attempts = 0;
        const interval = setInterval(() => {
            insertButton();
            attempts++;
            if (attempts >= 20) {
                clearInterval(interval);
            }
        }, 500);
    });

    // Try to insert immediately
    // 立即尝试插入一次
    insertButton();
})();