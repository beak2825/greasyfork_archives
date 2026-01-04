// ==UserScript==
// @name         Bypass AnonyViet
// @name:vi       Bỏ qua AnonyViet
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Automatically bypass intermediate pages and redirect to the destination on AnonyViet
// @description:vi  Tự động bỏ qua trang trung gian và chuyển hướng đến trang đích trên AnonyViet
// @author       Yuusei
// @match        https://anonyviet.com/tieptucdentrangmoi/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/517527/Bypass%20AnonyViet.user.js
// @updateURL https://update.greasyfork.org/scripts/517527/Bypass%20AnonyViet.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    // Waiting for the DOM to load
    function waitForElement(selector) {
        return new Promise(resolve => {
            if (document.querySelector(selector)) {
                return resolve(document.querySelector(selector));
            }

            const observer = new MutationObserver(mutations => {
                if (document.querySelector(selector)) {
                    observer.disconnect();
                    resolve(document.querySelector(selector));
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        });
    }

    // Main processing
    async function main() {
        // Try to get the link from the element with id="target-link" first
        const targetLink = await waitForElement('#target-link');
        if (targetLink) {
            const href = targetLink.getAttribute('href');
            if (href) {
                window.location.href = href;
                return;
            }
        }

        // If there is no link, try to get it from the URL params
        const urlParams = new URLSearchParams(window.location.search);
        const targetUrl = urlParams.get('url');
        if (targetUrl) {
            window.location.href = decodeURIComponent(targetUrl);
        }
    }

    main().catch(console.error);
})();