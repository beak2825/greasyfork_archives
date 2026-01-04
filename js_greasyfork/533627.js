// ==UserScript==
// @name         银河牛牛+1
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  牛牛聊天室一键+1
// @icon         https://www.milkywayidle.com/favicon.svg
// @author       PanPan
// @match        https://www.milkywayidle.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/533627/%E9%93%B6%E6%B2%B3%E7%89%9B%E7%89%9B%2B1.user.js
// @updateURL https://update.greasyfork.org/scripts/533627/%E9%93%B6%E6%B2%B3%E7%89%9B%E7%89%9B%2B1.meta.js
// ==/UserScript==

(function () {
    "use strict";

    // 配置参数
    const config = {
        childList: true,
        subtree: true,
    };

    // 缓存输入框选择器
    const CHAT_INPUT_SELECTOR = "input.Chat_chatInput__16dhX";
    const MESSAGE_CONTAINER_SELECTOR = "div.ChatMessage_chatMessage__2wev4";

    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.addedNodes.length) {
                processMessages();
            }
        });
    });

    observer.observe(document.body, config);
    processMessages();

    function processMessages() {
        document.querySelectorAll(MESSAGE_CONTAINER_SELECTOR).forEach((container) => {
            // 使用自定义属性防止重复添加
            if (!container.dataset.plusOneAdded) {
                container.dataset.plusOneAdded = "true";

                const plusOne = createPlusOneButton();
                container.appendChild(plusOne);
            }
        });
    }

    function createPlusOneButton() {
        const plusOne = document.createElement("span");
        plusOne.className = "added-plus-one";
        plusOne.textContent = "+1";

        // 提取样式到CSS类
        plusOne.style.cssText = `
      color: #00ff00;
      margin-left: 8px;
      font-weight: bold;
      font-size: 1.2em;
      cursor: pointer;
    `;

        // 使用常规函数确保this指向正确
        plusOne.addEventListener("click", function() {
            // 通过DOM结构可靠地查找消息内容
            //const container = this.closest(MESSAGE_CONTAINER_SELECTOR);
            //if (!container) return;

            // 查找消息内容（排除自己）
            //const contentSpan = container.querySelector('span:not(.added-plus-one)');
            //if (!contentSpan) return;

            const previousSpan = this.previousElementSibling;

            // 获取输入框（动态查找保证最新状态）
            const chatInput = document.querySelector(CHAT_INPUT_SELECTOR);
            if (!chatInput) {
                console.warn('未找到聊天输入框');
                return;
            }

            // 处理内容插入逻辑
            let originalMessage = previousSpan.textContent.trim();
            const random = Math.random();
            console.log(random)
            if (random < 17/100) {
                originalMessage += '喵'
            }
            const reactHandler = Object.keys(chatInput).find(key => key.startsWith('__reactProps'));

            if (reactHandler) {
                // React组件处理
                const reactProps = chatInput[reactHandler];
                if (reactProps && reactProps.onChange) {
                    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
                        HTMLInputElement.prototype,
                        "value"
                    ).set;

                    nativeInputValueSetter.call(chatInput, originalMessage);

                    const event = new Event('input', {
                        bubbles: true,
                        composed: true
                    });
                    chatInput.dispatchEvent(event);
                }
            } else {
                // 普通input处理
                chatInput.value = originalMessage;
                chatInput.dispatchEvent(new Event('input', { bubbles: true }));
            }
            // 核心修复代码结束

            // 附加保险措施
            setTimeout(() => {
                chatInput.focus();
                chatInput.value = originalMessage;
                chatInput.dispatchEvent(new Event('change', { bubbles: true }));
                // clickSendButton();
            }, 50);
        });

        return plusOne;
    }
    // 带防御性检测和重试机制
    function clickSendButton(retry = 3) {
         // 主选择器 // 备用文本匹配
        const button = document.querySelector(`.Chat_buttonContainer__1rw8b > button.Button_button__1Fe9z.Button_fullWidth__17pVU`);

        if (button && !button.disabled) {
            button.dispatchEvent(new Event('mousedown', { bubbles: true }));
            button.click();
            return true;
        }

        if (retry > 0) {
            setTimeout(() => clickSendButton(retry - 1), 500);
        }
        return false;
    }
})();
