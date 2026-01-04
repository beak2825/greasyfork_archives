// ==UserScript==
// @name         自动登录及状态检测脚本
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  自动完成网络选择、登录操作，并通过注销按钮检测登录状态
// @author       YourName
// @match        http://10.150.252.2/*
// @grant        none
// @license      MIT; https://opensource.org/licenses/MIT
// @downloadURL https://update.greasyfork.org/scripts/528143/%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95%E5%8F%8A%E7%8A%B6%E6%80%81%E6%A3%80%E6%B5%8B%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/528143/%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95%E5%8F%8A%E7%8A%B6%E6%80%81%E6%A3%80%E6%B5%8B%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置参数
    const config = {
        targetValue: '@chinanet',  // 电信选项的value
        maxRetry: 15,              // 最大重试次数
        retryInterval: 800,        // 重试间隔(毫秒)
        logoutBtnId: 'logout'      // 注销按钮ID
    };

    let retryCount = 0;

    // 主操作流程
    function automateProcess() {
        const select = document.getElementById('domain');
        const loginBtn = document.getElementById('login-account');

        // 第一阶段：设置网络选项
        if (select && select.value !== config.targetValue) {
            select.value = config.targetValue;
            select.dispatchEvent(new Event('change'));
            console.log('网络选项已设置为电信');
        }

        // 第二阶段：触发登录操作
        if (loginBtn) {
            loginBtn.click();
            console.log('已触发登录操作');
            startStatusMonitoring();
        } else if (retryCount++ < config.maxRetry) {
            console.log(`正在重试 (${retryCount}/${config.maxRetry})`);
            setTimeout(automateProcess, config.retryInterval);
        } else {
            console.error('操作失败：超过最大重试次数');
        }
    }

    // 登录状态监测
    function startStatusMonitoring() {
        const logoutBtn = document.getElementById(config.logoutBtnId);
        if (logoutBtn) {
            showSuccessAlert();
            observeLogoutButton(logoutBtn);
        } else if (retryCount++ < config.maxRetry) {
            setTimeout(startStatusMonitoring, config.retryInterval);
        }
    }

    // 显示成功提示
    function showSuccessAlert() {
        const alertBox = document.createElement('div');
        alertBox.style = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 25px;
            background: #4CAF50;
            color: white;
            border-radius: 5px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            z-index: 9999;
        `;
        alertBox.textContent = '✅ 登录成功！';
        document.body.appendChild(alertBox);

        // 5秒后自动消失
        setTimeout(() => {
            alertBox.remove();
        }, 5000);
    }

    // 持续观察注销按钮（防止SPA场景）
    function observeLogoutButton(targetNode) {
        const observer = new MutationObserver(() => {
            if (!document.getElementById(config.logoutBtnId)) {
                console.log('检测到用户已注销');
                observer.disconnect();
            }
        });

        observer.observe(targetNode.parentNode, {
            childList: true,
            subtree: true
        });
    }

    // 启动脚本
    window.addEventListener('load', automateProcess);
    setTimeout(automateProcess, 1000);
})();
