// ==UserScript==
// @name         左上显示视频剩余时长及进度条
// @author       He
// @version      1.5
// @description  显示视频剩余时间和内置进度条
// @match        *://*/*
// @exclude      *://*live*/*
// @exclude     *://www.huya.com/*
// @exclude     *://www.douyu.com/*
// @exclude     *://www.yy.com/*
// @namespace https://greasyfork.org/users/808960
// @downloadURL https://update.greasyfork.org/scripts/512751/%E5%B7%A6%E4%B8%8A%E6%98%BE%E7%A4%BA%E8%A7%86%E9%A2%91%E5%89%A9%E4%BD%99%E6%97%B6%E9%95%BF%E5%8F%8A%E8%BF%9B%E5%BA%A6%E6%9D%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/512751/%E5%B7%A6%E4%B8%8A%E6%98%BE%E7%A4%BA%E8%A7%86%E9%A2%91%E5%89%A9%E4%BD%99%E6%97%B6%E9%95%BF%E5%8F%8A%E8%BF%9B%E5%BA%A6%E6%9D%A1.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const containerCache = new WeakMap();

    function setupVideoTimeDisplay(video) {
        if (containerCache.has(video)) return;

        const container = document.createElement('div');
        container.className = 'video-time-display-container';
        container.style.cssText = `
            position: absolute;
            left: 10px;
            top: 10px;
            z-index: 1000;
            display: none; /* 初始隐藏容器 */
        `;

        const timeDisplay = document.createElement('div');
        timeDisplay.className = 'video-time-display';
        timeDisplay.style.cssText = `
            width: 100px;
            color: #C8DCC8;
            background: rgba(0, 0, 0, 0.5);
            padding: 1px 1px 5px 1px;
            font-size: 22px;
            text-align: center;
            border-radius: 5px;
            position: relative;
        `;

        const timeText = document.createElement('div');
        timeText.className = 'video-time-text';
        timeText.style.cssText = `
            line-height: 1.2;
            user-select: none;
        `;

        const progressBar = document.createElement('div');
        progressBar.className = 'video-progress-bar';
        progressBar.style.cssText = `
            width: 95%;
            height: 2px;
            background: rgba(255, 255, 255, 0.3);
            position: absolute;
            bottom: 5px;
            left: 2px;
            overflow: hidden;
        `;

        const bufferedBar = document.createElement('div');
        bufferedBar.className = 'video-buffered-bar';
        bufferedBar.style.cssText = `
            width: 0%;
            height: 100%;
            background: #FF6A00;
            position: absolute;
            left: 0;
            transition: width 0.3s ease;
        `;

        const progressBarInner = document.createElement('div');
        progressBarInner.className = 'video-progress-bar-inner';
        progressBarInner.style.cssText = `
            width: 0%;
            height: 100%;
            background: skyblue;
            position: absolute;
            left: 0;
            transition: width 0.3s ease;
        `;

        progressBar.append(bufferedBar, progressBarInner);
        timeDisplay.append(timeText, progressBar);
        container.append(timeDisplay);

        let parent = video.parentElement;
        while (parent && getComputedStyle(parent).position !== 'relative') {
            parent = parent.parentElement;
        }
        (parent || document.body).append(container);

        containerCache.set(video, container);

        let isUpdating = false;

        const updateDisplay = () => {
            if (isUpdating) return;
            isUpdating = true;

            requestAnimationFrame(() => {
                // 当视频时长无效时隐藏容器
                if (!isFinite(video.duration)) {
                    container.style.display = 'none';
                    isUpdating = false;
                    return;
                }

                // 计算并更新时间显示
                const remaining = video.duration - video.currentTime;
                const mins = String(Math.floor(remaining / 60)).padStart(2, '0');
                const secs = String(Math.floor(remaining % 60)).padStart(2, '0');
                timeText.textContent = `${mins}:${secs}`;

                // 更新进度条
                const progressPercent = (video.currentTime / video.duration) * 100;
                progressBarInner.style.width = `${progressPercent}%`;

                if (video.buffered.length > 0) {
                    const lastBuffer = video.buffered.end(video.buffered.length - 1);
                    const bufferPercent = (lastBuffer / video.duration) * 100;
                    bufferedBar.style.width = `${bufferPercent}%`;
                }

                // 有有效时间时显示容器
                container.style.display = '';
                isUpdating = false;
            });
        };

        const events = ['timeupdate', 'progress', 'loadedmetadata'];
        events.forEach(e => video.addEventListener(e, updateDisplay, { passive: true }));

        updateDisplay();
    }

    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    if (node.tagName === 'VIDEO') {
                        setupVideoTimeDisplay(node);
                    } else {
                        const videos = node.querySelectorAll('video');
                        videos.forEach(video => setupVideoTimeDisplay(video));
                    }
                }
            });
        });
    });

    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    });

    document.querySelectorAll('video').forEach(setupVideoTimeDisplay);
})();