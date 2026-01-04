// ==UserScript==
// @name        清除Cookies与复制Cookies
// @author      ChatGPT
// @version     1.4
// @description 在网页上显示悬浮按钮，点击按钮可以选择清除、复制或查看Cookie。
// @match       *://*/*
// @grant       GM_setClipboard
// @namespace   https://greasyfork.org/users/452911
// @downloadURL https://update.greasyfork.org/scripts/521904/%E6%B8%85%E9%99%A4Cookies%E4%B8%8E%E5%A4%8D%E5%88%B6Cookies.user.js
// @updateURL https://update.greasyfork.org/scripts/521904/%E6%B8%85%E9%99%A4Cookies%E4%B8%8E%E5%A4%8D%E5%88%B6Cookies.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建并初始化悬浮按钮
    const button = document.createElement('button');
    button.style.position = 'fixed';
    button.style.right = '20px'; // 距离右侧20px
    button.style.bottom = '30%'; // 距离底部30%，这样位于中间偏下一些
    button.style.padding = '10px';
    button.style.backgroundColor = '#007bff';
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.borderRadius = '5px';
    button.style.boxShadow = '0 0 5px rgba(0, 0, 0, 0.5)';
    button.style.cursor = 'pointer';
    button.style.opacity = '0.5'; // 设置透明度为0.5
    button.innerText = 'Cookie操作';
    document.body.appendChild(button);

    // 创建并初始化操作菜单
    const menu = document.createElement('div');
    menu.style.position = 'fixed';
    menu.style.right = '20px';
    menu.style.bottom = '35%'; // 菜单稍高于按钮
    menu.style.backgroundColor = '#f9f9f9';
    menu.style.border = '1px solid #ddd';
    menu.style.padding = '10px';
    menu.style.boxShadow = '0 0 5px rgba(0, 0, 0, 0.5)';
    menu.style.display = 'none';
    menu.style.zIndex = '10000';
    document.body.appendChild(menu);

    // 添加选项按钮到菜单
    function addMenuItem(text, onClick) {
        const item = document.createElement('button');
        item.innerText = text;
        item.style.display = 'block';
        item.style.marginBottom = '5px';
        item.style.padding = '8px';
        item.style.width = '100%';
        item.style.backgroundColor = '#007bff';
        item.style.color = 'white';
        item.style.border = 'none';
        item.style.borderRadius = '3px';
        item.style.cursor = 'pointer';
        item.addEventListener('click', () => {
            onClick();
            menu.style.display = 'none'; // 选择后隐藏菜单
        });
        menu.appendChild(item);
    }

    // 清除所有Cookie的函数
    function clearAllCookies() {
        let domain = window.location.hostname;
        if (domain.split('.').length > 2) {
            domain = '.' + domain.split('.').slice(-2).join('.');
        }

        const cookieNames = document.cookie.match(/[^ =;]+(?=\=)/g) || [];
        cookieNames.forEach(cookieName => {
            document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=${domain}`;
            document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=`;
        });

        alert('所有Cookie已被清除。');
    }

    // 复制所有Cookie到剪贴板的函数
    function copyCookiesToClipboard() {
        const cookies = document.cookie;
        GM_setClipboard(cookies);
        alert('Cookie已复制到剪贴板。');
    }

    // 查看所有Cookie内容的函数
    function viewCookies() {
        const cookies = document.cookie || '无Cookie';
        alert('当前Cookie: \n' + cookies);
    }

    // 将菜单项添加到操作菜单
    addMenuItem('清除所有Cookie', clearAllCookies);
    addMenuItem('复制Cookie到剪贴板', copyCookiesToClipboard);
    addMenuItem('查看Cookie', viewCookies);

    // 点击悬浮按钮时，显示或隐藏菜单
    button.addEventListener('click', () => {
        menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
    });

})();
