// ==UserScript==
// @name         英科学院自动点击继续学习
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  在指定页面上自动点击“继续学习”按钮
// @author       WYF
// @match        https://intco.yunxuetang.cn/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/519504/%E8%8B%B1%E7%A7%91%E5%AD%A6%E9%99%A2%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%E7%BB%A7%E7%BB%AD%E5%AD%A6%E4%B9%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/519504/%E8%8B%B1%E7%A7%91%E5%AD%A6%E9%99%A2%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%E7%BB%A7%E7%BB%AD%E5%AD%A6%E4%B9%A0.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 定义一个函数来检查并点击 "继续学习" 按钮
    function clickContinueLearning() {
        const continueButton = document.querySelector('button.yxtf-button.yxtf-button--primary.yxtf-button--large span');
        if (continueButton && continueButton.textContent.includes("继续学习")) {
            console.log('Detected "继续学习" button. Clicking it...');
            continueButton.parentElement.click(); // 点击父元素 button
        } else {
            console.log('No "继续学习" button found.');
        }
    }

    // 设置每10秒运行一次检查
    const intervalCheck = setInterval(clickContinueLearning, 10000);

    // 页面关闭或跳转时清除定时器
    window.addEventListener('unload', function () {
        clearInterval(intervalCheck);
        console.log('Stopped monitoring "继续学习" button.');
    });

    console.log('Monitoring for "继续学习" button every 10 seconds on intco.yunxuetang.cn...');
})();
