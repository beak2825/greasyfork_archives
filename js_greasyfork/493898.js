// ==UserScript==
// @name         Remove Channels from WhatsApp Web (Scoped + Safe)
// @namespace    mailto:mastertohno@gmail.com
// @version      1.3
// @description  Removes the Channels button from the WhatsApp Web interface, scoped to header only
// @author       Mastah Shiki Tohno
// @match        *://web.whatsapp.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/493898/Remove%20Channels%20from%20WhatsApp%20Web%20%28Scoped%20%2B%20Safe%29.user.js
// @updateURL https://update.greasyfork.org/scripts/493898/Remove%20Channels%20from%20WhatsApp%20Web%20%28Scoped%20%2B%20Safe%29.meta.js
// ==/UserScript==

(function () {
    'use strict';
    function removeChannelsButton() {
        const btn = document.querySelector('[aria-label="Channels"]');
        if (btn) {
            const container = btn.closest('div');
            if (container && container.parentNode) {
                container.parentNode.removeChild(container);
                console.log('[Tampermonkey] Channels button removed.');
            }
        }
    }
    function waitForHeaderAndObserve() {
        const headerCheck = setInterval(() => {
            const header = document.querySelector('header');
            if (header) {
                clearInterval(headerCheck);
                removeChannelsButton(); // Initial cleanup

                let isScheduled = false;
                const observer = new MutationObserver(() => {
                    if (!isScheduled) {
                        isScheduled = true;
                        requestAnimationFrame(() => {
                            removeChannelsButton();
                            isScheduled = false;
                        });
                    }
                });
                observer.observe(header, {
                    childList: true,
                    subtree: true
                });
                console.log('[Tampermonkey] MutationObserver started on <header>.');
            }
        }, 500);
    }
    waitForHeaderAndObserve();
})();