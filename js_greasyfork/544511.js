// ==UserScript==
// @name         BarcodeScannerHelper4.0
// @namespace    http://tampermonkey.net/
// @version      4.0.0
// @description  检测扫码枪输入时的中文输入法和大写锁定状态，防止输入错误
// @author       mabaize
// @match        *https://decom.boost.aws.a2z.org.cn/decom/work-requests*
// @match        *https://mobility.aws-border.cn/*
// @match        *https://mobility.amazon.com/*
// @match        *https://issues.cn-northwest-1.amazonaws.cn/issues/*
// @match        *https://myday-website.zhy.aws-border.cn/dashboard/*
// @match        *https://myday-website.zhy.aws-border.cn/*
// @match        *https://t.zhy.aws-border.cn/*
// @match        *https://app.boost.aws.a2z.org.cn/*
// @match        *https://tavern.zhy.aws-border.cn/*
// @match        *https://aws.argo.ocean-wave.aws.a2z.com/townsend/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/544511/BarcodeScannerHelper40.user.js
// @updateURL https://update.greasyfork.org/scripts/544511/BarcodeScannerHelper40.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /**
     * 扫码枪输入检测脚本 - 轻量级版本
     * 专门解决网页卡死问题
     */
    class BarcodeScannerHelperV3 {
        constructor() {
            this.isInputMethodWarningShown = false;
            this.isCapsLockWarningShown = false;
            this.lastInputTime = 0;
            this.scannerInputThreshold = 50;
            this.isComposing = false;
            this.warningCooldown = false; // 警告冷却时间
            this.eventThrottle = false; // 事件节流
            this.init();
        }

        init() {
            // 使用更轻量的事件监听，避免捕获阶段
            document.addEventListener('keydown', this.handleKeyDown.bind(this));
            document.addEventListener('compositionstart', this.handleCompositionStart.bind(this));
            document.addEventListener('compositionend', this.handleCompositionEnd.bind(this));

            console.log('扫码枪输入检测脚本已启动 (轻量级版本 v3.0)');
        }

        /**
         * 事件节流处理
         */
        throttleEvent(callback, delay = 100) {
            if (this.eventThrottle) return;
            this.eventThrottle = true;
            setTimeout(() => {
                this.eventThrottle = false;
                callback();
            }, delay);
        }

        /**
         * 检测是否为扫码枪输入
         */
        isScannerInput() {
            const currentTime = Date.now();
            const timeDiff = currentTime - this.lastInputTime;
            this.lastInputTime = currentTime;
            return timeDiff < this.scannerInputThreshold;
        }

        /**
         * 检测大写锁定状态
         */
        isCapsLockOn(event) {
            try {
                if (event.getModifierState) {
                    return event.getModifierState('CapsLock');
                }
            } catch (e) {
                console.warn('无法检测大写锁定状态:', e);
            }
            return false;
        }

        /**
         * 轻量级中文输入法检测
         */
        isChineseInputMethod(event) {
            // 简化检测逻辑，避免复杂判断
            return this.isComposing ||
                   (event.isComposing === true) ||
                   (event.keyCode === 229);
        }

        /**
         * 检测是否为输入框元素
         */
        isInputElement(element) {
            if (!element) return false;

            const tagName = element.tagName.toLowerCase();
            const inputTypes = ['text', 'password', 'search', 'url', 'email', 'tel'];

            return (tagName === 'input' && inputTypes.includes(element.type)) ||
                   tagName === 'textarea' ||
                   element.contentEditable === 'true';
        }

        /**
         * 轻量级事件阻止
         */
        lightPreventEvent(event, reason) {
            // 只使用preventDefault，避免stopPropagation导致的问题
            event.preventDefault();
            console.log(`事件已阻止: ${event.type}, 原因: ${reason}`);
            return false;
        }

        /**
         * 显示警告弹窗 (简化版)
         */
        showWarning(message, type) {
            // 防止重复弹窗和频繁弹窗
            if (this.warningCooldown) return;
            if (type === 'inputMethod' && this.isInputMethodWarningShown) return;
            if (type === 'capsLock' && this.isCapsLockWarningShown) return;

            this.warningCooldown = true;

            // 使用更简单的弹窗，避免复杂DOM操作
            const confirmed = confirm(`⚠️ 扫码枪输入错误\n\n${message}\n\n点击"确定"继续`);

            if (type === 'inputMethod') this.isInputMethodWarningShown = true;
            if (type === 'capsLock') this.isCapsLockWarningShown = true;

            // 设置冷却时间
            setTimeout(() => {
                this.warningCooldown = false;
                if (type === 'inputMethod') this.isInputMethodWarningShown = false;
                if (type === 'capsLock') this.isCapsLockWarningShown = false;
            }, 2000);

            console.log('显示警告:', message);
        }

        /**
         * 处理键盘按下事件 (简化版)
         */
        handleKeyDown(event) {
            // 事件节流，避免过度处理
            if (this.eventThrottle) return;

            if (!this.isInputElement(event.target)) return;

            if (event.key === 'Enter') {
                // 检查大写锁定
                if (this.isCapsLockOn(event)) {
                    this.throttleEvent(() => {
                        this.showWarning('检测到大写锁定已开启！\n请关闭大写锁定后重新扫码', 'capsLock');
                    });
                    return this.lightPreventEvent(event, '大写锁定开启');
                }

                // 检查IME状态
                if (this.isChineseInputMethod(event)) {
                    this.throttleEvent(() => {
                        this.showWarning('检测到中文输入法！\n请切换到英文输入法后重新扫码', 'inputMethod');
                    });
                    return this.lightPreventEvent(event, 'IME活跃状态');
                }
            }

            // 检测扫码枪输入时的状态
            if (this.isScannerInput()) {
                if (this.isCapsLockOn(event)) {
                    this.throttleEvent(() => {
                        this.showWarning('检测到大写锁定已开启！\n请关闭大写锁定后重新扫码', 'capsLock');
                    }, 200);
                }
                if (this.isChineseInputMethod(event)) {
                    this.throttleEvent(() => {
                        this.showWarning('检测到中文输入法！\n请切换到英文输入法后重新扫码', 'inputMethod');
                    }, 200);
                }
            }
        }

        /**
         * 处理输入法组合开始事件 (简化版)
         */
        handleCompositionStart(event) {
            if (!this.isInputElement(event.target)) return;

            this.isComposing = true;
            console.log('IME组合开始');

            // 延迟处理，避免阻塞
            setTimeout(() => {
                if (event.target && event.target.value) {
                    event.target.value = '';
                }
                this.throttleEvent(() => {
                    this.showWarning('检测到中文输入法！\n请切换到英文输入法后重新扫码', 'inputMethod');
                }, 300);
            }, 10);
        }

        /**
         * 处理输入法组合结束事件 (简化版)
         */
        handleCompositionEnd(event) {
            if (!this.isInputElement(event.target)) return;

            console.log('IME组合结束');

            // 延迟处理，避免阻塞
            setTimeout(() => {
                if (event.target && event.target.value) {
                    event.target.value = '';
                }
                this.isComposing = false;
            }, 50);
        }

        /**
         * 销毁监听器
         */
        destroy() {
            document.removeEventListener('keydown', this.handleKeyDown.bind(this));
            document.removeEventListener('compositionstart', this.handleCompositionStart.bind(this));
            document.removeEventListener('compositionend', this.handleCompositionEnd.bind(this));
            console.log('扫码枪输入检测脚本已停止 (轻量级版本)');
        }
    }

    // 等待DOM完全加载后初始化
    function initializeScript() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', function() {
                window.barcodeScannerHelperV3 = new BarcodeScannerHelperV3();
            });
        } else {
            window.barcodeScannerHelperV3 = new BarcodeScannerHelperV3();
        }
    }

    // 立即初始化
    initializeScript();

})();