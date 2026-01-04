// ==UserScript==
// @name         抖音自律助手终极版(右键可自定义时长)
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  带可拖动悬浮计时器、智能黑屏及网页端自定义时长
// @author       potato
// @match        *://*.douyin.com/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/525668/%E6%8A%96%E9%9F%B3%E8%87%AA%E5%BE%8B%E5%8A%A9%E6%89%8B%E7%BB%88%E6%9E%81%E7%89%88%28%E5%8F%B3%E9%94%AE%E5%8F%AF%E8%87%AA%E5%AE%9A%E4%B9%89%E6%97%B6%E9%95%BF%29.user.js
// @updateURL https://update.greasyfork.org/scripts/525668/%E6%8A%96%E9%9F%B3%E8%87%AA%E5%BE%8B%E5%8A%A9%E6%89%8B%E7%BB%88%E6%9E%81%E7%89%88%28%E5%8F%B3%E9%94%AE%E5%8F%AF%E8%87%AA%E5%AE%9A%E4%B9%89%E6%97%B6%E9%95%BF%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /*************** 样式 ***************/
    GM_addStyle(`
        /* 黑屏遮罩 */
        #timeout-overlay{position:fixed;top:0;left:0;width:100vw;height:100vh;background:rgba(0,0,0,.9);z-index:999999;display:none;justify-content:center;align-items:center;color:#fff;font-size:2em;text-align:center;cursor:not-allowed;flex-direction:column;}
        /* 倒计时小球 */
        #countdown-ball{position:fixed;right:20px;bottom:20px;width:60px;height:60px;background:linear-gradient(135deg,#ff6b6b,#ff4757);border-radius:50%;box-shadow:0 4px 15px rgba(255,107,107,.3);cursor:move;display:flex;align-items:center;justify-content:center;color:#fff;font-weight:bold;font-size:14px;text-align:center;line-height:1.2;z-index:999998;user-select:none;transition:all .3s cubic-bezier(.4,0,.2,1);}
        #countdown-ball:hover{transform:scale(1.1);box-shadow:0 6px 20px rgba(255,107,107,.4);}
        #countdown-ball.dragging{transition:none;opacity:.9;}
        /* 黑屏提示文字 */
        .timeout-text{animation:pulse 2s infinite;}
        @keyframes pulse{0%{transform:scale(1);}50%{transform:scale(1.05);}100%{transform:scale(1);}}
    `);

    /*************** DOM 构造 ***************/
    const createOverlay = () => {
        const overlay = document.createElement('div');
        overlay.id = 'timeout-overlay';
        document.body.appendChild(overlay);
        return overlay;
    };

    const createCountdownBall = () => {
        const ball = document.createElement('div');
        ball.id = 'countdown-ball';
        document.body.appendChild(ball);
        return ball;
    };

    /*************** 定时器控制 ***************/
    class TimerController {
        STORAGE_KEY = 'douyin_focus_duration_ms';

        constructor() {
            // 读取持久化时长，默认 10 分钟
            const saved = parseInt(localStorage.getItem(this.STORAGE_KEY), 10);
            this.totalTime = Number.isFinite(saved) && saved > 0 ? saved : 10 * 60 * 1000;

            this.startTime = Date.now();
            this.remaining = this.totalTime;
            this.timer = null;

            this.ball = createCountdownBall();
            this.overlay = createOverlay();

            this.setupOverlayText();      // 根据时长渲染提示
            this.init();
        }

        /***** 初始化 *****/
        init() {
            this.setupDrag();
            this.setupCustomTimeListener(); // 新增：自定义时长
            this.setupVisibilityListener();
            this.startCountdown();
        }

        /***** 倒计时循环 *****/
        startCountdown() {
            this.clearTimer();
            this.startTime = Date.now();
            this.updateDisplay();

            this.timer = setInterval(() => {
                this.remaining = this.totalTime - (Date.now() - this.startTime);
                if (this.remaining <= 0) return this.triggerTimeout();
                this.updateDisplay();
            }, 200);
        }

        clearTimer() {
            if (this.timer) clearInterval(this.timer);
            this.timer = null;
        }

        /***** UI 更新 *****/
        updateDisplay() {
            const m = Math.floor(this.remaining / 60000);
            const s = Math.floor((this.remaining % 60000) / 1000)
                .toString()
                .padStart(2, '0');
            this.ball.textContent = `${m}:${s}`;

            // 渐变色随进度变化
            const p = this.remaining / this.totalTime;
            this.ball.style.background = `linear-gradient(135deg,
                hsl(${p * 120},70%,50%),
                hsl(${p * 120},80%,45%)
            )`;
        }

        setupOverlayText() {
            const minutes = this.totalTime / 60000;
            this.overlay.innerHTML = `
                <div class="timeout-text">
                    <div>🕒 已连续使用${minutes}分钟</div>
                    <div style="font-size:0.6em;margin-top:20px;">请休息片刻再继续</div>
                    <div style="font-size:0.4em;margin-top:10px;">(刷新页面可恢复)</div>
                </div>
            `;
        }

        /***** 超时处理 *****/
        triggerTimeout() {
            this.clearTimer();
            document.querySelectorAll('video').forEach(v => v.pause());
            this.overlay.style.display = 'flex';
            this.ball.style.display = 'none';
            document.body.style.overflow = 'hidden';
            this.addOverlayBlockers();
        }

        addOverlayBlockers() {
            const blocker = e => {
                e.preventDefault();
                e.stopPropagation();
            };
            ['click', 'touchstart', 'keydown'].forEach(evt =>
                document.addEventListener(evt, blocker, true)
            );
        }

        /***** 自定义时长 *****/
        setupCustomTimeListener() {
            const handler = e => {
                e.preventDefault(); // 阻止默认菜单
                const currentMin = Math.round(this.totalTime / 60000);
                const input = prompt('设置专注时长 (分钟)：', currentMin);
                if (input === null) return;

                const mins = parseInt(input.trim(), 10);
                if (!Number.isFinite(mins) || mins <= 0) {
                    alert('请输入正整数分钟数');
                    return;
                }
                // 更新时长 & 持久化
                this.totalTime = mins * 60 * 1000;
                localStorage.setItem(this.STORAGE_KEY, this.totalTime);
                this.remaining = this.totalTime;
                this.setupOverlayText(); // 重新渲染遮罩文案
                this.ball.style.display = 'flex';
                this.overlay.style.display = 'none';
                document.body.style.overflow = '';
                this.startCountdown();
            };

            // 双击 or 右键均可触发
            this.ball.addEventListener('contextmenu', handler);
            this.ball.addEventListener('dblclick', handler);
        }

        /***** 可见性监控 *****/
        setupVisibilityListener() {
            let hiddenAt = 0;
            document.addEventListener('visibilitychange', () => {
                if (document.hidden) {
                    hiddenAt = Date.now();
                    this.clearTimer();
                } else {
                    this.startTime += Date.now() - hiddenAt;
                    this.startCountdown();
                }
            });
        }

        /***** 拖动 *****/
        setupDrag() {
            let dragging = false, startX, startY, origX, origY;

            const move = e => {
                if (!dragging) return;
                const dx = e.clientX - startX, dy = e.clientY - startY;
                const maxX = window.innerWidth - this.ball.offsetWidth;
                const maxY = window.innerHeight - this.ball.offsetHeight;
                const newX = Math.min(Math.max(0, origX + dx), maxX);
                const newY = Math.min(Math.max(0, origY + dy), maxY);
                this.ball.style.left = `${newX}px`;
                this.ball.style.top = `${newY}px`;
            };

            this.ball.addEventListener('mousedown', e => {
                dragging = true;
                this.ball.classList.add('dragging');
                startX = e.clientX; startY = e.clientY;
                const rect = this.ball.getBoundingClientRect();
                origX = rect.left; origY = rect.top;
                document.addEventListener('mousemove', move);
            });

            document.addEventListener('mouseup', () => {
                if (!dragging) return;
                dragging = false;
                this.ball.classList.remove('dragging');
                document.removeEventListener('mousemove', move);
            });
        }
    }

    // 启动
    new TimerController();
})();
