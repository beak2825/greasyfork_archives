// ==UserScript==
// @name         自动模糊Twitter-mini
// @namespace    http://tampermonkey.net/
// @license BSD 3-Clause
// @version      0.1.0
// @description  当Twitter网页检测鼠标离开页面和无操作时的模糊功能，并允许用户独立控制这些功能。
// @author       IF_Not_RuoMu
// @match        *://twitter.com/*
// @match        *://x.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/510300/%E8%87%AA%E5%8A%A8%E6%A8%A1%E7%B3%8ATwitter-mini.user.js
// @updateURL https://update.greasyfork.org/scripts/510300/%E8%87%AA%E5%8A%A8%E6%A8%A1%E7%B3%8ATwitter-mini.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置选项
    const CONFIG = {
        debugMode: false,
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
        MouseBlurManager.init();
        InactivityBlurManager.start();
    }

    // 等待页面完全加载后初始化
    window.addEventListener('load', initializeManagers);
})();