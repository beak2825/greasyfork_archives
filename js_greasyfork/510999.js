// ==UserScript==
// @name         NS+ | Nodeseek 增强脚本
// @namespace    https://www.nodeseek.com/
// @version      0.1.0
// @description  Nodeseek 增强脚本
// @author       Euserv
// @run-at       document-start
// @match        https://www.nodeseek.com/*
// @icon         https://www.nodeseek.com/static/image/favicon/android-chrome-512x512.png
// @license      gpl-3.0
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/510999/NS%2B%20%7C%20Nodeseek%20%E5%A2%9E%E5%BC%BA%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/510999/NS%2B%20%7C%20Nodeseek%20%E5%A2%9E%E5%BC%BA%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

GM_addStyle(`
    .post-list-item a[href^="/space"]:has(.avatar-normal),
    .avatar-wrapper:has(.avatar-normal),
    .user-card a[href^="/space"]:has(.avatar-normal) {
        position: static !important;
    }

    .post-list-item a[href^="/space"]:has(.avatar-normal):after,
    .avatar-wrapper:has(.avatar-normal):after,
    .user-card a[href^="/space"]:has(.avatar-normal):after {
        content: none !important;
    }
`);
