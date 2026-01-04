// ==UserScript==
// @name         百度NTR - By ChatGPT
// @namespace    none
// @description  将百度首页的 Logo、icon 和 tab 标题都更换为 Google 搜索引擎的 Logo、icon 和相应文字，并将搜索结果页重定向为 Google 搜索结果页，同时修改搜索行为为Google的结果页
// @version      2.1
// @match        https://www.baidu.com/*
// @icon         https://www.google.com/favicon.ico
// @license      license type
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/461094/%E7%99%BE%E5%BA%A6NTR%20-%20By%20ChatGPT.user.js
// @updateURL https://update.greasyfork.org/scripts/461094/%E7%99%BE%E5%BA%A6NTR%20-%20By%20ChatGPT.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const googleLogoUrl = 'https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png'; // Google搜索引擎的Logo的URL
    const googleIconUrl = 'https://www.google.com/favicon.ico'; // Google搜索引擎的icon的URL

    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('wd')) {
        // 如果URL中包含了搜索词，则将当前页面重定向到对应的Google搜索结果页
        const redirectUrl = `https://www.google.com/search?q=${encodeURIComponent(urlParams.get('wd'))}`;
        window.location.replace(redirectUrl);
    }

    const baiduLogo = document.querySelector('#s_lg_img');
    if (baiduLogo) {
        // 替换百度Logo为Google搜索引擎的Logo
        baiduLogo.src = googleLogoUrl;
        baiduLogo.width = 272;
        baiduLogo.height = 92;
    }

    const baiduIcon = document.querySelector('link[rel="shortcut icon"]');
    if (baiduIcon) {
        // 替换百度icon为Google的icon
        baiduIcon.href = googleIconUrl;
    }

    // 获取搜索输入框的DOM元素
    const searchInput = document.querySelector('#kw');
    if (searchInput) {
        // 监听搜索输入框的keydown事件
        searchInput.addEventListener('keydown', function(event) {
            // 如果按下的是Enter键，则阻止默认行为并将页面重定向到对应的Google搜索结果页
            if (event.key === 'Enter') {
                event.preventDefault();
                const redirectUrl = `https://www.google.com/search?q=${encodeURIComponent(searchInput.value)}`;
                window.location.replace(redirectUrl);
            }
        });
    }

    // 获取搜索按钮的DOM元素
    const searchBtn = document.querySelector('#su');
    if (searchBtn) {
        // 监听搜索按钮的click事件
        searchBtn.addEventListener('click', function(event) {
            // 阻止默认行为并将页面重定向到对应的Google搜索结果页
            event.preventDefault();
            const redirectUrl = `https://www.google.com/search?q=${encodeURIComponent(searchInput.value)}`;
            window.location.replace(redirectUrl);
        });
        // 修改搜索按钮的文本为谷歌一下
        searchBtn.value = '谷歌一下';
    }

    // 获取tab栏标题的DOM元素
    const pageTitle = document.querySelector('title');
    if (pageTitle) {
        // 修改tab栏标题的文本
        pageTitle.textContent = '谷歌一下，知道更多';
    }
})();