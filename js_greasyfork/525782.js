// ==UserScript==
// @name         DeepSeek 自动重试与成功检测脚本
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  自动检测并点击 DeepSeek 失败图标“重新生成”以重试生成，同时在成功生成后停止脚本
// @author       您的名字
// @match        https://chat.deepseek.com/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/525782/DeepSeek%20%E8%87%AA%E5%8A%A8%E9%87%8D%E8%AF%95%E4%B8%8E%E6%88%90%E5%8A%9F%E6%A3%80%E6%B5%8B%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/525782/DeepSeek%20%E8%87%AA%E5%8A%A8%E9%87%8D%E8%AF%95%E4%B8%8E%E6%88%90%E5%8A%9F%E6%A3%80%E6%B5%8B%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 检查间隔时间（毫秒）
    const intervalTime = 3000; // 3秒

    // 失败图标的选择器（基于可点击的父元素）
    const failureIconParentSelector = '#root > div > div.c3ecdb44 > div.f2eea526 > div > div.b83ee326 > div > div > div.dad65929 > div.f9bf7997.d7dc56a8.c05b5566 > div.ds-flex > div.ds-flex.abe97156 > div:nth-child(2)';

    // 成功生成的元素选择器（请根据实际情况修改）
    const successSelector = '#generation-success'; // 例如：'#generation-success'

    // 最大重试次数（可选）
    const maxRetries = 10;
    let retryCount = 0;

    // 点击失败图标的父元素函数
    function clickFailureIcon() {
        const retryButton = document.querySelector(failureIconParentSelector);
        if (retryButton) {
            console.log(`检测到“重新生成”按钮，正在点击以重试... (${retryCount + 1}/${maxRetries})`);
            retryButton.click();
            retryCount++;

            if (retryCount >= maxRetries) {
                console.log('已达到最大重试次数，停止脚本。');
                clearInterval(intervalId);
            }
        }
    }

    // 检查是否成功生成并点击失败图标
    function checkAndClick() {
        // 检查是否已经成功生成
        if (successSelector) {
            const successElement = document.querySelector(successSelector);
            if (successElement) {
                console.log('生成成功，停止自动重试脚本。');
                clearInterval(intervalId); // 停止定时器
                return;
            }
        }

        // 检查失败图标并点击
        clickFailureIcon();
    }

    // 设置定时器
    const intervalId = setInterval(checkAndClick, intervalTime);

})();