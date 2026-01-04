// ==UserScript==
// @name         自动发送消息到 WentUrc 群组 
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  通过 API 接口向chat.wenturc.com发送消息，带有美化的图形界面, 该脚本仅自用
// @author       expintanxy
// @match        *://chat.wenturc.com/*
// @grant        none
// @license      GNU Affero General Public License v3.0
// @downloadURL https://update.greasyfork.org/scripts/517002/%E8%87%AA%E5%8A%A8%E5%8F%91%E9%80%81%E6%B6%88%E6%81%AF%E5%88%B0%20WentUrc%20%E7%BE%A4%E7%BB%84.user.js
// @updateURL https://update.greasyfork.org/scripts/517002/%E8%87%AA%E5%8A%A8%E5%8F%91%E9%80%81%E6%B6%88%E6%81%AF%E5%88%B0%20WentUrc%20%E7%BE%A4%E7%BB%84.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建图形界面面板
    const panel = document.createElement('div');
    panel.style.position = 'fixed';
    panel.style.bottom = '20px';
    panel.style.right = '20px';
    panel.style.width = '300px';
    panel.style.padding = '20px';
    panel.style.backgroundImage = 'url("https://wenturc.com/wp-content/uploads/2024/10/illust_121726349_20240922_014816-scaled.jpg")';  // 替换为你想要的背景图链接
    panel.style.backgroundSize = 'cover';
    panel.style.backgroundPosition = 'center';
    panel.style.backgroundRepeat = 'no-repeat';
    panel.style.backgroundColor = 'rgba(0, 0, 0, 0.6)'; // 作为暗化效果
    panel.style.borderRadius = '12px';
    panel.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.3)';
    panel.style.color = '#fff';  // 调整字体颜色以适应背景
    panel.style.zIndex = '9999';
    panel.style.transition = 'height 0.3s ease, padding 0.3s ease'; // 过渡动画
    panel.style.overflow = 'hidden'; // 隐藏内容溢出，确保动画效果

    // 添加样式控制
    panel.classList.add('expanded'); // 初始为展开状态

    // 标题栏和最小化按钮
    const titleBar = document.createElement('div');
    titleBar.style.display = 'flex';
    titleBar.style.justifyContent = 'space-between';
    titleBar.style.alignItems = 'center';
    titleBar.style.cursor = 'move';  // 鼠标指针变为移动手型

    const title = document.createElement('h3');
    title.textContent = '发送快捷信息';
    title.style.userSelect = 'none';
    title.style.margin = '0';
    title.style.fontSize = '18px';
    title.style.fontWeight = 'bold';
    title.style.transition = 'margin-top 0.3s ease';  // 过渡动画

    const minimizeButton = document.createElement('button');
    minimizeButton.textContent = '-';
    minimizeButton.style.fontSize = '18px';
    minimizeButton.style.color = '#fff';
    minimizeButton.style.background = 'transparent';
    minimizeButton.style.border = 'none';
    minimizeButton.style.cursor = 'pointer';
    minimizeButton.style.marginLeft = '10px';

    minimizeButton.onclick = () => {
        const isMinimized = panel.classList.contains('collapsed');
        if (isMinimized) {
            panel.classList.remove('collapsed');
            panel.style.height = '';
            input.style.display = '';
            panel.style.padding = '20px'; // 展开时增加 padding
            sendButton.style.display = '';
            title.style.marginTop = '';  // 恢复标题位置
            minimizeButton.textContent = '-';
        } else {
            panel.classList.add('collapsed');
            panel.style.height = '40px !important';
            panel.style.padding = '10px'; // 折叠时缩小 padding
            input.style.display = 'none';
            sendButton.style.display = 'none';
            title.style.marginTop = '5px !important';  // 使标题居中显示
            minimizeButton.textContent = '+';
        }
    };

    titleBar.appendChild(title);
    titleBar.appendChild(minimizeButton);
    panel.appendChild(titleBar);

    // 文本输入框
    const input = document.createElement('textarea');
    input.placeholder = '这里可以为 chat.wenturc.com 上的群组快捷发送信息, 请输入要发送的消息！';
    input.style.width = '100%';
    input.style.height = '80px';
    input.style.marginTop = '15px';
    input.style.padding = '10px';
    input.style.border = 'none';
    input.style.borderRadius = '8px';
    input.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
    input.style.color = '#333';  // 文字颜色
    input.style.resize = 'none';  // 禁用调整大小
    panel.appendChild(input);

    // 发送按钮
    const sendButton = document.createElement('button');
    sendButton.textContent = '发送';
    sendButton.style.width = '100%';
    sendButton.style.marginTop = '15px';
    sendButton.style.padding = '10px';
    sendButton.style.background = 'linear-gradient(45deg, #ef6bfe, #c63e3e)';
    sendButton.style.color = '#fff';
    sendButton.style.border = 'none';
    sendButton.style.borderRadius = '8px';
    sendButton.style.cursor = 'pointer';
    sendButton.style.fontWeight = 'bold';
    sendButton.style.transition = 'opacity 0.5s';

    // 悬停效果
    sendButton.onmouseover = () => {
        sendButton.style.opacity = '0.8';
    };
    sendButton.onmouseout = () => {
        sendButton.style.opacity = '1';
    };

    // 发送按钮点击事件
    sendButton.onclick = () => {
        const message = input.value.trim();
        if (message) {
            // 拼接 API 请求的 URL
            const apiUrl = `https://chat.wenturc.com/api/plugin:com.msgbyte.simplenotify/webhook/callback?subscribeId=673337e5908a78bb1ecbb754&text=${encodeURIComponent(message)}`;

            // 发送请求
            fetch(apiUrl)
                .then(response => response.json())
                .then(data => {
                    console.log("消息发送成功：", data);
                    alert("消息发送成功！");
                    input.value = ''; // 清空输入框
                })
                .catch(error => {
                    console.error("发送消息时出错：", error);
                    alert("发送消息失败，请重试！");
                });
        } else {
            alert("请输入要发送的消息！");
        }
    };
    panel.appendChild(sendButton);

    // 将面板添加到页面
    document.body.appendChild(panel);

    // 实现拖动功能
    let isDragging = false;
    let startX, startY;

    titleBar.onmousedown = (e) => {
        isDragging = true;
        startX = e.clientX - panel.getBoundingClientRect().left;
        startY = e.clientY - panel.getBoundingClientRect().top;
        document.onmousemove = onMouseMove;
        document.onmouseup = onMouseUp;
    };

    function onMouseMove(e) {
        if (isDragging) {
            panel.style.left = `${e.clientX - startX}px`;
            panel.style.top = `${e.clientY - startY}px`;
            panel.style.right = ''; // 清除右边距，让拖动更加流畅
            panel.style.bottom = ''; // 清除底边距，让拖动更加流畅
        }
    }

    function onMouseUp() {
        isDragging = false;
        document.onmousemove = null;
        document.onmouseup = null;
    }
})();
