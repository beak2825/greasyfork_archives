// ==UserScript==
// @name         MediaFire UI Restore
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  UI Restore
// @author       Your Name
// @match        https://www.mediafire.com/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/547057/MediaFire%20UI%20Restore.user.js
// @updateURL https://update.greasyfork.org/scripts/547057/MediaFire%20UI%20Restore.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1) {
                        const changedElement = node.querySelector('.upsell-ab-promo, .MFUltra');
                        if (changedElement) {
                            changedElement.remove();
                            console.log('');
                        }
                    }
                });
            }
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });

    window.addEventListener('load', () => {
        const initialChanges = document.querySelectorAll('.upsell-ab-promo, .MFUltra');
        initialChanges.forEach(el => el.remove());
    });
})();