// ==UserScript==
// @name         DeepSeek 宽屏模式
// @namespace    http://tampermonkey.net/
// @version      20250904
// @description  将 DeepSeek 问答界面宽度改为`95%`
// @author       Enlin
// @match        *://*.chat.deepseek.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/542447/DeepSeek%20%E5%AE%BD%E5%B1%8F%E6%A8%A1%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/542447/DeepSeek%20%E5%AE%BD%E5%B1%8F%E6%A8%A1%E5%BC%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const style = document.createElement('style');
    style.textContent = `
        ._8f60047 {
            --message-list-max-width: 95% !important;
        }
    `;
    document.head.appendChild(style);

})();