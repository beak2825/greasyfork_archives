// ==UserScript==
// @name         获取和格式化显示哔哩哔哩 Cookies
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  获取 Cookies，格式化后显示
// @author       You
// @match        *://www.bilibili.com/*
// @grant        GM_setClipboard
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/526771/%E8%8E%B7%E5%8F%96%E5%92%8C%E6%A0%BC%E5%BC%8F%E5%8C%96%E6%98%BE%E7%A4%BA%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%20Cookies.user.js
// @updateURL https://update.greasyfork.org/scripts/526771/%E8%8E%B7%E5%8F%96%E5%92%8C%E6%A0%BC%E5%BC%8F%E5%8C%96%E6%98%BE%E7%A4%BA%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%20Cookies.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建并样式化按钮
    const showButton = document.createElement('button');
    showButton.textContent = '获取 Cookies';
    showButton.style.position = 'fixed';
    showButton.style.top = '20px';
    showButton.style.right = '20px';
    showButton.style.zIndex = '9999';
    showButton.style.padding = '10px 20px';
    showButton.style.fontSize = '16px';
    showButton.style.cursor = 'pointer';
    showButton.style.backgroundColor = '#4CAF50';
    showButton.style.color = 'white';
    showButton.style.border = 'none';
    showButton.style.borderRadius = '5px';

    // 创建显示 Cookies 的区域
    const cookieDisplayDiv = document.createElement('div');
    cookieDisplayDiv.style.position = 'fixed';
    cookieDisplayDiv.style.top = '80px';
    cookieDisplayDiv.style.right = '20px';
    cookieDisplayDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    cookieDisplayDiv.style.color = 'white';
    cookieDisplayDiv.style.padding = '10px';
    cookieDisplayDiv.style.fontFamily = 'Arial, sans-serif';
    cookieDisplayDiv.style.fontSize = '14px';
    cookieDisplayDiv.style.maxWidth = '300px';
    cookieDisplayDiv.style.maxHeight = '200px';
    cookieDisplayDiv.style.overflow = 'auto';
    cookieDisplayDiv.style.whiteSpace = 'pre-wrap';
    cookieDisplayDiv.style.display = 'none';  // 默认隐藏

    // 创建复制按钮
    const copyButton = document.createElement('button');
    copyButton.textContent = '复制 Cookies';
    copyButton.style.marginTop = '10px';
    copyButton.style.padding = '5px 10px';
    copyButton.style.fontSize = '14px';
    copyButton.style.cursor = 'pointer';
    copyButton.style.backgroundColor = '#008CBA';
    copyButton.style.color = 'white';
    copyButton.style.border = 'none';
    copyButton.style.borderRadius = '5px';

    // 按钮点击事件：获取并格式化 Cookies 后显示
    showButton.addEventListener('click', () => {
        const cookies = document.cookie;

        // 格式化 Cookies 为 JSON 格式
        const cookiesObject = cookies.split('; ').reduce((acc, cookie) => {
            const [key, value] = cookie.split('=');
            acc[key] = value;
            return acc;
        }, {});

        const formattedCookies = JSON.stringify(cookiesObject, null, 2); // 格式化为 JSON

        cookieDisplayDiv.textContent = `当前 Cookies:\n${formattedCookies}`;
        cookieDisplayDiv.style.display = 'block';  // 显示 Cookies 区域
    });

    // 复制按钮点击事件：复制格式化后的 Cookies 到剪贴板
    copyButton.addEventListener('click', () => {
        const cookies = document.cookie;

        // 格式化 Cookies 为 JSON 格式
        const cookiesObject = cookies.split('; ').reduce((acc, cookie) => {
            const [key, value] = cookie.split('=');
            acc[key] = value;
            return acc;
        }, {});

        const formattedCookies = JSON.stringify(cookiesObject, null, 2); // 格式化为 JSON

        // 使用 GM_setClipboard 将 Cookies 复制到剪贴板
        try {
            GM_setClipboard(formattedCookies);
            alert('格式化后的 Cookies 已复制到剪贴板！');
        } catch (error) {
            console.error('复制到剪贴板失败:', error);
            alert('复制到剪贴板失败，请检查权限设置。');
        }
    });

    // 将按钮和复制按钮插入到页面
    document.body.appendChild(showButton);
    cookieDisplayDiv.appendChild(copyButton);
    document.body.appendChild(cookieDisplayDiv);

    // 调试输出：确保按钮点击事件已绑定
    console.log("脚本已加载，按钮和复制功能已设置！");
})();
