// ==UserScript==
// @name         [Anich动漫]播放增强工具
// @namespace    http://tampermonkey.net/
// @version      0.1.2
// @description  旨在让Anich动画网的播放器变得更人性化,主要添加了: 快捷键控制和允许点击播放器任意空白元素实现暂停/播放
// @author       Aomine
// @match        https://anich.emmmm.eu.org/*
// @icon         https://anich.emmmm.eu.org/favicon.ico
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @license      GPL License
// @downloadURL https://update.greasyfork.org/scripts/532918/%5BAnich%E5%8A%A8%E6%BC%AB%5D%E6%92%AD%E6%94%BE%E5%A2%9E%E5%BC%BA%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/532918/%5BAnich%E5%8A%A8%E6%BC%AB%5D%E6%92%AD%E6%94%BE%E5%A2%9E%E5%BC%BA%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    // 生成唯一状态标识符（基于当前完整路径）
    const getPathKey = () => `refreshed_${location.pathname.replace(/\//g, '_')}`;

    // 判断是否基础路径
    const isBasePath = () => /^\/b\/\d+$/.test(location.pathname);

    // 判断是否子页面路径
    const isSubPath = () => /^\/b\/\d+\/\d+$/.test(location.pathname);

    // 核心刷新逻辑
    const checkRefresh = () => {
        const storageKey = getPathKey();

        // 仅当从基础路径跳转到子路径时触发
        if (isSubPath() && !sessionStorage.getItem(storageKey)) {
            sessionStorage.setItem(storageKey, 'true');
            console.log('检测到子路径切换，触发刷新');
            location.reload();
        }
    };

    // 劫持History API
    const injectHistoryListener = () => {
        const _wr = function(type) {
            const orig = history[type];
            return function() {
                const rv = orig.apply(this, arguments);
                const event = new Event(type.toLowerCase());
                event.arguments = arguments;
                window.dispatchEvent(event);
                return rv;
            };
        };
        history.pushState = _wr('pushState');
        history.replaceState = _wr('replaceState');
    };

    // 初始化
    injectHistoryListener();

    // 监听所有路由变化方式
    window.addEventListener('pushstate', checkRefresh);
    window.addEventListener('replacestate', checkRefresh);
    window.addEventListener('popstate', checkRefresh);

    // 初始检查
    checkRefresh();
})();

