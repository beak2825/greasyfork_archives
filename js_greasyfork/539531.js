// ==UserScript==
// @name         自动同意附加Google服务条款
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  自动勾选"我已阅读并同意上述条款。"复选框并点击"启用"按钮。
// @author       Gemini
// @match        https://admin.google.com/*
// @grant        none
// @run-at       document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/539531/%E8%87%AA%E5%8A%A8%E5%90%8C%E6%84%8F%E9%99%84%E5%8A%A0Google%E6%9C%8D%E5%8A%A1%E6%9D%A1%E6%AC%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/539531/%E8%87%AA%E5%8A%A8%E5%90%8C%E6%84%8F%E9%99%84%E5%8A%A0Google%E6%9C%8D%E5%8A%A1%E6%9D%A1%E6%AC%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const observer = new MutationObserver((mutationsList, observer) => {
        // --- 查找并点击复选框 ---
        try {
            // 通过文本找到标签元素
            const labels = Array.from(document.querySelectorAll('div'));
            const targetLabel = labels.find(el => el.textContent.trim() === '我已阅读并同意上述条款。');

            if (targetLabel) {
                // 根据HTML结构找到复选框的容器
                const container = targetLabel.closest('.uRQOPe');
                if (container) {
                    const checkbox = container.querySelector('div[role="checkbox"]');
                    // 如果复选框存在且未被选中，则点击它
                    if (checkbox && checkbox.getAttribute('aria-checked') === 'false') {
                        console.log('油猴脚本：找到同意条款复选框，正在点击...');
                        checkbox.click();
                    }
                }
            }
        } catch (error) {
            console.error('油猴脚本：查找或点击复选框时出错：', error);
        }

        // --- 查找并点击"启用"按钮 ---
        try {
            // 通过文本"启用"找到所有按钮
            const buttons = Array.from(document.querySelectorAll('div[role="button"]'));
            const enableButton = buttons.find(btn => btn.textContent.trim() === '启用');

            if (enableButton) {
                // 检查按钮是否可点击
                if (!enableButton.hasAttribute('aria-disabled') || enableButton.getAttribute('aria-disabled') === 'false') {
                     console.log('油猴脚本：找到"启用"按钮，正在点击...');
                     enableButton.click();
                     // 如果这是一个一次性的操作，您可以取消注释下面这行来停止观察，以节省资源
                     // observer.disconnect();
                }
            }
        } catch (error) {
            console.error('油猴脚本：查找或点击"启用"按钮时出错：', error);
        }
    });

    // 启动观察器，监视整个文档的变化
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    console.log('油猴脚本：已加载并开始监视页面元素。');
})();