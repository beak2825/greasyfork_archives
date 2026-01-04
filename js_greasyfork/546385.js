// ==UserScript==
// @name         Bilibili Playback Speed Controller - v2.7 Collection Aware
// @name:zh-CN   B站倍速快捷键控制 - v2.7 合集感知版
// @namespace    http://tampermonkey.net/
// @version      2.7
// @description  [Collection-Aware] Remembers speed setting ONLY within the same video collection/playlist in the current tab.
// @description:zh-CN  [合集感知版] 仅在当前标签页的同一个视频合集内，自动记忆并应用您的倍速设置。跳转到推荐视频或新页面将恢复默认速度。
// @author       YourName
// @match        *://*.bilibili.com/*
// @match        *://*.bilibili.tv/*
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/546385/Bilibili%20Playback%20Speed%20Controller%20-%20v27%20Collection%20Aware.user.js
// @updateURL https://update.greasyfork.org/scripts/546385/Bilibili%20Playback%20Speed%20Controller%20-%20v27%20Collection%20Aware.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 配置 ---
    const SPEED_STEP = 0.1;
    const MIN_SPEED = 0.1;
    const MAX_SPEED = 3.0;
    const KEY_DECREASE = 'x';
    const KEY_INCREASE = 'c';
    const STORAGE_KEY = 'bilibili_collection_speed_data';

    let speedIndicator = null;
    let indicatorTimeout = null;
    let playerContainer = null;
    let keydownListenerAttached = false;
    let videoEventListenersAttached = false;

    console.log('B站倍速脚本 V2.7 合集感知版 初始化...');

    /**
     * 从当前URL中提取合集ID (BV/av号)
     * @returns {string|null} 合集ID或null
     */
    function getCollectionIdFromUrl() {
        const match = window.location.href.match(/(BV[a-zA-Z0-9]+|av[0-9]+)/);
        return match ? match[0] : null;
    }

    function showSpeedIndicator(text) {
        if (!playerContainer) return;
        if (!speedIndicator) {
            speedIndicator = document.createElement('div');
            Object.assign(speedIndicator.style, {
                position: 'absolute', top: '20px', left: '20px', padding: '8px 15px',
                backgroundColor: 'rgba(0, 0, 0, 0.75)', color: 'white', fontSize: '18px',
                fontWeight: 'bold', borderRadius: '8px', zIndex: '9999999',
                pointerEvents: 'none', transition: 'opacity 0.5s ease-in-out', fontFamily: 'sans-serif'
            });
            playerContainer.appendChild(speedIndicator);
        }
        speedIndicator.textContent = text;
        speedIndicator.style.opacity = '1';
        if (indicatorTimeout) clearTimeout(indicatorTimeout);
        indicatorTimeout = setTimeout(() => {
            if (speedIndicator) speedIndicator.style.opacity = '0';
        }, 2000);
    }

    function applySavedSpeed(video) {
        const savedDataJSON = sessionStorage.getItem(STORAGE_KEY);
        if (!savedDataJSON) return;

        try {
            const savedData = JSON.parse(savedDataJSON);
            const currentCollectionId = getCollectionIdFromUrl();

            // --- 核心判断：当前合集ID是否与保存的ID匹配 ---
            if (currentCollectionId && savedData.collectionId === currentCollectionId) {
                const speedValue = parseFloat(savedData.speed);
                if (!isNaN(speedValue) && video.playbackRate !== speedValue) {
                    video.playbackRate = speedValue;
                    console.log(`合集感知: 匹配成功! 自动应用速度: ${speedValue} (合集ID: ${currentCollectionId})`);
                    showSpeedIndicator(`自动应用倍速: ${speedValue.toFixed(1)}x`);
                }
            } else {
                 console.log(`合集感知: ID不匹配或无效, 不应用速度。(当前: ${currentCollectionId}, 保存的: ${savedData.collectionId})`);
            }
        } catch (e) {
            console.error("解析保存的速度数据时出错:", e);
        }
    }

    function handleKeyDown(event) {
        if (event.target.isContentEditable || ['INPUT', 'TEXTAREA'].includes(event.target.tagName)) return;
        const key = event.key.toLowerCase();
        if (key === KEY_DECREASE || key === KEY_INCREASE) {
            const activeVideo = document.querySelector('video');
            if (!activeVideo) return;

            event.preventDefault();
            event.stopPropagation();

            let currentSpeed = activeVideo.playbackRate;
            let newSpeed = currentSpeed;

            if (key === KEY_DECREASE) {
                newSpeed = Math.max(MIN_SPEED, currentSpeed - SPEED_STEP);
            } else if (key === KEY_INCREASE) {
                newSpeed = Math.min(MAX_SPEED, currentSpeed + SPEED_STEP);
            }

            newSpeed = parseFloat(newSpeed.toFixed(2));
            if (newSpeed !== currentSpeed) {
                activeVideo.playbackRate = newSpeed;

                // --- 核心改动：保存速度和合集ID ---
                const currentCollectionId = getCollectionIdFromUrl();
                if (currentCollectionId) {
                    const dataToSave = {
                        collectionId: currentCollectionId,
                        speed: newSpeed
                    };
                    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
                    console.log(`快捷键: 速度已为当前合集保存:`, dataToSave);
                }
                showSpeedIndicator(`倍速: ${newSpeed.toFixed(1)}x`);
            }
        }
    }

    function setupVideoListeners(video) {
        if (videoEventListenersAttached) return;
        video.addEventListener('loadedmetadata', () => applySavedSpeed(video));
        videoEventListenersAttached = true;
        console.log('合集感知: 已成功为视频元素附加持久监听器。');
        applySavedSpeed(video);
    }

    function initialize() {
        const videoElement = document.querySelector('video');
        playerContainer = document.querySelector('.bpx-player-container') || document.querySelector('#bilibili-player');

        if (videoElement && playerContainer) {
            if (!keydownListenerAttached) {
                window.addEventListener('keydown', handleKeyDown, true);
                keydownListenerAttached = true;
            }
            setupVideoListeners(videoElement);
            return true;
        }
        return false;
    }

    let observer;
    function main() {
        if (initialize()) {
            if (observer) observer.disconnect();
            return;
        }
        observer = new MutationObserver(() => {
            if (initialize()) observer.disconnect();
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', main);
    } else {
        main();
    }
})();