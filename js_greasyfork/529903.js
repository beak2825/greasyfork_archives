// ==UserScript==
// @name         添加 YouTube Pot Player Watch 按鈕
// @namespace    添加 YouTube Pot Player Watch 按鈕
// @version       0.7
// @description  添加一個按鈕以使用底池播放器打開YouTube影片。現有視頻將暫停。
// @match         *://*.youtube.com/*=*
// @icon          https://www.google.com/s2/favicons?sz=64&domain=YouTube.com
// @author        AA

// @downloadURL https://update.greasyfork.org/scripts/529903/%E6%B7%BB%E5%8A%A0%20YouTube%20Pot%20Player%20Watch%20%E6%8C%89%E9%88%95.user.js
// @updateURL https://update.greasyfork.org/scripts/529903/%E6%B7%BB%E5%8A%A0%20YouTube%20Pot%20Player%20Watch%20%E6%8C%89%E9%88%95.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let videoID = '';

    // 获取视频ID
    function getVideoID() {
        return new URLSearchParams(window.location.search).get('v');
    }

    // 创建PotPlayer链接
    function createPotPlayerURL(videoID, startTime) {
        return `potplayer:https://www.youtube.com/watch?v=${videoID}?t=${startTime}`;
    }

    // 在PotPlayer中打开
    function openInPotPlayer() {
        const player = document.querySelector('video');
        if (player) {
            player.pause();
            const currentTime = Math.floor(player.currentTime);
            window.location.href = createPotPlayerURL(videoID, currentTime);
        }
    }

    // 创建浮动按钮
    function createFloatingButton() {
        if (document.getElementById('potplayer-floating-btn')) return;

        const btn = document.createElement('button');
        btn.id = 'potplayer-floating-btn';
        btn.textContent = '🎮 PotPlayer';
        btn.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 9999;
            padding: 12px 16px;
            background: #ff4444;
            color: white;
            border: none;
            border-radius: 25px;
            font-size: 14px;
            font-weight: bold;
            cursor: pointer;
            box-shadow: 0 4px 8px rgba(0,0,0,0.2);
            transition: transform 0.2s;
        `;

        btn.addEventListener('click', openInPotPlayer);
        document.body.appendChild(btn);

        // 手机版触摸优化
        btn.addEventListener('touchstart', () => {
            btn.style.transform = 'scale(0.95)';
        });
        btn.addEventListener('touchend', () => {
            btn.style.transform = 'scale(1)';
        });
    }

    // 主要检测逻辑
    function checkAndInject() {
        const newVideoID = getVideoID();
        if (!newVideoID) return;

        if (newVideoID !== videoID) {
            videoID = newVideoID;
            const existingBtn = document.getElementById('potplayer-floating-btn');
            if (existingBtn) existingBtn.remove();
            createFloatingButton();
        }
    }

    // 使用MutationObserver检测页面变化
    const observer = new MutationObserver(() => {
        checkAndInject();
    });

    observer.observe(document, {
        childList: true,
        subtree: true,
        attributes: false
    });

    // 初始检测
    checkAndInject();
})();