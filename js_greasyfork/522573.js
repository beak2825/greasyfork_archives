// ==UserScript==
// @name         Chrome字體改善
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  輕鬆修改全部網站的字體(Roboto字體)
// @author       Weiren
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/522573/Chrome%E5%AD%97%E9%AB%94%E6%94%B9%E5%96%84.user.js
// @updateURL https://update.greasyfork.org/scripts/522573/Chrome%E5%AD%97%E9%AB%94%E6%94%B9%E5%96%84.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 加載 Google Fonts 的 Roboto 字體
    const fontLink = document.createElement('link');
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap';
    fontLink.rel = 'stylesheet';
    document.head.appendChild(fontLink);

    // 指定新字體為 Roboto
    const newFont = 'Roboto, Arial, sans-serif';

    // 建立新的樣式表
    const style = document.createElement('style');
    style.type = 'text/css';
    style.textContent = `
        * {
            font-family: ${newFont} !important;
        }
    `;

    // 將樣式表加入到頁面中
    document.head.appendChild(style);
})();