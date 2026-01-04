// ==UserScript==
// @name         自动关闭网页版贴吧扫码登录弹窗 Auto Close Login Popup on Tieba
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  自动关闭网页版贴吧扫码登录弹窗，Automatically close the login popup when it appears on tieba.baidu.com
// @author       chemhunter
// @match        *://tieba.baidu.com/*
// @match        *://*.zhihu.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/510661/%E8%87%AA%E5%8A%A8%E5%85%B3%E9%97%AD%E7%BD%91%E9%A1%B5%E7%89%88%E8%B4%B4%E5%90%A7%E6%89%AB%E7%A0%81%E7%99%BB%E5%BD%95%E5%BC%B9%E7%AA%97%20Auto%20Close%20Login%20Popup%20on%20Tieba.user.js
// @updateURL https://update.greasyfork.org/scripts/510661/%E8%87%AA%E5%8A%A8%E5%85%B3%E9%97%AD%E7%BD%91%E9%A1%B5%E7%89%88%E8%B4%B4%E5%90%A7%E6%89%AB%E7%A0%81%E7%99%BB%E5%BD%95%E5%BC%B9%E7%AA%97%20Auto%20Close%20Login%20Popup%20on%20Tieba.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const observer = new MutationObserver((mutations) => {
        const loginWrapper = document.querySelector('.tieba-login-wrapper');
        const closeButton = document.querySelector('.close-btn');
        const closeButton_zhihu = document.querySelector('button.Button.Modal-closeButton.Button--plain[aria-label="关闭"]');
        if (loginWrapper && closeButton ) {
            closeButton.click();
        } else if (closeButton_zhihu) {
            closeButton_zhihu.click();
        }
    });
    const config = { childList: true, subtree: true };
    observer.observe(document.body, config);
})();