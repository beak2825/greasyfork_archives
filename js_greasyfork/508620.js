// ==UserScript==
// @name         人人有Nai用beta
// @namespace    http://tampermonkey.net/
// @version      0.2.7
// @description  Modify base URLs for all HTTP requests to specific domains
// @author       XTer
// @match        https://novelai.net/*
// @grant        none
// @license GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/508620/%E4%BA%BA%E4%BA%BA%E6%9C%89Nai%E7%94%A8beta.user.js
// @updateURL https://update.greasyfork.org/scripts/508620/%E4%BA%BA%E4%BA%BA%E6%9C%89Nai%E7%94%A8beta.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 配置需要拦截的域名及其对应的新base URL
    const urlMapping = {
        'https://image.novelai.net/ai/': 'https://nai.xter.org/nai/',
        'https://api.novelai.net/user/': 'https://nai.xter.org/user/'
    };

    // 检查并返回对应的新URL
    function getModifiedUrl(url) {
        for (const [originalUrl, newBaseUrl] of Object.entries(urlMapping)) {
            if (url.startsWith(originalUrl)) {
                return newBaseUrl + url.slice(originalUrl.length);
            }
        }
        return null;
    }

    // 重写 fetch 函数
    const originalFetch = window.fetch;
    window.fetch = function (input, init) {
        if (typeof input === 'string') {
            const modifiedUrl = getModifiedUrl(input);
            if (modifiedUrl) {
                input = modifiedUrl;
            }
        }
        return originalFetch(input, init);
    };

    // 拦截 XMLHttpRequest 的所有请求
    const originalOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function (method, url, async, user, password) {
        const modifiedUrl = getModifiedUrl(url);
        if (modifiedUrl) {
            arguments[1] = modifiedUrl;
        }
        originalOpen.apply(this, arguments);
    };

    // 创建并显示悬浮圆角块
    function createFloatingBanner() {
        const banner = document.createElement('div');
        banner.style.position = 'fixed';
        banner.style.bottom = '20px';
        banner.style.right = '20px';
        banner.style.backgroundColor = '#32a852'; // 更好看的绿色
        banner.style.color = 'white';
        banner.style.padding = '10px';
        banner.style.borderRadius = '10px';
        banner.style.boxShadow = '0 0 10px rgba(0,0,0,0.3)';
        banner.style.zIndex = '9999';
        banner.style.textAlign = 'center';
        banner.style.fontFamily = 'Arial, sans-serif';
        banner.style.lineHeight = '1.5';
        banner.style.opacity = '0.1'; // 初始透明度为 0.3
        banner.style.transition = 'opacity 0.3s, background-color 0.5s, border 0.1s'; // 添加背景颜色和边框变换的过渡

        // 使用 innerHTML 设置可点击的超链接和新行文本
        banner.innerHTML = '您正在使用<br>“人人有nai用”<br>公益账号<br>由 <a href="https://space.bilibili.com/3546762734209105" target="_blank" style="color: white; text-decoration: underline;">YoxRider</a> <br>和 <a href="https://space.bilibili.com/66633770" target="_blank" style="color: white; text-decoration: underline;">XTer</a> 共同开发<br><a href="https://contribute.xter.org/" target="_blank" style="color: white; text-decoration: underline;">赞助链接</a>';

        // 添加鼠标悬停效果
        banner.onmouseover = function () {
            banner.style.backgroundColor = '#28a745'; // 鼠标悬浮时的颜色
            banner.style.opacity = '1'; // 鼠标悬浮时的透明度
            banner.style.border = '2px solid #ffffff'; // 鼠标悬浮时的边框
        };

        banner.onmouseout = function () {
            banner.style.backgroundColor = '#32a852'; // 恢复原始颜色
            banner.style.opacity = '0.5'; // 恢复原始透明度
            banner.style.border = 'none'; // 恢复原始边框
        };

        document.body.appendChild(banner);

        // 在短暂延迟后开始动画
        setTimeout(() => {
            banner.style.opacity = '0.5';
        }, 100);
    }

    // 初始化悬浮圆角块
    createFloatingBanner();
})();
