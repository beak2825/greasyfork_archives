// ==UserScript==
// @name         极简主义谷歌翻译
// @namespace    user.minimal.translate.toolbar
// @version      0.1
// @description  调用谷歌翻译widget
// @match        *://*/*
// @exclude      *://translate.google.com/*
// @grant        none
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/546049/%E6%9E%81%E7%AE%80%E4%B8%BB%E4%B9%89%E8%B0%B7%E6%AD%8C%E7%BF%BB%E8%AF%91.user.js
// @updateURL https://update.greasyfork.org/scripts/546049/%E6%9E%81%E7%AE%80%E4%B8%BB%E4%B9%89%E8%B0%B7%E6%AD%8C%E7%BF%BB%E8%AF%91.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建容器
    const container = document.createElement('div');
    container.id = 'google_translate_element';
    container.style.display = 'none';
    document.body.insertBefore(container, document.body.firstChild);

    // 初始化回调
    window.googleTranslateElementInit = function() {
        new google.translate.TranslateElement({
            pageLanguage: 'auto',
            includedLanguages: 'en,zh-CN,ja,zh-TW',
            layout: google.translate.TranslateElement.InlineLayout.BOTTOM_RIGHT,
            autoDisplay: true
        }, 'google_translate_element');
    };

    // 动态加载谷歌翻译脚本
    const s = document.createElement('script');
    s.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    document.body.appendChild(s);
})();
