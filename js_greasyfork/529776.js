// ==UserScript==
// @name         金十数据 增强工具
// @namespace    http://tampermonkey.net/
// @version      0.2.0
// @description  金十数据页面增强工具
// @author       Rocco
// @match        https://www.jin10.com/
// @match        https://rili.jin10.com/
// @match        https://qihuo.jin10.com/
// @icon         https://cdn.jin10.com/assets/img/commons/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/529776/%E9%87%91%E5%8D%81%E6%95%B0%E6%8D%AE%20%E5%A2%9E%E5%BC%BA%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/529776/%E9%87%91%E5%8D%81%E6%95%B0%E6%8D%AE%20%E5%A2%9E%E5%BC%BA%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const addStyle = () => {
        const style = document.createElement("style");
        style.innerHTML = `
        .tw-change-box .flash-text
        { color: #111; font-weight: bold !important; }

        .top-poster,
        .jin-side-action,
        .top-tips,
        .data-reference,
        .jin-header_poster,
        .home-main_right > div:nth-of-type(2),
        .home-main_right > div:nth-of-type(5),
        .home-main_right > div:nth-of-type(6),
        .ushk-side > div:nth-of-type(2),
        .ushk-side > div:nth-of-type(4),
        .ushk-side .banner-list
        { display: none !important; }
        `;
        document.head.appendChild(style);
    };
    addStyle();
})();