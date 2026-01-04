// ==UserScript==
// @name        Qwen添加查询参数
// @namespace   Violentmonkey Scripts
// @match       https://chat.qwen.ai/*
// @license       GPL
// @version     1.5
// @author      CathyElla
// @description 2025/5/25 23:34:36 给Qwen添加查询参数?q=%s
// @downloadURL https://update.greasyfork.org/scripts/537233/Qwen%E6%B7%BB%E5%8A%A0%E6%9F%A5%E8%AF%A2%E5%8F%82%E6%95%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/537233/Qwen%E6%B7%BB%E5%8A%A0%E6%9F%A5%E8%AF%A2%E5%8F%82%E6%95%B0.meta.js
// ==/UserScript==
(function () {
    'use strict';

    // 获取URL查询参数
    const getQueryParam = () => {
        const q = new URLSearchParams(window.location.search).get('q');
        return q;
    };

    // 等待元素加载
    const waitForElement = async (selector, timeout = 20000) => {
        const start = Date.now();
        return new Promise((resolve, reject) => {
            const check = () => {
                const el = document.querySelector(selector);
                if (el) {
                    return resolve(el);
                }
                if (Date.now() - start > timeout) {
                    return reject(new Error(`Element timeout: ${selector}`));
                }
                setTimeout(check, 100);
            };
            check();
        });
    };

    // 模拟完整用户输入流程
    const simulateInput = async (text) => {
        try {
            const chatBox = await waitForElement('#chat-input');

            // 模拟点击聚焦
            chatBox.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
            chatBox.focus();

            // 设置输入值并触发事件（兼容React）
            const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
                window.HTMLTextAreaElement.prototype,
                "value"
            ).set;

            nativeInputValueSetter.call(chatBox, text);

            // 触发输入事件链
            ['input', 'change', 'keydown', 'keyup'].forEach(eventType => {
                chatBox.dispatchEvent(new Event(eventType, {
                    bubbles: true,
                    cancelable: true
                }));
            });

            // 等待内容处理完成
            await new Promise(resolve => setTimeout(resolve, 300));

            // 模拟回车发送
          ['keydown', 'keypress', 'keyup'].forEach(eventType => {
            const event = new KeyboardEvent(eventType, {
            key: 'Enter',
            code: 'Enter',
            keyCode: 13,
            bubbles: true
          });
          chatBox.dispatchEvent(event);
          });



        } catch (error) {
            console.error('[QwenAutoInput] 错误详情:', error);
        }
    };

    // 主流程
    const mainProcess = async () => {
        const query = getQueryParam();
        if (!query) return;

        // 确保页面完全加载
        await waitForElement('#chat-input');
        await new Promise(resolve => setTimeout(resolve, 1000));

        // 执行自动输入
        await simulateInput(query);
    };

    // 启动条件
    if (window.location.host === 'chat.qwen.ai') {

        // 兼容SPA路由变化
        if (document.readyState === 'complete') {
            mainProcess();
        } else {
            window.addEventListener('load', mainProcess);
            document.addEventListener('DOMContentLoaded', mainProcess);
        }
    }
})();