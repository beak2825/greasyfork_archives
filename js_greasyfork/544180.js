// ==UserScript==
// @name         洛曦-便捷助手
// @namespace    https://greasyfork.org/scripts/
// @version      1.0.0
// @description  自用脚本
// @author       Love丶伊卡洛斯
// @match        https://member.bilibili.com/platform/upload-manager/ep
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/544180/%E6%B4%9B%E6%9B%A6-%E4%BE%BF%E6%8D%B7%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/544180/%E6%B4%9B%E6%9B%A6-%E4%BE%BF%E6%8D%B7%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    async function HeJiFuZhiTiJiaoBtn() {
        async function getElementWithRetry(selector, attempts = 0, maxAttempts = 999999, delay = 2000) {
            let element;
            while (attempts < maxAttempts && !(element = document.querySelector(selector))) {
                attempts++;
                console.log(`尝试次数: ${attempts}, 未能找到元素 '${selector}', 等待 ${delay}ms 后重试...`);
                await new Promise(resolve => setTimeout(resolve, delay));
            }
            return element;
        }

        // 尝试获取要复制的“立即提交”按钮元素，并使用重试逻辑
        const submitButton = await getElementWithRetry('.ep-button-group .ep-button-primary');

        if (!submitButton) {
            console.error('达到最大尝试次数，仍未找到“立即提交”按钮');
            return;
        }

        // 克隆该按钮，参数 true 表示深拷贝，即包括其子节点
        const clonedSubmitButton = submitButton.cloneNode(true);

        // 获取目标 div 元素，并使用重试逻辑
        let targetDiv = await getElementWithRetry('.ep-edit-section-list-nav');

        function insertClonedButton(targetDiv) {
            // 移除克隆出来的按钮上的所有内联样式（如果不需要保留原始样式的话）
            // clonedSubmitButton.removeAttribute('style');

            // 将克隆的按钮插入到目标 div 中，这里我们选择在添加视频按钮之前插入
            const insertBeforeElement = targetDiv.querySelector('.ep-button-primary');
            if (insertBeforeElement) {
                targetDiv.insertBefore(clonedSubmitButton, insertBeforeElement);
            } else {
                // 如果没有找到添加视频按钮，则直接添加到最后
                targetDiv.appendChild(clonedSubmitButton);
            }

            clonedSubmitButton.onclick = function () {
                submitButton.click();
            }
        }

        if (targetDiv) {
            insertClonedButton(targetDiv);
        } else {
            console.error('达到最大尝试次数，仍未找到目标元素');
        }
    }

    // b站合集编辑页面，把“立即提交”按钮复制到顶部，方便添加新单集时保存。
    HeJiFuZhiTiJiaoBtn();
})();