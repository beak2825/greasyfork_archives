// ==UserScript==
// @name         Telegram 无限制转发删除（使用火狐浏览器有效）
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Telegram 突破按钮限制（转发与删除）脚本，适合网页端telegram使用。安装该脚本插件，建议使用火狐！chrome内核浏览器无效！
// @author       啤酒花
// @license      GNU GPLv3
// @match        https://web.telegram.org/*
// @match        https://webk.telegram.org/*
// @match        https://webz.telegram.org/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/515048/Telegram%20%E6%97%A0%E9%99%90%E5%88%B6%E8%BD%AC%E5%8F%91%E5%88%A0%E9%99%A4%EF%BC%88%E4%BD%BF%E7%94%A8%E7%81%AB%E7%8B%90%E6%B5%8F%E8%A7%88%E5%99%A8%E6%9C%89%E6%95%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/515048/Telegram%20%E6%97%A0%E9%99%90%E5%88%B6%E8%BD%AC%E5%8F%91%E5%88%A0%E9%99%A4%EF%BC%88%E4%BD%BF%E7%94%A8%E7%81%AB%E7%8B%90%E6%B5%8F%E8%A7%88%E5%99%A8%E6%9C%89%E6%95%88%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to enable buttons
    function enableButtons() {
        // Select the forward button
        const forwardButton = document.querySelector('button.selection-container-forward');
        const deleteButton = document.querySelector('button.selection-container-delete');

        // Remove 'disabled=""' attribute if it exists
        if (forwardButton) {
            forwardButton.removeAttribute('disabled');
        }
        if (deleteButton) {
            deleteButton.removeAttribute('disabled');
        }
    }

    // Initial check when the page loads
    enableButtons();

    // MutationObserver to watch for DOM changes and re-enable buttons
    const observer = new MutationObserver(() => {
        enableButtons();
    });

    // Start observing the body for child nodes and subtree changes
    observer.observe(document.body, { childList: true, subtree: true });
})();