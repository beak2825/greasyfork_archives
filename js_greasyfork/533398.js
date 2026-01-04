// ==UserScript==
// @name         Auto Fullscreen on Play (Enhanced)
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  在 Bilibili 和 YouTube 播放時自動全螢幕，暫停或結束時退出全螢幕（穩定版）
// @author       YourName
// @match        *://www.bilibili.com/*
// @match        *://www.youtube.com/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/533398/Auto%20Fullscreen%20on%20Play%20%28Enhanced%29.user.js
// @updateURL https://update.greasyfork.org/scripts/533398/Auto%20Fullscreen%20on%20Play%20%28Enhanced%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let userInteracted = false;
    let isManualExit = false; // 新增手動退出標記

    // 強化用戶互動檢測
    const initUserInteraction = () => {
        const events = ['click', 'keydown', 'mousemove', 'touchstart'];
        const handler = () => {
            userInteracted = true;
            events.forEach(e => document.removeEventListener(e, handler));
        };
        events.forEach(e => document.addEventListener(e, handler, { once: true }));
    };
    initUserInteraction();

    // 全屏控制函數
    const enterFullscreen = (el) => {
        if (!userInteracted || document.fullscreenElement || isManualExit) return;
        const req = el.requestFullscreen || el.webkitRequestFullscreen || el.mozRequestFullScreen || el.msRequestFullscreen;
        req?.call(el).catch(err => console.warn('全螢幕請求失敗:', err));
    };

    const exitFullscreen = () => {
        if (!document.fullscreenElement) return;
        const exitFn = document.exitFullscreen || document.webkitExitFullscreen || document.mozCancelFullScreen || document.msExitFullscreen;
        exitFn?.call(document);
    };

    // 容器選擇邏輯強化
    const getContainer = (video) => {
        const host = location.hostname;
        try {
            if (host.includes('youtube.com')) {
                return video.closest('.html5-video-player:not(.ytp-miniplayer)') || video;
            } else if (host.includes('bilibili.com')) {
                const container = video.closest('.bpx-player-container:not(.mini-panel)');
                return container && !container.querySelector('.live-section') ? container : null;
            }
        } catch (e) {
            return video;
        }
    };

    // 事件監聽邏輯優化
    const handlePlay = (e) => {
        const video = e.target;
        if (!(video instanceof HTMLVideoElement)) return;

        const container = getContainer(video);
        if (!container) return;

        // 重置手動退出標記
        if (document.fullscreenElement) isManualExit = false;

        // 立即嘗試全屏，若失敗則等待互動
        const attemptFullscreen = () => {
            if (userInteracted) {
                enterFullscreen(container);
            } else {
                const onInteract = () => {
                    userInteracted = true;
                    enterFullscreen(container);
                    document.removeEventListener('click', onInteract);
                };
                document.addEventListener('click', onInteract, { once: true });
            }
        };

        // YouTube 特殊處理
        if (location.host.includes('youtube.com') && video.readyState < 3) {
            video.addEventListener('loadeddata', attemptFullscreen, { once: true });
        } else {
            attemptFullscreen();
        }
    };

    document.addEventListener('play', handlePlay, true);

    // 退出邏輯強化
    document.addEventListener('pause', (e) => {
        if (e.target instanceof HTMLVideoElement && document.fullscreenElement) {
            exitFullscreen();
        }
    }, true);

    document.addEventListener('ended', (e) => {
        if (e.target instanceof HTMLVideoElement && document.fullscreenElement) {
            exitFullscreen();
        }
    }, true);

    // 監聽手動退出行為
    document.addEventListener('fullscreenchange', () => {
        if (!document.fullscreenElement) {
            isManualExit = true; // 標記為手動退出
            setTimeout(() => isManualExit = false, 3000); // 3秒後重置
        }
    });
})();