// ==UserScript==
// @name        iyuu 辅种 qBittorrent 和 Transmission 自动开始任务
// @namespace   Violentmonkey Scripts
// @include     *
// @grant       none
// @version     1.2
// @description 2024/7/5 14:08:26
// @downloadURL https://update.greasyfork.org/scripts/492812/iyuu%20%E8%BE%85%E7%A7%8D%20qBittorrent%20%E5%92%8C%20Transmission%20%E8%87%AA%E5%8A%A8%E5%BC%80%E5%A7%8B%E4%BB%BB%E5%8A%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/492812/iyuu%20%E8%BE%85%E7%A7%8D%20qBittorrent%20%E5%92%8C%20Transmission%20%E8%87%AA%E5%8A%A8%E5%BC%80%E5%A7%8B%E4%BB%BB%E5%8A%A1.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function clickContinue() {
        // 处理 qBittorrent
        processQbittorrent();
        // 处理 Transmission
        processTransmission();
    }

    function processQbittorrent() {
        // 检测状态为"完成"的项并模拟点击
        var completedRows = document.querySelectorAll('td[title="完成"]');
        completedRows.forEach(row => {
            simulateClick(row);
        });

        // 检测状态为"暂停"，且完成度大于99%的项
        var pausedRows = document.querySelectorAll('td[title="暂停"]');
        pausedRows.forEach(row => {
            // 寻找完成度元素
            var progressBar = row.closest('tr').querySelector('.progressbar_dark');
            if (progressBar) {
                // 获取完成度百分比
                var percentage = parseFloat(progressBar.textContent);
                if (percentage > 99) {
                    // 当完成度大于99%时，模拟点击
                    simulateClick(row);
                }
            }
        });
    }

    function processTransmission() {
        // 检测状态为"已暂停"的项
        var pausedRows = document.querySelectorAll('div.td[style*="width: 80px;"] > div');
        pausedRows.forEach(row => {
            if (row.textContent.trim() === "已暂停") {
                // 寻找完成度元素
                var progressBar = row.closest('.tr').querySelector('.progressbar.white-outline > div:nth-child(1)');
                if (progressBar) {
                    // 获取完成度百分比
                    var percentage = parseFloat(progressBar.textContent);
                    if (percentage > 99) {
                        // 当完成度大于99%时，模拟点击
                        simulateClick(row);
                    }
                }
            }
        });
    }

    function simulateClick(element) {
        // 模拟点击事件
        var clickEvent = new MouseEvent("click", {
            "view": window,
            "bubbles": true,
            "cancelable": false
        });
        element.dispatchEvent(clickEvent); // 模拟点击项

        // 查找并点击对应的"继续"按钮
        var continueButton = document.querySelector('img.mochaToolButton[title="继续"]');
        if (continueButton) {
            continueButton.click();
        } else {
            // 如果在 Transmission 中
            simulateF3KeyPress();
        }
    }

    function simulateF3KeyPress() {
        var targetElement = document.activeElement || document.body;
        var f3KeyDown = new KeyboardEvent('keydown', {
            key: 'F3',
            code: 'F3',
            keyCode: 114,
            which: 114,
            bubbles: true,
            cancelable: true
        });
        var f3KeyUp = new KeyboardEvent('keyup', {
            key: 'F3',
            code: 'F3',
            keyCode: 114,
            which: 114,
            bubbles: true,
            cancelable: true
        });
        targetElement.dispatchEvent(f3KeyDown);
        targetElement.dispatchEvent(f3KeyUp);
    }

    setInterval(clickContinue, 5000); // 每5秒执行一次操作
})();
