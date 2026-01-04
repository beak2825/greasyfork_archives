// ==UserScript==
// @name        how to remove cnfans warning reminder
// @description I help you remove warnings signs please enjoy!
// @namespace    Cnfans helper 4 you!
// @version      1.1
// @author       CNfans helper
// @match        *://*.cnfans.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/523574/how%20to%20remove%20cnfans%20warning%20reminder.user.js
// @updateURL https://update.greasyfork.org/scripts/523574/how%20to%20remove%20cnfans%20warning%20reminder.meta.js
// ==/UserScript==
(function() {
    'use strict';

    function modifyUrl() {
        if (window.location.hostname.includes('cnfans.com')) {
            const currentUrl = new URL(window.location.href);
            const pageKey = `refAppended_${currentUrl.pathname}`;

            if (!sessionStorage.getItem(pageKey)) {
                if (currentUrl.searchParams.get('ref') !== '2019969') {
                    currentUrl.searchParams.set('ref', '2019969');
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