// ==UserScript==
// @name        清除Cookies与复制Cookies
// @author       ChatGPT
// @version      1.0
// @description 脚本菜单包含清除和复制功能。
// @match       *://*/*
// @grant       GM_registerMenuCommand
// @grant       GM_setClipboard
// @namespace https://greasyfork.org/users/452911
// @downloadURL https://update.greasyfork.org/scripts/489611/%E6%B8%85%E9%99%A4Cookies%E4%B8%8E%E5%A4%8D%E5%88%B6Cookies.user.js
// @updateURL https://update.greasyfork.org/scripts/489611/%E6%B8%85%E9%99%A4Cookies%E4%B8%8E%E5%A4%8D%E5%88%B6Cookies.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 清除所有Cookie的函数
    function clearAllCookies() {
        // 获取顶级域以清除域相关的Cookie
        let domain = window.location.hostname;
        if (domain.split('.').length > 2) {
            domain = '.' + domain.split('.').slice(-2).join('.');
        }

        // 获取所有Cookie名称
        const cookieNames = document.cookie.match(/[^ =;]+(?=\=)/g) || [];

        // 清除所有Cookie
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

    // 注册操作到用户脚本菜单
    GM_registerMenuCommand("清除所有Cookie", clearAllCookies);
    GM_registerMenuCommand("复制Cookie到剪贴板", copyCookiesToClipboard);
})();
