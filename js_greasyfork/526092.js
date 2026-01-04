// ==UserScript==
// @name         视频5minutes回顾提醒（跨平台版Bilibili➕Youtube）
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  每5分钟暂停视频并提醒回顾内容（支持B站和YouTube）
// @author       Zane
// @match        https://www.bilibili.com/video/*
// @match        https://www.youtube.com/watch*
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/526092/%E8%A7%86%E9%A2%915minutes%E5%9B%9E%E9%A1%BE%E6%8F%90%E9%86%92%EF%BC%88%E8%B7%A8%E5%B9%B3%E5%8F%B0%E7%89%88Bilibili%E2%9E%95Youtube%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/526092/%E8%A7%86%E9%A2%915minutes%E5%9B%9E%E9%A1%BE%E6%8F%90%E9%86%92%EF%BC%88%E8%B7%A8%E5%B9%B3%E5%8F%B0%E7%89%88Bilibili%E2%9E%95Youtube%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 样式定义（合并保留公共样式）
    GM_addStyle(`
        .review-reminder {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 20px;
            border-radius: 8px;
            z-index: 9999;
            text-align: center;
            display: none;
            opacity: 1;
            transition: opacity 0.5s ease-out;
        }
        .review-reminder.fade-out {
            opacity: 0;
        }
        .review-reminder h3 {
            color: white;
            margin-bottom: 10px;
        }
        .reminder-toggle {
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 9999;
            padding: 10px;
            background: rgba(0, 0, 0, 0.7);
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        }
    `);

    // 创建提醒UI（安全方式）
    const reminderDiv = document.createElement('div');
    reminderDiv.className = 'review-reminder';
    const h3 = document.createElement('h3');
    h3.textContent = '已观看5分钟';
    const p1 = document.createElement('p');
    p1.textContent = '请回顾一下刚才学习的内容';
    const p2 = document.createElement('p');
    p2.className = 'hint';
    p2.textContent = '(按空格继续播放)';
    reminderDiv.appendChild(h3);
    reminderDiv.appendChild(p1);
    reminderDiv.appendChild(p2);

    // 创建开关按钮
    const toggleButton = document.createElement('button');
    toggleButton.className = 'reminder-toggle';
    toggleButton.textContent = '提醒: 开启';
    toggleButton.onclick = toggleReminder;

    let isReminderEnabled = true;
    let timer = null;
    let videoElement = null;

    // 平台配置
    const platformConfig = {
        'bilibili': {
            playerContainerSelector: '.bpx-player-video-perch',
            videoSelector: '.bpx-player-video-wrap video'
        },
        'youtube': {
            playerContainerSelector: '#movie_player',
            videoSelector: '#movie_player video'
        }
    };

    // 初始化函数（整合两个版本）
    function init() {
        const currentPlatform = window.location.hostname.includes('bilibili') ? 'bilibili' : 'youtube';
        const config = platformConfig[currentPlatform];

        // 查找元素
        const playerContainer = document.querySelector(config.playerContainerSelector);
        videoElement = document.querySelector(config.videoSelector);

        if (playerContainer && videoElement) {
            // 注入元素
            playerContainer.appendChild(reminderDiv);
            document.body.appendChild(toggleButton);

            // 启动功能
            startTimer();
            setupVideoListeners();

            // YouTube需要监听URL变化
            if (currentPlatform === 'youtube') {
                watchPageChanges();
            }
        } else {
            setTimeout(init, 1000);
        }
    }

    // 视频事件监听（公共逻辑）
    function setupVideoListeners() {
        videoElement.addEventListener('play', () => {
            if (!timer) startTimer();
        });
        videoElement.addEventListener('pause', stopTimer);
    }

    // 计时器逻辑（公共）
    function startTimer() {
        if (!isReminderEnabled || timer) return;
        timer = setTimeout(showReminder, 5 * 60 * 1000); // 改为5分钟
        // timer = setTimeout(showReminder, 5 * 1000); // 测试
    }

    function stopTimer() {
        if (timer) {
            clearTimeout(timer);
            timer = null;
        }
    }

    // 显示提醒（公共）
    function showReminder() {
        if (!isReminderEnabled) return;
        videoElement.pause();
        reminderDiv.style.display = 'block';
        reminderDiv.classList.remove('fade-out');
    }

    // 键盘事件（公共）
    document.addEventListener('keydown', function(event) {
        if (event.code === 'Space' && reminderDiv.style.display === 'block') {
            event.preventDefault();
            reminderDiv.classList.add('fade-out');
            setTimeout(() => {
                reminderDiv.style.display = 'none';
                reminderDiv.classList.remove('fade-out');
                videoElement.play();
                startTimer();
            }, 500);
        }
    });

    // 开关功能（公共）
    function toggleReminder() {
        isReminderEnabled = !isReminderEnabled;
        toggleButton.textContent = `提醒: ${isReminderEnabled ? '开启' : '关闭'}`;
        isReminderEnabled ? (videoElement.paused || startTimer()) : stopTimer();
    }

    // YouTube URL变化监听（仅YouTube需要）
    function watchPageChanges() {
        let lastUrl = location.href;
        new MutationObserver(() => {
            if (location.href !== lastUrl) {
                lastUrl = location.href;
                init();
            }
        }).observe(document, {subtree: true, childList: true});
    }

    // 启动脚本
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        setTimeout(init, 1000);
    }
})();