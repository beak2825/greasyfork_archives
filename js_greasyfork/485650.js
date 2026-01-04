// ==UserScript==
// @name         YouTube Mini Player
// @name:zh-CN   Youtube 小屏播放
// @namespace    http://tampermonkey.net/
// @version      2.4.1
// @license      MIT
// @description  Youtube Mini Player. When you scroll down the mini player will appear.
// @description:zh-CN   Youtube 小屏播放。当你向下滚动时，小屏播放器将会出现。
// @author       https://github.com/AkiyaKiko
// @homepage     https://github.com/AkiyaKiko/YouTubeMiniPlayer
// @match        https://www.youtube.com/*
// @icon         https://www.youtube.com/favicon.ico
// @run-at       document-end
// @grant        GM_addStyle
// @grant        GM_log
// @downloadURL https://update.greasyfork.org/scripts/485650/YouTube%20Mini%20Player.user.js
// @updateURL https://update.greasyfork.org/scripts/485650/YouTube%20Mini%20Player.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_log('🛠️ 脚本 "YouTube Mini Player (No Placeholder)" 开始执行');

    const miniPlayerClass = 'youtube-mini-player-active';
    let playerElement = null;
    let outerContainer = null;
    let innerContainer = null;
    let videoElement = null;
    let ivVideoContent = null;
    let bottomChrome = null;

    let originalOuterContainerStyle = null;
    let originalInnerContainerStyle = null;
    let originalVideoStyle = null;
    let originalIvContentStyle = null;

    let intersectionObserver = null;
    let observer = null;

    let isMiniPlayerActive = false;
    let lastUrl = location.href;
    let initializedUrl = null;

    let isDragging = false;
    let dragOffsetX = 0;
    let dragOffsetY = 0;
    let storedPlayerHeight = 0;

    function isFullscreen() {
        return !!document.fullscreenElement;
    }

    function minimizeOuterContainer() {
        if (!outerContainer || isMiniPlayerActive || isFullscreen()) {
            GM_log('🔽 不满足小窗条件，跳过。');
            return;
        }

        originalOuterContainerStyle = outerContainer.getAttribute('style');
        originalInnerContainerStyle = innerContainer?.getAttribute('style');
        originalVideoStyle = videoElement?.getAttribute('style');
        originalIvContentStyle = ivVideoContent?.getAttribute('style');

        storedPlayerHeight = playerElement.offsetHeight;
        GM_log(`📏 设置 #player 高度: ${storedPlayerHeight}px`);
        playerElement.style.height = `${storedPlayerHeight}px`;

        const floatingWidth = window.innerWidth / 5;
        const aspectRatio = outerContainer.offsetWidth / outerContainer.offsetHeight;
        const floatingHeight = floatingWidth / aspectRatio;
        const rightOffset = window.innerWidth * 0.03;
        const bottomOffset = window.innerHeight * 0.02;

        outerContainer.style.position = 'fixed';
        outerContainer.style.bottom = `${bottomOffset}px`;
        outerContainer.style.right = `${rightOffset}px`;
        outerContainer.style.left = 'auto';
        outerContainer.style.top = 'auto';
        outerContainer.style.width = `${floatingWidth}px`;
        outerContainer.style.height = `${floatingHeight}px`;
        outerContainer.style.zIndex = '3000';
        outerContainer.style.boxShadow = '2px 2px 5px rgba(0, 0, 0, 0.3)';
        outerContainer.style.minWidth = '0px';
        outerContainer.classList.add(miniPlayerClass);
        isMiniPlayerActive = true;

        if (innerContainer) {
            innerContainer.style.width = `${floatingWidth}px`;
            innerContainer.style.height = `${floatingHeight}px`;
            innerContainer.style.paddingTop = '0px';
        }
        if (bottomChrome) bottomChrome.style.display = 'none';
        if (videoElement) {
            videoElement.style.width = `${floatingWidth}px`;
            videoElement.style.height = `${floatingHeight}px`;
        }
        if (ivVideoContent) {
            ivVideoContent.style.width = `${floatingWidth}px`;
            ivVideoContent.style.height = `${floatingHeight}px`;
        }

        enableDragging();
    }

    function restoreOuterContainer() {
        if (!outerContainer || !isMiniPlayerActive || isFullscreen()) {
            GM_log('🔼 不满足恢复条件，跳过。');
            return;
        }

        outerContainer.setAttribute('style', originalOuterContainerStyle || '');
        outerContainer.classList.remove(miniPlayerClass);
        isMiniPlayerActive = false;

        if (playerElement) {
            playerElement.style.height = '';
            GM_log('🔁 恢复 #player 高度样式为空');
        }

        if (innerContainer) innerContainer.removeAttribute('style');
        if (bottomChrome) bottomChrome.style.display = '';
        if (videoElement) videoElement.setAttribute('style', originalVideoStyle || '');
        if (ivVideoContent) ivVideoContent.setAttribute('style', originalIvContentStyle || '');

        disableDragging();
    }

    function enableDragging() {
        if (!outerContainer) return;
        outerContainer.addEventListener('mousedown', onMouseDown);
    }

    function disableDragging() {
        if (!outerContainer) return;
        outerContainer.removeEventListener('mousedown', onMouseDown);
    }

    function onMouseDown(e) {
        if (!isMiniPlayerActive) return;
        isDragging = true;
        dragOffsetX = e.clientX - outerContainer.getBoundingClientRect().left;
        dragOffsetY = e.clientY - outerContainer.getBoundingClientRect().top;
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
        e.preventDefault();
    }

    function onMouseMove(e) {
        if (!isDragging) return;
        outerContainer.style.left = `${e.clientX - dragOffsetX}px`;
        outerContainer.style.top = `${e.clientY - dragOffsetY}px`;
        outerContainer.style.right = 'auto';
        outerContainer.style.bottom = 'auto';
    }

    function onMouseUp() {
        isDragging = false;
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
    }

    function observePlayerVisibility() {
        if (!playerElement) return;
        if (intersectionObserver) intersectionObserver.disconnect();

        intersectionObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                const playerRect = entry.boundingClientRect;
                if (playerRect.bottom < 0) {
                    if (!isFullscreen()) minimizeOuterContainer();
                } else {
                    restoreOuterContainer();
                }
            });
        }, { threshold: 0 });

        intersectionObserver.observe(playerElement);
    }

    function waitForElements() {
        if (!observer) {
            observer = new MutationObserver((mutations, obs) => {
                if (document.getElementById('player') &&
                    document.getElementById('player-container-outer') &&
                    document.getElementById('player-container-inner') &&
                    document.querySelector('video.video-stream.html5-main-video') &&
                    document.getElementById('contents')) {
                    obs.disconnect();
                    observer = null;
                    initialize();
                }
            });
            observer.observe(document.body, { childList: true, subtree: true });
        }
    }

    function handleResize() {
        if (outerContainer && outerContainer.classList.contains(miniPlayerClass)) {
            const floatingWidth = window.innerWidth / 5;
            const aspectRatio = outerContainer.offsetWidth / outerContainer.offsetHeight;
            const floatingHeight = floatingWidth / aspectRatio;
            const rightOffset = window.innerWidth * 0.03;
            const bottomOffset = window.innerHeight * 0.02;

            outerContainer.style.width = `${floatingWidth}px`;
            outerContainer.style.height = `${floatingHeight}px`;
            outerContainer.style.right = `${rightOffset}px`;
            outerContainer.style.bottom = `${bottomOffset}px`;
            outerContainer.style.left = 'auto';
            outerContainer.style.top = 'auto';

            if (innerContainer) {
                innerContainer.style.width = `${floatingWidth}px`;
                innerContainer.style.height = `${floatingHeight}px`;
            }
            if (videoElement) {
                videoElement.style.width = `${floatingWidth}px`;
                videoElement.style.height = `${floatingHeight}px`;
            }
            if (ivVideoContent) {
                ivVideoContent.style.width = `${floatingWidth}px`;
                ivVideoContent.style.height = `${floatingHeight}px`;
            }
        }
    }

    function cleanup() {
        if (intersectionObserver) {
            intersectionObserver.disconnect();
            intersectionObserver = null;
        }
        if (observer) {
            observer.disconnect();
            observer = null;
        }
        restoreOuterContainer();
        window.removeEventListener('resize', handleResize);
        playerElement = null;
        outerContainer = null;
        innerContainer = null;
        videoElement = null;
        ivVideoContent = null;
        bottomChrome = null;
        initializedUrl = null;
        isMiniPlayerActive = false;
        isDragging = false;
        storedPlayerHeight = 0;
    }

    function initialize() {
        playerElement = document.getElementById('player');
        outerContainer = document.getElementById('player-container-outer');
        innerContainer = document.getElementById('player-container-inner');
        videoElement = document.querySelector('video.video-stream.html5-main-video');
        ivVideoContent = document.querySelector('.ytp-iv-video-content');
        bottomChrome = document.querySelector('.ytp-chrome-bottom');

        if (playerElement && outerContainer && innerContainer && videoElement) {
            observePlayerVisibility();
            window.addEventListener('resize', handleResize);
            if (observer) {
                observer.disconnect();
                observer = null;
            }
            isMiniPlayerActive = false;

            const rect = playerElement.getBoundingClientRect();
            if (rect.bottom < 0) minimizeOuterContainer();
            else restoreOuterContainer();

            initializedUrl = location.href;
        } else {
            waitForElements();
        }
    }

    function checkUrlAndInitialize() {
        if (location.pathname.startsWith('/watch')) {
            if (location.href !== initializedUrl) {
                cleanup();
                setTimeout(() => initialize(), 500);
            }
        } else {
            cleanup();
        }
    }

    function startUrlWatcher() {
        setInterval(() => {
            if (location.href !== lastUrl) {
                lastUrl = location.href;
                checkUrlAndInitialize();
            }
        }, 300);
    }

    function start() {
        checkUrlAndInitialize();
        startUrlWatcher();
    }

    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        start();
    } else {
        document.addEventListener('DOMContentLoaded', start);
    }

    GM_addStyle(`
        .${miniPlayerClass} {
            transition: width 0.3s ease, height 0.3s ease, right 0.3s ease, bottom 0.3s ease, top 0.3s ease, left 0.3s ease;
            cursor: move;
        }
    `);
})();