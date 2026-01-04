// ==UserScript==
// @name         TAPD一键关闭按钮
// @namespace    http://tampermonkey.net/
// @version      1.11
// @description  在TAPD中添加一个一键关闭按钮
// @author       JSSM
// @match        *www.tapd.cn/*/bugtrace/bugs/view*
// @match        *www.tapd.cn/tapd_fe/*/bug/detail/*
// @grant        none
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/519223/TAPD%E4%B8%80%E9%94%AE%E5%85%B3%E9%97%AD%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/519223/TAPD%E4%B8%80%E9%94%AE%E5%85%B3%E9%97%AD%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建观察者实例
    const observer = new MutationObserver((mutations) => {
        // 查找目标 div
        const targetDiv = document.querySelector('.status-transfer.status-transfer--top.status-transfer--detail-mode');
        if (targetDiv) {
            // 创建新的 div 用于按钮
            const buttonContainer = document.createElement('div');
            buttonContainer.className = 'close-button-container'; // 新建的 class

            // 创建关闭按钮
            const closeButton = document.createElement('button');
            closeButton.type = 'button';
            closeButton.className = 'agi-button agi-button--default agi-button--level-primary agi-button--size-small agi-button--text-only';
            closeButton.id = 'close-tab-btn';
            closeButton.innerHTML = '<span class="agi-button__text"> 一键关闭然后流转然后关闭 </span>';

            // 关闭按钮的点击事件
            closeButton.addEventListener('click', function() {
                // 查找所有选项卡
                const tabs = document.querySelectorAll('.el-tabs__item');
                let closedTabFound = false;

                // 遍历选项卡，查找包含“已关闭”文本的选项卡
                tabs.forEach(tab => {
                    const label = tab.querySelector('.tag-name');
                    if (label && label.textContent.trim() === '已关闭') {
                        // 点击 "已关闭" 选项卡以选中它
                        tab.click();
                        closedTabFound = true; // 找到已关闭选项卡
                    }
                });

                // 如果找到了已关闭选项卡
                if (closedTabFound) {
                    // 等待 1 秒后执行流转按钮的点击
                    setTimeout(function() {
                        // 查找页面上存在的流转按钮
                        const flowButton = document.getElementById('guide-trans-btn');
                        if (flowButton) {
                            // 点击流转按钮
                            flowButton.click();
                        }

                        // 再等 1 秒后关闭当前标签页
                        setTimeout(function() {
                            window.close();
                        }, 1000); // 1000 毫秒 = 1 秒
                    }, 100); // 1000 毫秒 = 1 秒
                } else {
                    // 如果没有找到已关闭选项卡，修改按钮文字为“状态错误”
                    closeButton.innerHTML = '<span class="agi-button__text"> 状态错误 </span>';
                }
            });

            // 将关闭按钮添加到新建的 div 中
            buttonContainer.appendChild(closeButton);

            // 将新建的 div 添加到目标 div 之前
            targetDiv.parentNode.insertBefore(buttonContainer, targetDiv);

            // 停止观察
            observer.disconnect();
        }
    });

    // 配置观察器
    observer.observe(document.body, { childList: true, subtree: true });

})();

