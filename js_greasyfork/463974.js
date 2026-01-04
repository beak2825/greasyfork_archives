// ==UserScript==
// @name         Hide Bilibili.tv Logo/Watermark
// @namespace    http://tampermonkey.net/
// @version      0.11
// @author       Ridwan Shandy
// @match        https://www.bilibili.tv/*
// @grant        GM_addStyle
// @description  Hide those annoying watermark on Bilibili.tv
// @downloadURL https://update.greasyfork.org/scripts/463974/Hide%20Bilibilitv%20LogoWatermark.user.js
// @updateURL https://update.greasyfork.org/scripts/463974/Hide%20Bilibilitv%20LogoWatermark.meta.js
// ==/UserScript==

(function() {
    GM_addStyle(`
        .ip-watermark, .video-watermark {
            display: none !important;
        }
    `);
})();
