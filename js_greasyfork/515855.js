// ==UserScript==
// @name         移动版网页重定向到PC版
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  将m.开头的移动端网址重定向到PC端
// @license      MIT
// @author       Heavrnl
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/515855/%E7%A7%BB%E5%8A%A8%E7%89%88%E7%BD%91%E9%A1%B5%E9%87%8D%E5%AE%9A%E5%90%91%E5%88%B0PC%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/515855/%E7%A7%BB%E5%8A%A8%E7%89%88%E7%BD%91%E9%A1%B5%E9%87%8D%E5%AE%9A%E5%90%91%E5%88%B0PC%E7%89%88.meta.js
// ==/UserScript==
(function() {
    'use strict';

    // 获取当前URL
    const currentURL = window.location.href;

    // 直接替换m.为空，保持URL其他部分不变
    const pcURL = currentURL.replace(/^(https?:\/\/)m\./, '$1');

    // 如果URL发生了变化，则进行重定向
    if (pcURL !== currentURL) {
        window.location.replace(pcURL);
    }
})();

