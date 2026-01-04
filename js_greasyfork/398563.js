// ==UserScript==
// @name         Copy Notion Page Content
// @name:zh-CN  复制 Notion 页面正文内容
// @namespace    http://www.notion.so/
// @version      0.1
// @description  Copy the Notion page's html content to clipboard.
// @description:zh-cn 复制 Notion 页面正文部分的 HTML 到剪贴板。
// @author       Ruter Lü
// @match        https://www.notion.so/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/398563/Copy%20Notion%20Page%20Content.user.js
// @updateURL https://update.greasyfork.org/scripts/398563/Copy%20Notion%20Page%20Content.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Helper function to wait for the element ready
    const waitFor = (...selectors) => new Promise(resolve => {
        const delay = 500;
        const f = () => {
            const elements = selectors.map(selector => document.querySelector(selector));
            if (elements.every(element => element != null)) {
                resolve(elements);
            } else {
                setTimeout(f, delay);
            }
        }
        f();
    });
    waitFor('div.notion-scroller .notion-record-icon').then(([iconEl]) => {
        console.log('Notion Page Loaded.');
        const disabled = iconEl.getAttribute('aria-disabled');
        if (disabled === 'true') {
            // Bind click event
            iconEl.addEventListener('click', event => {
                let content = document.querySelector('.notion-page-content');
                navigator.clipboard.writeText(content.outerHTML).then(function() {
                    /* clipboard successfully set */
                    console.log('Copy Notion Page Content Success.');
                }, function(e) {
                    /* clipboard write failed */
                    console.error(e);
                });
            });
        } else {
            return;
        }
    });
})();