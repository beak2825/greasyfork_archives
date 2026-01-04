// ==UserScript==
// @name         微信定时消息发送
// @namespace    http://tampermonkey.net/
// @version      1.8
// @description  支持多个时段的定时发送消息，或者同一分钟发送多条消息，按时间顺序显示和管理。
// @author       heiyu
// @match        https://*.qq.com/*
// @icon         https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://wechat.com&size=64
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/517265/%E5%BE%AE%E4%BF%A1%E5%AE%9A%E6%97%B6%E6%B6%88%E6%81%AF%E5%8F%91%E9%80%81.user.js
// @updateURL https://update.greasyfork.org/scripts/517265/%E5%BE%AE%E4%BF%A1%E5%AE%9A%E6%97%B6%E6%B6%88%E6%81%AF%E5%8F%91%E9%80%81.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建输入框容器
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.top = '10px';
    container.style.right = '10px';
    container.style.zIndex = '9999';
    container.style.width = '260px';
    container.style.padding = '15px';
    container.style.backgroundColor = '#f0f8ff';
    container.style.border = '2px solid #007acc';
    container.style.borderRadius = '8px';
    container.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
    container.style.fontFamily = 'Arial, sans-serif';

    // 输入框和时间选择器样式
    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = '输入要发送的文本';
    input.style.width = 'calc(100% - 20px)';
    input.style.margin = '0 auto';
    input.style.padding = '8px';
    input.style.border = '1px solid #007acc';
    input.style.borderRadius = '4px';
    container.appendChild(input);

    const timeInput = document.createElement('input');
    timeInput.type = 'time';
    timeInput.style.width = 'calc(100% - 20px)';
    timeInput.style.margin = '10px auto 0';
    timeInput.style.padding = '8px';
    timeInput.style.border = '1px solid #007acc';
    timeInput.style.borderRadius = '4px';
    container.appendChild(timeInput);

    // 添加消息按钮
    const addButton = document.createElement('button');
    addButton.textContent = '添加定时消息';
    addButton.style.width = 'calc(100% - 20px)';
    addButton.style.margin = '10px auto 0';
    addButton.style.padding = '8px';
    addButton.style.backgroundColor = '#007acc';
    addButton.style.color = '#fff';
    addButton.style.border = 'none';
    addButton.style.borderRadius = '4px';
    addButton.style.cursor = 'pointer';
    addButton.style.fontWeight = 'bold';
    container.appendChild(addButton);

    // 消息列表容器
    const messageList = document.createElement('ul');
    messageList.style.listStyle = 'none';
    messageList.style.padding = '0';
    messageList.style.marginTop = '15px';
    messageList.style.maxHeight = '150px';
    messageList.style.overflowY = 'auto';
    messageList.style.overflowX = 'auto';
    messageList.style.borderTop = '1px solid #007acc';
    messageList.style.paddingTop = '10px';
    container.appendChild(messageList);

    // 将输入框容器添加到页面
    document.body.appendChild(container);

    let scheduledMessages = [];

    // 添加定时消息
    addButton.addEventListener('click', () => {
        const newText = input.value.trim();
        const time = timeInput.value;

        if (newText && time) {
            const [hours, minutes] = time.split(':').map(num => parseInt(num));
            const now = new Date();
            const targetTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes, 0, 0);

            if (targetTime <= now) {
                targetTime.setDate(now.getDate() + 1);
            }

            const message = { text: newText, time: targetTime, sent: false };
            scheduledMessages.push(message);
            scheduledMessages.sort((a, b) => a.time - b.time);
            displayMessages();

            input.value = '';
            timeInput.value = '';
        } else {
            alert('请输入文本和选择发送时间！');
        }
    });

    // 显示消息列表
    function displayMessages() {
        messageList.innerHTML = '';

        scheduledMessages.forEach((message, index) => {
            const listItem = document.createElement('li');
            const timeStr = message.time.toTimeString().split(' ')[0].substring(0, 5);

            // 消息文本
            const messageText = document.createElement('span');
            messageText.textContent = `${timeStr} - ${message.text}`;
            messageText.style.display = 'block';
            messageText.style.padding = '5px';
            messageText.style.backgroundColor = index % 2 === 0 ? '#e6f7ff' : '#f0f8ff';
            messageText.style.wordBreak = 'break-all';
            messageText.style.whiteSpace = 'pre-wrap';
            listItem.appendChild(messageText);

            // 按钮容器
            const buttonContainer = document.createElement('div');
            buttonContainer.style.display = 'flex';
            buttonContainer.style.justifyContent = 'flex-end';
            buttonContainer.style.marginTop = '5px';

            // 编辑按钮
            const editButton = document.createElement('button');
            editButton.textContent = '编辑';
            editButton.style.padding = '3px 8px';
            editButton.style.border = 'none';
            editButton.style.backgroundColor = '#ffa07a';
            editButton.style.color = '#fff';
            editButton.style.borderRadius = '4px';
            editButton.style.cursor = 'pointer';
            editButton.style.marginRight = '5px';
            editButton.addEventListener('click', () => editMessage(index));
            buttonContainer.appendChild(editButton);

            // 删除按钮
            const deleteButton = document.createElement('button');
            deleteButton.textContent = '删除';
            deleteButton.style.padding = '3px 8px';
            deleteButton.style.border = 'none';
            deleteButton.style.backgroundColor = '#ff6347';
            deleteButton.style.color = '#fff';
            deleteButton.style.borderRadius = '4px';
            deleteButton.style.cursor = 'pointer';
            deleteButton.addEventListener('click', () => deleteMessage(index));
            buttonContainer.appendChild(deleteButton);

            // 将按钮容器添加到消息项
            listItem.appendChild(buttonContainer);

            messageList.appendChild(listItem);
        });
    }

    // 编辑消息
    function editMessage(index) {
        const message = scheduledMessages[index];
        input.value = message.text;
        timeInput.value = message.time.toTimeString().slice(0, 5);

        deleteMessage(index);
    }

    // 删除消息
    function deleteMessage(index) {
        scheduledMessages.splice(index, 1);
        displayMessages();
    }

    // 定时检查是否需要发送消息
   setInterval(() => {
        const now = new Date();

        scheduledMessages.forEach((message) => {
            const messageMinute = message.time.getHours() * 60 + message.time.getMinutes();
            const currentMinute = now.getHours() * 60 + now.getMinutes();

            if (!message.sent && currentMinute === messageMinute) {
                const editArea = document.getElementById('editArea');
                const sendButton = document.querySelector('.btn.btn_send');

                if (editArea && message.text) {
                    editArea.textContent = message.text;
                    editArea.dispatchEvent(new Event('input'));
                }

                if (sendButton && message.text) {
                    sendButton.click();
                    message.sent = true; // 记录消息已发送
                }
            }
        });

        // 移除已发送的消息
        scheduledMessages = scheduledMessages.filter(message => !message.sent);
        displayMessages();
    }, 1000); // 每秒检查一次

})();
