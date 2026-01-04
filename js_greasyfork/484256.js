// ==UserScript==
// @name         复制邮箱地址不跳转邮箱应用
// @name:en      Copy Mailto Link Stop Jump Mail App
// @version      0.1
// @namespace    http://copy.mail.to/
// @description  复制邮箱地址弹出提示框，不跳转邮箱应用
// @description:en Copy mailto link to clipboard instead of opening email application
// @author       Zhy
// @match        *://*/*
// @grant        GM_setClipboard
// @license      The Unlicense
// @downloadURL https://update.greasyfork.org/scripts/484256/%E5%A4%8D%E5%88%B6%E9%82%AE%E7%AE%B1%E5%9C%B0%E5%9D%80%E4%B8%8D%E8%B7%B3%E8%BD%AC%E9%82%AE%E7%AE%B1%E5%BA%94%E7%94%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/484256/%E5%A4%8D%E5%88%B6%E9%82%AE%E7%AE%B1%E5%9C%B0%E5%9D%80%E4%B8%8D%E8%B7%B3%E8%BD%AC%E9%82%AE%E7%AE%B1%E5%BA%94%E7%94%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 监听所有链接的点击事件
    document.addEventListener('click', function(event) {
        // 检查点击的链接是否是mailto链接
        if (event.target.tagName === 'A' && event.target.href && event.target.href.startsWith('mailto:')) {
            event.preventDefault(); // 阻止默认行为，即不打开邮件应用

            // 提取邮箱地址
            const emailAddress = event.target.href.replace('mailto:', '');

            // 复制到剪切板
            GM_setClipboard(emailAddress, 'text');

            // 提示用户已复制
            alert('已复制邮箱地址到剪切板: ' + emailAddress);
        }
    }, false);
})();
