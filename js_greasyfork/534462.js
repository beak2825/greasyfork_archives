// ==UserScript==
// @name         gooboo刷新神秘碎片
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  检测指定图标是否存在，不存在则自动刷新页面
// @author       YourName
// @match        *://*/gooboo/*
// @match        https://gooboo.g8hh.com.cn/*
// @grant        unsafeWindow
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/534462/gooboo%E5%88%B7%E6%96%B0%E7%A5%9E%E7%A7%98%E7%A2%8E%E7%89%87.user.js
// @updateURL https://update.greasyfork.org/scripts/534462/gooboo%E5%88%B7%E6%96%B0%E7%A5%9E%E7%A7%98%E7%A2%8E%E7%89%87.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置参数 ========================================
    const config = {
        iconSelector: '.mdi-billiards-rack', // 修改为目标图标的选择器
        checkInterval: 500,          // 检查间隔（毫秒）
        maxRetries: 20,               // 最大重试次数（可选防护）
        debugMode: true               // 调试日志开关
    };

    // 核心逻辑 ========================================
    let checkCount = 0;

    const checkIcon = () => {
        const targetElement = document.querySelector(config.iconSelector);
        log(`第 ${++checkCount} 次检查 - 目标元素: ${targetElement ? '存在' : '不存在'}`);

        // 元素存在时执行
        if (targetElement) {
            log(' 检测到目标图标，停止刷新');
            clearInterval(checkTimer);
            // 此处可添加检测到元素后的操作
            return;
        }

        // 防护机制：达到最大重试次数
        if (config.maxRetries && checkCount >= config.maxRetries) {
            log(' 达到最大重试次数，停止刷新');
            clearInterval(checkTimer);
            return;
        }

        // 执行刷新
        log(' 未检测到目标图标，执行刷新');
        setTimeout(() => location.reload(), 1000);
    };

    // 工具函数 ========================================
    const log = (...args) => {
        if (config.debugMode) console.log('[图标检测]', ...args);
    };

    // 启动检测 ========================================
    log('脚本启动，配置参数:', config);
    const checkTimer = setInterval(checkIcon, config.checkInterval);
})();
