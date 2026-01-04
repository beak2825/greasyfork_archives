// ==UserScript==
// @name         亿云校回放网页全屏
// @namespace    https://github.com/laiyoi/GM_scripts
// @license      MIT
// @version      1.1.1
// @author       laiyoi
// @description  类似 Bilibili 的网页全屏，视频垂直高度居中显示，自动裁剪左右宽度。完美兼容云校2x1920x1080的屏幕
// @match        https://apppc.eyxedu.com/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/541643/%E4%BA%BF%E4%BA%91%E6%A0%A1%E5%9B%9E%E6%94%BE%E7%BD%91%E9%A1%B5%E5%85%A8%E5%B1%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/541643/%E4%BA%BF%E4%BA%91%E6%A0%A1%E5%9B%9E%E6%94%BE%E7%BD%91%E9%A1%B5%E5%85%A8%E5%B1%8F.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 注入样式（只需一次）
    GM_addStyle(`
        .webpage-fullscreen {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            width: 100vw !important;
            height: 100vh !important;
            z-index: 9999 !important;
            background-color: black !important;
            display: flex !important;
            justify-content: center !important;
            align-items: center !important;
        }
        .webpage-fullscreen video {
            width: 100% !important;
            height: 100% !important;
            object-fit: cover !important;
            object-position: center center !important;
        }
    `);

    function tryInject(container) {
        if (!container || container.dataset.gmWebFullscreenInjected) return;

        const controlBar = container.querySelector('.vjs-control-bar');
        const video = container.querySelector('video');

        if (!controlBar || !video) return;

        // 标记为已注入
        container.dataset.gmWebFullscreenInjected = 'true';

        const btn = document.createElement('button');
        btn.className = 'vjs-control vjs-button vjs-webpage-fullscreen-button';
        btn.title = '网页全屏';
        btn.style.order = 999;

        btn.innerHTML = `
            <svg aria-hidden="true" height="16" width="16" viewBox="0 0 24 24" fill="white" stroke="black" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle;">
                <rect x="2" y="2" width="20" height="20" fill="white" stroke="black" stroke-width="2"/>
                <path d="M3 7V3h4" />
                <path d="M17 3h4v4" />
                <path d="M21 17v4h-4" />
                <path d="M7 21H3v-4" />
            </svg>
            <span class="vjs-control-text" aria-live="polite">网页全屏</span>
        `;

        let isFull = false;
        btn.onclick = () => {
            container.classList.toggle('webpage-fullscreen');
            isFull = !isFull;
        };

        controlBar.appendChild(btn);
    }

    function scanAndInject() {
        document.querySelectorAll('.video-js').forEach(tryInject);
    }

    // 初始扫描一次（适用于刷新）
    scanAndInject();

    // 使用 MutationObserver 自动适配异步加载和页面切换
    const observer = new MutationObserver(() => {
        scanAndInject();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

})();
