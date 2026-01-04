// ==UserScript==
// @name         抖音创作者中心批量删除作品
// @namespace    https://zhangzifan.com
// @version      1.0
// @description  抖音创作者中心，批量删除作品。
// @author       Fanly
// @match        https://creator.douyin.com/creator-micro/content/manage
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/507068/%E6%8A%96%E9%9F%B3%E5%88%9B%E4%BD%9C%E8%80%85%E4%B8%AD%E5%BF%83%E6%89%B9%E9%87%8F%E5%88%A0%E9%99%A4%E4%BD%9C%E5%93%81.user.js
// @updateURL https://update.greasyfork.org/scripts/507068/%E6%8A%96%E9%9F%B3%E5%88%9B%E4%BD%9C%E8%80%85%E4%B8%AD%E5%BF%83%E6%89%B9%E9%87%8F%E5%88%A0%E9%99%A4%E4%BD%9C%E5%93%81.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 页面加载完成后执行
    window.addEventListener('load', () => {
        console.log('页面加载完成');

        // 定义监控的间隔时间
        const CHECK_INTERVAL = 1000; // 1秒

        let monitorInterval;

        // 启动监控
        function startMonitoring() {
            monitorInterval = setInterval(() => {
                const contentBody = document.querySelector('[class^="content-body-"]');
                if (contentBody && contentBody.textContent.trim() !== '') {
                    console.log('目标内容加载完成');
                    clearInterval(monitorInterval); // 停止监控
                    clickDeleteButton(); // 执行删除操作
                }
            }, CHECK_INTERVAL);
        }

        // 点击第一个“删除作品”按钮
        function clickDeleteButton() {
            // 查找包含“删除作品”文本的所有 span
            const deleteButtonSpans = Array.from(document.querySelectorAll('span'))
                .filter(span => span.textContent.trim() === '删除作品');

            if (deleteButtonSpans.length > 0) {
                // 点击第一个“删除作品”按钮的父级 div
                const firstDeleteButtonSpan = deleteButtonSpans[0];
                const parentDiv = firstDeleteButtonSpan.closest('div');
                if (parentDiv) {
                    parentDiv.click();
                    console.log('已点击第一个“删除作品”按钮');
                    setTimeout(() => {
                        clickConfirmButton();
                        //startMonitoring(); // 删除操作完成后重新启动监控
                    }, 1000); // 等待1秒后点击确认按钮
                } else {
                    console.error('未找到“删除作品”按钮的父级 div');
                }
            } else {
                console.error('未找到文本为“删除作品”的 span');
            }
        }

        // 点击确认按钮
        function clickConfirmButton() {
            // 查找弹窗中的“确定”按钮
            const confirmButton = document.querySelector('.semi-modal-body button[class*="primary-"]');
            console.error(confirmButton.innerText);
            if (confirmButton) {
                confirmButton.click();
                console.log('已点击“确定”按钮');
                checkDeleteSuccess();
            } else {
                console.error('未找到按钮文本为“确定”的按钮');
            }
        }

        // 检查删除是否成功
        function checkDeleteSuccess() {
            const successMessage = '删除成功'; // 这里需要根据实际情况调整成功的标志
            const checkInterval = setInterval(() => {
                if (document.body.innerText.includes(successMessage)) {
                    console.log('删除成功，恢复监控');
                    clearInterval(checkInterval); // 停止检查
                    startMonitoring(); // 恢复监控
                }
            }, CHECK_INTERVAL);
        }

        // 启动初始监控
        startMonitoring();
    });
})();