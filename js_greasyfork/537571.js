// ==UserScript==
// @name         Facebook Login Bypass
// @version      4.0
// @description  Prevent Facebook's "Log in" prompt from blocking Marketplace/Other Usage.
// @author       e.e
// @match        *://*.facebook.com/*
// @grant        none
// @run-at       document-start
// @license MIT
// @namespace https://greasyfork.org/users/1476064
// @downloadURL https://update.greasyfork.org/scripts/537571/Facebook%20Login%20Bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/537571/Facebook%20Login%20Bypass.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const containerSelector = '.__fb-light-mode.x1n2onr6.xzkaem6';
    const targetText = 'See more on Facebook';
    const findAndRemoveLoginWall = () => {
        const containers = document.querySelectorAll(containerSelector);
        for (const container of containers) {
            if (container.innerText && container.innerText.includes(targetText)) {
                console.log('[FB Blocker ~ e.e] Found the specific login wall pop-up. Removing it.', container);
                container.remove();
                const htmlElement = document.documentElement;
                if (htmlElement.style.overflow === 'hidden') {
                    htmlElement.style.overflow = '';
                    console.log('[FB Blocker ~ e.e] Restored page scrolling.');
                }
                break;
            }
        }
    };

    const observer = new MutationObserver(findAndRemoveLoginWall);
    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    });
    findAndRemoveLoginWall();
})();