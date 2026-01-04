// ==UserScript==
// @name         跳过弹窗提示 - 增强版
// @description  自动跳过所有类型的弹窗提示（alert、confirm、prompt），支持日志记录和自定义配置
// @namespace    http://sysaq.imu.edu.cn/
// @version      2025.10.19
// @author       Upgraded Version
// @match        http://sysaq.imu.edu.cn/*
// @match        http://labsra.scau.edu.cn/*
// @grant        none
// @license      MIT
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/451768/%E8%B7%B3%E8%BF%87%E5%BC%B9%E7%AA%97%E6%8F%90%E7%A4%BA%20-%20%E5%A2%9E%E5%BC%BA%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/451768/%E8%B7%B3%E8%BF%87%E5%BC%B9%E7%AA%97%E6%8F%90%E7%A4%BA%20-%20%E5%A2%9E%E5%BC%BA%E7%89%88.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ========== 配置选项 ==========
    const CONFIG = {
        enableLog: false,           // 是否在控制台记录被拦截的弹窗
        logPrefix: '[弹窗拦截]',    // 日志前缀
        confirmReturn: true,        // confirm 函数的返回值
        promptReturn: '',           // prompt 函数的返回值
        showNotification: false,    // 是否显示通知（右下角提示）
        notificationDuration: 2000  // 通知显示时长（毫秒）
    };

    // ========== 保存原始函数 ==========
    const originalAlert = window.alert;
    const originalConfirm = window.confirm;
    const originalPrompt = window.prompt;

    // ========== 统计信息 ==========
    const stats = {
        alertCount: 0,
        confirmCount: 0,
        promptCount: 0
    };

    // ========== 日志函数 ==========
    function log(type, message) {
        if (CONFIG.enableLog) {
            console.log(`${CONFIG.logPrefix} [${type}]`, message);
        }
    }

    // ========== 显示通知 ==========
    function showNotification(type) {
        if (!CONFIG.showNotification) return;

        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 10px 20px;
            border-radius: 5px;
            z-index: 999999;
            font-size: 14px;
            transition: opacity 0.3s;
        `;
        notification.textContent = `已拦截 ${type} 弹窗`;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => notification.remove(), 300);
        }, CONFIG.notificationDuration);
    }

    // ========== 覆盖 alert 函数 ==========
    window.alert = function(message) {
        stats.alertCount++;
        log('Alert', message || '(空消息)');
        showNotification('Alert');
        // 不做任何事，直接跳过
    };

    // ========== 覆盖 confirm 函数 ==========
    window.confirm = function(message) {
        stats.confirmCount++;
        log('Confirm', message || '(空消息)');
        showNotification('Confirm');
        return CONFIG.confirmReturn;
    };

    // ========== 覆盖 prompt 函数 ==========
    window.prompt = function(message, defaultValue) {
        stats.promptCount++;
        log('Prompt', `消息: ${message || '(空消息)'}, 默认值: ${defaultValue || '(无)'}`);
        showNotification('Prompt');
        return CONFIG.promptReturn;
    };

    // ========== 添加全局访问接口 ==========
    window.popupBlocker = {
        // 获取统计信息
        getStats: () => ({ ...stats }),
        
        // 重置统计
        resetStats: () => {
            stats.alertCount = 0;
            stats.confirmCount = 0;
            stats.promptCount = 0;
            console.log(`${CONFIG.logPrefix} 统计已重置`);
        },
        
        // 显示统计
        showStats: () => {
            console.log(`${CONFIG.logPrefix} 统计信息:`, {
                'Alert 拦截次数': stats.alertCount,
                'Confirm 拦截次数': stats.confirmCount,
                'Prompt 拦截次数': stats.promptCount,
                '总计': stats.alertCount + stats.confirmCount + stats.promptCount
            });
        },
        
        // 恢复原始函数
        restore: () => {
            window.alert = originalAlert;
            window.confirm = originalConfirm;
            window.prompt = originalPrompt;
            console.log(`${CONFIG.logPrefix} 已恢复原始弹窗函数`);
        },
        
        // 更新配置
        updateConfig: (newConfig) => {
            Object.assign(CONFIG, newConfig);
            console.log(`${CONFIG.logPrefix} 配置已更新`, CONFIG);
        },
        
        // 获取当前配置
        getConfig: () => ({ ...CONFIG })
    };

    // ========== 初始化提示 ==========
    console.log(`${CONFIG.logPrefix} 脚本已加载 v2025.10.19`);
    console.log(`${CONFIG.logPrefix} 使用 window.popupBlocker 访问控制接口`);
    console.log(`${CONFIG.logPrefix} 例如: window.popupBlocker.showStats() 查看统计`);

    // ========== 监听页面加载完成 ==========
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            log('Init', '页面加载完成，弹窗拦截已激活');
        });
    } else {
        log('Init', '脚本注入成功，弹窗拦截已激活');
    }

})();