// ==UserScript==
// @name         Medium 簡潔化
// @name:es      Medium Simplify.
// @name:zh      Medium 简洁化
// @name:zh-CN   Medium 简洁化
// @name:zh-TW   Medium 簡潔化
// @description         移除位於https://*.medium.com/*頁面下方的註冊提示，以及移除非必要的內容。
// @description:es      Remove the registration prompt located at the bottom of the https://*.medium.com/* page and remove unnecessary content.
// @description:zh      移除位于https://*.medium.com/*页面下方的注册提示，以及移除非必要的内容。
// @description:zh-CN   移除位于https://*.medium.com/*页面下方的注册提示，以及移除非必要的内容。
// @description:zh-TW   移除位於https://*.medium.com/*頁面下方的註冊提示，以及移除非必要的內容。
// @author       TOC SH
// @license      MIT
// @namespace    none
// @match        *://*/*
// @icon         https://telegra.ph/file/6eb4ebf4ed38fa9f2b87c.png
// @grant        none
// @version      2.0
// @downloadURL https://update.greasyfork.org/scripts/502041/Medium%20%E7%B0%A1%E6%BD%94%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/502041/Medium%20%E7%B0%A1%E6%BD%94%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const selectors = [
        '*.ab.q.cn.fi',
        '*.ab.ac',
        '*.l.bw',
        '*.l.sy'
    ];

    function removeElements() {
        selectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => element.remove());
        });
    }

    function checkForMediumLogo() {
        if (document.querySelector('[data-testid="headerMediumLogo"]')) {
            removeElements();
            const observer = new MutationObserver(removeElements);
            const config = { childList: true, subtree: true };
            observer.observe(document.body, config);
        }
    }

    const observer = new MutationObserver(checkForMediumLogo);
    const config = { childList: true, subtree: true };
    observer.observe(document.body, config);

    // Initial check
    checkForMediumLogo();
})();