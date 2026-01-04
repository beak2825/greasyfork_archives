// ==UserScript==
// @name         kimi清空历史记录
// @version      0.2
// @description  在历史记录页面右上角“清空历史记录”，点击后清空所有历史记录
// @author       Yu1978
// @match        https://kimi.moonshot.cn/*
// @grant        none
// @namespace https://greasyfork.org/users/1440235
// @downloadURL https://update.greasyfork.org/scripts/528130/kimi%E6%B8%85%E7%A9%BA%E5%8E%86%E5%8F%B2%E8%AE%B0%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/528130/kimi%E6%B8%85%E7%A9%BA%E5%8E%86%E5%8F%B2%E8%AE%B0%E5%BD%95.meta.js
// ==/UserScript==
(function() {
    'use strict';

    const startButton = document.createElement('button');
    startButton.textContent = '清空历史记录';
    // 设置按钮样式
    startButton.style.position = 'fixed';
    startButton.style.top = '15px'; // 距离顶部15px
    startButton.style.right = '15px'; // 距离右侧15px

    // 按钮外观样式
    startButton.style.backgroundColor = 'black'; // 黑色背景
    startButton.style.color = 'white'; // 白色文字
    startButton.style.fontSize = '16px'; // 文字大小
    startButton.style.fontWeight = 'bold'; // 文字加粗
    startButton.style.padding = '10px 20px'; // 内边距，左右更宽
    startButton.style.border = 'none'; // 去掉默认边框
    startButton.style.borderRadius = '30px'; // 两端圆形
    startButton.style.cursor = 'pointer'; // 鼠标悬浮时显示指针
    startButton.style.transition = 'background-color 0.3s ease'; // 添加平滑的颜色变化效果

    // 鼠标悬浮时的效果
    startButton.onmouseover = function() {
        startButton.style.backgroundColor = '#333'; // 鼠标悬浮时变暗
    };

    startButton.onmouseout = function() {
        startButton.style.backgroundColor = 'black'; // 鼠标移出时恢复原色
    };

    let intervalId = setInterval(() => {
        var targetDiv = document.querySelector('.history-modal.hole');
        if (targetDiv) {
            // 如果找到目标div，将按钮插入
            targetDiv.appendChild(startButton);
            clearInterval(intervalId); // 停止定时器
        }
    }, 1000); // 每隔1秒检查一次

    // 开始按钮点击事件处理函数
    startButton.addEventListener('click', async function() {
        // 获取所有 class 为 "delete" 的 span 元素
        const deleteSpans = document.querySelectorAll('span.delete');

        // 遍历所有 deleteSpan 元素
        for (const deleteSpan of deleteSpans) {
            if (deleteSpan) {
                // 点击当前的 delete span
                deleteSpan.click();

                // 等待10毫秒后再去查找并点击确认按钮
                await new Promise(resolve => setTimeout(resolve, 10));

                // 找到 class 为 "kimi-button btn-confirm" 的按钮并点击
                const confirmButton = document.querySelector('button.kimi-button.btn-confirm');
                if (confirmButton) {
                    confirmButton.click();
                }

                // 本次循环操作结束后，等待500毫秒开始下一次循环
                await new Promise(resolve => setTimeout(resolve, 500));
            }
        }
    });
})();