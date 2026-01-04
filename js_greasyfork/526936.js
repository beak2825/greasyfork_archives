// ==UserScript==
// @name         智能网课防挂机助手
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  模拟真实用户行为，防止网课挂机检测
// @author       资深程序员
// @match        *://*/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/526936/%E6%99%BA%E8%83%BD%E7%BD%91%E8%AF%BE%E9%98%B2%E6%8C%82%E6%9C%BA%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/526936/%E6%99%BA%E8%83%BD%E7%BD%91%E8%AF%BE%E9%98%B2%E6%8C%82%E6%9C%BA%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置参数（单位：毫秒）
    const CONFIG = {
        CHECK_INTERVAL: 60 * 1000,      // 基础检测间隔
        RANDOM_RANGE: 15 * 1000,        // 随机时间范围
        MOUSE_MOVE_RATE: 0.6,           // 鼠标移动概率
        CLICK_RATE: 0.3,               // 点击事件概率
        SCROLL_RATE: 0.2,               // 滚动事件概率
        KEYBOARD_RATE: 0.1              // 键盘事件概率
    };

    // 智能动作生成器
    class ActivitySimulator {
        constructor() {
            this.lastPosition = { x: 0, y: 0 };
            this.initMouseTracking();
        }

        initMouseTracking() {
            document.addEventListener('mousemove', (e) => {
                this.lastPosition = { x: e.clientX, y: e.clientY };
            });
        }

        // 生成随机坐标
        generateRandomPosition() {
            const range = 50;
            return {
                x: Math.max(0, this.lastPosition.x + (Math.random() * range - range/2)),
                y: Math.max(0, this.lastPosition.y + (Math.random() * range - range/2))
            };
        }

        // 模拟鼠标移动
        simulateMouseMove() {
            const pos = this.generateRandomPosition();
            const moveEvent = new MouseEvent('mousemove', {
                view: window,
                bubbles: true,
                cancelable: true,
                clientX: pos.x,
                clientY: pos.y
            });
            document.dispatchEvent(moveEvent);
        }

        // 模拟点击事件（智能选择安全区域）
        simulateClick() {
            const clickableElements = [
                'video', 'player', 'controls', // 常见播放器组件
                'div', 'span'                // 通用元素
            ].map(selector => 
                Array.from(document.querySelectorAll(selector))
            ).flat();

            if (clickableElements.length > 0) {
                const target = clickableElements[Math.floor(Math.random() * clickableElements.length)];
                const rect = target.getBoundingClientRect();
                const clickEvent = new MouseEvent('click', {
                    bubbles: true,
                    cancelable: true,
                    view: window,
                    clientX: rect.left + rect.width/2,
                    clientY: rect.top + rect.height/2
                });
                target.dispatchEvent(clickEvent);
            }
        }

        // 模拟滚动事件
        simulateScroll() {
            const scrollAmount = Math.random() < 0.5 ? 50 : -50;
            window.scrollBy({
                top: scrollAmount,
                behavior: 'smooth'
            });
        }

        // 模拟键盘事件
        simulateKeyboard() {
            const keyCodes = [32, 37, 38, 39, 40]; // 空格、方向键
            const keyEvent = new KeyboardEvent('keydown', {
                keyCode: keyCodes[Math.floor(Math.random() * keyCodes.length)],
                bubbles: true,
                cancelable: true
            });
            document.dispatchEvent(keyEvent);
        }

        // 执行随机动作
        performRandomAction() {
            const actions = [];
            
            if (Math.random() < CONFIG.MOUSE_MOVE_RATE) {
                actions.push(() => this.simulateMouseMove());
            }
            if (Math.random() < CONFIG.CLICK_RATE) {
                actions.push(() => this.simulateClick());
            }
            if (Math.random() < CONFIG.SCROLL_RATE) {
                actions.push(() => this.simulateScroll());
            }
            if (Math.random() < CONFIG.KEYBOARD_RATE) {
                actions.push(() => this.simulateKeyboard());
            }

            // 随机执行1-2个动作
            if (actions.length > 0) {
                const shuffle = actions.sort(() => 0.5 - Math.random());
                shuffle.slice(0, 1 + Math.floor(Math.random())).forEach(action => action());
            }
        }
    }

    // 智能调度系统
    class Scheduler {
        constructor() {
            this.simulator = new ActivitySimulator();
            this.setupListener();
            this.start();
        }

        setupListener() {
            // 页面可见性检测
            document.addEventListener('visibilitychange', () => {
                if (document.hidden) {
                    this.stop();
                } else {
                    this.start();
                }
            });
        }

        start() {
            if (!this.timer) {
                this.timer = setInterval(() => {
                    this.simulator.performRandomAction();
                    this.adjustInterval();
                }, this.nextInterval());
            }
        }

        stop() {
            clearInterval(this.timer);
            this.timer = null;
        }

        nextInterval() {
            return CONFIG.CHECK_INTERVAL + 
                Math.random() * CONFIG.RANDOM_RANGE - 
                CONFIG.RANDOM_RANGE/2;
        }

        adjustInterval() {
            clearInterval(this.timer);
            this.timer = setInterval(() => {
                this.simulator.performRandomAction();
                this.adjustInterval();
            }, this.nextInterval());
        }
    }

    // 启动系统
    new Scheduler();

    // 视频保活检测（可选）
    const videoElements = document.querySelectorAll('video');
    if (videoElements.length > 0) {
        setInterval(() => {
            videoElements.forEach(video => {
                if (video.paused && !video.ended) {
                    video.play().catch(() => {});
                }
            });
        }, 5000);
    }
})();