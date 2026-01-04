// ==UserScript==
// @name         GitHub PR Retest Button
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  在GitHub PR页面添加一键Retest按钮
// @author       zhouyan
// @match        https://github.freewheel.tv/*/pull/*
// @icon         https://github.githubassets.com/favicons/favicon.svg
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/531732/GitHub%20PR%20Retest%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/531732/GitHub%20PR%20Retest%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 主函数
    function initRetestButton() {
        const actionsContainer = document.querySelector('.gh-header-actions');
        if (!actionsContainer || document.getElementById('gh-retest-button')) return;

        // 创建Retest按钮
        const retestButton = document.createElement('button');
        retestButton.innerHTML = `
            <span class="Button-content">
                <span class="Button-label">Retest</span>
            </span>
        `;

        // 设置按钮属性
        retestButton.id = 'gh-retest-button';
        retestButton.className = 'Button--secondary Button--small Button';
        retestButton.style.marginLeft = '8px';

        // 添加点击事件
        retestButton.addEventListener('click', async function() {
            try {
                // 聚焦评论框
                const commentField = document.getElementById('new_comment_field');
                if (!commentField) throw new Error('找不到评论框');

                commentField.focus();

                // 设置值并触发所有必要事件
                commentField.value = '/retest';
                triggerInputEvents(commentField);

                // 等待React状态更新
                await new Promise(resolve => setTimeout(resolve, 100));

                // 提交评论
                const submitButton = document.querySelector('.btn-primary[type="submit"]:not([disabled])');
                if (submitButton) {
                    submitButton.click();
                    showFeedback('Retest命令已发送!');
                } else {
                    throw new Error('提交按钮不可用');
                }
            } catch (error) {
                showFeedback(`错误: ${error.message}`, true);
                console.error('Retest按钮错误:', error);
            }
        });

        actionsContainer.appendChild(retestButton);
    }

    // 触发完整的输入事件序列
    function triggerInputEvents(element) {
        const events = ['focus', 'input', 'change', 'blur'];
        events.forEach(eventType => {
            const event = new Event(eventType, { bubbles: true });
            element.dispatchEvent(event);
        });
    }

    // 显示反馈消息
    function showFeedback(message, isError = false) {
        let feedback = document.getElementById('gh-feedback-message');
        if (!feedback) {
            feedback = document.createElement('div');
            feedback.id = 'gh-feedback-message';
            feedback.style.position = 'fixed';
            feedback.style.bottom = '20px';
            feedback.style.right = '20px';
            feedback.style.padding = '10px 20px';
            feedback.style.borderRadius = '6px';
            feedback.style.zIndex = '9999';
            feedback.style.fontFamily = '-apple-system, BlinkMacSystemFont, sans-serif';
            feedback.style.boxShadow = '0 4px 14px rgba(0, 0, 0, 0.15)';
            document.body.appendChild(feedback);
        }

        feedback.textContent = message;
        feedback.style.backgroundColor = isError ? '#f85149' : '#2ea043';
        feedback.style.color = 'white';
        feedback.style.opacity = '1';

        setTimeout(() => {
            feedback.style.opacity = '0';
        }, 3000);
    }

    // 初始化并设置MutationObserver
    function main() {
        initRetestButton();

        const observer = new MutationObserver(function(mutations) {
            if (!document.getElementById('gh-retest-button')) {
                initRetestButton();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // 页面加载完成后执行
    if (document.readyState === 'complete') {
        main();
    } else {
        window.addEventListener('load', main);
    }
})();