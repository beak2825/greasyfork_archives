// ==UserScript==
// @name         HTML5视频倍速
// @namespace    http://tampermonkey.net/
// @version      1.0.3
// @description  精准控制视频速度不跳帧（1=1x, 2=2x, 3=3x）
// @author       重庆吴亦凡
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/531037/HTML5%E8%A7%86%E9%A2%91%E5%80%8D%E9%80%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/531037/HTML5%E8%A7%86%E9%A2%91%E5%80%8D%E9%80%9F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 更稳定的样式注入
    const style = document.createElement('style');
    style.textContent = `
        .speed-hud {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0,0,0,0.8);
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            font-size: 18px;
            font-family: Arial;
            z-index: 99999;
            opacity: 0;
            transition: opacity 0.3s;
        }
        .speed-hud.show {
            opacity: 1;
        }
    `;
    document.head.appendChild(style);

    class VideoMaster {
        constructor() {
            this.speeds = {'1':1.0, '2':2.0, '3':3.0};
            this.hud = this.createHUD();
            this.currentVideo = null;
            this.observer = new MutationObserver(() => this.detectVideo());
            this.detectVideo();
        }

        createHUD() {
            const hud = document.createElement('div');
            hud.className = 'speed-hud';
            document.body.appendChild(hud);
            return hud;
        }

        detectVideo() {
            // 优先选择正在播放的视频
            const videos = Array.from(document.querySelectorAll('video'));
            this.currentVideo = videos.find(v => !v.paused) || videos[0];

            // 自动监控iframe内的视频
            if (!this.currentVideo) {
                document.querySelectorAll('iframe').forEach(iframe => {
                    try {
                        const iframeDoc = iframe.contentDocument;
                        if (iframeDoc) {
                            const iframeVideos = iframeDoc.querySelectorAll('video');
                            if (iframeVideos.length) {
                                this.currentVideo = iframeVideos[0];
                            }
                        }
                    } catch (e) {}
                });
            }

            // 开始观察DOM变化
            if (!this.observer) {
                this.observer = new MutationObserver(() => this.detectVideo());
                this.observer.observe(document.body, {
                    childList: true,
                    subtree: true
                });
            }
        }

        setSpeed(speed) {
            if (!this.currentVideo) {
                this.detectVideo();
                if (!this.currentVideo) return false;
            }

            // 保存当前播放时间（避免跳帧）
            const currentTime = this.currentVideo.currentTime;
            const wasPaused = this.currentVideo.paused;

            this.currentVideo.playbackRate = speed;
            this.currentVideo.currentTime = currentTime; // 锁定时间点

            if (!wasPaused) {
                this.currentVideo.play().catch(e => console.log(e));
            }

            this.showHUD(`${speed}x`);
            return true;
        }

        showHUD(text) {
            this.hud.textContent = `速度: ${text}`;
            this.hud.classList.add('show');
            clearTimeout(this.hudTimer);
            this.hudTimer = setTimeout(() => {
                this.hud.classList.remove('show');
            }, 1000);
        }
    }

    const vm = new VideoMaster();

    // 强化版事件监听
    document.addEventListener('keydown', function(e) {
        // 排除输入框/可编辑区域
        if (['INPUT','TEXTAREA'].includes(document.activeElement.tagName) ||
            document.activeElement.isContentEditable) return;

        // 只响应独立数字键（不响应组合键）
        if (['1','2','3'].includes(e.key) && !e.ctrlKey && !e.altKey && !e.metaKey) {
            e.stopImmediatePropagation();
            e.preventDefault();

            // 确保视频已加载
            if (!vm.currentVideo || vm.currentVideo.readyState < 2) {
                vm.detectVideo();
                if (!vm.currentVideo) return;
            }

            vm.setSpeed(vm.speeds[e.key]);
        }
    }, true); // 使用捕获阶段确保优先处理
})();