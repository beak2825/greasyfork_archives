// ==UserScript==
// @name         Bilibili自动宽屏脚本
// @namespace    bilibili-auto-fullscreen-script
// @version      1.4.2
// @icon         https://www.bilibili.com/favicon.ico
// @description  在Bilibili网站自动宽屏播放视频，按T键切换全屏,包括直播间。
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

    // 全局变量，记录直播间是否处于自定义全屏状态
    let isLiveMaximized = false;

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

    // Video page fullscreen handler (Normal Videos)
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

    // --- 核心逻辑：切换直播间全屏状态 (支持还原) ---
    function toggleLiveState(forceState = null) {
        // 如果传入了 forceState，则强制设置状态；否则取反当前状态
        const targetState = forceState !== null ? forceState : !isLiveMaximized;

        const player = document.getElementById('live-player');
        const bottomBar = document.getElementById("web-player__bottom-bar__container"); // 底部礼物栏
        const asideArea = document.getElementById("aside-area-vm"); // 侧边栏

        if (targetState) {
            // >>> 进入增强全屏模式 <<<

            // 1. 触发 Bilibili 原生双击 (切换为网页全屏模式)
            if (player) triggerDoubleClick(player);

            // 2. 隐藏干扰元素 (使用 display: none 而不是 remove，以便恢复)
            if (bottomBar) bottomBar.style.display = 'none';
            if (asideArea) asideArea.style.display = 'none';

            // 3. 强制播放器 CSS 占满屏幕
            if (player) {
                player.style.position = 'fixed';
                player.style.top = '0';
                player.style.left = '0';
                player.style.width = '100vw';
                player.style.height = '100vh';
                player.style.zIndex = '10000';
            }

            // 4. 隐藏页面滚动条
            document.body.style.overflow = 'hidden';

        } else {
            // >>> 还原普通模式 <<<

            // 1. 再次双击退出 Bilibili 原生网页全屏
            if (player) triggerDoubleClick(player);

            // 2. 恢复元素显示
            if (bottomBar) bottomBar.style.display = '';
            if (asideArea) asideArea.style.display = '';

            // 3. 清除强制的 CSS 样式 (恢复默认布局)
            if (player) {
                player.style.position = '';
                player.style.top = '';
                player.style.left = '';
                player.style.width = '';
                player.style.height = '';
                player.style.zIndex = '';
            }

            // 4. 恢复页面滚动条
            document.body.style.overflow = '';
        }

        // 更新状态记录
        isLiveMaximized = targetState;
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

        // Initial fullscreen -> Force Enter
        document.body.classList.add('hide-aside-area');
        toggleLiveState(true);
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
                    // 切换状态 (开 <-> 关)
                    toggleLiveState();
                } else {
                    triggerVideoFullscreen();
                }
            }

            if (e.key === 'Escape') {
                if (isLivePage && isLiveMaximized) {
                    // 如果当前是最大化状态，按 ESC 还原
                    toggleLiveState(false);
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