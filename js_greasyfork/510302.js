// ==UserScript==
// @name         自动模糊Twitter
// @namespace    http://tampermonkey.net/
// @version      0.1.0
// @description  当Twitter网页检测到视频流窗口中出现人体时自动模糊，恢复时取消模糊。同时提供鼠标离开页面和无操作时的模糊功能，并允许用户独立控制这些功能。
// @author       IF_Not_RuoMu
// @match        *://twitter.com/*
// @match        *://x.com/*
// @grant        none
// @license      BSD 3-Clause
// @require      https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@3.21.0/dist/tf.min.js
// @require      https://cdn.jsdelivr.net/npm/@tensorflow-models/coco-ssd@2.2.2/dist/coco-ssd.min.js
// @downloadURL https://update.greasyfork.org/scripts/510302/%E8%87%AA%E5%8A%A8%E6%A8%A1%E7%B3%8ATwitter.user.js
// @updateURL https://update.greasyfork.org/scripts/510302/%E8%87%AA%E5%8A%A8%E6%A8%A1%E7%B3%8ATwitter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置选项
    const CONFIG = {
        debugMode: true,
        blurAmount: 20, // 模糊强度（像素）
        detectionInterval: 1000, // 检测间隔（毫秒）
        inactivityTime: 5000, // 无操作时间（毫秒）
        enableTransition: true, // 是否启用过渡效果

        // 按钮样式配置
        buttonStyles: {
            position: 'fixed',
            right: '20px',
            zIndex: '10001', // 确保按钮在覆盖层之上
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            padding: '10px 15px',
            fontSize: '14px',
            boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
            marginTop: '10px'
        },
        buttonColors: {
            detection: '#1da1f2',
            mouseBlur: '#ff9800',
            inactivityBlur: '#9c27b0'
        },

        // 覆盖层配置
        overlay: {
            id: 'blur-overlay', // 覆盖层的ID
            backgroundColor: 'rgba(255, 255, 255, 0)', // 覆盖层背景色（透明）
            backdropFilter: 'blur', // 使用 backdrop-filter 实现模糊
            transition: 'backdrop-filter 0.5s ease', // 过渡效果
            pointerEvents: 'none', // 允许下方元素交互
            zIndex: '9999' // 覆盖层的z-index，确保在所有内容之上但低于按钮
        }
    };

    // 创建覆盖层
    (function createBlurOverlay() {
        const overlay = document.createElement('div');
        overlay.id = CONFIG.overlay.id;

        // 应用覆盖层的初始样式
        Object.assign(overlay.style, {
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            backgroundColor: CONFIG.overlay.backgroundColor,
            backdropFilter: 'none', // 初始无模糊
            transition: CONFIG.enableTransition ? CONFIG.overlay.transition : 'none',
            pointerEvents: CONFIG.overlay.pointerEvents,
            zIndex: CONFIG.overlay.zIndex,
            display: 'none' // 初始隐藏
        });

        document.body.appendChild(overlay);
    })();

    // 模糊来源管理
    const BlurManager = {
        sources: {
            human: false,
            mouse: false,
            inactivity: false
        },
        overlay: document.getElementById(CONFIG.overlay.id),

        updateBlur() {
            const isBlurred = Object.values(this.sources).some(status => status);
            if (isBlurred) {
                this.overlay.style.display = 'block';
                this.overlay.style.backdropFilter = `blur(${CONFIG.blurAmount}px)`;
            } else {
                this.overlay.style.backdropFilter = 'none';
                // 使用过渡效果后再隐藏，以避免突然消失
                if (CONFIG.enableTransition) {
                    setTimeout(() => {
                        if (!Object.values(this.sources).some(status => status)) {
                            this.overlay.style.display = 'none';
                        }
                    }, 500); // 与CSS过渡时间一致
                } else {
                    this.overlay.style.display = 'none';
                }
            }
            this.debugLog(`模糊状态: ${isBlurred ? '开启' : '关闭'} (Human: ${this.sources.human}, Mouse: ${this.sources.mouse}, Inactivity: ${this.sources.inactivity})`);
        },
        debugLog(message) {
            if (CONFIG.debugMode) {
                console.log(`[DEBUG] ${message}`);
            }
        },
        setBlur(source, status) {
            if (source in this.sources) {
                this.sources[source] = status;
                this.updateBlur();
            }
        }
    };

    // 创建按钮的通用函数
    function createButton(initialText, bottomOffset, color, onClick) {
        const button = document.createElement('button');
        button.textContent = initialText;
        Object.assign(button.style, { 
            ...CONFIG.buttonStyles, 
            bottom: `${bottomOffset}px`, 
            backgroundColor: color 
        });
        button.addEventListener('click', onClick);
        document.body.appendChild(button);
        return button;
    }

    // 定义所有模糊来源的配置
    const blurSourcesConfig = [
        {
            name: 'human',
            type: 'toggle',
            initialText: '启动人体检测',
            enabledText: '停止人体检测',
            color: CONFIG.buttonColors.detection,
            action: (button) => DetectionManager.toggle(button)
        },
        {
            name: 'mouse',
            type: 'toggle',
            initialText: '禁用鼠标模糊',
            enabledText: '启用鼠标模糊',
            color: CONFIG.buttonColors.mouseBlur,
            action: (button) => MouseBlurManager.toggle(button)
        },
        {
            name: 'inactivity',
            type: 'toggle',
            initialText: '禁用无操作模糊',
            enabledText: '启用无操作模糊',
            color: CONFIG.buttonColors.inactivityBlur,
            action: (button) => InactivityBlurManager.toggle(button)
        }
    ];

    // 创建所有按钮
    const blurButtons = blurSourcesConfig.map((source, index) =>
        createButton(
            source.initialText, 
            20 + index * 60, // 调整垂直间距
            source.color, 
            () => source.action(blurButtons[index])
        )
    );

    // 人体检测管理
    const DetectionManager = {
        model: null,
        videoStream: null,
        videoElement: null,
        canvas: null,
        ctx: null,
        timer: null,
        isDetecting: false,
        isEnabled: false,
        
        toggle(button) {
            this.isEnabled = !this.isEnabled;
            button.textContent = this.isEnabled ? '停止人体检测' : '启动人体检测';
            this.isEnabled ? this.startDetection() : this.stopDetection();
        },

        async loadModel() {
            try {
                this.model = await cocoSsd.load();
                BlurManager.debugLog('COCO-SSD 模型已加载');
            } catch (error) {
                console.error('模型加载失败:', error);
                alert('模型加载失败，请检查控制台获取详细信息。');
                this.isEnabled = false; // 重置状态
            }
        },

        async startDetection() {
            if (this.isDetecting) return;
            this.isDetecting = true;
            BlurManager.debugLog('开始人体检测');

            await this.loadModel();
            if (!this.model) {
                this.stopDetection();
                return;
            }

            try {
                this.videoStream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: false });
                BlurManager.debugLog('视频流已捕获');

                this.videoElement = document.createElement('video');
                this.videoElement.srcObject = this.videoStream;
                this.videoElement.play();
                this.videoElement.style.display = 'none';
                document.body.appendChild(this.videoElement);

                this.canvas = document.createElement('canvas');
                this.ctx = this.canvas.getContext('2d');
                this.canvas.style.display = 'none';
                document.body.appendChild(this.canvas);

                this.videoElement.addEventListener('loadedmetadata', () => {
                    this.canvas.width = this.videoElement.videoWidth;
                    this.canvas.height = this.videoElement.videoHeight;
                    BlurManager.debugLog(`视频元数据加载: 宽度=${this.canvas.width}, 高度=${this.canvas.height}`);
                });

                this.timer = setInterval(() => this.detectFrame(), CONFIG.detectionInterval);
                BlurManager.debugLog('人体检测定时器已启动');
            } catch (error) {
                console.error('屏幕捕捉失败:', error);
                alert('无法捕捉屏幕。请确保已授权并选择正确的窗口。');
                this.stopDetection();
            }
        },

        async detectFrame() {
            if (this.videoElement.readyState !== this.videoElement.HAVE_ENOUGH_DATA || !this.videoElement) return;
            this.ctx.drawImage(this.videoElement, 0, 0, this.canvas.width, this.canvas.height);
            const img = tf.browser.fromPixels(this.canvas);
            try {
                const predictions = await this.model.detect(img);
                BlurManager.debugLog(`检测结果: ${JSON.stringify(predictions)}`);

                const hasPerson = predictions.some(prediction => prediction.class === 'person' && prediction.score > 0.5);
                if (hasPerson !== BlurManager.sources.human) {
                    BlurManager.setBlur('human', hasPerson);
                    BlurManager.debugLog(hasPerson ? '检测到人体，开启模糊' : '未检测到人体，关闭模糊');
                }
            } catch (error) {
                console.error('检测过程中出现错误:', error);
            } finally {
                img.dispose();
            }
        },

        stopDetection() {
            if (!this.isDetecting) return;
            this.isDetecting = false;
            BlurManager.debugLog('停止人体检测');

            clearInterval(this.timer);
            this.timer = null;

            if (this.videoStream) {
                this.videoStream.getTracks().forEach(track => {
                    track.stop();
                    BlurManager.debugLog('停止视频流');
                });
                this.videoStream = null;
            }

            if (this.videoElement) {
                document.body.removeChild(this.videoElement);
                this.videoElement = null;
                BlurManager.debugLog('视频元素已移除');
            }

            if (this.canvas) {
                document.body.removeChild(this.canvas);
                this.canvas = null;
                this.ctx = null;
                BlurManager.debugLog('Canvas 元素已移除');
            }

            BlurManager.setBlur('human', false);
        }
    };

    // 鼠标离开模糊管理
    const MouseBlurManager = {
        isEnabled: true,

        toggle(button) {
            this.isEnabled = !this.isEnabled;
            button.textContent = this.isEnabled ? '禁用鼠标模糊' : '启用鼠标模糊';
            BlurManager.debugLog(`鼠标模糊功能已${this.isEnabled ? '启用' : '禁用'}`);

            if (!this.isEnabled && BlurManager.sources.mouse) {
                BlurManager.setBlur('mouse', false);
                BlurManager.debugLog('禁用鼠标模糊，取消当前模糊');
            }
        },

        init() {
            document.addEventListener('mouseout', (e) => {
                if (!this.isEnabled) return;
                const fromElement = e.relatedTarget || e.toElement;
                if (!fromElement || !document.body.contains(fromElement)) {
                    BlurManager.setBlur('mouse', true);
                    BlurManager.debugLog('鼠标离开页面，开启模糊');
                }
            });

            document.addEventListener('mouseover', () => {
                if (!this.isEnabled) return;
                BlurManager.setBlur('mouse', false);
                BlurManager.debugLog('鼠标重新进入页面，关闭模糊');
            });
        }
    };

    // 无操作模糊管理
    const InactivityBlurManager = {
        timer: null,
        isEnabled: true,

        toggle(button) {
            this.isEnabled = !this.isEnabled;
            button.textContent = this.isEnabled ? '禁用无操作模糊' : '启用无操作模糊';
            BlurManager.debugLog(`无操作模糊功能已${this.isEnabled ? '启用' : '禁用'}`);
            this.isEnabled ? this.start() : this.stop();
        },

        start() {
            if (this.timer) return;
            let inactivityTime = 0;

            const resetInactivityTime = () => {
                inactivityTime = 0;
                BlurManager.setBlur('inactivity', false);
                BlurManager.debugLog('用户活动，取消无操作模糊');
            };

            this.timer = setInterval(() => {
                inactivityTime += CONFIG.detectionInterval;
                if (inactivityTime >= CONFIG.inactivityTime) {
                    BlurManager.setBlur('inactivity', true);
                    BlurManager.debugLog('用户无操作，开启模糊');
                }
            }, CONFIG.detectionInterval);

            document.addEventListener('mousemove', resetInactivityTime);
            document.addEventListener('keypress', resetInactivityTime);
            document.addEventListener('scroll', resetInactivityTime);
        },

        stop() {
            clearInterval(this.timer);
            this.timer = null;
            BlurManager.debugLog('停止无操作模糊监测');
            BlurManager.setBlur('inactivity', false);
        }
    };

    // 初始化管理器
    function initializeManagers() {
        DetectionManager.loadModel();
        MouseBlurManager.init();
        InactivityBlurManager.start();
    }

    // 等待页面完全加载后初始化
    window.addEventListener('load', initializeManagers);
})();