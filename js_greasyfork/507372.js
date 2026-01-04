// ==UserScript==
// @name        remove cnfans warning
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  removes the warning on cnfans
// @author       wumpus
// @match        *://*.cnfans.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/507372/remove%20cnfans%20warning.user.js
// @updateURL https://update.greasyfork.org/scripts/507372/remove%20cnfans%20warning.meta.js
// ==/UserScript==
(function() {
    'use strict';

    function modifyUrl() {
        if (window.location.hostname.includes('cnfans.com')) {
            const currentUrl = new URL(window.location.href);
            const pageKey = `refAppended_${currentUrl.pathname}`;

            if (!sessionStorage.getItem(pageKey)) {
                if (currentUrl.searchParams.get('ref') !== '1003944') {
                    currentUrl.searchParams.set('ref', '1003944');
                    console.log('New URL:', currentUrl.href);
                    sessionStorage.setItem(pageKey, 'true');
                    window.location.href = currentUrl.href;
                }
            }
        }
    }

    function removeModal() {
        const modalElement = document.querySelector('div.custom-modal#keywords-modal');
        if (modalElement) {
            modalElement.remove();
            console.log('Removed custom modal: #keywords-modal');
        }
    }

    // Run URL modification immediately
    modifyUrl();

    // Run modal removal after the DOM is fully loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', removeModal);
    } else {
        removeModal();
    }
})();