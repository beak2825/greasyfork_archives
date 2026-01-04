// ==UserScript==
// @name         ChatGPT Questions' Tree
// @namespace    https://github.com/DrNaki
// @version      1.1.0
// @description  进入问题页面后，点击按钮获取问题列表；点击问题某一项，直接跳转到对应位置。
// @author       zeanzai
// @copyright    2024, zeanzai (https://github.com/zeanzai)
// @license      MIT
// @match        *://chatgpt.com/*
// @compatible   chrome
// @compatible   firefox
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/501717/ChatGPT%20Questions%27%20Tree.user.js
// @updateURL https://update.greasyfork.org/scripts/501717/ChatGPT%20Questions%27%20Tree.meta.js
// ==/UserScript==

window.addEventListener('DOMContentLoaded', function () {

    let btn = document.createElement("button");
    btn.style.position = 'fixed';
    btn.style.top = '20px';
    btn.style.right = '350px';
    btn.style.width = '100px';
    btn.style.backgroundColor = '#2e95d3';
    btn.innerHTML = "问题列表";//innerText也可以,区别是innerText不会解析html
    
    btn.onclick = function () {
        if(document.getElementById('mulu')){
            document.getElementById('mulu').remove();
        }

        // 获取所有具有 data-message-id 属性的标签
        const messageElements = document.querySelectorAll('[data-message-id]');
        const messages = [];

        // 遍历所有匹配的元素并提取信息
        messageElements.forEach(element => {
            const messageId = element.getAttribute('data-message-id');
            const messageContent = element.textContent.trim();

            const authorRole = element.getAttribute('data-message-author-role');
            console.log(authorRole)
            if (authorRole === 'user') {
                const message = {};
                message.authorName = 'q';
                message.id = messageId;
                message.content = messageContent;
                messages.push(message);

            } else if (authorRole === 'assistant') {
                const message = {};
                message.authorName = 'a';
                message.id = messageId;
                message.content = messageContent;
                messages.push(message);
            }
        });

        // 创建一个新的 div 标签
        const messageContainer = document.createElement('div');
        messageContainer.setAttribute('id', 'mulu');
        messageContainer.classList.add('message-container');
        messageContainer.style.position = 'fixed';
        messageContainer.style.top = '50px';
        messageContainer.style.left = '250px';
        messageContainer.style.width = '400px';
        messageContainer.style.maxHeight = '90vh';
        messageContainer.style.overflowY = 'auto';
        messageContainer.style.border = '1px solid #ddd';
        messageContainer.style.padding = '10px';
        messageContainer.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.1)';
        messageContainer.style.cursor = 'move';
        messageContainer.style.zIndex = '1000';

        // 创建一个用于渲染消息列表的 ul 元素
        const messageList = document.createElement('ul');
        messageList.classList.add('message-list');

        // 创建列表项并添加到列表中
        let count=0;
        messages.forEach(message => {
            if (message.authorName == 'q') {
                count++;
                const listItem = document.createElement('li');
                listItem.style.border = '1px solid #ddd';
                listItem.style.padding = '5px';
                listItem.style.margin = '5px 0';
                if(count%2===1){
                    listItem.style.backgroundColor='#e9950c';
                }else{
                    listItem.style.backgroundColor='#2e95d3';
                }
                listItem.textContent = message.content.length > 50
                    ? message.authorName + ': ' + message.content.substring(0, 50) + '...'
                    : message.authorName + ': ' + message.content;
                listItem.title = message.content; // 显示完整内容的悬停文本
                listItem.addEventListener('click', () => {
                    // 滚动到对应的消息元素
                    document.querySelector(`[data-message-id="${message.id}"]`).parentElement.parentElement.scrollIntoView({ behavior: 'smooth' });
                    listItem.style.backgroundColor = '#ececec';
                });
                messageList.appendChild(listItem);
            }

        });

        // 将消息列表添加到新的 div 标签中
        messageContainer.appendChild(messageList);

        // 将新的 div 标签添加到 body 中
        document.body.appendChild(messageContainer);

        // 添加拖动功能
        let isDragging = false;
        let offsetX, offsetY;

        messageContainer.addEventListener('mousedown', (e) => {
            isDragging = true;
            offsetX = e.clientX - messageContainer.offsetLeft;
            offsetY = e.clientY - messageContainer.offsetTop;
            messageContainer.style.cursor = 'grabbing';
        });

        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                messageContainer.style.left = `${e.clientX - offsetX}px`;
                messageContainer.style.top = `${e.clientY - offsetY}px`;
            }
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
            messageContainer.style.cursor = 'move';
        });

        // Prevent text selection while dragging
        messageContainer.addEventListener('dragstart', (e) => {
            e.preventDefault();
        });
    }

    let btn2 = document.createElement("button");
    btn2.style.position = 'fixed';
    btn2.style.top = '20px';
    btn2.style.right = '200px';
    btn2.style.width = '100px';
    btn2.style.backgroundColor = '#2e95d3';
    btn2.innerHTML = "关闭列表";//innerText也可以,区别是innerText不会解析html
    btn2.onclick = function () {
        if(document.getElementById('mulu')){
            document.getElementById('mulu').remove();
        }
    };
    document.body.append(btn);
    document.body.append(btn2);
});


