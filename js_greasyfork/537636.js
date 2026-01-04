// ==UserScript==
// @name          抖音播完自动暂停
// @namespace     http://tampermonkey.net/
// @version       1.1
// @description   在抖音网页版中，当视频剩余 0.2 秒时自动暂停，防止自动跳播下一条视频。同时支持快捷键P控制启用/暂停
// @author        ChatGPT & Gemini
// @icon         data:image/png;base64,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
// @match         https://www.tiktok.com/*
// @match         https://www.douyin.com/*
// @match         https://www.douyin.com/video/*
// @exclude       https://www.tiktok.com/*/live/*
// @exclude       https://www.tiktok.com/live/*
// @exclude       https://live.douyin.com/*
// @grant         GM_setValue
// @grant         GM_getValue
// @grant         GM_notification
// @downloadURL https://update.greasyfork.org/scripts/537636/%E6%8A%96%E9%9F%B3%E6%92%AD%E5%AE%8C%E8%87%AA%E5%8A%A8%E6%9A%82%E5%81%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/537636/%E6%8A%96%E9%9F%B3%E6%92%AD%E5%AE%8C%E8%87%AA%E5%8A%A8%E6%9A%82%E5%81%9C.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 脚本状态管理 ---
    const SCRIPT_ENABLED_KEY = 'douyin_auto_pause_script_enabled';
    const FIRST_RUN_KEY = 'douyin_auto_pause_first_run_v09'; // 更新首次运行标记版本
    let scriptEnabled = GM_getValue(SCRIPT_ENABLED_KEY, true); // 默认启用

    function setScriptEnabled(enabled) {
        scriptEnabled = enabled;
        GM_setValue(SCRIPT_ENABLED_KEY, enabled);
        showNotification(`脚本已${enabled ? '启用' : '禁用'}`, enabled ? 'success' : 'warning');
        if (!enabled) {
            // 脚本禁用时，移除所有视频监听器并停止观察者
            if (currentVideo) {
                currentVideo.removeEventListener('timeupdate', handleVideoTimeUpdate);
                currentVideo.removeEventListener('ended', handleVideoEnded);
                currentVideo = null; // 清理当前视频引用
            }
            if (observer) {
                observer.disconnect(); // 停止观察
            }
            console.log('Tampermonkey: 脚本已禁用，已移除所有监听器和观察者。');
        } else {
            // 脚本启用时，重新初始化观察者和视频监听
            if (observer) {
                observer.observe(document.body, {
                    childList: true,
                    subtree: true,
                    attributes: true,
                    attributeFilter: ['data-e2e-state', 'src']
                });
            }
            setupVideoListener();
            console.log('Tampermonkey: 脚本已启用，重新设置监听器和观察者。');
        }
    }

    // --- 提示框相关变量和函数 ---
    let notificationTimeoutId = null;

    function showNotification(message, type = 'info', duration = 1000) {
        const existingNotification = document.getElementById('douyin-tampermonkey-notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        if (notificationTimeoutId) {
            clearTimeout(notificationTimeoutId);
        }

        const notificationDiv = document.createElement('div');
        notificationDiv.id = 'douyin-tampermonkey-notification';
        notificationDiv.textContent = message;

        Object.assign(notificationDiv.style, {
            position: 'fixed',
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            padding: '10px 20px',
            borderRadius: '8px',
            color: '#fff',
            fontSize: '14px',
            zIndex: '99999',
            opacity: '0',
            transition: 'opacity 0.3s ease-in-out',
            pointerEvents: 'none', // 默认不响应鼠标事件
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
        });

        switch (type) {
            case 'info':
                notificationDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
                break;
            case 'success':
                notificationDiv.style.backgroundColor = 'rgba(76, 175, 80, 0.7)';
                break;
            case 'warning':
                notificationDiv.style.backgroundColor = 'rgba(255, 152, 0, 0.7)';
                break;
            case 'error':
                notificationDiv.style.backgroundColor = 'rgba(244, 67, 54, 0.7)';
                break;
            default:
                notificationDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        }

        document.body.appendChild(notificationDiv);
        notificationDiv.offsetHeight; // 强制 reflow，确保动画生效
        notificationDiv.style.opacity = '1';

        notificationTimeoutId = setTimeout(() => {
            notificationDiv.style.opacity = '0';
            notificationDiv.addEventListener('transitionend', () => {
                notificationDiv.remove();
            }, { once: true });
        }, duration);
    }

    // --- 定制首次启动提示框 ---
    function showCustomFirstRunNotification() {
        const existingNotification = document.getElementById('douyin-tampermonkey-custom-notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        const customNotificationDiv = document.createElement('div');
        customNotificationDiv.id = 'douyin-tampermonkey-custom-notification';
        customNotificationDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: rgba(0, 0, 0, 0.85);
            padding: 25px 35px;
            border-radius: 10px;
            color: #fff;
            font-size: 16px;
            text-align: center;
            z-index: 100000;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
            display: flex;
            flex-direction: column;
            gap: 20px;
            max-width: 80%;
            pointer-events: auto; /* 允许鼠标事件 */
            opacity: 0;
            transition: opacity 0.3s ease-in-out;
        `;

        const messageSpan = document.createElement('span');
        messageSpan.innerHTML = `
            按下键盘上的快捷键 P 来启动或关闭播完暂停功能，<br>
            如果要开启连播功能，请自行关闭播完暂停功能，否则连播功能会失效。
        `;
        messageSpan.style.lineHeight = '1.5';
        messageSpan.style.fontWeight = 'bold';

        const button = document.createElement('button');
        button.textContent = '我知道了';
        button.style.cssText = `
            background-color: #fe2c55; /* 抖音红 */
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
            font-size: 16px;
            transition: background-color 0.2s ease-in-out;
        `;
        button.onmouseover = () => button.style.backgroundColor = '#d02648';
        button.onmouseout = () => button.style.backgroundColor = '#fe2c55';
        button.onclick = () => {
            customNotificationDiv.style.opacity = '0';
            customNotificationDiv.addEventListener('transitionend', () => {
                customNotificationDiv.remove();
            }, { once: true });
        };

        customNotificationDiv.appendChild(messageSpan);
        customNotificationDiv.appendChild(button);
        document.body.appendChild(customNotificationDiv);

        // 强制 reflow，确保动画生效
        customNotificationDiv.offsetHeight;
        customNotificationDiv.style.opacity = '1';
    }


    // --- 辅助函数 ---

    /**
     * 获取当前正在播放的视频元素。
     */
    function getCurrentVideoElement() {
        const videoElements = document.querySelectorAll('video');

        for (const video of videoElements) {
            if (video.offsetWidth > 0 && video.offsetHeight > 0 && video.duration > 0 && !video.paused) {
                // 优先选择抖音主视频播放器容器内的视频
                const parentContainer = video.closest('.web-player-video-container, .xgplayer-container, .player-container');
                if (parentContainer) {
                    return video;
                }
                // 如果没有找到特定的父容器，但它是一个可见且正在播放的视频，也可能就是我们要找的
                return video;
            }
        }
        return null;
    }

    // --- 核心逻辑 ---

    let currentVideo = null;
    const PAUSE_THRESHOLD = 0.2; // 提前暂停的秒数

    // 用于跟踪视频是否已经被处理过，避免重复触发
    let videoProcessedFlag = false;

    /**
     * 处理视频 timeupdate 事件的逻辑。
     */
    function handleVideoTimeUpdate() {
        if (!scriptEnabled) return;

        if (this.duration > 0 && !this.paused && !this.ended && !videoProcessedFlag) {
            const remainingTime = this.duration - this.currentTime;

            if (remainingTime <= PAUSE_THRESHOLD) {
                this.pause();
                console.log(`Tampermonkey: 已在视频结束前 ${PAUSE_THRESHOLD} 秒暂停。`);
                showNotification(`视频已暂停`, 'success');
                videoProcessedFlag = true;
                // 移除监听器，等待下一个视频重新绑定
                if (currentVideo) {
                    currentVideo.removeEventListener('timeupdate', handleVideoTimeUpdate);
                    currentVideo.removeEventListener('ended', handleVideoEnded);
                }
            }
        }
    }

    /**
     * 备用：处理视频播放完全结束的逻辑 (以防 timeupdate 不够精确)
     */
    function handleVideoEnded() {
        if (!scriptEnabled) return;

        console.log('Tampermonkey: 视频播放完全结束（备用触发）。');
        this.pause();
        showNotification('视频已暂停', 'success');
        videoProcessedFlag = true;
        // 移除监听器
        if (currentVideo) {
            currentVideo.removeEventListener('timeupdate', handleVideoTimeUpdate);
            currentVideo.removeEventListener('ended', handleVideoEnded);
        }
    }

    /**
     * 监听视频播放事件，并在视频变化时更新监听器。
     */
    function setupVideoListener() {
        if (!scriptEnabled) return;

        const video = getCurrentVideoElement();

        if (video && (video !== currentVideo || (currentVideo && video.src !== currentVideo.src))) {
            console.log('Tampermonkey: 检测到新视频或视频源改变，正在重新设置监听器。');

            if (currentVideo) {
                currentVideo.removeEventListener('timeupdate', handleVideoTimeUpdate);
                currentVideo.removeEventListener('ended', handleVideoEnded);
                console.log('Tampermonkey: 已移除旧视频监听器。');
            }

            currentVideo = video;
            videoProcessedFlag = false; // 重置处理标记

            currentVideo.addEventListener('timeupdate', handleVideoTimeUpdate);
            currentVideo.addEventListener('ended', handleVideoEnded);
            console.log('Tampermonkey: 已为新视频设置 timeupdate 和 ended 监听器。');
        } else if (!video && currentVideo) {
            currentVideo.removeEventListener('timeupdate', handleVideoTimeUpdate);
            currentVideo.removeEventListener('ended', handleVideoEnded);
            currentVideo = null;
            videoProcessedFlag = false;
            console.log('Tampermonkey: 当前视频元素已消失，已清理监听器。');
        }
    }

    // --- 快捷键监听 ---
    document.addEventListener('keydown', (event) => {
        if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
            return;
        }

        if (event.key === 'P' || event.key === 'p') {
            event.preventDefault();
            setScriptEnabled(!scriptEnabled);
        }
    });

    // --- 页面URL检测 ---
    function checkPageUrlAndDisableScript() {
        if (window.location.href.includes('https://live.douyin.com/')) {
            if (scriptEnabled) {
                setScriptEnabled(false);
                showNotification('检测到直播页面，脚本已自动禁用', 'error', 3000);
            }
        }
    }

    // --- 首次启动判断 ---
    function checkFirstRunAndShowNotification() {
        const isFirstRun = GM_getValue(FIRST_RUN_KEY, true);
        if (isFirstRun) {
            showCustomFirstRunNotification(); // 显示定制的首次启动提示
            GM_setValue(FIRST_RUN_KEY, false); // 标记已运行过
        }
    }

    // --- 启动脚本 ---

    // 使用 MutationObserver 监视 DOM 变化
    const observer = new MutationObserver(mutations => {
        if (!scriptEnabled) return;

        let videoRelatedChange = false;
        for (const mutation of mutations) {
            if (mutation.type === 'childList' || (mutation.type === 'attributes' && mutation.attributeName === 'src')) {
                videoRelatedChange = true;
                break;
            }
        }

        if (videoRelatedChange) {
            setupVideoListener();
        }
    });

    // 只有在脚本启用时才开始观察
    if (scriptEnabled) {
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['data-e2e-state', 'src']
        });
    }

    // 页面加载或从其他页面导航回来时
    window.addEventListener('load', () => {
        checkPageUrlAndDisableScript();
        checkFirstRunAndShowNotification(); // 检查并显示首次启动提示
        if (scriptEnabled) {
            setupVideoListener();
            showNotification(`脚本已${scriptEnabled ? '启用' : '禁用'} (按 'P' 切换)`, scriptEnabled ? 'info' : 'warning');
        } else {
            showNotification('脚本已禁用 (按 \'P\' 启用)', 'warning');
        }
    });

    // 监听URL变化（适用于单页应用，如抖音）
    let lastUrl = location.href;
    new MutationObserver(() => {
        if (location.href !== lastUrl) {
            lastUrl = location.href;
            checkPageUrlAndDisableScript();
            if (scriptEnabled) {
                setupVideoListener();
            }
        }
    }).observe(document, { subtree: true, childList: true });

    // 初始检查URL和显示脚本状态
    checkPageUrlAndDisableScript();
    checkFirstRunAndShowNotification(); // 初始加载时也检查一次
    showNotification(`脚本已${scriptEnabled ? '启用' : '禁用'} (按 'P' 切换)`, scriptEnabled ? 'info' : 'warning');

})();