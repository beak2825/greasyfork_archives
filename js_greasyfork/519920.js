// ==UserScript==
// @name Milky way idle交易监听
// @namespace http://yournamespace.com/
// @version 0.200
// @description 对商品的实时成本和实时出售价进行计算对比
// @author xmcx
// @match https://www.milkywayidle.com/*
// @grant none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/519920/Milky%20way%20idle%E4%BA%A4%E6%98%93%E7%9B%91%E5%90%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/519920/Milky%20way%20idle%E4%BA%A4%E6%98%93%E7%9B%91%E5%90%AC.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const MAX_MESSAGES = 20; // 最大显示消息数量
    let messageQueue = []; // 缓存消息，防止页面加载前丢失

    // 创建消息显示区域
    const createMessageDisplay = () => {
        const messageBox = document.createElement('div');
        messageBox.id = 'ws-message-box';
        messageBox.style.position = 'fixed';
        messageBox.style.top = '10px';
        messageBox.style.left = '10px';
        messageBox.style.width = '400px';
        messageBox.style.height = '200px';
        messageBox.style.resize = 'both';
        messageBox.style.overflow = 'hidden'; // 避免超出内容显示
        messageBox.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        messageBox.style.color = '#fff';
        messageBox.style.zIndex = '9999';
        messageBox.style.border = '1px solid rgba(255, 255, 255, 0.5)';
        messageBox.style.borderRadius = '5px';
        messageBox.style.boxShadow = '0px 2px 5px rgba(0, 0, 0, 0.5)';
        messageBox.innerHTML = `
            <div id="ws-header" style="padding: 5px; background: rgba(255, 255, 255, 0.1); cursor: move; border-bottom: 1px solid rgba(255, 255, 255, 0.2);">
                <button id="clear-messages" style="padding: 5px; font-size: 12px;">Clear</button>
                <input id="filter-keyword" type="text" placeholder="Filter by keyword" style="flex: 1; padding: 5px; font-size: 12px; margin-left: 5px;"/>
            </div>
            <div id="ws-messages" style="padding: 10px; max-height: calc(100% - 40px); overflow-y: auto;"></div>`;
        document.body.appendChild(messageBox);

        makeDraggable(messageBox, document.getElementById('ws-header')); // 使消息框通过顶部区域可拖动

        // 加载缓存的消息
        messageQueue.forEach((msg) => appendMessage(msg));
        messageQueue = []; // 清空缓存
    };

    // 添加消息到显示区域，限制最大消息数量
    const appendMessage = (message) => {
        const messagesContainer = document.getElementById('ws-messages');
        const filterKeyword = document.getElementById('filter-keyword')?.value.trim();

        if (messagesContainer) {
            // 仅显示符合过滤条件的消息
            if (!filterKeyword || message.includes(filterKeyword)) {
                const messageElement = document.createElement('div');
                messageElement.textContent = message;
                messagesContainer.appendChild(messageElement);

                // 限制显示的最大消息数量
                const allMessages = messagesContainer.children;
                if (allMessages.length > MAX_MESSAGES) {
                    messagesContainer.removeChild(allMessages[0]);
                }

                messagesContainer.scrollTop = messagesContainer.scrollHeight; // 确保新消息可见
            }
        } else {
            // 如果界面尚未创建，将消息加入队列
            messageQueue.push(message);
            if (messageQueue.length > MAX_MESSAGES) messageQueue.shift(); // 保持队列最大长度
        }
    };

    // 清除所有消息
    const clearMessages = () => {
        const messagesContainer = document.getElementById('ws-messages');
        if (messagesContainer) {
            messagesContainer.innerHTML = '';
        }
    };

    // 使消息框通过指定区域可拖动
    const makeDraggable = (element, dragHandle) => {
        let isDragging = false;
        let offsetX, offsetY;

        dragHandle.addEventListener('mousedown', (e) => {
            isDragging = true;
            offsetX = e.clientX - element.offsetLeft;
            offsetY = e.clientY - element.offsetTop;
            document.body.style.userSelect = 'none'; // 禁止选中文本
        });

        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                element.style.left = `${e.clientX - offsetX}px`;
                element.style.top = `${e.clientY - offsetY}px`;
            }
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
            document.body.style.userSelect = ''; // 恢复文本选择
        });
    };

    // 保存原始的 WebSocket 构造函数
    const OriginalWebSocket = window.WebSocket;

    // 重写 WebSocket 构造函数
    window.WebSocket = function (...args) {
        const ws = new OriginalWebSocket(...args);

        // 监听消息事件
        ws.addEventListener('message', (event) => {
            console.log('WebSocket Message:', event.data);
            appendMessage(event.data); // 将消息显示在页面上
        });

        return ws;
    };

    // 保留 WebSocket 的其余属性和方法
    window.WebSocket.prototype = OriginalWebSocket.prototype;

    // 界面初始化延迟到页面加载完成
    window.addEventListener('load', () => {
        createMessageDisplay();

        // 绑定按钮事件
        document.getElementById('clear-messages').addEventListener('click', clearMessages);

        // 绑定关键词筛选实时更新
        document.getElementById('filter-keyword').addEventListener('input', () => {
            const keyword = document.getElementById('filter-keyword').value.trim();
            const messagesContainer = document.getElementById('ws-messages');
            const allMessages = Array.from(messagesContainer.children);
            allMessages.forEach((msg) => {
                msg.style.display = keyword && !msg.textContent.includes(keyword) ? 'none' : 'block';
            });
        });
    });

    console.log('WebSocket hijacking initialized with immediate message capture and delayed UI!');
})();