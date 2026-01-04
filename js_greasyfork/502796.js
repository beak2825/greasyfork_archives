// ==UserScript==
// @name         Shuaito Forum Auto Reply with Button
// @version      1.1.0
// @description  帅兔网自动回复脚本。添加一个按钮，点击后自动在帖子中回复并返回论坛页面，并显示通知提示脚本运行状态
// @author       FelixChristian
// @match        https://www.shuaito.me/thread-*.html
// @grant        none
// @license      MIT
// @namespace https://greasyfork.org/users/1346616
// @downloadURL https://update.greasyfork.org/scripts/502796/Shuaito%20Forum%20Auto%20Reply%20with%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/502796/Shuaito%20Forum%20Auto%20Reply%20with%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 回复内容
    const replyContent = '谢谢楼主分享，辛苦了。';

    // 显示通知
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.style.position = 'fixed';
        notification.style.top = '10px';
        notification.style.left = '50%';
        notification.style.transform = 'translateX(-50%)';
        notification.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        notification.style.color = 'white';
        notification.style.padding = '10px';
        notification.style.borderRadius = '5px';
        notification.style.zIndex = '10000';
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000); // 通知显示3秒后消失
    }

    // 创建并添加按钮
    function addButton() {
        const button = document.createElement('button');
        button.textContent = '自动回复';
        button.style.position = 'fixed';
        button.style.top = '10px';
        button.style.right = '10px';
        button.style.padding = '10px';
        button.style.zIndex = '10000';
        button.style.backgroundColor = '#4CAF50';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.style.cursor = 'pointer';
        document.body.appendChild(button);

        button.addEventListener('click', () => {
            // 执行回复操作
            executeReply();
        });
    }

    // 执行回复操作
    function executeReply() {
        showNotification('开始执行脚本...');

        // 获取回复按钮
        const replyButton = document.querySelector('button#fastpostsubmit');

        if (replyButton) {
            // 输入回复内容
            const replyTextarea = document.querySelector('#fastpostmessage');

            setTimeout(() => {
                replyTextarea.value = replyContent;
                showNotification('输入回复内容...');

                // 模拟点击回复按钮
                setTimeout(() => {
                    replyButton.click();
                    showNotification('点击回复按钮...');

                    // 设置延时以确保回复提交和自动滚动完成
                    setTimeout(() => {
                        // 使用原生JavaScript滚动到顶部
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                        showNotification('回复提交完成');
                    }, 1000); // 回复提交后延迟
                }, 500); // 输入回复内容后延迟
            }, 500); // 开始执行脚本后延迟
        } else {
            showNotification('未找到回复按钮');
        }
    }

    // 添加按钮到页面
    addButton();
})();