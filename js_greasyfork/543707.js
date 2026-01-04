// ==UserScript==
// @name         423down链接统一
// @namespace    http://tampermonkey.net/
// @version      5.0
// @description  确保423down显示的链接与点击、复制的链接完全一致
// @author       Kevin
// @match        *://www.423down.com/*
// @grant        none
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/543707/423down%E9%93%BE%E6%8E%A5%E7%BB%9F%E4%B8%80.user.js
// @updateURL https://update.greasyfork.org/scripts/543707/423down%E9%93%BE%E6%8E%A5%E7%BB%9F%E4%B8%80.meta.js
// ==/UserScript==

(function() {
    document.querySelectorAll('a[href*="/go.php"]').forEach(link => {
        link.href = link.textContent.trim();
    });
})();