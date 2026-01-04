// ==UserScript==
// @name         哔哩哔哩体验优化
// @namespace    http://tampermonkey.net/
// @version      v1
// @description  自动关闭哔哩哔哩视频的自动连播并开启网页全屏
// @author       XMX
// @match        https://www.bilibili.com/video/*
// @icon         https://www.bilibili.com/favicon.ico
// @grant        none
// @run-at       document-end
// @license      GPL License
// @downloadURL https://update.greasyfork.org/scripts/535216/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E4%BD%93%E9%AA%8C%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/535216/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E4%BD%93%E9%AA%8C%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const MAX_ATTEMPTS = 30; // Try for 15 seconds (30 * 500ms)
    let attempts = 0;
    let intervalId = null;

    let autoplayGoalMet = false;
    let webFullscreenGoalMet = false;

    function performActions() {
        attempts++;

        // 1. Disable Autoplay (自动连播)
        if (!autoplayGoalMet) {
            const autoplayButton = document.querySelector('.bpx-player-ctrl-btn.bpx-player-ctrl-autoplay');
            if (autoplayButton) {
                if (autoplayButton.classList.contains('bpx-state-active')) {
                    autoplayButton.click();
                    console.log('Tampermonkey (Bilibili Enhancer): 自动连播已关闭。');
                    autoplayGoalMet = true;
                } else {
                    console.log('Tampermonkey (Bilibili Enhancer): 自动连播已处于关闭状态。');
                    autoplayGoalMet = true; // Already in desired state
                }
            } else if (attempts > 5) { // Only log repeated failures after a few tries
                console.log('Tampermonkey (Bilibili Enhancer): 未找到自动连播按钮。');
            }
        }

        // 2. Enable Web Fullscreen (网页全屏)
        if (!webFullscreenGoalMet) {
            const webFullscreenButton = document.querySelector('.bpx-player-ctrl-btn.bpx-player-ctrl-web');
            if (webFullscreenButton) {
                if (!webFullscreenButton.classList.contains('bpx-state-active')) {
                    webFullscreenButton.click();
                    console.log('Tampermonkey (Bilibili Enhancer): 网页全屏已开启。');
                    webFullscreenGoalMet = true;
                } else {
                    console.log('Tampermonkey (Bilibili Enhancer): 网页全屏已处于开启状态。');
                    webFullscreenGoalMet = true; // Already in desired state
                }
            } else if (attempts > 5) { // Only log repeated failures after a few tries
                console.log('Tampermonkey (Bilibili Enhancer): 未找到网页全屏按钮。');
            }
        }

        // If both goals are met or max attempts reached, stop trying.
        if ((autoplayGoalMet && webFullscreenGoalMet) || attempts >= MAX_ATTEMPTS) {
            clearInterval(intervalId);
            if (attempts >= MAX_ATTEMPTS && !(autoplayGoalMet && webFullscreenGoalMet)) {
                console.log('Tampermonkey (Bilibili Enhancer): 已达到最大尝试次数，部分操作可能未成功执行。');
            } else {
                console.log('Tampermonkey (Bilibili Enhancer): 哔哩哔哩体验优化脚本执行完毕。');
            }
        }
    }

    // Bilibili player loads dynamically. We need to wait for elements.
    // Using setInterval to check periodically.
    // Ensure the interval starts after the document is likely more complete.
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        intervalId = setInterval(performActions, 500);
    } else {
        window.addEventListener('DOMContentLoaded', () => {
            intervalId = setInterval(performActions, 500);
        });
    }
})();