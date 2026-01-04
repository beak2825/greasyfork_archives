// ==UserScript==
// @name         Intercept Alerts and Enable Debugging
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Ticket booking bot with timing and CSP bypass
// @author       Scott
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @connect      localhost
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/515220/Intercept%20Alerts%20and%20Enable%20Debugging.user.js
// @updateURL https://update.greasyfork.org/scripts/515220/Intercept%20Alerts%20and%20Enable%20Debugging.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // 覆盖原生 alert 函数
    window.alert = function(message) {
        console.log("Intercepted alert: ", message);
        // 在控制台输出信息，而不弹出窗口
    };

    // 覆盖原生 confirm 函数
    window.confirm = function(message) {
        console.log("Intercepted confirm: ", message);
        return true; // 自动返回 true，模拟用户确认
    };

    // 覆盖原生 prompt 函数
    window.prompt = function(message, defaultResponse) {
        console.log("Intercepted prompt: ", message);
        return defaultResponse; // 自动返回默认响应
    };

    // 监控并显示 JavaScript 错误
    window.onerror = function(message, source, lineno, colno, error) {
        console.error("Error caught: ", message, " at ", lineno, ":", colno);
        // 可以在此处添加更多的处理逻辑
    };

    // 允许在调试时继续使用 F12
    document.addEventListener('keydown', function(event) {
        if (event.ctrlKey && event.key === 'u') {
            event.preventDefault(); // 防止 Ctrl + U 操作
        }
    });

})();
