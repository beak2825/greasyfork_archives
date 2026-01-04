// ==UserScript==
// @name         显示当前网站的Cookie
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  以易读格式显示当前网站的所有Cookie
// @author       niweizhuan
// @match        *://*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/527099/%E6%98%BE%E7%A4%BA%E5%BD%93%E5%89%8D%E7%BD%91%E7%AB%99%E7%9A%84Cookie.user.js
// @updateURL https://update.greasyfork.org/scripts/527099/%E6%98%BE%E7%A4%BA%E5%BD%93%E5%89%8D%E7%BD%91%E7%AB%99%E7%9A%84Cookie.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 获取当前网站的所有Cookie
    const cookies = document.cookie;

    // 将Cookie字符串解析为键值对
    const cookiePairs = cookies.split(';').map(cookie => {
        const [key, value] = cookie.trim().split('=');
        return { key, value };
    });

    // 创建一个div元素来显示Cookie
    const cookieDisplay = document.createElement('div');
    cookieDisplay.style.position = 'fixed';
    cookieDisplay.style.bottom = '0';
    cookieDisplay.style.right = '0';
    cookieDisplay.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    cookieDisplay.style.color = '#fff';
    cookieDisplay.style.padding = '10px';
    cookieDisplay.style.zIndex = '10000';
    cookieDisplay.style.fontFamily = 'Arial, sans-serif';
    cookieDisplay.style.fontSize = '14px';
    cookieDisplay.style.borderRadius = '5px';
    cookieDisplay.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)';
    cookieDisplay.style.maxWidth = '300px';
    cookieDisplay.style.overflow = 'hidden'; // 隐藏内部滚动条
    cookieDisplay.style.display = 'flex';
    cookieDisplay.style.flexDirection = 'column';

    // 创建标题和按钮的容器
    const headerContainer = document.createElement('div');
    headerContainer.style.display = 'flex';
    headerContainer.style.justifyContent = 'space-between';
    headerContainer.style.alignItems = 'center';
    headerContainer.style.marginBottom = '10px';
    cookieDisplay.appendChild(headerContainer);

    // 创建标题
    const title = document.createElement('div');
    title.textContent = '当前网站的Cookie：';
    title.style.fontWeight = 'bold';
    headerContainer.appendChild(title);

    // 创建按钮容器
    const buttonContainer = document.createElement('div');
    buttonContainer.style.display = 'flex';
    buttonContainer.style.gap = '10px';
    headerContainer.appendChild(buttonContainer);

    // 创建帮助按钮
    const helpButton = document.createElement('button');
    helpButton.textContent = '❓\uFE0E';
    helpButton.style.padding = '5px 10px';
    helpButton.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
    helpButton.style.color = '#fff';
    helpButton.style.border = '1px solid rgba(255, 255, 255, 0.2)';
    helpButton.style.borderRadius = '3px';
    helpButton.style.cursor = 'pointer';
    helpButton.style.transition = 'background-color 0.2s';
    helpButton.addEventListener('mouseenter', () => {
        helpButton.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
    });
    helpButton.addEventListener('mouseleave', () => {
        helpButton.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
    });
    helpButton.addEventListener('click', showHelp);
    buttonContainer.appendChild(helpButton);

    // 创建关闭按钮
    const closeButton = document.createElement('button');
    closeButton.textContent = '❌\uFE0E';
    closeButton.style.padding = '5px 10px';
    closeButton.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
    closeButton.style.color = '#fff';
    closeButton.style.border = '1px solid rgba(255, 255, 255, 0.2)';
    closeButton.style.borderRadius = '3px';
    closeButton.style.cursor = 'pointer';
    closeButton.style.transition = 'background-color 0.2s';
    closeButton.addEventListener('mouseenter', () => {
        closeButton.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
    });
    closeButton.addEventListener('mouseleave', () => {
        closeButton.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
    });
    closeButton.addEventListener('click', () => {
        document.body.removeChild(cookieDisplay);
    });
    buttonContainer.appendChild(closeButton);

    // 创建信息容器
    const infoContainer = document.createElement('div');
    infoContainer.style.overflowY = 'auto';
    infoContainer.style.maxHeight = '150px'; // 限制高度以实现滚动
    infoContainer.style.paddingRight = '5px'; // 避免滚动条遮挡内容
    cookieDisplay.appendChild(infoContainer);

    // 将每个Cookie键值对添加到信息容器中
    cookiePairs.forEach(pair => {
        const cookieLine = document.createElement('div');
        cookieLine.textContent = `${pair.key}: ${pair.value}`;
        cookieLine.style.marginBottom = '5px';
        cookieLine.style.cursor = 'pointer';
        cookieLine.style.padding = '5px';
        cookieLine.style.borderRadius = '3px';
        cookieLine.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
        cookieLine.style.transition = 'background-color 0.2s';
        cookieLine.addEventListener('mouseenter', () => {
            cookieLine.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
        });
        cookieLine.addEventListener('mouseleave', () => {
            cookieLine.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
        });
        cookieLine.addEventListener('click', () => {
            showCookieDetails(pair.key, pair.value);
        });
        infoContainer.appendChild(cookieLine);
    });

    // 将div添加到页面中
    document.body.appendChild(cookieDisplay);

    // 显示Cookie的基本信息
    function showCookieDetails(key, value) {
        // 获取当前页面的域名和路径
        const domain = window.location.hostname;
        const path = window.location.pathname;

        // 构造基本信息
        const details = `
名称: ${key}
值: ${value}
域名: ${domain}
路径: ${path}
        `;

        // 显示信息
        alert(`Cookie详细信息：\n${details}`);
    }

    // 显示帮助信息
    function showHelp() {
        const helpText = `
--说明
1. 脚本会在页面右下角显示一个浮动窗口，列出当前网站的所有Cookie。
2. 点击某个Cookie条目，会弹出一个对话框，显示该Cookie的详细信息。
3. 点击关闭按钮即可关闭悬浮窗口。

--什么是Cookie
Cookie是网站存储在用户浏览器中的小型文本文件，用于记录用户的偏好、登录状态、购物车内容等信息。每次用户访问网站时，浏览器会将相关的Cookie发送给服务器，以便服务器识别用户并提供个性化的服务。

--主要参数
1. 名称（Name）：Cookie的唯一标识符，用于区分不同的Cookie。
2. 值（Value）：与名称相关联的数据，通常是字符串形式。
3. 域名（Domain）：指定Cookie所属的域名。只有在该域名下的请求才会携带此Cookie。
4. 路径（Path）：指定Cookie所属的路径。只有在该路径下的请求才会携带此Cookie。

--能获取到哪些Cookie
1. 脚本只能获取当前网站（即与页面URL匹配的域名）的Cookie。
2. 如果Cookie设置了HttpOnly标志，脚本无法获取其值，只能看到名称。
3. 某些浏览器或扩展程序可能会阻止脚本访问Cookie，以保护用户隐私。
4. 如果Cookie已被删除或过期，脚本将无法获取到该Cookie。
        `;
        alert(helpText);
    }
})();