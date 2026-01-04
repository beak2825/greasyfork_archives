// ==UserScript==
// @name         北京大学医学部继续教育平台（北大医学堂）——课程自动化脚本 (V5.0 自动刷新-防拦截版)
// @namespace    http://tampermonkey.net/
// @version      5.0
// @description  自动开始|25分钟定时刷新|移除弹窗监测|禁用刷新拦截(beforeunload)，实现真·全自动挂机
// @author       BdyyfxkBjmu
// @match        *://*.webtrn.cn/learnspace/learn/learn/templateeight/*
// @grant        none
// @run-at       document-start
// @license      GPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/542106/%E5%8C%97%E4%BA%AC%E5%A4%A7%E5%AD%A6%E5%8C%BB%E5%AD%A6%E9%83%A8%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E5%B9%B3%E5%8F%B0%EF%BC%88%E5%8C%97%E5%A4%A7%E5%8C%BB%E5%AD%A6%E5%A0%82%EF%BC%89%E2%80%94%E2%80%94%E8%AF%BE%E7%A8%8B%E8%87%AA%E5%8A%A8%E5%8C%96%E8%84%9A%E6%9C%AC%20%28V50%20%E8%87%AA%E5%8A%A8%E5%88%B7%E6%96%B0-%E9%98%B2%E6%8B%A6%E6%88%AA%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/542106/%E5%8C%97%E4%BA%AC%E5%A4%A7%E5%AD%A6%E5%8C%BB%E5%AD%A6%E9%83%A8%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E5%B9%B3%E5%8F%B0%EF%BC%88%E5%8C%97%E5%A4%A7%E5%8C%BB%E5%AD%A6%E5%A0%82%EF%BC%89%E2%80%94%E2%80%94%E8%AF%BE%E7%A8%8B%E8%87%AA%E5%8A%A8%E5%8C%96%E8%84%9A%E6%9C%AC%20%28V50%20%E8%87%AA%E5%8A%A8%E5%88%B7%E6%96%B0-%E9%98%B2%E6%8B%A6%E6%88%AA%E7%89%88%29.meta.js
// ==/UserScript==

'use strict';

// 【V5.0 核心】拦截 beforeunload 事件，防止页面刷新时弹窗确认
// 必须在 @run-at document-start 模式下，在页面自身脚本执行前运行
const originalAddEventListener = window.EventTarget.prototype.addEventListener;
window.EventTarget.prototype.addEventListener = function (type, listener, options) {
    if (type === 'beforeunload') {
        console.log('[脚本拦截] 已成功阻止页面的 "beforeunload" 事件，可无提示刷新。');
        return; // 直接返回，不添加该事件监听器
    }
    originalAddEventListener.call(this, type, listener, options);
};
// 同时覆盖 onbeforeunload 属性，双重保险
Object.defineProperty(window, 'onbeforeunload', {
    value: null,
    writable: true,
});


