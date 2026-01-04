// ==UserScript==
// @name         视频倍速播放增强版
// @name:en      Enhanced Video Speed Controller
// @namespace    http://tampermonkey.net/
// @version      1.3.1
// @description  长按右方向键倍速播放，松开恢复原速。按+/-键调整倍速，按]/[键快速调整倍速，按P键恢复1.0倍速。上/下方向键调节音量，回车键切换全屏。左/右方向键快退/快进5秒。支持YouTube、Bilibili等大多数视频网站（可通过修改脚本的 @match 规则扩展支持的网站）。
// @description:en  Hold right arrow key for speed playback, release to restore. Press +/- to adjust speed, press ]/[ for quick speed adjustment, press P to restore 1.0x speed. Up/Down arrows control volume, Enter toggles fullscreen. Left/Right arrows for 5s rewind/forward. Supports YouTube, Bilibili and most video websites (extendable by modifying the @match rule).
// @author       AA
// @license      MIT
// @match        *://*.youtube.com/*
// @match        *://*.bilibili.com/video/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/527734/%E8%A7%86%E9%A2%91%E5%80%8D%E9%80%9F%E6%92%AD%E6%94%BE%E5%A2%9E%E5%BC%BA%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/527734/%E8%A7%86%E9%A2%91%E5%80%8D%E9%80%9F%E6%92%AD%E6%94%BE%E5%A2%9E%E5%BC%BA%E7%89%88.meta.js
// ==/UserScript==

