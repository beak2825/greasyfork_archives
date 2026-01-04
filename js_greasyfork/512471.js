// ==UserScript==
// @name         Bilibili 自动设置播放速度、开启字幕及网页全屏快捷键
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  自动将 B站视频播放速度设置为2.3倍速，开启字幕，并添加网页全屏快捷键（按 'G' 键）
// @author       cx
// @match        *://*.bilibili.com/video/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/512471/Bilibili%20%E8%87%AA%E5%8A%A8%E8%AE%BE%E7%BD%AE%E6%92%AD%E6%94%BE%E9%80%9F%E5%BA%A6%E3%80%81%E5%BC%80%E5%90%AF%E5%AD%97%E5%B9%95%E5%8F%8A%E7%BD%91%E9%A1%B5%E5%85%A8%E5%B1%8F%E5%BF%AB%E6%8D%B7%E9%94%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/512471/Bilibili%20%E8%87%AA%E5%8A%A8%E8%AE%BE%E7%BD%AE%E6%92%AD%E6%94%BE%E9%80%9F%E5%BA%A6%E3%80%81%E5%BC%80%E5%90%AF%E5%AD%97%E5%B9%95%E5%8F%8A%E7%BD%91%E9%A1%B5%E5%85%A8%E5%B1%8F%E5%BF%AB%E6%8D%B7%E9%94%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 目标播放速度
    const TARGET_SPEED = 2.3;

    // 字幕显示模式
    const TARGET_SUBTITLE_MODE = 'showing'; // 'hidden', 'showing', 'disabled'

    // 网页全屏快捷键设置
    const WEB_FULLSCREEN_KEY = 'g'; // 可以更改为你喜欢的键

    // 设置视频播放速度的函数
    function setPlaybackRate(rate) {
        const videos = document.querySelectorAll('video');
        videos.forEach(video => {
            if (video.playbackRate !== rate) {
                video.playbackRate = rate;
                console.log(`设置播放速度为 ${rate}x`);
                showTips(`播放速度: ${rate}x`);
            }
        });
    }

    // 设置字幕显示的函数
    function setSubtitles(mode) {
        const videos = document.querySelectorAll('video');
        videos.forEach(video => {
            const textTracks = video.textTracks;
            if (textTracks) {
                for (let i = 0; i < textTracks.length; i++) {
                    if (textTracks[i].mode !== mode) {
                        textTracks[i].mode = mode;
                        console.log(`设置字幕模式为 ${mode}`);
                        showTips(`字幕: ${mode === 'showing' ? '开启' : '关闭'}`);
                    }
                }
            }
        });
    }

    // 切换网页全屏模式的函数
    function toggleWebFullscreen() {
        // 查找“网页全屏”按钮并点击
        const webFullscreenButton = document.querySelector("div[aria-label='网页全屏']");
        if (webFullscreenButton) {
            webFullscreenButton.click();
            console.log(`切换网页全屏模式`);
            showTips(`已切换网页全屏模式`);
        } else {
            console.error(`未找到“网页全屏”按钮`);
            showTips(`未找到“网页全屏”按钮`);
        }
    }

    // 创建提示框的函数
    function createTipsDiv() {
        let tipsDiv = document.getElementById('custom_tips_div');
        if (!tipsDiv) {
            tipsDiv = document.createElement('div');
            tipsDiv.id = 'custom_tips_div';
            tipsDiv.style.position = 'fixed';
            tipsDiv.style.left = '50%';
            tipsDiv.style.top = '50%';
            tipsDiv.style.transform = 'translate(-50%, -50%)';
            tipsDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
            tipsDiv.style.color = '#fff';
            tipsDiv.style.padding = '10px 20px';
            tipsDiv.style.borderRadius = '10px';
            tipsDiv.style.fontSize = '16px';
            tipsDiv.style.zIndex = '10000';
            tipsDiv.style.display = 'none';
            document.body.appendChild(tipsDiv);
        }
        return tipsDiv;
    }

    // 显示提示信息的函数
    function showTips(message) {
        const tipsDiv = createTipsDiv();
        tipsDiv.textContent = message;
        tipsDiv.style.display = 'block';
        setTimeout(() => {
            tipsDiv.style.display = 'none';
        }, 2000); // 显示2秒
    }

    // 初始设置
    setPlaybackRate(TARGET_SPEED);
    setSubtitles(TARGET_SUBTITLE_MODE);

    // 监听 DOM 变化，以处理动态加载的视频元素
    const observer = new MutationObserver((mutations) => {
        for (let mutation of mutations) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                setPlaybackRate(TARGET_SPEED);
                setSubtitles(TARGET_SUBTITLE_MODE);
            }
        }
    });

    // 配置观察选项
    observer.observe(document.body, { childList: true, subtree: true });

    // 监听页面加载完成后的事件（某些播放器可能在加载后重新渲染视频元素）
    window.addEventListener('load', () => {
        setPlaybackRate(TARGET_SPEED);
        setSubtitles(TARGET_SUBTITLE_MODE);
    });

    // 定期检查播放速度和字幕状态（可选，确保播放速度和字幕保持）
    setInterval(() => {
        setPlaybackRate(TARGET_SPEED);
        setSubtitles(TARGET_SUBTITLE_MODE);
    }, 1000);

    // 添加键盘事件监听器
    window.addEventListener('keydown', (e) => {
        // 检查是否按下指定的快捷键（忽略输入框等可编辑元素中的按键）
        if (e.target.tagName.toLowerCase() !== 'input' && e.target.tagName.toLowerCase() !== 'textarea') {
            if (e.key.toLowerCase() === WEB_FULLSCREEN_KEY) {
                toggleWebFullscreen();
            }
        }
    });

    console.log(`Tampermonkey 脚本已加载。按下 '${WEB_FULLSCREEN_KEY.toUpperCase()}' 键切换网页全屏模式。`);
})();
