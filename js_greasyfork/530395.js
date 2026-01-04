// ==UserScript==
// @name         Hover-Display Button to Open Steam Page in Client
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  在Steam页面左上角添加悬停显示的按钮，点击在Steam客户端打开当前页面
// @author       SynEvo
// @match        https://store.steampowered.com/*
// @match        https://steamcommunity.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/530395/Hover-Display%20Button%20to%20Open%20Steam%20Page%20in%20Client.user.js
// @updateURL https://update.greasyfork.org/scripts/530395/Hover-Display%20Button%20to%20Open%20Steam%20Page%20in%20Client.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建按钮元素
    const button = document.createElement('button');
    button.style.position = 'fixed';
    button.style.top = '10px';
    button.style.left = '10px';
    button.style.zIndex = '9999';
    button.style.opacity = '0';
    button.style.transition = 'opacity 0.3s';
    button.style.padding = '5px 10px';
    button.style.backgroundColor = '#171d25';
    button.style.color = '#ffffff';
    button.style.border = 'none';
    button.style.borderRadius = '3px';
    button.style.cursor = 'pointer';
    button.style.display = 'flex';
    button.style.alignItems = 'center';

    // 创建图标元素
    const icon = document.createElement('img');
    icon.src = 'https://store.steampowered.com/favicon.ico';
    icon.style.width = '16px';
    icon.style.height = '16px';
    icon.style.marginRight = '5px';

    // 创建文字节点
    const text = document.createTextNode('在Steam中打开');

    // 将图标和文字添加到按钮
    button.appendChild(icon);
    button.appendChild(text);

    // 添加到页面
    document.body.appendChild(button);

    // 获取当前页面URL并转换为Steam协议链接
    function getSteamProtocolUrl() {
        const currentUrl = window.location.href;
        return 'steam://openurl/' + currentUrl;
    }

    // 鼠标悬停显示/隐藏
    const hoverArea = document.createElement('div');
    hoverArea.style.position = 'fixed';
    hoverArea.style.top = '0';
    hoverArea.style.left = '0';
    hoverArea.style.width = '50px';
    hoverArea.style.height = '50px';
    hoverArea.style.zIndex = '9998';

    document.body.appendChild(hoverArea);

    hoverArea.addEventListener('mouseenter', () => {
        button.style.opacity = '1';
    });

    hoverArea.addEventListener('mouseleave', () => {
        button.style.opacity = '0';
    });

    // 点击事件
    button.addEventListener('click', () => {
        window.location.href = getSteamProtocolUrl();
    });

    // 按钮自身的悬停保持显示
    button.addEventListener('mouseenter', () => {
        button.style.opacity = '1';
    });

    button.addEventListener('mouseleave', () => {
        button.style.opacity = '0';
    });
})();