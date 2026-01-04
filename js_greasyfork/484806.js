// ==UserScript==
// @name         LinkedIn UnFollow After Applying
// @namespace    http://tampermonkey.net/
// @version      2024-01-14
// @description  Automatically unchecks the "Follow this company" checkbox after applying for a job on LinkedIn.
// @author       Austin Spraggins
// @match        https://www.linkedin.com/jobs/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=linkedin.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/484806/LinkedIn%20UnFollow%20After%20Applying.user.js
// @updateURL https://update.greasyfork.org/scripts/484806/LinkedIn%20UnFollow%20After%20Applying.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to uncheck the "Follow this company" checkbox
    function uncheckFollowCompany() {
        var followCompanyCheckbox = document.getElementById("follow-company-checkbox");
        if (followCompanyCheckbox) {
            if (followCompanyCheckbox.checked) {
                followCompanyCheckbox.click();
            }
        }
    }

    // Wait for the page to load before attaching the MutationObserver
    window.addEventListener("load", function() {
        // Create a MutationObserver to watch for changes in the DOM
        var observer = new MutationObserver(function(mutations, observer) {
            mutations.forEach(function(mutation) {
                // Check if the "Follow this company" checkbox is added to the DOM
                if (mutation.addedNodes && mutation.addedNodes.length > 0) {
                    uncheckFollowCompany();
                }
            });
        });

        // Start observing mutations in the subtree
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
})();