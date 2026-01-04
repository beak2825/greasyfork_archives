// ==UserScript==
// @name         Follow Auto Click - prod
// @namespace    http://tampermonkey.net/
// @version      2025-06-25 01
// @description  Follow website automatic click
// @author       Skye
// @match        https://app.follow.is
// @icon         https://www.google.com/s2/favicons?sz=64&domain=app.follow.is
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/522422/Follow%20Auto%20Click%20-%20prod.user.js
// @updateURL https://update.greasyfork.org/scripts/522422/Follow%20Auto%20Click%20-%20prod.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 添加全局执行标记
    if (window._autoClickScriptRunning) {
        console.log('[Follow自动点击] 脚本已在运行中，停止重复执行');
        return;
    }
    window._autoClickScriptRunning = true;

    // 配置参数
    const CONFIG = {
        initialDelay: 12000,// 初始延迟时间
        clickInterval: 3000,// 点击间隔时间
        cycleInterval: 60000,// 循环间隔时间（改为1分钟）
        maxCycles: 3,// 最大循环轮次
        currentCycle: 0,// 当前轮次计数
        debug: true // 是否启用详细日志
    };

    // 日志函数
    const log = (message, type = 'info') => {
        if (!CONFIG.debug && type === 'debug') return;
        console.log(`[Follow自动点击] ${message}`);
    };

    // 安全的元素点击函数
    const safeClick = (element) => {
        try {
            if (element && typeof element.click === 'function') {
                element.click();
                return true;
            }
        } catch (error) {
            log(`点击失败: ${error.message}`, 'error');
        }
        return false;
    };

    function processButtons(buttons, index) {
        if (!buttons || index >= buttons.length) {
            CONFIG.currentCycle++;
            log(`完成第 ${CONFIG.currentCycle}/${CONFIG.maxCycles} 轮`);

            if (CONFIG.currentCycle >= CONFIG.maxCycles) {
                log('已完成所有轮次，脚本结束');
                return;
            }

            log(`等待 ${CONFIG.cycleInterval/1000} 秒后开始下一轮...`);
            setTimeout(() => processButtons(buttons, 0), CONFIG.cycleInterval);
            return;
        }

        if (safeClick(buttons[index])) {
            log(`点击了第 ${index + 1}/${buttons.length} 个按钮`, 'debug');
            setTimeout(() => handleFeedsArea(buttons, index), CONFIG.clickInterval);
        } else {
            // 如果点击失败，继续处理下一个
            setTimeout(() => processButtons(buttons, index + 1), CONFIG.clickInterval);
        }
    }

    function handleFeedsArea(buttons, index) {
        const feedsArea = document.getElementById('feeds-area');
        const divsToClick = Array.from(feedsArea?.querySelectorAll('div[tabindex="-1"]') || []);

        if (!divsToClick.length) {
            log('未找到目标元素，继续下一个', 'debug');
            setTimeout(() => processButtons(buttons, index + 1), CONFIG.clickInterval);
            return;
        }

        let currentDivIndex = 0;

        function processNextFeedsDiv() {
            if (currentDivIndex >= divsToClick.length) {
                log(`完成所有 ${divsToClick.length} 个feeds区域元素的处理`, 'debug');
                setTimeout(() => processButtons(buttons, index + 1), CONFIG.clickInterval);
                return;
            }

            if (safeClick(divsToClick[currentDivIndex])) {
                log(`点击第 ${currentDivIndex + 1}/${divsToClick.length} 个feeds区域元素`, 'debug');
                // 点击后等待处理完子元素再继续
                setTimeout(() => {
                    clickNextDivs(buttons, index, () => {
                        currentDivIndex++;
                        setTimeout(processNextFeedsDiv, CONFIG.clickInterval);
                    });
                }, CONFIG.clickInterval);
            } else {
                currentDivIndex++;
                setTimeout(processNextFeedsDiv, CONFIG.clickInterval);
            }
        }

        processNextFeedsDiv();
    }

    function clickNextDivs(buttons, index, callback) {
        const nextDivs = Array.from(document.querySelectorAll('div[data-entry-id]'));
        let currentIndex = 0;

        function clickNext() {
            if (currentIndex >= nextDivs.length) {
                log(`完成 ${currentIndex} 个子元素的点击`, 'debug');
                callback(); // 处理完所有子元素后调用回调
                return;
            }

            const firstChildDiv = nextDivs[currentIndex].querySelector('div');
            if (safeClick(firstChildDiv)) {
                log(`点击第 ${currentIndex + 1} 个子元素`, 'debug');
            }

            currentIndex++;
            setTimeout(clickNext, CONFIG.clickInterval);
        }

        clickNext();
    }

    // 启动脚本
    log('脚本已启动，等待初始延迟...');
    setTimeout(() => {
        const parentDiv = document.querySelector('div.flex.w-full');
        if (!parentDiv) {
            log('未找到目标容器，脚本终止');
            return;
        }

        const buttons = parentDiv.querySelectorAll('button');
        log(`找到 ${buttons.length} 个按钮，开始处理`);
        processButtons(buttons, 0);
    }, CONFIG.initialDelay);

})();