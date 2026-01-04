// ==UserScript==
// @name         Bing 跳转 Google
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  在 Bing 搜索页面添加跳转到 Google 搜索的功能
// @author       ChatGPT
// @match        https://cn.bing.com/search?q=*
// @match        https://www.bing.com/search?q=*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/529381/Bing%20%E8%B7%B3%E8%BD%AC%20Google.user.js
// @updateURL https://update.greasyfork.org/scripts/529381/Bing%20%E8%B7%B3%E8%BD%AC%20Google.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 获取当前 URL 的搜索参数
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('q');
    if (!query) return;

    // 生成 Google 搜索 URL
    const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;

    // 创建新的导航按钮
    const navItem = document.createElement('li');
    navItem.innerHTML = `<a href="${googleSearchUrl}" target="_blank" class="">谷歌</a>`;

    // 插入到导航栏中
    const navBar = document.querySelector('.b_scopebar ul');
    if (navBar) {
        navBar.appendChild(navItem);
    }
})();
