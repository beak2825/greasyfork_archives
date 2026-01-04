// ==UserScript==
// @name         B站网页全屏切换(S键)
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  按 S 键切换 B 站视频网页全屏状态（适配2024新版播放器）
// @author       YourName
// @match        https://www.bilibili.com/video/*
// @icon         https://www.bilibili.com/favicon.ico
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/535878/B%E7%AB%99%E7%BD%91%E9%A1%B5%E5%85%A8%E5%B1%8F%E5%88%87%E6%8D%A2%28S%E9%94%AE%29.user.js
// @updateURL https://update.greasyfork.org/scripts/535878/B%E7%AB%99%E7%BD%91%E9%A1%B5%E5%85%A8%E5%B1%8F%E5%88%87%E6%8D%A2%28S%E9%94%AE%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 优化后的选择器
    const WEB_FULLSCREEN_SELECTOR = '.bpx-player-ctrl-web[aria-label="网页全屏"], .bpx-player-ctrl-web[aria-label="退出网页全屏"]';

    document.addEventListener('keydown', function(e) {
        if (e.key.toLowerCase() === 's') {
            // 排除输入框/文本域操作
            if (/^(INPUT|TEXTAREA)$/i.test(document.activeElement.tagName)) {
                return;
            }

            e.preventDefault();

            // 获取当前全屏状态按钮
            const fullscreenBtn = document.querySelector(WEB_FULLSCREEN_SELECTOR);

            if (fullscreenBtn) {
                // 添加点击反馈动画
                fullscreenBtn.style.transform = 'scale(0.9)';
                setTimeout(() => {
                    fullscreenBtn.style.transform = 'scale(1)';
                }, 100);

                // 执行点击操作
                fullscreenBtn.click();
            }
        }
    });

    // 添加动画关键帧
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; transform: translateX(-50%) translateY(-20px); }
        }
        .bpx-player-ctrl-web {
            transition: transform 0.2s ease;
        }
    `;
    document.head.appendChild(style);
})();