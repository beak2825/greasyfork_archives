// ==UserScript==
// @name         Bilibili自动宽屏脚本
// @namespace    bilibili-auto-fullscreen-script
// @version      1.3.9
// @icon         https://www.bilibili.com/favicon.ico
// @description  在Bilibili网站自动宽屏播放视频，按T键切换全屏,包括直播间。修复了在输入框中按T键会触发切换的问题。
// @author       BlingCc
// @match        https://www.bilibili.com/*
// @match        https://live.bilibili.com/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/469085/Bilibili%E8%87%AA%E5%8A%A8%E5%AE%BD%E5%B1%8F%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/469085/Bilibili%E8%87%AA%E5%8A%A8%E5%AE%BD%E5%B1%8F%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Utility function to wait for elements
    function waitForElement(selector, callback, maxTries = 10, interval = 1000) {
        let tries = 0;

        function check() {
            const element = document.querySelector(selector);
            if (element) {
                callback(element);
                return;
            }

            tries++;
            if (tries < maxTries) {
                setTimeout(check, interval);
            }
        }

        check();
    }

    // Mouse event simulation
    function simulateMouseEvent(element, eventType, x, y) {
        const event = new MouseEvent(eventType, {
            view: window,
            bubbles: true,
            cancelable: true,
            clientX: x,
            clientY: y
        });
        element.dispatchEvent(event);
    }

    // Double click simulation
    function triggerDoubleClick(element) {
        const event = new MouseEvent('dblclick', {
            bubbles: true,
            cancelable: true,
            view: window
        });
        element.dispatchEvent(event);
    }

    // Video page fullscreen handler
    function triggerVideoFullscreen() {
        const fullscreenButton = document.querySelector('[aria-label="网页全屏"]');
        if (!fullscreenButton) return;

        try {
            fullscreenButton.click();
        } catch (e) {
            const rect = fullscreenButton.getBoundingClientRect();
            const x = rect.left + rect.width / 2;
            const y = rect.top + rect.height / 2;

            simulateMouseEvent(fullscreenButton, 'mouseenter', x, y);
            simulateMouseEvent(fullscreenButton, 'click', x, y);
            simulateMouseEvent(fullscreenButton, 'mouseleave', x, y);
        }
    }

    // Live stream fullscreen handler
    function toggleLiveFullscreen() {
        const player = document.getElementById('live-player');
        if (player) {
            triggerDoubleClick(player);
        }
        const element = document.getElementById("web-player__bottom-bar__container");
        if (element) {
            element.remove();
        }
    }

    // Initialize video page
    function initializeVideo() {
        waitForElement('.bpx-player-video-area', () => {
            waitForElement('[aria-label="网页全屏"]', () => {
                triggerVideoFullscreen();
            });
        });
    }

    // Initialize live stream page
    async function initializeLive() {
        // Wait for player script
        await new Promise((resolve) => {
            const observer = new MutationObserver((mutations, obs) => {
                const scripts = document.getElementsByTagName('script');
                for (let script of scripts) {
                    if (script.src.includes('room-player.prod.min.js')) {
                        setTimeout(() => {
                            obs.disconnect();
                            resolve();
                        }, 1000);
                        return;
                    }
                }
            });

            observer.observe(document, {
                childList: true,
                subtree: true
            });
        });

        // Wait for player element
        const player = await new Promise((resolve) => {
            const checkElement = () => {
                const player = document.getElementById('live-player');
                if (player) {
                    resolve(player);
                } else {
                    requestAnimationFrame(checkElement);
                }
            };
            checkElement();
        });

        // Initial fullscreen
        triggerDoubleClick(player);
        document.body.classList.add('hide-aside-area');
        const element = document.getElementById("web-player__bottom-bar__container");
        if (element) {
            element.remove();
        }

    }

    // Main initialization
    function initialize() {
        const isLivePage = window.location.hostname === 'live.bilibili.com';

        if (isLivePage) {
            initializeLive();
        } else {
            initializeVideo();
        }

        // Global T key handler
        document.addEventListener('keydown', (e) => {
            // --- BUG修复逻辑 ---
            // 检查当前活动的元素是否为输入框、文本区域或可编辑元素
            // 如果是，则不触发快捷键，直接返回
            const activeEl = document.activeElement;
            const isTyping = activeEl && (
                activeEl.tagName.toLowerCase() === 'input' ||
                activeEl.tagName.toLowerCase() === 'textarea' ||
                activeEl.isContentEditable
            );

            if (isTyping) {
                return;
            }
            // --- BUG修复结束 ---

            if (e.key.toLowerCase() === 't') {
                if (isLivePage) {
                    toggleLiveFullscreen();
                } else {
                    triggerVideoFullscreen();
                }
            }
            if (e.key === 'Escape') {
                if (isLivePage) {
                    toggleLiveFullscreen();
                }
            }
        });
    }

    // Start script
    if (document.readyState === 'complete') {
        initialize();
    } else {
        window.addEventListener('load', initialize);
    }
})();