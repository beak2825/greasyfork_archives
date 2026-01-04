// ==UserScript==
// @name         Speedtest.net Auto Runner
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Automatically runs speedtest and repeats
// @author       Henry Guo
// @match        https://www.speedtest.net/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/513659/Speedtestnet%20Auto%20Runner.user.js
// @updateURL https://update.greasyfork.org/scripts/513659/Speedtestnet%20Auto%20Runner.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const config = {
        initialDelay: 2000,    // 页面加载后等待时间（毫秒）
        resultDelay: 5000,     // 测试完成后等待时间（毫秒）
    };

    // 检查当前是否在结果页面
    function isResultPage() {
        return window.location.pathname.startsWith('/result/');
    }

    // 开始测速
    function startTest() {
        const startButton = document.querySelector('.js-start-test');
        if (startButton) {
            startButton.click();
            console.log('Speed test started');
            // 开始监控URL变化
            checkTestComplete();
        }
    }

    // 检查测试是否完成
    function checkTestComplete() {
        if (isResultPage()) {
            console.log('Test completed, waiting before next test...');
            setTimeout(() => {
                // 重新加载主页以开始新的测试
                window.location.href = '/';
            }, config.resultDelay);
        } else {
            // 如果测试还未完成，继续检查
            setTimeout(checkTestComplete, 1000);
        }
    }

    // 初始化函数
    function initialize() {
        // 如果当前在结果页面，等待后返回主页
        if (isResultPage()) {
            setTimeout(() => {
                window.location.href = '/';
            }, config.resultDelay);
            return;
        }

        // 等待页面加载完成后开始测试
        setTimeout(() => {
            startTest();
        }, config.initialDelay);
    }

    // 启动脚本
    initialize();
})();
