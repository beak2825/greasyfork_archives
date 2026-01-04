// ==UserScript==
// @name         Irys Click - prod
// @namespace    http://tampermonkey.net/
// @version      2025-07-10
// @description  Irys auto click
// @author       You
// @match        https://bitomokx.irys.xyz/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=irys.xyz
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/542178/Irys%20Click%20-%20prod.user.js
// @updateURL https://update.greasyfork.org/scripts/542178/Irys%20Click%20-%20prod.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ===== 时间配置 =====
    const FIRST_DELAY = 10000;         // 首次检测延迟（毫秒）
    const CHECK_INTERVAL = 2000;      // 检查点击间隔（毫秒）
    // ====================

    // 日志封装，带时间戳和前缀
    function log(msg) {
        console.log(`[AutoClick][${new Date().toLocaleTimeString()}] ${msg}`);
    }

    // 时间格式化辅助函数（毫秒转"X分钟Y秒"）
    function formatMs(ms) {
        const min = Math.floor(ms / 60000);
        const sec = Math.floor((ms % 60000) / 1000);
        if (min && sec) return `${min}分钟${sec}秒`;
        if (min) return `${min}分钟`;
        if (sec) return `${sec}秒`;
        return `${ms}毫秒`;
    }

    // 检查并点击按钮
    function checkAndClick() {
        try {
            // 1. 找到目标 button
            const btn = document.querySelector('button.disabled\\:opacity-50.disabled\\:cursor-not-allowed.cursor-pointer');
            if (!btn) {
                log('未找到目标按钮');
                return;
            }
            // 3. 如果有同级div，则点击connect-toggle-button
            if (btn.disabled) {
                log(`按钮禁用，${formatMs(CHECK_INTERVAL)}后再次检测`);
            } else {
                log('按钮启用，点击按钮');
                btn.click();
            }
        } finally {
            setTimeout(checkAndClick, CHECK_INTERVAL);
        }
    }

    // 启动首次检测
    function setupFirstCheck() {
        window.addEventListener('load', function() {
            log(`${formatMs(FIRST_DELAY)}后开始执行`);
            setTimeout(checkAndClick, FIRST_DELAY);
        });
    }

    // 主入口
    function main() {
        log('脚本启动...');
        setupFirstCheck();
    }

    main();
})();