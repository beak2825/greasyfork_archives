// ==UserScript==
// @name        「MsDocTranslateLink」微软开发文档语言站点转换按钮
// @namespace    https://github.com/iamshen
// @version      2024-04-19
// @description  新增切换语言站点的按钮
// @author       iamshen
// @match        https://learn.microsoft.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @license      AGPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/492905/%E3%80%8CMsDocTranslateLink%E3%80%8D%E5%BE%AE%E8%BD%AF%E5%BC%80%E5%8F%91%E6%96%87%E6%A1%A3%E8%AF%AD%E8%A8%80%E7%AB%99%E7%82%B9%E8%BD%AC%E6%8D%A2%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/492905/%E3%80%8CMsDocTranslateLink%E3%80%8D%E5%BE%AE%E8%BD%AF%E5%BC%80%E5%8F%91%E6%96%87%E6%A1%A3%E8%AF%AD%E8%A8%80%E7%AB%99%E7%82%B9%E8%BD%AC%E6%8D%A2%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 获取当前页面的语言
    function getCurrentLanguage() {
        return document.documentElement.lang;
    }

    // 设置当前页面的语言
    function setCurrentLanguage(language) {
        const currentUrl = window.location.href;
        const newUrl = currentUrl.replace(/\/(en-us|zh-cn)\//, `/${language}/`);
        window.location.href = newUrl;
    }
    // 创建语言切换按钮
    function createLanguageSwitcherButton() {
        const button = document.createElement('button');
        button.textContent = getCurrentLanguage() === 'en-us' ? '切换到中文' : 'Switch to English';
        button.classList.add('button', 'button-sm', 'button-clear', 'button-primary'); // Add the specified classes
        button.style.marginLeft = '10px'; // Add margin for better spacing
        button.addEventListener('click', () => {
            const targetLanguage = getCurrentLanguage() === 'en-us' ? 'zh-cn' : 'en-us';
            setCurrentLanguage(targetLanguage);
        });

        const pageActions = document.getElementById('article-header-page-actions');
        if (pageActions) {
            pageActions.appendChild(button);
        }
    }

    // 如果是 Microsoft Docs 网站
    if (window.location.hostname === 'learn.microsoft.com') {
        createLanguageSwitcherButton();
    }
})();