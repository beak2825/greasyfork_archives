// ==UserScript==
// @name         Hide Specific Flag Cards on Speaky
// @description  Hides all user cards with specified flags on Speaky
// @match        *://*.speaky.com/*
// @grant        none
// @version 0.0.1.20250303131759
// @namespace https://greasyfork.org/users/1435046
// @downloadURL https://update.greasyfork.org/scripts/528637/Hide%20Specific%20Flag%20Cards%20on%20Speaky.user.js
// @updateURL https://update.greasyfork.org/scripts/528637/Hide%20Specific%20Flag%20Cards%20on%20Speaky.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const flagIds = [
        "flag-icons-ma", // Morocco
        "flag-icons-us", // US
        "flag-icons-dz", // Algeria
        "flag-icons-ae", // UAE
        "flag-icons-ca", // Canada
        "flag-icons-gb", // UK
        "flag-icons-sa", // Saudi Arabia
        "flag-icons-iq", // Iraq
        "flag-icons-eg", // Egypt
        "flag-icons-au"  // Australia
    ];

    function hideFlagCards() {
        document.querySelectorAll('li.c-PJLV').forEach(li => {
            flagIds.forEach(flagId => {
                if (li.querySelector(`svg[id="${flagId}"]`)) {
                    li.style.display = 'none';
                }
            });
        });
    }

    function hideLanguageCards() {
        document.querySelectorAll('li.c-PJLV').forEach(li => {
            const speaksAr = li.querySelector('.c-kgeLBM-jWbhrq-speaks-true')?.textContent.includes('ar');
            const learnsArElement = li.querySelector('.c-kgeLBM-gEsXtw-learns-true');
            const learnsAr = learnsArElement ? learnsArElement.textContent.includes('ar') : false;
            if (speaksAr || !learnsArElement || !learnsAr) {
                li.style.display = 'none';
            }
        });
    }

    function hideCards() {
        hideFlagCards();
        hideLanguageCards();
    }

    // Run initially
    hideCards();

    // Observe mutations
    const observer = new MutationObserver(hideCards);
    observer.observe(document.body, { childList: true, subtree: true });
})();