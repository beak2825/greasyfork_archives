// ==UserScript==
// @name        E站各处标题修改成日文
// @namespace   http://tampermonkey/
// @version     2.1
// @description E站画廊 提取 日文标题修改成 浏览器标题 搜索页面提取搜索内容设置成浏览器标题
// @match       https://exhentai.org/?f*
// @match       https://exhentai.org/g/*
// @match       https://exhentai.org/s/*
// @match       https://exhentai.org/uploader/*
// @grant       none
// @author      淫书馆馆长与他的GPT
// @license     GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/464382/E%E7%AB%99%E5%90%84%E5%A4%84%E6%A0%87%E9%A2%98%E4%BF%AE%E6%94%B9%E6%88%90%E6%97%A5%E6%96%87.user.js
// @updateURL https://update.greasyfork.org/scripts/464382/E%E7%AB%99%E5%90%84%E5%A4%84%E6%A0%87%E9%A2%98%E4%BF%AE%E6%94%B9%E6%88%90%E6%97%A5%E6%96%87.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Determine current URL
    const currentUrl = location.href;

    // Set the browser title based on the current URL and extracted value
    if (currentUrl.startsWith('https://exhentai.org/?f')) {
        const getValueFromInputField = () => document.getElementById('f_search')?.value;
        document.title = getValueFromInputField() || document.title;
    } else if (currentUrl.startsWith('https://exhentai.org/g/')) {
        const getContentFromH1Tag = () => document.querySelector('h1#gj')?.textContent;
        document.title = getContentFromH1Tag() || document.title;
    } else if (currentUrl.startsWith('https://exhentai.org/s/')) {
        const getContentFromH1Tag = () => document.querySelector('h1')?.textContent;
        document.title = getContentFromH1Tag() || document.title;
    } else if (currentUrl.startsWith('https://exhentai.org/uploader/')) {
        const getValueFromInputField = () => document.getElementById('f_search')?.value;
        document.title = getValueFromInputField() || document.title;
    }
})();