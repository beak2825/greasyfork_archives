// ==UserScript==
// @name         批量添加视频到合集
// @namespace    http://tampermonkey.net/
// @version      2025-03-31
// @description  搜索后，按快捷键 alt+z 开始添加，s 停止
// @author       You
// @match        https://member.bilibili.com/platform/upload-manager/ep
// @icon         https://www.bilibili.com/favicon.ico
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/531385/%E6%89%B9%E9%87%8F%E6%B7%BB%E5%8A%A0%E8%A7%86%E9%A2%91%E5%88%B0%E5%90%88%E9%9B%86.user.js
// @updateURL https://update.greasyfork.org/scripts/531385/%E6%89%B9%E9%87%8F%E6%B7%BB%E5%8A%A0%E8%A7%86%E9%A2%91%E5%88%B0%E5%90%88%E9%9B%86.meta.js
// ==/UserScript==

GM_addStyle(`
    .title-text-content {
        overflow: visible !important;
    }

    .title-icon {
        visibility: hidden !important;
    }
`);

(function() {
    'use strict';
    // Your code here...

    let isRunning = false; // 标志位，控制是否继续运行

    document.addEventListener('keydown', function (event) {
        // 按下 "alt+z" 键启动逻辑
        if (event.altKey && event.key === 'z') {
            if (isRunning) {
                console.log('操作已在运行中');
                return; // 防止重复启动
            }

            isRunning = true; // 设置为运行状态
            const container = document.querySelector('.ep-select-box-item'); // 滚动容器
            const height = document.querySelector('.ep-select-box-item-all')?.offsetHeight || 0; // 单个元素高度
            if (!container || height === 0) {
                console.error('未找到滚动容器或元素高度为 0');
                isRunning = false; // 结束运行
                return;
            }

            let deleteFinished = false;
            let checkCount = 0;

            // 定义一个函数来处理滚动和操作
            function processNext() {
                if (!isRunning) {
                    console.log('操作已停止');
                    return; // 如果标志位为 false，停止递归
                }

                if (!deleteFinished) {
                    // 删除已禁用的元素
                    const disabledElement = document.querySelector('.ep-select-box-item-all-disabled');
                    if (disabledElement) {
                        disabledElement.remove(); // 删除元素
                    } else {
                        console.log('所有禁用元素已删除');
                        deleteFinished = true;
                    }
                } else {
                    // 查找未勾选的复选框
                    const checkbox = document.querySelector('.icon-checkbox');
                    if (checkbox && checkCount < 50) {
                        checkbox.click(); // 点击勾选
                        checkCount++;
                    } else {
                        isRunning = false; // 停止运行
                        console.log('勾选至上限,操作已停止');
                        return;
                    }
                }

                // 滚动到下一个元素
                container.scrollBy({ top: height, behavior: 'smooth' });

                // 递归调用，处理下一个元素
                setTimeout(processNext, 300); // 延迟 300ms，等待滚动完成
            }

            // 开始处理
            processNext();
        }

        // 按下 "S" 键停止逻辑
        if (event.key === 's') {
            isRunning = false; // 设置标志位为 false，停止运行
            console.log('操作已停止');
        }
    });


})();