// ==UserScript==
// @name         NS211助手
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  免登陆免扫码自动获取NS211真实下载链接
// @author       nd64
// @match        https://www.ns211.com/*
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/544832/NS211%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/544832/NS211%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    async function getDownloadLink(postID, type) {
        try {
            const response = await fetch(`${window.location.origin}/wp-admin/admin-ajax.php`, {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: `action=get_download_link&post_id=${postID}&type=${type}`
            });

            const data = await response.json();
            return data.success ? data.data.link : null;
        } catch (error) {
            return null;
        }
    }

    async function processDownloadButtons() {
        const downloadButtons = document.querySelectorAll('a.download-link[data-postid][data-type]');

        if (downloadButtons.length === 0) return;

        for (const button of downloadButtons) {
            const postID = button.getAttribute('data-postid');
            const type = button.getAttribute('data-type');

            const realLink = await getDownloadLink(postID, type);

            if (realLink) {
                button.href = realLink;
                button.target = '_blank';
                button.removeAttribute('data-postid');
                button.removeAttribute('data-type');
                button.textContent = '✅ ' + button.textContent;

                const newButton = button.cloneNode(true);
                button.parentNode.replaceChild(newButton, button);
            }
        }
    }

    processDownloadButtons();

})();