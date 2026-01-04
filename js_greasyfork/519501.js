// ==UserScript==
// @name         BR大逃杀局外聊天
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Enable chat functionality without joining a game session
// @author       Your Name
// @match        http://s1.dtsgame.com/*
// @match        http://s2.dtsgame.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/519501/BR%E5%A4%A7%E9%80%83%E6%9D%80%E5%B1%80%E5%A4%96%E8%81%8A%E5%A4%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/519501/BR%E5%A4%A7%E9%80%83%E6%9D%80%E5%B1%80%E5%A4%96%E8%81%8A%E5%A4%A9.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建聊天输入框和发送按钮
    const chatContainer = document.createElement('div');
    chatContainer.style.position = 'fixed';
    chatContainer.style.bottom = '10px';
    chatContainer.style.right = '10px';
    chatContainer.style.backgroundColor = 'white';
    chatContainer.style.border = '1px solid #ccc';
    chatContainer.style.padding = '10px';
    chatContainer.style.zIndex = '1000';
    chatContainer.style.boxShadow = '0 0 10px rgba(0,0,0,0.5)';

    const chatInput = document.createElement('input');
    chatInput.type = 'text';
    chatInput.placeholder = '输入聊天信息...';
    chatInput.style.width = '200px';
    chatContainer.appendChild(chatInput);

    const sendButton = document.createElement('button');
    sendButton.innerText = '发送';
    chatContainer.appendChild(sendButton);

    document.body.appendChild(chatContainer);

    // 发送聊天信息的函数
    function sendChatMessage() {
        const message = chatInput.value.trim();
        if (message) {
            // 这里调用原有的聊天发送功能
            postChatMessage(message);
            chatInput.value = ''; // 清空输入框
        }
    }

    // 发送聊天信息的请求
    function postChatMessage(message) {
        const oXmlHttp = new XMLHttpRequest();
        oXmlHttp.open("POST", "chat.php", true); // 确保URL正确
        oXmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        oXmlHttp.onreadystatechange = function () {
            if (oXmlHttp.readyState == 4) {
                if (oXmlHttp.status == 200) {
                    console.log("消息发送成功:", oXmlHttp.responseText);
                    // 这里可以添加代码来更新聊天记录
                } else {
                    console.error("消息发送失败:", oXmlHttp.statusText);
                }
            }
        };
        oXmlHttp.send("sendmode=send&chatmsg=" + encodeURIComponent(message));
    }

    // 绑定发送按钮的点击事件
    sendButton.addEventListener('click', sendChatMessage);

    // 绑定回车键发送消息
    chatInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            sendChatMessage();
        }
    });
})();
