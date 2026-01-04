// ==UserScript==
// @name         YouTube Current Time Copier
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Copy current timestamp on click with smooth feedback
// @author       Zane
// @match        https://www.youtube.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/526558/YouTube%20Current%20Time%20Copier.user.js
// @updateURL https://update.greasyfork.org/scripts/526558/YouTube%20Current%20Time%20Copier.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 添加全局样式
    const style = document.createElement('style');
    style.textContent = `
        .timecopier-toast {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(255, 255, 255, 0.9);
            color: #000;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 14px;
            font-family: YouTube Noto, Arial;
            opacity: 0;
            pointer-events: none;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            animation: fadeInOut 1.2s ease-in-out;
            z-index: 3000;
        }

        @keyframes fadeInOut {
            0% { opacity: 0; transform: translate(-50%, -40%); }
            20% { opacity: 1; transform: translate(-50%, -50%); }
            80% { opacity: 1; transform: translate(-50%, -50%); }
            100% { opacity: 0; transform: translate(-50%, -60%); }
        }
    `;
    document.head.appendChild(style);

    function showToast() {
        // 移除已存在的提示
        const existing = document.querySelector('.timecopier-toast');
        if (existing) existing.remove();

        const toast = document.createElement('div');
        toast.className = 'timecopier-toast';
        toast.textContent = '已复制';
        document.body.appendChild(toast);

        // 动画结束后自动移除元素
        toast.addEventListener('animationend', () => toast.remove());
    }

    function init() {
        const timeCurrent = document.querySelector('.ytp-time-current:not([data-timecopier])');
        if (!timeCurrent) return;

        timeCurrent.dataset.timecopier = "true";
        timeCurrent.style.cursor = 'pointer';

        timeCurrent.addEventListener('click', (e) => {
            e.stopPropagation();
            const video = document.querySelector('video');
            if (video) {
                const seconds = Math.floor(video.currentTime);
                const timestamp = `${Math.floor(seconds/60)}:${String(seconds%60).padStart(2,'0')}`;
                navigator.clipboard.writeText(timestamp)
                    .then(showToast)
                    .catch(err => console.error('复制失败:', err));
            }
        });
    }

    new MutationObserver(init).observe(document.body, {
        childList: true,
        subtree: true
    });

    init();
})();
