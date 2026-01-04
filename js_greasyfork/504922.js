// ==UserScript==
// @name         PWA标题栏颜色 (PWA Titlebar Color)
// @version      2.2
// @description  为不同的网站自定义标题栏颜色
// @author       hiisme
// @match        *://*/*
// @grant        none
// @run-at       document-start
// @namespace http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/504922/PWA%E6%A0%87%E9%A2%98%E6%A0%8F%E9%A2%9C%E8%89%B2%20%28PWA%20Titlebar%20Color%29.user.js
// @updateURL https://update.greasyfork.org/scripts/504922/PWA%E6%A0%87%E9%A2%98%E6%A0%8F%E9%A2%9C%E8%89%B2%20%28PWA%20Titlebar%20Color%29.meta.js
// ==/UserScript==

(() => {
    'use strict';

    // 定义不同网站的标题栏颜色
    const colorConfig = {
        'www.youtube.com': '#0F0F0F',
        'kimi.moonshot.cn': '#1D1F20',
        'podcasts.apple.com': '#252526',
        'mypikpak.com': '#181A1B',
        'www.deepl.com': '#181A1B',
        'www.google.com': '#202124',
        'www.bing.com': '#181A1B',
        'yandex.com': '#111112',
        'm.weibo.cn': '#1F1F1F',
        'www.pinterest.com': '#121212',
        'message.bilibili.com': '#000000',
        'www.doubao.com': '#121212',
        'hailuoai.com': '#202123',
        'mail.google.com': '#111111',
        // 添加更多的网站和颜色
    };

    // 获取当前网站的主机名
    const currentHost = new URL(window.location.href).hostname;

    // 创建或更新 meta 标签
    const setMetaThemeColor = (color) => {
        let meta = document.querySelector('meta[name="theme-color"]');
        if (!meta) {
            meta = document.createElement('meta');
            meta.name = 'theme-color';
            document.head.appendChild(meta);
        }
        meta.content = color;
    };

    // 应用标题栏颜色
    const applyTitlebarColor = () => {
        const color = colorConfig[currentHost];
        if (color) {
            setMetaThemeColor(color);
        }
    };

    // 在页面加载后执行一次
    window.addEventListener('load', applyTitlebarColor, { once: true });
})();