// 主逻辑需要等待DOM加载完成
window.addEventListener('DOMContentLoaded', () => {

    // 全局配置
    const CONFIG = {
        playbackRate: 2.0,
        volume: 0,
        progressThreshold: 0.98,
        checkInterval: 15000,
        playerInitDelay: 3000,
        resumeDelay: 1500,
        retryTimes: 5,
        speedControlRetry: 8,
        // 页面自动刷新时间（分钟）
        refreshIntervalMinutes: 25
    };

    // 全局状态
    let isScriptRunning = true; // 默认启动

    // 确保SweetAlert2可用
    function ensureSwalLoaded() {
        if (typeof Swal === 'undefined') {
            const swalScript = document.createElement('script');
            swalScript.src = 'https://cdn.bootcdn.net/ajax/libs/sweetalert2/11.16.1/sweetalert2.all.js';
            document.head.appendChild(swalScript);
            return false;
        }
        return true;
    }

    // ==================== 主框架页面逻辑 ====================
    function initMainFrame() {
        console.log("[主框架] 脚本初始化 (V5.0 自动刷新-防拦截版)...");

        // 25分钟后自动刷新页面
        if (CONFIG.refreshIntervalMinutes > 0) {
            const refreshTimeMs = CONFIG.refreshIntervalMinutes * 60 * 1000;
            setTimeout(() => {
                console.log(`[自动刷新] ${CONFIG.refreshIntervalMinutes}分钟已到，正在无提示刷新页面...`);
                window.onbeforeunload = null; // 刷新前再次确保拦截已移除
                location.reload();
            }, refreshTimeMs);
            console.log(`[自动刷新] 页面刷新已设定在 ${CONFIG.refreshIntervalMinutes} 分钟后。`);
        }

        // 创建控制面板
        const ctrlPanel = document.createElement('div');
        ctrlPanel.style.cssText = `
            position: fixed; top: 150px; left: 20px; z-index: 99999;
            display: flex; flex-direction: column; gap: 10px;
        `;

        const statusIndicator = document.createElement('div');
        statusIndicator.textContent = '🔄 自动化运行中...';
        statusIndicator.style.cssText = `
            background-color: #2196F3; color: white; padding: 10px 20px;
            border: none; border-radius: 5px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            font-size: 14px; font-weight: bold; text-align: center;
        `;

        const toggleBtn = document.createElement('button');
        toggleBtn.textContent = '⏸️ 暂停脚本';
        toggleBtn.style.cssText = `
            background-color: #f44336; color: white; padding: 10px 20px;
            border: none; border-radius: 5px; cursor: pointer;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            font-size: 14px; font-weight: bold;
        `;

        ctrlPanel.appendChild(statusIndicator);
        ctrlPanel.appendChild(toggleBtn);
        document.body.appendChild(ctrlPanel);

        toggleBtn.addEventListener('click', function() {
            isScriptRunning = !isScriptRunning;
            if (isScriptRunning) {
                statusIndicator.textContent = '🔄 自动化运行中...';
                toggleBtn.textContent = '⏸️ 暂停脚本';
                toggleBtn.style.backgroundColor = '#f44336';
                if (ensureSwalLoaded()) Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: '自动化学习已恢复！', showConfirmButton: false, timer: 3000 });
            } else {
                statusIndicator.textContent = '⏹️ 脚本已暂停';
                toggleBtn.textContent = '▶️ 恢复运行';
                toggleBtn.style.backgroundColor = '#4CAF50';
                if (ensureSwalLoaded()) Swal.fire({ toast: true, position: 'top-end', icon: 'info', title: '自动化学习已暂停！', showConfirmButton: false, timer: 3000 });
            }
        });

        function autoStartLearning() {
            if (!isScriptRunning) {
                console.log("[自动开始] 脚本已暂停，不执行自动开始。");
                return;
            }
            console.log("[自动开始] 正在启动自动化流程...");
            const courseFrame = document.getElementById('mainContent');
            if (courseFrame?.contentWindow) {
                setTimeout(() => {
                    console.log("[自动开始] 向课程框架发送 'startAutoPlay' 消息");
                    courseFrame.contentWindow.postMessage({action: 'startAutoPlay'}, '*');
                }, 2000);

                if (ensureSwalLoaded()) {
                    Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: '自动化学习已自动启动！', showConfirmButton: false, timer: 3000 });
                }
            } else {
                console.error('[框架错误] 找不到课程内容框架，自动开始失败。');
            }
        }

        // 初始启动
        autoStartLearning();
    }

    // ==================== 课程列表页面逻辑 ====================
    function initCourseListPage() {
        console.log("[课程列表] 初始化自动化监听...");
        localStorage.setItem('videoAutoNext_isEnd', 'false');

        window.addEventListener('message', function(event) {
            if (event.data.action === 'startAutoPlay') {
                playNextUnfinishedVideo();
            }
        });

        setTimeout(() => {
            const currentPlaying = document.querySelector('.s_point.s_point_cur');
            if (!currentPlaying) {
                 console.log("[课程列表] 未发现当前播放项，主动开始寻找下一个视频...");
                 playNextUnfinishedVideo();
            }
        }, 3000);

        function playNextUnfinishedVideo() {
            console.log("[课程切换] 寻找下一个未完成视频...");
            const lessons = document.querySelectorAll('.s_point');
            for (let lesson of lessons) {
                const isCompleted = lesson.getAttribute('completestate') === '1';
                const isVideo = lesson.getAttribute('itemtype') === 'video';
                if (!isCompleted && isVideo) {
                    console.log(`[课程切换] 找到未播放视频: ${lesson.title}`);
                    lesson.click();
                    return;
                }
            }
            console.log("[进度报告] 所有视频任务已完成");
            if (ensureSwalLoaded()) {
                Swal.fire({ title: '课程完成', text: '所有视频任务点已完成！', icon: 'success', confirmButtonText: '好的' });
            }
        }

        setInterval(function() {
            // 通过isScriptRunning变量来决定是否检查，但此变量在iframe中无法直接访问，
            // 所以依赖主框架的逻辑，这里的暂停功能主要体现在不会自动播放下一个。
            if (localStorage.getItem('videoAutoNext_isEnd') === 'true') {
                console.log("[进度监控] 检测到视频完成，准备下一节");
                localStorage.setItem('videoAutoNext_isEnd', 'false');
                setTimeout(playNextUnfinishedVideo, 2000);
            }
        }, 2000);
    }

    // ==================== 视频播放页面逻辑 ====================
    function initVideoPage() {
        console.log("[播放页面] 初始化播放控制器...");

        let currentPlayer = null;
        let retryCount = 0;

        function setSpeedByDOM(speed) {
            let attempts = 0;
            const maxAttempts = CONFIG.speedControlRetry;
            function trySetSpeed() {
                attempts++;
                const speedElements = document.querySelectorAll('.choose-items-cell[name="speed"]');
                if (speedElements.length > 0) {
                    for (let elem of speedElements) {
                        const speedVal = parseFloat(elem.getAttribute('speedval'));
                        if (Math.abs(speedVal - speed) < 0.01) {
                            elem.querySelector('a').click();
                            console.log(`[速度控制] 已通过DOM设置速度: ${speed}x`);
                            return true;
                        }
                    }
                }
                if (attempts < maxAttempts) setTimeout(trySetSpeed, 1000 * attempts);
                else console.warn(`[速度控制] 无法找到速度控制元素，已尝试${maxAttempts}次`);
                return false;
            }
            return trySetSpeed();
        }

        function detectPlayer() {
            if (currentPlayer?.instance?.play) return currentPlayer;
            currentPlayer = null;
            const playerTypes = [
                { name: 'WhatyMediaPlayer', test: () => typeof WhatyMediaPlayer !== 'undefined', instance: () => WhatyMediaPlayer, methods: { play: (p) => p.play || p.start, setRate: (p) => p.setRate || p.setPlaybackRate, mute: (p) => p.mute || p.setMute } },
                { name: 'AliPlayer', test: () => typeof player !== 'undefined', instance: () => player, methods: { play: (p) => p.play || p.start, setRate: (p) => p.setPlaybackRate, mute: (p) => p.setMute || p.setVolume } },
                { name: 'JWPlayer', test: () => typeof jwplayer === 'function', instance: () => jwplayer(), methods: { play: (p) => p.play, setRate: (p) => p.setPlaybackRate, mute: (p) => p.setMute } },
                { name: 'HTML5 Video', test: () => document.querySelector('video') !== null, instance: () => document.querySelector('video'), methods: { play: (p) => () => p.play(), setRate: (p) => (rate) => { p.playbackRate = rate; }, mute: (p) => (mute) => { p.muted = mute; } } }
            ];
            for (const type of playerTypes) {
                try {
                    if (type.test()) {
                        const instance = type.instance();
                        if (instance) {
                            currentPlayer = { type: type.name.toLowerCase(), instance: instance, play: type.methods.play(instance), setRate: type.methods.setRate(instance), mute: type.methods.mute(instance) };
                            console.log(`[播放器检测] 发现并初始化 ${type.name}`);
                            return currentPlayer;
                        }
                    }
                } catch(e) { console.warn(`[播放器检测] ${type.name}检测失败:`, e); }
            }
            return null;
        }

        function configurePlayer() {
            const player = detectPlayer();
            if (!player) {
                if (retryCount < CONFIG.retryTimes) {
                    retryCount++;
                    setTimeout(configurePlayer, 3000);
                }
                return false;
            }
            try {
                if (player.setRate) player.setRate(CONFIG.playbackRate);
                else if (player.instance?.setPlaybackRate) player.instance.setPlaybackRate(CONFIG.playbackRate);
                setSpeedByDOM(CONFIG.playbackRate);

                if (player.mute) player.mute(true);
                else if (player.instance?.setMute) player.instance.setMute(true);
                else if (player.instance?.setVolume) player.instance.setVolume(CONFIG.volume);

                // 找到播放器就尝试播放
                if(player.play) {
                    player.play();
                }

                return true;
            } catch(e) {
                console.error("[播放设置] 配置失败:", e);
                return false;
            }
        }

        function initPlayer() {
            if (!configurePlayer()) return;
            const progressCheck = setInterval(() => {
                try {
                    const current = document.getElementById('screen_player_time_1')?.textContent;
                    const total = document.getElementById('screen_player_time_2')?.textContent;
                    if (current && total) {
                        const currentSec = timeToSeconds(current);
                        const totalSec = timeToSeconds(total);
                        if (currentSec > 0 && totalSec > 0 && (currentSec / totalSec) >= CONFIG.progressThreshold) {
                            console.log("[进度完成] 视频即将结束");
                            localStorage.setItem('videoAutoNext_isEnd', 'true');
                            window.parent.postMessage({action: 'videoEnded'}, '*');
                            clearInterval(progressCheck);
                        }
                    }
                } catch(e) { console.error("[进度监控] 检测异常:", e); }
            }, CONFIG.checkInterval);
        }

        function timeToSeconds(timeStr) {
            if (!timeStr) return 0;
            const parts = timeStr.split(':').map(Number);
            if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
            if (parts.length === 2) return parts[0] * 60 + parts[1];
            return parts[0] || 0;
        }

        setTimeout(initPlayer, CONFIG.playerInitDelay);
    }

    // ==================== 页面路由 ====================
    const path = window.location.pathname;
    console.log(`[路由] 当前路径: ${path}`);
    if (path.includes('/index.action')) {
        initMainFrame();
    } else if (path.includes('/courseware_index.action')) {
        initCourseListPage();
    } else if (path.includes('/content_video.action')) {
        initVideoPage();
    }

});