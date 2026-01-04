// ==UserScript==
// @name         逼站直播优化
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  切换弹幕显示隐藏功能
// @author       AI
// @match        https://live.bilibili.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/533041/%E9%80%BC%E7%AB%99%E7%9B%B4%E6%92%AD%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/533041/%E9%80%BC%E7%AB%99%E7%9B%B4%E6%92%AD%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建按钮
    const button = document.createElement('button');
    button.textContent = '隐藏弹幕';

    // 设置按钮样式（因按钮嵌入在已有的容器中，不再使用 fixed 定位）
    button.style.display = 'inline-block';
    button.style.marginTop = '20px';
    button.style.marginRight = '20px';
    button.style.padding = '4px 10px';
    button.style.borderRadius = '40px';
    button.style.backgroundColor = '#fe2c55';
    button.style.height = '28px';
    button.style.color = 'white';
    button.style.fontSize = '14px';
    button.style.border = 'none';
    button.style.cursor = 'pointer';

    // 从 localStorage 读取上次的状态
    let isDanmuHidden = localStorage.getItem('danmuHidden') === 'true';

    // 切换弹幕显示隐藏的函数
    const toggleDanmu = () => {
        const chatHistory = document.getElementById('chat-history-list');
        if (chatHistory) {
            if (isDanmuHidden) {
                chatHistory.style.display = '';
                button.textContent = '隐藏弹幕';
            } else {
                chatHistory.style.display = 'none';
                button.textContent = '显示弹幕';
            }
            isDanmuHidden = !isDanmuHidden;
            // 保存状态到 localStorage
            localStorage.setItem('danmuHidden', isDanmuHidden);
        }
    };

    // 初始应用保存的状态
    const applySavedState = () => {
        const chatHistory = document.getElementById('chat-history-list');
        if (chatHistory) {
            if (isDanmuHidden) {
                chatHistory.style.display = 'none';
                button.textContent = '显示弹幕';
            } else {
                chatHistory.style.display = '';
                button.textContent = '隐藏弹幕';
            }
        }
    };

    // 添加点击事件
    button.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleDanmu();
    });

    // 尝试将按钮放到目标容器后，如果没有找到则继续等待
    const insertButton = () => {
        const container = document.querySelector('div.rows-ctnr.rows-content');
        if (container && container.parentNode) {
            container.insertAdjacentElement('afterend', button);
            applySavedState(); // 按钮插入后应用保存的状态
            return true;
        }
        return false;
    };

    if (!insertButton()) {
        const intervalId = setInterval(() => {
            if (insertButton()) {
                clearInterval(intervalId);
            }
        }, 1000);
    }
})();