(function() {
    'use strict';

    // 添加提示样式
    GM_addStyle(`
.anich-helper-notification {
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(0, 0, 0, 0.85);
    color: white;
    padding: 12px 20px;
    border-radius: 4px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    z-index: 9999;
    max-width: 300px;
    animation: fadeIn 0.3s ease-out;
    font-family: Arial, sans-serif;
    font-size: 14px;
    line-height: 1.5;
    text-align: center;
}
    `);

// 修改通知显示函数
function showNotification(message, duration = 3000) {
    const notification = document.createElement('div');
    notification.className = 'anich-helper-notification';
    notification.innerHTML = message; // 改为innerHTML

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transition = 'opacity 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, duration);
}
    // 初始化设置
    const autoWidescreenKey = 'autoWidescreen';
    const defaultSetting = false;

    // 获取或初始化设置
    let autoWidescreen = GM_getValue(autoWidescreenKey, defaultSetting);

// 修改菜单命令部分
GM_registerMenuCommand(`自动宽屏: ${autoWidescreen ? '开启' : '关闭'}`, function() {
    const newSetting = !autoWidescreen;
    GM_setValue(autoWidescreenKey, newSetting);
    autoWidescreen = newSetting;

    showNotification(
        `自动宽屏模式已${newSetting ? '开启' : '关闭'}<br>` +
        `此设置将在刷新后生效`
    );
});

    // 页面加载时检查是否需要自动开启（仅在刷新后执行）
    if (autoWidescreen) {
        let retryCount = 0;
        const maxRetries = 3;

        function safeEnableWidescreen() {
            try {
                const pagefitButton = document.querySelector('section[item][pagefit]');
                if (pagefitButton) {
                    pagefitButton.click();
                    console.log('已自动开启宽屏模式');
                } else if (retryCount < maxRetries) {
                    retryCount++;
                    setTimeout(safeEnableWidescreen, 1000 * retryCount);
                }
            } catch (error) {
                console.error('自动开启宽屏模式时出错:', error);
                if (retryCount < maxRetries) {
                    retryCount++;
                    setTimeout(safeEnableWidescreen, 1000 * retryCount);
                }
            }
        }

        setTimeout(safeEnableWidescreen, 1500);
    }

    // 1. 空格键控制播放/暂停
    document.addEventListener('keydown', function(e) {
        if (e.code === 'Space') {
            e.preventDefault();
            const playButton = document.querySelector('section[item][play], section[item][pause]');
            if (playButton) playButton.click();
        }
    });

    document.addEventListener('mousedown', function(e) {
        // 确保点击事件发生在播放器区域（例如 'section' 元素），且没有点击播放/暂停按钮
        const player = document.querySelector('section[player]');
        const playButton = document.querySelector('section[item][play], section[item][pause]');

        // 判断点击目标是否在播放器区域
        if (player && playButton && !playButton.contains(e.target) && player.contains(e.target) && e.button === 0) {
            const playButton = document.querySelector('section[item][play], section[item][pause]');
            if (playButton) playButton.click();
        }
    });

    // 2. D键控制弹幕开关 - 匹配开启和关闭两种状态
    document.addEventListener('keydown', function(e) {
        if (e.code === 'KeyD' && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
            e.preventDefault();
            const danmakuButton = document.querySelector('section[player] section[item][danmaku-open], section[player] section[item][danmaku-disabled]');

            if (danmakuButton) {
                danmakuButton.click();

                // 获取当前弹幕的状态
                const isDanmakuOpen = danmakuButton.hasAttribute('danmaku-open');
                const message = isDanmakuOpen ? "弹幕关" : "弹幕开";

                // 显示反馈提示
                showFeedback(message);
            }
        }
    });

    // 3. W键控制网页全屏
    document.addEventListener('keydown', function(e) {
        if (e.code === 'KeyW' && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
            e.preventDefault();
            const pagefitButton = document.querySelector('section[item][pagefit]');
            if (pagefitButton) pagefitButton.click();
        }
    });

    // 4. F键或Enter键控制全屏
    document.addEventListener('keydown', function(e) {
        if ((e.code === 'KeyF' || e.code === 'Enter') && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
            e.preventDefault();
            const fullscreenButton = document.querySelector('section[item][fullsreen], section[item][exit-fullscreen]');
            if (fullscreenButton) fullscreenButton.click();
        }
    });

    // 5. PageDown键控制下一集
    document.addEventListener('keydown', function(e) {
        if (e.code === 'PageDown' && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
            e.preventDefault();
            const nextButton = document.querySelector('section[item][next]');
            if (nextButton) nextButton.click();
        }
    });

    //6. Ctrl+←/Ctrl+→控制快进快退90s:
    document.addEventListener('keydown', function(e) {
        // 只处理方向键左/右
        if (e.code !== 'ArrowLeft' && e.code !== 'ArrowRight') return;

        // 排除输入框的情况
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

        // 获取视频元素
        const video = document.querySelector('video');
        if (!video) {
            console.warn('未找到video元素');
            return;
        }

        // 确定快进量
        let seekAmount;
        let feedbackText = '';

        if (e.ctrlKey) {
            // Ctrl组合键处理90秒
            seekAmount = 90;
        } else {
            // 检查其他修饰键是否按下
            if (e.shiftKey || e.altKey || e.metaKey) return;
            // 普通方向键处理5秒
            seekAmount = 5;
        }

        e.preventDefault(); // 阻止默认行为

        // 计算新时间
        const newTime = e.code === 'ArrowLeft'
        ? Math.max(0, video.currentTime - seekAmount)
        : Math.min(video.duration, video.currentTime + seekAmount);

        video.currentTime = newTime;

        // 生成反馈文字
        const actionType = e.code === 'ArrowLeft' ? '后退' : '快进';
        feedbackText = `${actionType}${seekAmount}秒，当前时间: ${formatTime(newTime)}`;

        // 显示反馈
        showFeedback(feedbackText);
    });

    // 格式化时间的函数
    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs < 10 ? '0' + secs : secs}`;
    }

    // 显示反馈提示的函数
    function showFeedback(text) {
        // 创建反馈提示的 DOM 元素
        const feedback = document.createElement('div');
        feedback.style.position = 'absolute';
        feedback.style.top = '50%';
        feedback.style.left = '50%';
        feedback.style.transform = 'translate(-50%, -50%)';
        feedback.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        feedback.style.color = 'white';
        feedback.style.padding = '10px 20px';
        feedback.style.borderRadius = '5px';
        feedback.style.fontSize = '16px';
        feedback.style.fontWeight = 'bold';
        feedback.style.zIndex = '9999';
        feedback.innerText = text;

        // 获取播放器的父元素
        const playerSection = document.querySelector('section[player]');
        if (playerSection) {
            playerSection.style.position = 'relative'; // 确保播放器容器有相对定位
            playerSection.appendChild(feedback);

            // 2秒后移除反馈提示
            setTimeout(() => {
                feedback.remove();
            }, 2000);
        }
    }
    // 7. 上下方向键控制音量
    document.addEventListener('keydown', function(e) {
        // 只处理方向键上/下
        if (e.code !== 'ArrowUp' && e.code !== 'ArrowDown') return;

        // 排除输入框的情况
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

        // 获取视频元素
        const video = document.querySelector('video');
        if (!video) {
            console.warn('未找到video元素');
            return;
        }

        // 检查其他修饰键是否按下
        if (e.ctrlKey || e.shiftKey || e.altKey || e.metaKey) return;

        e.preventDefault(); // 阻止默认行为

        // 计算新音量（0-1范围）
        const volumeStep = 0.05;
        let newVolume;

        if (e.code === 'ArrowUp') {
            newVolume = Math.min(1, video.volume + volumeStep);
        } else {
            newVolume = Math.max(0, video.volume - volumeStep);
        }

        // 设置新音量
        video.volume = newVolume;

        // 更新音量控制UI
        updateVolumeUI(newVolume);

        // 显示反馈
        const volumePercent = Math.round(newVolume * 100);
        showFeedback(`音量: ${volumePercent}%`);
    });

    // 更新音量控制UI的函数
    function updateVolumeUI(volume) {
        const volumePercent = Math.round(volume * 100);

        // 显示反馈提示的函数
        function showFeedback(text) {
            // 创建反馈提示的 DOM 元素
            const feedback = document.createElement('div');
            feedback.style.position = 'absolute';
            feedback.style.top = '50%';
            feedback.style.left = '50%';
            feedback.style.transform = 'translate(-50%, -50%)';
            feedback.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
            feedback.style.color = 'white';
            feedback.style.padding = '10px 20px';
            feedback.style.borderRadius = '5px';
            feedback.style.fontSize = '16px';
            feedback.style.fontWeight = 'bold';
            feedback.style.zIndex = '9999';
            feedback.innerText = text;

            // 获取播放器的父元素
            const playerSection = document.querySelector('section[player]');
            if (playerSection) {
                playerSection.style.position = 'relative'; // 确保播放器容器有相对定位
                playerSection.appendChild(feedback);

                // 2秒后移除反馈提示
                setTimeout(() => {
                    feedback.remove();
                }, 2000);
            }
        }
    }

    // 添加操作提示
    const style = document.createElement('style');
    style.textContent = `
        .shortcut-hint {
            position: fixed;
            bottom: 50px;
            left: 20px;
            background: rgba(0,0,0,0.7);
            color: white;
            padding: 10px;
            border-radius: 5px;
            font-family: Arial, sans-serif;
            font-size: 14px;
            z-index: 9999;
        }
    `;
    document.head.appendChild(style);

    // 创建快捷键提示元素（初始隐藏）
    const createHintElement = () => {
        const hint = document.createElement('div');
        hint.className = 'shortcut-hint';
        hint.style.display = 'none'; // 初始隐藏
        hint.style.opacity = '0';
        hint.style.transition = 'opacity 0.3s';
        hint.innerHTML = `
            <div>快捷键提示:</div>
            <div>空格: 播放/暂停</div>
            <div>D: 弹幕开关</div>
            <div>W: 网页全屏</div>
            <div>F/Enter: 全屏</div>
            <div>PageDown: 下一集</div>
            <div>Shift+?: 显示/隐藏本提示</div>
        `;
        document.body.appendChild(hint);
        return hint;
    };

    // 显示或隐藏提示（带淡入淡出动画）
    const toggleHint = (hint) => {
        if (hint.style.display === 'none') {
            // 显示提示
            hint.style.display = 'block';
            setTimeout(() => hint.style.opacity = '1', 10); // 小延迟确保过渡生效
        } else {
            // 隐藏提示
            hint.style.opacity = '0';
            setTimeout(() => hint.style.display = 'none', 300); // 等待过渡完成
        }
    };

    // 初始化提示元素
    const hint = createHintElement();

    // 监听 Shift+? 快捷键
    document.addEventListener('keydown', (e) => {
        if (e.shiftKey && e.key === '?') {
            e.preventDefault(); // 防止浏览器默认行为（如Chrome的帮助菜单）
            toggleHint(hint);
        }
    });
})();