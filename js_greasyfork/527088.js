// ==UserScript==
// @name        抖音健康提醒助手-增强版
// @namespace   http://tampermonkey.net/
// @version      3.3
// @description 带音频后备方案的计时提醒工具
// @author      DeepSeek
// @match       https://www.douyin.com/*
// @grant       GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/527088/%E6%8A%96%E9%9F%B3%E5%81%A5%E5%BA%B7%E6%8F%90%E9%86%92%E5%8A%A9%E6%89%8B-%E5%A2%9E%E5%BC%BA%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/527088/%E6%8A%96%E9%9F%B3%E5%81%A5%E5%BA%B7%E6%8F%90%E9%86%92%E5%8A%A9%E6%89%8B-%E5%A2%9E%E5%BC%BA%E7%89%88.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 完整的9秒蜂鸣声base64（WAV格式）
    const BASE64_AUDIO = 'UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=' +
                         'UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=' +
                         'UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=' +
                         'UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=' +
                         'UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=' +
                         'UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=' +
                         'UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=' +
                         'UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=' +
                         'UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=' +
                         'UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=' +
                         'UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=' +
                         'UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA='; // 示例的9秒蜂鸣声数据

    // 样式配置
    GM_addStyle(`
        @keyframes ds-alarmFlash {
            0% { box-shadow: 0 0 15px rgba(0,255,0,0.5); border-color: #00ff00; }
            50% { box-shadow: 0 0 30px rgba(255,50,50,0.8); border-color: #ff0000; }
            100% { box-shadow: 0 0 15px rgba(0,255,0,0.5); border-color: #00ff00; }
        }
        .ds-timer {
            position: fixed;
            top: 10%;
            left: 50%;
            transform: translate(-50%, -50%);
            padding: 18px 28px;
            background: rgba(0, 0, 0, 0.85);
            color: #00ff00;
            border-radius: 12px;
            z-index: 99999;
            font-family: 'Arial', sans-serif;
            font-size: 1.8em;
            box-shadow: 0 0 15px rgba(0, 255, 0, 0.5);
            border: 1.5px solid #00ff00;
            text-align: center;
            min-width: 220px;
        }
        #ds-counter {
            display: inline-block;
            margin-left: 12px;
            font-weight: bold;
            text-shadow: 0 0 8px rgba(0,255,0,0.6);
        }
        .ds-timer-sub {
            font-size: 0.5em;
            color: #888;
            margin-bottom: 4px;
        }
        .ds-audio-alert {
            color: #ff4444!important;
            font-size: 0.4em!important;
            margin-top: 8px!important;
            animation: ds-alertBlink 1s infinite;
        }
        @keyframes ds-alertBlink {
            50% { opacity: 0.3; }
        }
    `);

    class TimerManager {
        constructor() {
            this.timer = null;
            this.startTime = null;
            this.audio = this.initAudio();
            this.initDom();
            this.bindEvents();

        }

        initDom() {
            this.container = document.createElement('div');
            this.container.className = 'ds-timer';
            this.container.innerHTML = `
                <div class="ds-timer-sub">🕒 使用时长</div>
                <span id="ds-counter">00:00</span>
            `;
            document.body.appendChild(this.container);
            this.counter = this.container.querySelector('#ds-counter');
        }

        initAudio() {
            const audio = new Audio(`data:audio/wav;base64,${BASE64_AUDIO}`);
            audio.preload = 'auto'; // 确保音频预加载
            audio.volume = 0.7;

            // 确保音频元数据加载完成后获取正确的持续时间
            audio.addEventListener('loadedmetadata', () => {
                console.log(`Audio duration: ${audio.duration} seconds`);
            });

            return audio;
        }

        bindEvents() {
            // 用户首次交互后加载音频
            const loadAudio = () => {
                this.audio.load().catch(console.warn);
                document.removeEventListener('click', loadAudio);
                document.removeEventListener('scroll', loadAudio);
            };
            document.addEventListener('click', loadAudio);
            document.addEventListener('scroll', loadAudio);

            window.addEventListener('beforeunload', () => this.cleanup());
        }

        start(duration = 60000) {
            this.cleanup();
            this.startTime = Date.now();

            this.timer = setInterval(() => {
                const elapsed = Date.now() - this.startTime;
                this.updateDisplay(elapsed);

                if (elapsed >= duration) {
                    this.triggerAlarm();
                    clearInterval(this.timer);
                }
            }, 1000);
        }

        updateDisplay(elapsed) {
            const pad = n => String(n).padStart(2, '0');
            this.counter.textContent = `${pad(Math.floor(elapsed/60000))}:${pad(Math.floor((elapsed%60000)/1000))}`;
        }

        async triggerAlarm() {
            this.container.style.animation = 'ds-alarmFlash 1s infinite';

            try {
                for (let i = 0; i < 3; i++) { // 将10次改为20次
                    await this.audio.play();
                    await new Promise(resolve => setTimeout(resolve, this.audio.duration * 1000));
                }
            } catch (e) {
                this.showFallbackAlert();
                this.playFallbackTone();
            }
        }

        showFallbackAlert() {
            const alert = document.createElement('div');
            alert.className = 'ds-audio-alert';
            alert.textContent = '系统提示音已激活';
            this.container.appendChild(alert);
            setTimeout(() => alert.remove(), 3000);
        }

        playFallbackTone() {
            try {
                const ctx = new (window.AudioContext || window.webkitAudioContext)();
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();

                osc.type = 'sine';
                osc.frequency.value = 880;
                gain.gain.value = 0.1;

                osc.connect(gain);
                gain.connect(ctx.destination);

                osc.start();
                setTimeout(() => {
                    osc.stop();
                    ctx.close();
                }, 3000);
            } catch (e) {
                console.error('音频后备方案失败:', e);
            }
        }

        cleanup() {
            clearInterval(this.timer);
            this.container.style.animation = '';
            this.container.querySelectorAll('.ds-audio-alert').forEach(el => el.remove());
        }
    }

    // SPA适配器
    let timerInstance = null;
    const initTimer = () => {
        if (!timerInstance) {
            timerInstance = new TimerManager();
            timerInstance.start();
        }
    };

    const observer = new MutationObserver(mutations => {
        if (!document.body.contains(timerInstance?.container)) {
            timerInstance = null;
            initTimer();
        }
    });

    // 启动逻辑
    window.addEventListener('load', () => {
        observer.observe(document.body, { childList: true, subtree: true });
        initTimer();
    });
})();
