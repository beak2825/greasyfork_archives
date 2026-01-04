// ==UserScript==
// @name         ChatGPT功能扩展（自动发送和问题列表）
// @version      1.2
// @description  结合自动发送消息与问题列表侧边栏功能
// @author       xf17
// @license      MIT
// @match        https://chatgpt.com/*
// @run-at       document-start
// @namespace https://greasyfork.org/users/1396542
// @downloadURL https://update.greasyfork.org/scripts/517442/ChatGPT%E5%8A%9F%E8%83%BD%E6%89%A9%E5%B1%95%EF%BC%88%E8%87%AA%E5%8A%A8%E5%8F%91%E9%80%81%E5%92%8C%E9%97%AE%E9%A2%98%E5%88%97%E8%A1%A8%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/517442/ChatGPT%E5%8A%9F%E8%83%BD%E6%89%A9%E5%B1%95%EF%BC%88%E8%87%AA%E5%8A%A8%E5%8F%91%E9%80%81%E5%92%8C%E9%97%AE%E9%A2%98%E5%88%97%E8%A1%A8%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 监听 Enter 键自动点击发送按钮
    document.addEventListener("keydown", function(event) {
        if (event.key === "Enter" && !event.shiftKey) {
            const textarea = document.querySelector('.text-token-text-primary div[contenteditable]');
            const button = document.querySelector("button[data-testid='send-button']");
            if (textarea && button && textarea.innerText.trim() !== "") {
                event.preventDefault(); // 阻止默认的 Enter 行为（换行）
                button.click(); // 点击发送按钮
                console.log("已点击发送按钮");
            }
        }
    });

    // 创建侧边栏容器并添加到页面
    window.addEventListener('DOMContentLoaded', function () {
        const container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.top = '60px';
        container.style.right = '20px';
        container.style.width = '260px';
        container.style.zIndex = '1001';
        container.style.cursor = 'move';

        // 创建显示/隐藏问题列表的按钮（眼睛图标）
        const toggleBtn = document.createElement('button');
        toggleBtn.style.position = 'absolute';
        toggleBtn.style.top = '10px';
        toggleBtn.style.right = '10px';
        toggleBtn.style.width = '35px';
        toggleBtn.style.height = '35px';
        toggleBtn.style.backgroundColor = 'transparent';
        toggleBtn.style.border = 'none';
        toggleBtn.style.cursor = 'pointer';

        const eyeIcon = document.createElement('span');
        eyeIcon.innerHTML = '👁️';
        eyeIcon.style.fontSize = '20px';
        toggleBtn.appendChild(eyeIcon);

        // 创建问题列表容器
        const messageContainer = document.createElement('div');
        messageContainer.id = 'questionSidebar';
        messageContainer.style.position = 'relative';
        messageContainer.style.marginTop = '10px';
        messageContainer.style.width = '220px';
        messageContainer.style.maxHeight = '50vh';
        messageContainer.style.overflowY = 'auto';
        messageContainer.style.border = '1px solid #ddd';
        messageContainer.style.padding = '8px';
        messageContainer.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
        messageContainer.style.backgroundColor = '#fff';
        messageContainer.style.borderRadius = '6px';
        messageContainer.style.display = 'none';

        const title = document.createElement('h4');
        title.textContent = '问题栏';
        title.style.fontSize = '14px';
        title.style.marginBottom = '8px';
        messageContainer.appendChild(title);

        // 将按钮和问题列表容器添加到主容器中
        container.appendChild(toggleBtn);
        container.appendChild(messageContainer);

        // 将整个主容器添加到页面
        document.body.appendChild(container);

        // 按钮点击事件，显示/隐藏问题列表
        toggleBtn.addEventListener('click', function () {
            if (messageContainer.style.display === 'none') {
                loadQuestionList();
                messageContainer.style.display = 'block';
            } else {
                messageContainer.style.display = 'none';
            }
        });

        // 加载问题列表的函数
        function loadQuestionList() {
            messageContainer.querySelector('.message-list')?.remove();
            const messageElements = document.querySelectorAll('[data-message-id]');
            const messages = Array.from(messageElements).filter(el => el.getAttribute('data-message-author-role') === 'user')
                .map(el => ({
                    id: el.getAttribute('data-message-id'),
                    content: el.textContent.trim(),
                }));

            const messageList = document.createElement('ul');
            messageList.classList.add('message-list');
            messageList.style.padding = '0';
            messageList.style.listStyleType = 'none';

            messages.forEach((message, index) => {
                const listItem = document.createElement('li');
                listItem.style.padding = '6px';
                listItem.style.margin = '4px 0';
                listItem.style.borderRadius = '4px';
                listItem.style.fontSize = '12px';
                listItem.style.cursor = 'pointer';
                listItem.style.transition = 'background-color 0.3s';
                listItem.style.border = '1px solid #ddd';
                listItem.style.backgroundColor = index % 2 === 1 ? '#f1f8e9' : '#e3f2fd';
                listItem.textContent = message.content.length > 50 ? `${message.content.substring(0, 50)}...` : message.content;
                listItem.title = message.content;

                listItem.addEventListener('mouseover', () => listItem.style.backgroundColor = '#b3e5fc');
                listItem.addEventListener('mouseout', () => listItem.style.backgroundColor = index % 2 === 1 ? '#f1f8e9' : '#e3f2fd');
                listItem.addEventListener('click', () => {
                    document.querySelector(`[data-message-id="${message.id}"]`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    listItem.style.backgroundColor = '#80deea';
                });

                messageList.appendChild(listItem);
            });

            messageContainer.appendChild(messageList);
        }

        // 添加拖动功能到整个主容器（包括眼睛图标和列表）
        let isDragging = false;
        let offsetX, offsetY;

        container.addEventListener('mousedown', (e) => {
            isDragging = true;
            offsetX = e.clientX - container.getBoundingClientRect().left;
            offsetY = e.clientY - container.getBoundingClientRect().top;
            container.style.cursor = 'grabbing';
        });

        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                container.style.left = `${e.clientX - offsetX}px`;
                container.style.top = `${e.clientY - offsetY}px`;
            }
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
            container.style.cursor = 'move';
        });
    });
})();
