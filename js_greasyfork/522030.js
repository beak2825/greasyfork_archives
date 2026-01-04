// ==UserScript==
// @name         MissAV video shows full title
// @name:zh-CN   MissAV影片显示完整标题
// @name:zh-TW   MissAV影片顯示完整標題
// @name:ja      MissAVのタイトルが全て表示されます
// @namespace    http://tampermonkey.net/
// @version      2024-12-27
// @description  Show full title on the video list page
// @description:zh-CN 让列表页面的影片显示完整标题
// @description:zh-TW 讓清單頁面的影片顯示完整標題
// @description:ja    リストページのビデオに完全なタイトルが表示されるようにする
// @author       Q3tBhdgZZf0uv3bxGQ8P
// @match        *://*.missav.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=missav.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/522030/MissAV%20video%20shows%20full%20title.user.js
// @updateURL https://update.greasyfork.org/scripts/522030/MissAV%20video%20shows%20full%20title.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建一个新的style元素
    var style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = `
        a.text-secondary.group-hover\\:text-primary {
            text-wrap-mode: wrap;
        }
    `;

    // 将style元素添加到head中
    document.head.appendChild(style);
})();