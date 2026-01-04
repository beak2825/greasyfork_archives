// ==UserScript==
// @name         TinyChat Ad Fix by theLizardWizard
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Remove the ad container position on TinyChat
// @license MIT
// @match        https://tinychat.com/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/504566/TinyChat%20Ad%20Fix%20by%20theLizardWizard.user.js
// @updateURL https://update.greasyfork.org/scripts/504566/TinyChat%20Ad%20Fix%20by%20theLizardWizard.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function removeAdContainer() {
        const adContainer = document.querySelector('div[style*="width: 728px"][style*="height: 90px"][style*="position: fixed"][style*="bottom: 5px"]');
        if (adContainer) {
            adContainer.remove();
        }
    }
    function observeDOM() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    removeAdContainer();
                }
            });
        });
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            removeAdContainer();
            observeDOM();
        });
    } else {
        removeAdContainer();
        observeDOM();
    }
})();