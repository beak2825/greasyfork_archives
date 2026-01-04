// ==UserScript==
// @name   BiliBili自动网页全屏和关灯
// @namespace    http://tampermonkey.net/
// @version      2.7
// @description 在BiliBili视频播放页面上，提供用户选项来自动进入网页全屏和/或关灯模式。
// @author       two cold
// @match        https://www.bilibili.com/video/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/545646/BiliBili%E8%87%AA%E5%8A%A8%E7%BD%91%E9%A1%B5%E5%85%A8%E5%B1%8F%E5%92%8C%E5%85%B3%E7%81%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/545646/BiliBili%E8%87%AA%E5%8A%A8%E7%BD%91%E9%A1%B5%E5%85%A8%E5%B1%8F%E5%92%8C%E5%85%B3%E7%81%AF.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- UI & Notifications ---
    GM_addStyle(`
        .gm-toast-container {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 99999;
            display: flex;
            flex-direction: column;
            align-items: flex-end;
        }
        .gm-toast {
            padding: 10px 20px;
            margin-bottom: 10px;
            background-color: #00a1d6; /* Bilibili blue */
            color: white;
            border-radius: 5px;
            opacity: 0;
            transition: opacity 0.4s ease-in-out, transform 0.4s ease-in-out;
            font-family: sans-serif;
            font-size: 14px;
            transform: translateX(100%);
        }
    `);

    const toastContainer = document.createElement('div');
    toastContainer.className = 'gm-toast-container';
    document.body.appendChild(toastContainer);

    function showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'gm-toast';
        toast.textContent = message;
        toastContainer.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = 1;
            toast.style.transform = 'translateX(0)';
        }, 10);

        // Display for 5 seconds
        setTimeout(() => {
            toast.style.opacity = 0;
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => toast.remove(), 400);
        }, 5000);
    }

    // --- Configuration ---
    const CONFIG_WEBFULLSCREEN_KEY = 'config_auto_web_fullscreen';
    const CONFIG_LIGHTSOFF_KEY = 'config_lights_off';

    let enableAutoWebFullscreen = GM_getValue(CONFIG_WEBFULLSCREEN_KEY, true);
    let enableLightsOff = GM_getValue(CONFIG_LIGHTSOFF_KEY, false);

    GM_registerMenuCommand(`自动网页全屏: ${enableAutoWebFullscreen ? '✅' : '❌'}`, () => {
        enableAutoWebFullscreen = !enableAutoWebFullscreen;
        GM_setValue(CONFIG_WEBFULLSCREEN_KEY, enableAutoWebFullscreen);
        showToast(`自动网页全屏已${enableAutoWebFullscreen ? '开启' : '关闭'}，刷新页面后生效`);
    });

    GM_registerMenuCommand(`自动关灯模式: ${enableLightsOff ? '✅' : '❌'}`, () => {
        enableLightsOff = !enableLightsOff;
        GM_setValue(CONFIG_LIGHTSOFF_KEY, enableLightsOff);
        showToast(`自动关灯模式已${enableLightsOff ? '开启' : '关闭'}，刷新页面后生效`);
    });


    // --- Core Logic ---
    let scriptExecuted = false;
    let lastExecutionTime = 0;
    const MIN_EXECUTION_INTERVAL = 5000;

    function waitForElement(selector, callback, maxAttempts = 50) {
        let attempts = 0;
        const interval = setInterval(() => {
            const element = document.querySelector(selector);
            if (element || attempts >= maxAttempts) {
                clearInterval(interval);
                if (element) {
                    callback(element);
                }
            }
            attempts++;
        }, 200);
    }

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

    function canExecute() {
        const currentTime = Date.now();
        if (scriptExecuted && (currentTime - lastExecutionTime) < MIN_EXECUTION_INTERVAL) {
            console.log('执行间隔太短，跳过执行');
            return false;
        }
        return true;
    }

    function isAlreadyInWebFullscreen() {
        return document.querySelector('.bilibili-player-video-web-fullscreen') || document.querySelector('.bpx-player-state-web-fullscreen');
    }

    function enterWebFullscreen() {
        if (isAlreadyInWebFullscreen()) {
            console.log('已处于网页全屏状态，跳过');
            return;
        }
        const fullscreenBtn = document.querySelector('.bpx-player-ctrl-btn.bpx-player-ctrl-web') || document.querySelector('[aria-label="网页全屏"]');
        if (fullscreenBtn) {
            console.log('找到并点击网页全屏按钮');
            fullscreenBtn.click();
        } else {
            console.log('未找到网页全屏按钮');
        }
    }

    async function enterLightsOffMode() {
        console.log('尝试进入关灯模式...');
        if (document.querySelector('.bpx-player-mode-lightsoff') || document.body.classList.contains('player-mode-blackmask')) {
            console.log('已处于关灯模式，跳过');
            return;
        }

        const settingsBtn = document.querySelector('.bpx-player-ctrl-setting') || document.querySelector('.bilibili-player-video-btn-setting');
        if (!settingsBtn) {
            console.log('未找到设置按钮');
            return;
        }
        settingsBtn.click();
        await new Promise(r => setTimeout(r, 300));

        const lightOffSwitch = document.querySelector('input[aria-label="关灯模式"]');
        if (lightOffSwitch) {
            if (!lightOffSwitch.checked) {
                console.log('找到并点击“关灯模式”开关');
                lightOffSwitch.click();
            }
        }
        settingsBtn.click();
    }

    function main() {
        if (!canExecute()) return;

        console.log('Bilibili 助手脚本启动');
        scriptExecuted = true;
        lastExecutionTime = Date.now();

        waitForElement('.bilibili-player, .bpx-player-container, #bilibiliPlayer', () => {
            console.log('播放器已加载');

            if (enableAutoWebFullscreen) {
                console.log('准备进入网页全屏');
                setTimeout(enterWebFullscreen, 1500);
            }

            if (enableLightsOff) {
                console.log('准备进入关灯模式');
                setTimeout(enterLightsOffMode, 2500);
            }
        });
    }

    const debouncedMain = debounce(main, 3000);

    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        debouncedMain();
    } else {
        document.addEventListener('DOMContentLoaded', debouncedMain);
    }

    let lastUrl = location.href;
    const observer = new MutationObserver(() => {
        if (location.href !== lastUrl) {
            const currentVideoId = location.href.match(/\/video\/(BV\w+)/);
            const lastVideoId = lastUrl.match(/\/video\/(BV\w+)/);

            if (currentVideoId && (!lastVideoId || currentVideoId[1] !== lastVideoId[1])) {
                console.log('检测到新视频，重置状态并执行');
                scriptExecuted = false;
                setTimeout(debouncedMain, 1500);
            }
            lastUrl = location.href;
        }
    });

    observer.observe(document, { subtree: true, childList: true });

})();