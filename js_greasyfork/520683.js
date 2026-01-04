// ==UserScript==
// @name         YouTube 进度条增强
// @namespace    https://lele1894.tk
// @version      1.0.0
// @description  优化 YouTube 进度条显示效果
// @author       lele1894
// @match        *://*.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/520683/YouTube%20%E8%BF%9B%E5%BA%A6%E6%9D%A1%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/520683/YouTube%20%E8%BF%9B%E5%BA%A6%E6%9D%A1%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置项
    const CONFIG = {
        barHeight: '3px',
        barColor: '#f00',
        bufferColor: 'rgba(255,255,255,.4)',
        backgroundColor: 'rgba(255,255,255,.2)',
        adColor: '#fc0',
        transitionDuration: '0.25s'
    };

    // 核心功能类
    class ProgressBarEnhancer {
        constructor() {
            this.initialized = false;
            this.elements = {};
        }

        init() {
            if (this.initialized) return;

            this.createStyles();
            this.initProgressBar();
            this.bindEvents();

            this.initialized = true;
        }

        createStyles() {
            const style = document.createElement('style');
            style.textContent = `
                .youtube-progress-bar {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    width: 100%;
                    height: ${CONFIG.barHeight};
                    background: ${CONFIG.backgroundColor};
                    z-index: 100;
                    opacity: 0;
                    transition: opacity ${CONFIG.transitionDuration};
                }

                .youtube-progress {
                    width: 100%;
                    height: 100%;
                    background: ${CONFIG.barColor};
                    transform-origin: left;
                    transform: scaleX(0);
                    transition: transform ${CONFIG.transitionDuration} linear;
                }

                .youtube-buffer {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: ${CONFIG.bufferColor};
                    transform-origin: left;
                    transform: scaleX(0);
                }

                .ytp-autohide .youtube-progress-bar {
                    opacity: 1;
                }

                .ad-showing .youtube-progress {
                    background: ${CONFIG.adColor};
                }
            `;
            document.head.appendChild(style);
        }

        initProgressBar() {
            const player = document.querySelector('.html5-video-player');
            if (!player) return;

            const bar = document.createElement('div');
            bar.className = 'youtube-progress-bar';

            const progress = document.createElement('div');
            progress.className = 'youtube-progress';

            const buffer = document.createElement('div');
            buffer.className = 'youtube-buffer';

            bar.appendChild(buffer);
            bar.appendChild(progress);
            player.appendChild(bar);

            this.elements = { bar, progress, buffer };
        }

        bindEvents() {
            const video = document.querySelector('video');
            if (!video) return;

            // 更新播放进度
            video.addEventListener('timeupdate', () => {
                const progress = video.currentTime / video.duration;
                this.elements.progress.style.transform = `scaleX(${progress})`;
            });

            // 更新缓冲进度
            video.addEventListener('progress', () => {
                if (video.buffered.length > 0) {
                    const buffered = video.buffered.end(video.buffered.length - 1) / video.duration;
                    this.elements.buffer.style.transform = `scaleX(${buffered})`;
                }
            });

            // 监听广告状态
            const observer = new MutationObserver(() => {
                const isAdShowing = document.querySelector('.ad-showing');
                this.elements.bar.classList.toggle('ad-showing', isAdShowing);
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        }
    }

    // 等待页面加载完成后初始化
    function waitForYouTube() {
        if (document.querySelector('.html5-video-player')) {
            const enhancer = new ProgressBarEnhancer();
            enhancer.init();
        } else {
            setTimeout(waitForYouTube, 1000);
        }
    }

    waitForYouTube();
})();