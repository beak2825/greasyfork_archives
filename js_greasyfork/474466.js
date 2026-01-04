// ==UserScript==
// @name         WP配套脚本
// @namespace    http://your-namespace.com
// @version      1.1
// @description  Extracts and collects download links from wp.karendes.top
// @author       九条可怜
// @match        *://wp.karendes.top/*
// @match        *://202.146.216.233:8848/*
// @grant        none
// @license      九条可怜
// @downloadURL https://update.greasyfork.org/scripts/474466/WP%E9%85%8D%E5%A5%97%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/474466/WP%E9%85%8D%E5%A5%97%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建一个按钮并添加到页面右侧
    var button = document.createElement('button');
    button.innerHTML = '一键下载';
    button.style.position = 'fixed';
    button.style.right = '10px';
    button.style.top = '50%';
    button.style.transform = 'translateY(-50%)';
    document.body.appendChild(button);

    // 创建一个输入框并添加到页面右侧
    var delayInput = document.createElement('input');
    delayInput.type = 'number';
    delayInput.style.position = 'fixed';
    delayInput.style.right = '10px';
    delayInput.style.top = '55%';
    delayInput.placeholder = '在此输入延迟(仅数字)';
    delayInput.style.transform = 'translateY(-50%)';
    document.body.appendChild(delayInput);

    // 创建一个按钮并添加到页面右侧
    var delayButton = document.createElement('button');
    delayButton.innerHTML = '修改延迟';
    delayButton.style.position = 'fixed';
    delayButton.style.right = '10px';
    delayButton.style.top = '58%';
    delayButton.style.transform = 'translateY(-50%)';
    document.body.appendChild(delayButton);

    // 全局延迟数值，默认为1400
    var globalDelay = localStorage.getItem('delay') || 1400;

    // 设置输入框的初始值为全局延迟数值
    delayInput.value = globalDelay;

    // 点击按钮时触发的函数
    button.onclick = function() {
        var downloadLinks = [];
        var downloadButtons = document.querySelectorAll('[onclick^="Download("]');

        // 定义一个延迟函数
        function delay(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }

        // 定义一个递归函数，用于处理下载按钮的点击
        async function processDownloadButtons(index) {
            if (index >= downloadButtons.length) {
                return; // 递归终止条件
            }

            var button = downloadButtons[index];

            // 模拟点击下载按钮
            button.click();

            // 等待一段时间，确保文件信息加载完成
            await delay(globalDelay);

            // 模拟点击发送到Aria2按钮
            var sendToAria2Button = document.querySelector('[data-bs-target="#SendToAria2"]');
            sendToAria2Button.click();

            // 等待一段时间，确保发送到Aria2完成
            await delay(globalDelay);

            // 模拟点击下载按钮
            var downloadButton = document.querySelector('[onclick="addUri()"]');
            downloadButton.click();

            // 等待一段时间，确保下载开始
            await delay(globalDelay);

            // 执行下一个文件的下载
            await processDownloadButtons(index + 1);
        }

        // 开始执行下载按钮的点击操作
        processDownloadButtons(0);
    };

    // 点击按钮时触发的函数
    delayButton.onclick = function() {
        var delayValue = delayInput.value;
        if (delayValue) {
            // 修改全局延迟数值
            globalDelay = parseInt(delayValue);
            // 保存延迟数值到localStorage
            localStorage.setItem('delay', globalDelay);
        }
    };
})();
