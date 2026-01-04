// ==UserScript==
// @name         复制Steam页面信息
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  Add buttons to copy the link (without extra content) and app ID on Steam game pages
// @author       Punk Deer
// @match        https://store.steampowered.com/app/*
// @grant        GM_setClipboard
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/527613/%E5%A4%8D%E5%88%B6Steam%E9%A1%B5%E9%9D%A2%E4%BF%A1%E6%81%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/527613/%E5%A4%8D%E5%88%B6Steam%E9%A1%B5%E9%9D%A2%E4%BF%A1%E6%81%AF.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 获取页面中的 App ID
    const appId = window.location.pathname.split('/')[2];

    // 获取当前游戏页面的完整链接并去掉多余部分
    const currentLink = window.location.href.split('?')[0]; // 去掉URL中的查询参数部分

    // 使用正则表达式清除后缀部分，保留基础链接
    const cleanLink = currentLink.replace(/\/[^/]+\/?$/, '/');

    // 创建复制链接的按钮
    const copyLinkButton = document.createElement('button');
    copyLinkButton.innerText = '复制游戏链接';
    copyLinkButton.style.position = 'fixed';
    copyLinkButton.style.top = '10px';
    copyLinkButton.style.right = '10px';
    copyLinkButton.style.zIndex = '1000';
    copyLinkButton.style.padding = '10px';
    copyLinkButton.style.backgroundColor = '#2a9df4';
    copyLinkButton.style.color = '#fff';
    copyLinkButton.style.border = 'none';
    copyLinkButton.style.borderRadius = '5px';
    copyLinkButton.style.cursor = 'pointer';

    // 点击复制链接按钮
    copyLinkButton.addEventListener('click', function() {
        GM_setClipboard(cleanLink);  // 复制当前页面链接到剪贴板
        showMessage('链接已复制');  // 显示成功消息
    });

    // 创建复制 App ID 的按钮
    const copyIdButton = document.createElement('button');
    copyIdButton.innerText = '复制App ID';
    copyIdButton.style.position = 'fixed';
    copyIdButton.style.top = '50px';
    copyIdButton.style.right = '10px';
    copyIdButton.style.zIndex = '1000';
    copyIdButton.style.padding = '10px';
    copyIdButton.style.backgroundColor = '#2a9df4';
    copyIdButton.style.color = '#fff';
    copyIdButton.style.border = 'none';
    copyIdButton.style.borderRadius = '5px';
    copyIdButton.style.cursor = 'pointer';

    // 点击复制 App ID 按钮
    copyIdButton.addEventListener('click', function() {
        GM_setClipboard(appId);  // 复制 App ID 到剪贴板
        showMessage('App ID 已复制');  // 显示成功消息
    });

    // 创建一个显示成功消息的函数
    function showMessage(message) {
        const messageDiv = document.createElement('div');
        messageDiv.innerText = message;
        messageDiv.style.position = 'fixed';
        messageDiv.style.bottom = '10px';
        messageDiv.style.right = '10px';
        messageDiv.style.backgroundColor = '#2a9df4';
        messageDiv.style.color = '#fff';
        messageDiv.style.padding = '10px';
        messageDiv.style.borderRadius = '5px';
        messageDiv.style.zIndex = '1000';
        messageDiv.style.fontSize = '14px';

        // 添加到页面
        document.body.appendChild(messageDiv);

        // 1秒后自动移除消息
        setTimeout(() => {
            document.body.removeChild(messageDiv);
        }, 1500);  // 1.5秒后消息消失
    }

    // 将按钮添加到页面中
    document.body.appendChild(copyLinkButton);
    document.body.appendChild(copyIdButton);
})();
