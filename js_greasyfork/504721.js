// ==UserScript==
// @name         Avoid AMP Pages from Google Search
// @version      1.0
// @description  Redirect Google AMP links to the original page
// @author        DoctorEye
// @namespace     DoctorEye
// @match        *://*.google.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/504721/Avoid%20AMP%20Pages%20from%20Google%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/504721/Avoid%20AMP%20Pages%20from%20Google%20Search.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Ελέγχει εάν η σελίδα περιέχει AMP element
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            mutation.addedNodes.forEach(function(node) {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    const ampLink = node.querySelector('a[href*="/amp/"]');
                    if (ampLink) {
                        const originalLink = ampLink.href.replace('/amp/', '/');
                        window.location.href = originalLink;
                    }
                }
            });
        });
    });

    // Στόχευση στο κύριο στοιχείο της σελίδας για παρακολούθηση των αλλαγών
    const targetNode = document.querySelector('body');
    const config = { childList: true, subtree: true };

    // Εκκίνηση του observer
    observer.observe(targetNode, config);

    // Πρόσθετη ασφάλεια - ανακατεύθυνση αν η σελίδα είναι ήδη AMP
    if (window.location.pathname.includes('/amp/')) {
        const originalLink = window.location.href.replace('/amp/', '/');
        window.location.href = originalLink;
    }

})();
