// ==UserScript==
// @name         起点中文网登录
// @namespace    https://github.com/ended_world/qidian-auto-login
// @version      2.0
// @license      MIT
// @description  在起点中文网PC版主页没有登录的时候自动点击登录按钮
// @author       ended_world
// @match        https://www.qidian.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/525461/%E8%B5%B7%E7%82%B9%E4%B8%AD%E6%96%87%E7%BD%91%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/525461/%E8%B5%B7%E7%82%B9%E4%B8%AD%E6%96%87%E7%BD%91%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ==================== 配置区 ====================
    const CONFIG = {
        USERNAME: 'ended_world',         // 你的用户名（用于精准检测）
        CHECK_INTERVAL: 2000,            // 状态检查间隔
        MAX_RETRY: 3,                    // 最大点击尝试次数
        COOLDOWN: 15 * 60 * 1000         // 15分钟冷却时间
    };

    // ==================== 核心逻辑 ====================
    let retryCount = 0;
    let checkTimer = null;

    // 精准登录状态检测
    function isLoggedIn() {
        // 方案1：检测用户名是否匹配
        const userEl = document.getElementById('user-name');
        const hasUser = userEl?.textContent?.includes(CONFIG.USERNAME);

        // 方案2：检测登录按钮文本
        const loginBtn = document.getElementById('login-btn');
        const isLoginText = loginBtn?.textContent?.trim() === '登录';

        return hasUser || !isLoginText;
    }

    // 安全点击方法
    function safeClick() {
        if (isLoggedIn() || retryCount >= CONFIG.MAX_RETRY) {
            clearInterval(checkTimer);
            return;
        }

        const loginBtn = document.getElementById('login-btn');
        if (loginBtn && loginBtn.textContent.trim() === '登录') {
            console.log('检测到有效登录按钮，触发点击');
            loginBtn.click();
            retryCount++;
            GM_setValue('lastClickTime', Date.now());
        }
    }

    // 冷却期检测
    function isInCooldown() {
        const lastClick = GM_getValue('lastClickTime', 0);
        return Date.now() - lastClick < CONFIG.COOL_DOWN;
    }

    // ==================== 主流程 ====================
    function init() {
        if (isInCooldown()) {
            console.log('处于冷却期，脚本暂停');
            return;
        }

        console.log('启动智能检测流程...');
        checkTimer = setInterval(safeClick, CONFIG.CHECK_INTERVAL);

        // 登录成功后停止检测
        const observer = new MutationObserver(() => {
            if (isLoggedIn()) {
                console.log('检测到登录成功，停止脚本');
                clearInterval(checkTimer);
                observer.disconnect();
            }
        });
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // 延迟启动防止干扰页面加载
    setTimeout(init, 3000);
})();