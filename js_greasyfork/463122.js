// ==UserScript==
// @name         ChatGPT聊天记录助手
// @namespace    http://tampermonkey.net/
// @version      0.11
// @description  1、复制页面对话信息到剪贴板并发送到飞书webhook；2、记录GPT-4调用次数并发送每次调用的时间至webhook；
// @author       You
// @match        *://chat.openai.com/chat*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/463122/ChatGPT%E8%81%8A%E5%A4%A9%E8%AE%B0%E5%BD%95%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/463122/ChatGPT%E8%81%8A%E5%A4%A9%E8%AE%B0%E5%BD%95%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //XXXXXXXX为飞书webhookID,需指定
    const webhookUrl = 'https://open.feishu.cn/open-apis/bot/v2/hook/XXXXXXXXX' 

    function sendToWebhook(text) {
        console.log('发送到 webhook: ', text);
        const payload = {
            msg_type: "text",
            content: {
                text: text
            }
        };

        GM_xmlhttpRequest({
            method: 'POST',
            url: webhookUrl,
            headers: {
                'Content-Type': 'application/json'
            },
            data: JSON.stringify(payload),
            onload: (response) => {
                console.log('Webhook 请求状态: ', response.status);
                console.log('Webhook 响应: ', response.responseText);
                if (response.status === 200) {
                    console.log('成功发送到 webhook');
                } else {
                    console.error('发送到 webhook 失败: ', response.status);
                }
            },
            onerror: (error) => {
                console.error('发送到 webhook 出错: ', error);
            }
        });
    }

    function extractChatInfo() {
        let chatInfo = [];
        const messageElements = document.querySelectorAll('.group > div:first-child > div:first-child + div');
        for (let i = 0; i < messageElements.length; i += 2) {
            const question = messageElements[i].innerText.trim();
            const answer = messageElements[i + 1] ? messageElements[i + 1].innerText.trim() : '';
            chatInfo.push({ question: question, answer: answer });
        }
        return chatInfo;
    }

    function displayChatInfo() {
        const chatInfo = extractChatInfo();
        const chatInfoText = chatInfo.map(({ question, answer }, index) => `Q ${String(index + 1).padStart(3, '0')}: ${question}\nA ${String(index + 1).padStart(3, '0')}: ${answer}`).join('\n\n');
        navigator.clipboard.writeText(chatInfoText).then(
            () => {
                alert('聊天信息已复制到剪贴板');
            },
            (err) => {
                console.error('无法复制聊天信息: ', err);
            }
        );
        // 同时发送到 webhook
        sendToWebhook(chatInfoText);
    }

    function createFloatingButton() {
        const button = document.createElement('button');
        button.textContent = '点我复制';
        button.style.position = 'fixed';
        button.style.top = '10px';
        button.style.right = '10px';
        button.style.zIndex = '9999';
        button.style.padding = '5px 10px';
        button.style.fontSize = '14px';
        button.style.border = '1px solid #ccc';
        button.style.borderRadius = '3px';
		button.style.backgroundColor = '#f9f9f9';
		button.style.cursor = 'pointer';
    // 监听颜色模式变化
    const updateButtonColor = (e) => {
        const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (isDarkMode) {
            button.style.color = '#fff';
            button.style.backgroundColor = '#444';
        } else {
            button.style.color = '#000';
            button.style.backgroundColor = '#f9f9f9';
        }
    };

    const colorSchemeQuery = window.matchMedia('(prefers-color-scheme: dark)');
    colorSchemeQuery.addListener(updateButtonColor);

    // 初始化按钮颜色
    updateButtonColor();

    button.addEventListener('click', displayChatInfo);
    document.body.appendChild(button);
}

createFloatingButton();

// 添加悬浮 div 的样式
GM_addStyle(`
    #gpt4_counter {
        position: fixed;
        right: 20px;
        bottom: 20px;
        padding: 10px;
        background-color: rgba(0, 0, 0, 0.7);
        color: white;
        font-size: 14px;
        border-radius: 5px;
        z-index: 9999;
    }
`);

// 创建悬浮 div 元素
const counterDiv = document.createElement("div");
counterDiv.id = "gpt4_counter";
document.body.appendChild(counterDiv);

// 存储消息计数和时间戳的变量
let messageCounter = 0;
let timestamp = null;

// 更新悬浮 div 的内容
const updateCounterDiv = () => {
    const currentTime = Date.now();
    const elapsedTime = timestamp ? currentTime - timestamp : 0;
    const remainingTime = 3 * 60 * 60 * 1000 - elapsedTime;

    counterDiv.innerHTML = `
        开始时间: ${timestamp ? new Date(timestamp).toLocaleString() : '-'}<br>
        已发送次数: ${messageCounter}<br>
        剩余时间: ${remainingTime > 0 ? Math.floor(remainingTime / 1000 / 60) + ' 分钟' : '-'}
    `;
};

const incrementCounter = () => {
    const modelIndicator = document.querySelector(".w-full.gap-1");
    const isGPT4 = modelIndicator && modelIndicator.textContent.includes("Model: GPT-4");

    if (!isGPT4) {
        return;
    }

    if (timestamp && (Date.now() - timestamp > 3 * 60 * 60 * 1000)) {
        messageCounter = 0;
        timestamp = null;
    }

    if (!timestamp) {
        timestamp = Date.now();
    }

    messageCounter++;
    updateCounterDiv();

    // 调用 webhook 发送消息
    console.log(new Date().toLocaleString() + " GPT-4 +1");
    sendToWebhook(new Date().toLocaleString() + " GPT-4 +1");
};

const tryAttachEventListeners = () => {
    const sendButton = document.querySelector("textarea + button > svg");
    const inputArea = document.querySelector("textarea");

    if (sendButton && inputArea) {
        sendButton.parentNode.addEventListener("click", incrementCounter);
        inputArea.addEventListener("keydown", (event) => {
            if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault();
                incrementCounter();
            }
        });

        clearInterval(checkInterval);
    }

    // 使用 MutationObserver 监视修改按钮的出现
    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            if (mutation.type === 'childList') {
                for (const node of mutation.addedNodes) {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        const editButton = node.querySelector("textarea + div > button:first-child");
                        if (editButton) {
                            editButton.addEventListener("click", incrementCounter);
                        }
                    }
                }
            }
        }
    });

    const config = { childList: true, subtree: true };
    observer.observe(document.body, config);

    const attachInputAreaListener = (inputArea) => {
        inputArea.removeEventListener("keydown", handleKeyDown);
        inputArea.addEventListener("keydown", handleKeyDown);
    };

    const handleKeyDown = (event) => {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            incrementCounter();
        }
    };

    const inputAreaObserver = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            if (mutation.type === "childList") {
                for (const node of mutation.addedNodes) {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        const inputArea = node.querySelector("textarea");
                        if (inputArea) {
                            attachInputAreaListener(inputArea);
                        }
                    }
                }
            }
        }
    });

    const inputAreaConfig = { childList: true, subtree: true };
    inputAreaObserver.observe(document.body, inputAreaConfig);

    if (sendButton && inputArea) {
        sendButton.parentNode.addEventListener("click", incrementCounter);
        attachInputAreaListener(inputArea);
        clearInterval(checkInterval);
    }
};

const checkInterval = setInterval(tryAttachEventListeners, 1000);
setInterval(updateCounterDiv, 1000); // 每秒更新一次悬浮 div 的内容
})();