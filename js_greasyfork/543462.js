// ==UserScript==
// @name         YouTube画面开关器
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  为YouTube添加画面开关功能，保护视力时可遮挡视频画面只听音频
// @author       You
// @match        https://www.youtube.com/watch*
// @match        https://youtube.com/watch*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/543462/YouTube%E7%94%BB%E9%9D%A2%E5%BC%80%E5%85%B3%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/543462/YouTube%E7%94%BB%E9%9D%A2%E5%BC%80%E5%85%B3%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let coverDiv = null;
    let toggleButton = null;
    let isCovered = false;

    // 创建遮挡层
    function createCover() {
        coverDiv = document.createElement('div');
        coverDiv.id = 'youtube-video-cover';
        coverDiv.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%);
            display: none;
            z-index: 999;
            border-radius: 12px;
            box-shadow: inset 0 0 50px rgba(0,0,0,0.5);
            backdrop-filter: blur(10px);
        `;

        // 添加遮挡层文字提示
        const coverText = document.createElement('div');
        coverText.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: #ffffff;
            font-size: 24px;
            font-weight: bold;
            text-align: center;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.8);
            user-select: none;
            pointer-events: none;
        `;
        coverText.innerHTML = `
            <div style="margin-bottom: 15px;">🎵</div>
            <div>音频模式</div>
            <div style="font-size: 14px; margin-top: 10px; opacity: 0.8;">视频已隐藏，正在播放音频</div>
        `;

        coverDiv.appendChild(coverText);
        return coverDiv;
    }

    // 创建切换按钮
    function createToggleButton() {
        toggleButton = document.createElement('button');
        toggleButton.id = 'youtube-cover-toggle';
        toggleButton.innerHTML = '👁️';
        toggleButton.title = '切换画面显示/隐藏';
        toggleButton.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            width: 50px;
            height: 50px;
            border: none;
            border-radius: 50%;
            background: linear-gradient(135deg, #ff4444, #cc0000);
            color: white;
            font-size: 20px;
            cursor: pointer;
            z-index: 10000;
            box-shadow: 0 4px 15px rgba(0,0,0,0.3);
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
        `;

        // 按钮悬停效果
        toggleButton.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1)';
            this.style.boxShadow = '0 6px 20px rgba(0,0,0,0.4)';
        });

        toggleButton.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
            this.style.boxShadow = '0 4px 15px rgba(0,0,0,0.3)';
        });

        // 点击事件
        toggleButton.addEventListener('click', toggleCover);

        document.body.appendChild(toggleButton);
        return toggleButton;
    }

    // 切换遮挡状态
    function toggleCover() {
        const videoContainer = getVideoContainer();

        if (!videoContainer) {
            console.log('未找到视频容器');
            return;
        }

        if (!coverDiv) {
            coverDiv = createCover();
            videoContainer.style.position = 'relative';
            videoContainer.appendChild(coverDiv);
        }

        isCovered = !isCovered;

        if (isCovered) {
            coverDiv.style.display = 'block';
            toggleButton.innerHTML = '🙈';
            toggleButton.title = '显示画面';
            toggleButton.style.background = 'linear-gradient(135deg, #44ff44, #00cc00)';
        } else {
            coverDiv.style.display = 'none';
            toggleButton.innerHTML = '👁️';
            toggleButton.title = '隐藏画面';
            toggleButton.style.background = 'linear-gradient(135deg, #ff4444, #cc0000)';
        }
    }

    // 获取视频容器
    function getVideoContainer() {
        // 尝试多种选择器来适配不同的YouTube布局
        const selectors = [
            '#movie_player',
            '.html5-video-player',
            '#player-container',
            '.ytp-player-content',
            '#ytd-player'
        ];

        for (let selector of selectors) {
            const container = document.querySelector(selector);
            if (container) {
                return container;
            }
        }

        return null;
    }

    // 初始化脚本
    function init() {
        // 等待页面加载完成
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
            return;
        }

        // 等待视频容器出现
        const checkContainer = setInterval(() => {
            const videoContainer = getVideoContainer();
            if (videoContainer) {
                clearInterval(checkContainer);

                // 创建按钮
                createToggleButton();

                console.log('YouTube画面开关器已加载');
            }
        }, 1000);

        // 监听页面变化（处理YouTube的SPA导航）
        let currentUrl = location.href;
        new MutationObserver(() => {
            if (location.href !== currentUrl) {
                currentUrl = location.href;

                // 页面变化时重新初始化
                setTimeout(() => {
                    if (coverDiv) {
                        coverDiv.remove();
                        coverDiv = null;
                        isCovered = false;
                    }

                    if (toggleButton) {
                        toggleButton.innerHTML = '👁️';
                        toggleButton.style.background = 'linear-gradient(135deg, #ff4444, #cc0000)';
                    }
                }, 500);
            }
        }).observe(document, {subtree: true, childList: true});
    }

    // 添加键盘快捷键支持
    document.addEventListener('keydown', function(e) {
        // Ctrl+H 切换画面
        if (e.ctrlKey && e.code === 'KeyH') {
            e.preventDefault();
            toggleCover();
        }
    });

    // 启动脚本
    init();

})();
