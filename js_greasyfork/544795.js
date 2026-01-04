// ==UserScript==
// @name         🏆 LINUX DO OAuth 自动点击 - 极简版
// @namespace    https://github.com/TechnologyStar/linuxdo-oauth-helper
// @version      1.0.0
// @description  🎯 专为LINUX DO OAuth设计的自动点击助手 - 极简版
// @author       Premium UI Designer
// @match        https://connect.linux.do/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/544795/%F0%9F%8F%86%20LINUX%20DO%20OAuth%20%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%20-%20%E6%9E%81%E7%AE%80%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/544795/%F0%9F%8F%86%20LINUX%20DO%20OAuth%20%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%20-%20%E6%9E%81%E7%AE%80%E7%89%88.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置
    const CONFIG = {
        selectors: {
            approveButton: 'a.bg-red-500[href*="/oauth2/approve/"]'
        },
        autoClickDelay: 0 // 0秒延迟
    };

    // 日志工具
    function log(message) {
        console.log(`%c[OAuth自动点击] ${message}`, 'color: #10B981', new Date().toLocaleTimeString());
    }

    // 自动点击管理器
    class AutoClickManager {
        constructor() {
            this.hasClicked = false;
            log('自动点击管理器启动');
            this.init();
        }

        init() {
            setTimeout(() => {
                this.attemptAutoClick();
            }, CONFIG.autoClickDelay);
        }

        attemptAutoClick() {
            if (this.hasClicked) return;

            const approveButton = document.querySelector(CONFIG.selectors.approveButton);
            if (!approveButton) {
                log('未找到授权按钮');
                return;
            }

            log('找到授权按钮，准备自动点击');
            this.hasClicked = true;

            setTimeout(() => {
                log(`正在跳转到: ${approveButton.href}`);
                window.location.href = approveButton.href;
            }, 300);
        }
    }

    // 启动脚本
    function startScript() {
        log('OAuth自动点击助手启动');

        // 只在OAuth页面激活
        if (!window.location.pathname.includes('/oauth2/')) {
            log('当前不是OAuth页面，脚本待机');
            return;
        }

        log('检测到OAuth页面，启动自动点击功能');

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => new AutoClickManager());
        } else {
            new AutoClickManager();
        }
    }

    startScript();
})();
