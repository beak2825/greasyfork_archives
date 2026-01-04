// ==UserScript==
// @name         🏆 AWS IAM Identity Center (SSO) 自动确认
// @namespace    https://github.com/AlliotTech/aws-sso-confirm-helper
// @version      0.0.1
// @description  🎯 [健壮、安全、高效] 专为AWS IAM Identity Center (SSO) 设计的自动确认助手。
// @author       AlliotTech
// @homepage     https://github.com/AlliotTech/aws-sso-confirm-helper
// @match        https://*.awsapps.com/start/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        window.close
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/544806/%F0%9F%8F%86%20AWS%20IAM%20Identity%20Center%20%28SSO%29%20%E8%87%AA%E5%8A%A8%E7%A1%AE%E8%AE%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/544806/%F0%9F%8F%86%20AWS%20IAM%20Identity%20Center%20%28SSO%29%20%E8%87%AA%E5%8A%A8%E7%A1%AE%E8%AE%A4.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 存储键 ---
    const STORAGE_KEY_CLOSE_TAB = 'awsSsoHelper_shouldCloseTab';

    // --- 配置中心 ---
    const CONFIG = {
        // 定义需要按顺序自动点击的按钮
        CLICK_STEPS: [
            { name: 'Device Confirmation Button', selector: '#cli_verification_btn' },
            { name: 'Allow Access Button', selector: '[data-testid="allow-access-button"]' },
        ],
        // 最大等待时间（毫秒），防止脚本在异常情况下无限运行
        GLOBAL_TIMEOUT: 20000,
    };

    // --- 可配置选项 ---
    const OPTIONS = {
        // 是否在完成后自动关闭标签页。通过油猴菜单动态修改此设置。
        CLOSE_TAB_ON_FINISH: GM_getValue(STORAGE_KEY_CLOSE_TAB, false), // 默认为 false
        // 自动关闭前的延迟时间（毫秒）
        CLOSE_DELAY: 2000,
    };

    /**
     * 注册一个油猴菜单命令，用于切换自动关闭功能的开关
     */
    function registerMenuCommand() {
        const currentSetting = GM_getValue(STORAGE_KEY_CLOSE_TAB, false);
        const menuText = `${currentSetting ? '✅' : '❌'} 完成后自动关闭标签页`;

        GM_registerMenuCommand(menuText, () => {
            const newSetting = !currentSetting;
            GM_setValue(STORAGE_KEY_CLOSE_TAB, newSetting);
            alert(`完成后自动关闭标签页」已${newSetting ? '启用' : '禁用'}。`);
        });
    }

    /**
     * @class AwsSsoAutoClicker
     * @description 一个健壮的、基于 MutationObserver 的自动点击器，
     *              用于处理 AWS SSO 的多步骤确认流程。
     */
    class AwsSsoAutoClicker {
        constructor() {
            this.currentStepIndex = 0;
            this.observer = null;
            this.timeoutId = null;
            this.isStopped = false;

            this.log('脚本初始化...');
            this.start();
        }

        start() {
            if (window.self !== window.top) {
                this.log('检测到在iframe中运行，出于安全原因，脚本已停止。', 'warn');
                return;
            }

            this.timeoutId = setTimeout(() => {
                this.log(`全局超时 (${CONFIG.GLOBAL_TIMEOUT / 1000}秒)，脚本停止。`, 'warn');
                this.stop();
            }, CONFIG.GLOBAL_TIMEOUT);

            this.observer = new MutationObserver(() => this.checkForButtons());
            this.observer.observe(document.body, { childList: true, subtree: true });

            this.log('MutationObserver 已启动，正在监控页面变化...');
            this.checkForButtons();
        }

        checkForButtons() {
            if (this.isStopped || this.currentStepIndex >= CONFIG.CLICK_STEPS.length) {
                return;
            }

            const stepConfig = CONFIG.CLICK_STEPS[this.currentStepIndex];
            const button = document.querySelector(stepConfig.selector);

            if (button && !button.disabled) {
                this.log(`步骤 ${this.currentStepIndex + 1}: 找到可点击按钮 "${stepConfig.name}"`);
                this.observer.disconnect(); // 暂停观察，防止点击触发的DOM变化导致重入

                setTimeout(() => {
                    try {
                        this.log(`正在点击 "${stepConfig.name}"...`);
                        button.click();
                        this.currentStepIndex++;

                        if (this.currentStepIndex >= CONFIG.CLICK_STEPS.length) {
                            this.log('所有步骤已成功完成！', 'info');
                            if (OPTIONS.CLOSE_TAB_ON_FINISH) {
                                this.handleAutoClose();
                            } else {
                                this.log('自动关闭功能未启用。脚本正常停止。');
                                this.stop();
                            }
                        } else {
                            this.log('准备进入下一步...');
                            this.observer.observe(document.body, { childList: true, subtree: true });
                        }
                    } catch (error) {
                        this.log(`点击按钮时发生错误: ${error.message}`, 'error');
                        this.stop();
                    }
                }, 100);
            }
        }

        /**
         * 处理自动关闭逻辑
         */
        handleAutoClose() {
            this.log(`自动关闭已启用，将在 ${OPTIONS.CLOSE_DELAY / 1000} 秒后关闭此标签页...`, 'info');
            setTimeout(() => {
                this.log('正在关闭标签页...');
                this.stop(); // 确保在关闭前清理所有资源
                window.close();
            }, OPTIONS.CLOSE_DELAY);
        }

        stop() {
            if (this.isStopped) return;
            this.isStopped = true;

            if (this.observer) this.observer.disconnect();
            if (this.timeoutId) clearTimeout(this.timeoutId);

            this.log('脚本已停止，资源已清理。');
        }

        log(message, type = 'log') {
            const prefix = '%c[AWS Auto-Confirm]';
            const style = 'color: #FF9900; font-weight: bold;';
            console[type](prefix, style, message);
        }
    }

    // --- 启动应用 ---
    registerMenuCommand();
    new AwsSsoAutoClicker();

})();