(function () {
    "use strict";

    class VideoController {
        static DEFAULT_SETTINGS = {
            defaultRate: 1.0,
            targetRate: 2.5
        };

        constructor() {
            this.settings = this.loadSettings();
            this.currentUrl = location.href;
            this.activeObservers = new Set();
            this.longPressTimer = null;
            this.currentQuickRate = 1.0;
            this.originalRate = 1.0;
            this.init();
        }

        loadSettings() {
            return {
                defaultRate: GM_getValue('defaultRate', VideoController.DEFAULT_SETTINGS.defaultRate),
                targetRate: GM_getValue('targetRate', VideoController.DEFAULT_SETTINGS.targetRate)
            };
        }

        async init() {
            this.registerMenuCommands();
            await this.setupVideoControls();
            this.setupNavigationWatcher();
        }

        registerMenuCommands() {
            this.createMenuCommand('设置默认播放速度', 'defaultRate', '默认播放速度');
            this.createMenuCommand('设置长按右键倍速', 'targetRate', '长按右键倍速');
        }

        createMenuCommand(label, settingKey, displayName) {
            GM_registerMenuCommand(label, () => {
                const newValue = prompt(`请输入${displayName} (0.5-16):`, this.settings[settingKey]);
                const value = parseFloat(newValue);
                
                if (!isNaN(value) && value >= 0.5 && value <= 16) {
                    this.settings[settingKey] = value;
                    GM_setValue(settingKey, value);
                    this.showFloatingMessage(`${displayName}已设置为 ${value}x`);
                    if (settingKey === 'defaultRate') this.applyDefaultSpeed();
                } else {
                    alert('请输入有效的速度值（0.5-16）');
                }
            });
        }

        async setupVideoControls() {
            try {
                const video = await this.waitForVideoElement();
                this.setupEventListeners(video);
                this.setupVideoObserver(video);
                this.applyDefaultSpeed(video);
            } catch (error) {
                console.error('视频控制初始化失败:', error);
            }
        }

        applyDefaultSpeed(video = document.querySelector('video')) {
            if (video) video.playbackRate = this.settings.defaultRate;
        }

        async waitForVideoElement() {
            return new Promise((resolve, reject) => {
                const checkVideo = () => {
                    const video = this.findVideoElement();
                    if (video && video.readyState >= 1) return video;
                    return null;
                };

                const video = checkVideo();
                if (video) return resolve(video);

                const observer = new MutationObserver(() => {
                    const foundVideo = checkVideo();
                    if (foundVideo) {
                        cleanup();
                        resolve(foundVideo);
                    }
                });

                const cleanup = () => {
                    observer.disconnect();
                    this.activeObservers.delete(observer);
                };

                observer.observe(document.body, { childList: true, subtree: true });
                this.activeObservers.add(observer);

                setTimeout(() => cleanup() || reject({ type: "timeout" }), 10000);
            });
        }

        findVideoElement() {
            if (location.hostname.includes('youtube.com')) {
                return document.querySelector('.html5-main-video, video.video-stream, .html5-video-player video');
            }
            return document.querySelector('video');
        }

        setupEventListeners(video) {
            const keyHandler = this.createKeyHandler(video);
            document.addEventListener('keydown', keyHandler.down);
            document.addEventListener('keyup', keyHandler.up);
            this.activeObservers.add({
                disconnect: () => {
                    document.removeEventListener('keydown', keyHandler.down);
                    document.removeEventListener('keyup', keyHandler.up);
                }
            });
        }

        createKeyHandler(video) {
            return {
                down: (e) => this.handleKeyDown(e, video),
                up: (e) => this.handleKeyUp(e, video)
            };
        }

        handleKeyDown(e, video) {
            if (this.shouldIgnoreEvent(e)) return;

            const handlers = {
                ArrowUp: () => this.adjustVolume(video, 0.1),
                ArrowDown: () => this.adjustVolume(video, -0.1),
                Enter: () => this.toggleFullscreen(video),
                ArrowRight: () => this.handleRightKeyDown(video),
                BracketRight: () => this.adjustSpeed(0.5),
                BracketLeft: () => this.adjustSpeed(-0.5),
                KeyP: () => this.resetSpeed(video),
                Equal: () => this.changeTargetRate(0.5),
                Minus: () => this.changeTargetRate(-0.5)
            };

            if (handlers[e.code]) {
                e.preventDefault();
                e.stopImmediatePropagation();
                handlers[e.code]();
            }
        }

        handleKeyUp(e, video) {
            if (e.code === 'ArrowRight') {
                clearTimeout(this.longPressTimer);
                if (video.playbackRate === this.settings.targetRate) {
                    video.playbackRate = this.originalRate;
                    this.showFloatingMessage(`恢复 ${this.originalRate}x 倍速`);
                } else {
                    video.currentTime += 5;
                }
            }
        }

        handleRightKeyDown(video) {
            this.originalRate = video.playbackRate;
            this.longPressTimer = setTimeout(() => {
                video.playbackRate = this.settings.targetRate;
                this.showFloatingMessage(`${this.settings.targetRate}x 倍速`);
            }, 300);
        }

        adjustVolume(video, delta) {
            video.volume = Math.min(1, Math.max(0, video.volume + delta));
            this.showFloatingMessage(`音量：${Math.round(video.volume * 100)}%`);
        }

        toggleFullscreen(video) {
            if (!document.fullscreenElement) {
                video.requestFullscreen?.().catch(console.error);
            } else {
                document.exitFullscreen?.();
            }
        }

        adjustSpeed(delta) {
            this.currentQuickRate = Math.max(0.5, this.currentQuickRate + delta);
            document.querySelector('video').playbackRate = this.currentQuickRate;
            this.showFloatingMessage(`当前速度：${this.currentQuickRate}x`);
        }

        resetSpeed(video) {
            this.currentQuickRate = 1.0;
            video.playbackRate = 1.0;
            this.showFloatingMessage('恢复正常速度');
        }

        changeTargetRate(delta) {
            const newRate = this.settings.targetRate + delta;
            if (newRate >= 0.5 && newRate <= 16) {
                this.settings.targetRate = newRate;
                this.showFloatingMessage(`下次倍速：${newRate}x`);
            }
        }

        shouldIgnoreEvent(e) {
            const validKeys = ['ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown', 
                             'Enter', 'Equal', 'Minus', 'BracketRight', 'BracketLeft', 'KeyP'];
            return !validKeys.includes(e.code) ||
                   e.target.tagName === 'INPUT' ||
                   e.target.tagName === 'TEXTAREA' ||
                   (location.hostname.includes('youtube.com') && 
                    !document.querySelector('#movie_player')?.contains(e.target));
        }

        showFloatingMessage(message) {
            let msgElement = document.getElementById('speedControlMessage');
            if (!msgElement) {
                msgElement = document.createElement('div');
                msgElement.id = 'speedControlMessage';
                Object.assign(msgElement.style, {
                    position: 'fixed',
                    top: '10px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    color: 'white',
                    padding: '8px 16px',
                    borderRadius: '4px',
                    zIndex: '10000',
                    fontFamily: 'Arial, sans-serif',
                    fontSize: '14px',
                    transition: 'opacity 0.5s ease-out'
                });
                document.body.appendChild(msgElement);
            }

            msgElement.textContent = message;
            msgElement.style.opacity = '1';
            setTimeout(() => msgElement.style.opacity = '0', 1500);
        }

        setupVideoObserver(video) {
            const observer = new MutationObserver(() => {
                if (!document.contains(video)) {
                    this.cleanup();
                    this.setupVideoControls();
                }
            });
            observer.observe(video.parentElement, { childList: true });
            this.activeObservers.add(observer);
        }

        setupNavigationWatcher() {
            const handleNavigation = () => {
                if (location.href !== this.currentUrl) {
                    this.currentUrl = location.href;
                    this.cleanup();
                    setTimeout(() => this.setupVideoControls(), 1000);
                }
            };

            const observer = new MutationObserver(handleNavigation);
            observer.observe(document.body, { childList: true, subtree: true });
            this.activeObservers.add(observer);

            window.addEventListener('popstate', handleNavigation);
            const originalPushState = history.pushState;
            history.pushState = (...args) => {
                originalPushState.apply(history, args);
                handleNavigation();
            };
        }

        cleanup() {
            this.activeObservers.forEach(observer => observer.disconnect());
            this.activeObservers.clear();
            clearTimeout(this.longPressTimer);
        }
    }

    // 启动控制器
    new VideoController();
})();