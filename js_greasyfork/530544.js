// ==UserScript==
// @name         yuedu
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  yueduui
// @author       皮皮
// @match        *://*/*
// @grant        none
// @license      pipi
// @downloadURL https://update.greasyfork.org/scripts/530544/yuedu.user.js
// @updateURL https://update.greasyfork.org/scripts/530544/yuedu.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建样式元素
    const style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = `

.navigation-sub-title {
    display: none
}

    .chapter-wrapper .chapter[data-v-fff9fad7] {
        width: 100vw !important;
        padding: 0px !important;
        box-sizing: border-box;}
    `;

    // 将样式添加到文档的 head 中
    document.head.appendChild(style);
})();