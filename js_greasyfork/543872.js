// ==UserScript==
// @name         PikPak 删除后自动清空回收站
// @namespace    https://github.com/sxjeru
// @version      1.1
// @description  检测到删除时，模拟点击实现清空回收站，以节省空间
// @author       sxjeru
// @match        *://mypikpak.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mypikpak.com
// @license      GPL-3.0
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/543872/PikPak%20%E5%88%A0%E9%99%A4%E5%90%8E%E8%87%AA%E5%8A%A8%E6%B8%85%E7%A9%BA%E5%9B%9E%E6%94%B6%E7%AB%99.user.js
// @updateURL https://update.greasyfork.org/scripts/543872/PikPak%20%E5%88%A0%E9%99%A4%E5%90%8E%E8%87%AA%E5%8A%A8%E6%B8%85%E7%A9%BA%E5%9B%9E%E6%94%B6%E7%AB%99.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 清空回收站的函数
    function clearRecycleBin() {
        // 查找 aria-label 为 "清空回收站" 的 <a> 元素
        const clearButton = document.querySelector('a[aria-label="清空回收站"]');

        // 判断是否找到了该按钮
        if (clearButton) {
            // 如果找到了，就模拟点击它
            clearButton.click();
            console.log('已成功模拟点击"清空回收站"按钮！');
        } else {
            console.error('未找到"清空回收站"按钮，请检查选择器是否正确。');
        }
    }

    // 监测"删除成功"消息
    function startMonitoringSuccessMessage() {
        console.log('开始监测删除成功消息...');

        // 创建一个观察器实例
        const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                    const element = mutation.target;

                    // 确保是消息元素
                    if (element.classList.contains('pp-message')) {
                        // 检查是否包含成功图标和"删除成功"文本
                        const successIcon = element.querySelector('.message-icon.success');
                        const messageText = element.querySelector('.message-text');

                        if (successIcon &&
                            messageText &&
                            messageText.textContent === '删除成功' &&
                            element.style.display !== 'none') {

                            console.log('检测到"删除成功"消息，准备清空回收站');
                            // 断开观察器，避免重复触发
                            observer.disconnect();
                            // 执行清空回收站
                            clearRecycleBin();
                            break;
                        }
                    }
                }
            }
        });

        // 开始观察整个文档中的style属性变化
        observer.observe(document.body, {
            attributes: true,
            attributeFilter: ['style'],
            subtree: true
        });

        // 设置超时，避免长时间无效监听
        setTimeout(() => {
            observer.disconnect();
            console.log('监测超时，停止监测');
        }, 10000); // 10秒后停止监测
    }

    // 查找并监听删除按钮
    function findAndSetupDeleteButton() {
        // 查找符合条件的删除按钮
        const buttons = document.querySelectorAll('button[aria-disabled="false"].el-button.el-button--primary');

        buttons.forEach(button => {
            const span = button.querySelector('span');
            // 确认按钮文本是"删除"且还没有设置过监听
            if (span && span.textContent.trim() === '删除' && !button.dataset.recycleBinSetup) {
                // 标记已设置监听，避免重复
                button.dataset.recycleBinSetup = 'true';
                // 添加点击事件监听器
                button.addEventListener('click', function() {
                    // 点击后立即开始监测成功消息
                    startMonitoringSuccessMessage();
                });
                console.log('已设置删除按钮点击监听');
            }
        });
    }

    // 创建一个MutationObserver来监视DOM变化，以便检测动态加载的删除按钮
    const domObserver = new MutationObserver(function() {
        findAndSetupDeleteButton();
    });

    // 开始观察整个文档的变化
    domObserver.observe(document.body, { childList: true, subtree: true });

    // 页面加载时也运行一次检查
    window.addEventListener('load', findAndSetupDeleteButton);

    // 立即运行一次，以防页面已加载完成
    findAndSetupDeleteButton();
})();