// ==UserScript==
// @name         Prognocis Hide ads on login page
// @namespace    prognocis.com
// @version      2025.01.24.0935
// @description  Hide intrusive internal and 3rd party advertisements on PronoCIS login screen
// @author       mrkrag
// @match        *.prognocis.com/prognocis/scrUserLogin.jsp*
// @icon         https://prognocis.com/wp-content/uploads/2020/07/cropped-Fav-192x192.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/524636/Prognocis%20Hide%20ads%20on%20login%20page.user.js
// @updateURL https://update.greasyfork.org/scripts/524636/Prognocis%20Hide%20ads%20on%20login%20page.meta.js
// ==/UserScript==
(function() {
    'use strict';

    // Function to replace elements with a custom message
    function replaceWithMessage() {
        const salesDivs = document.querySelectorAll('.salesdiv');
        salesDivs.forEach((div) => {
            div.innerHTML = '<span style="color: purple; font-size: 8pt; font-weight: bold;">ad hidden courtesy of mrkrag</span>';
        });
    }

    // Block requests to salesad.prognocis.com
    function blockSalesAds(request) {
        if (request.url.includes('salesad.prognocis.com/')) {
            request.abort(); // Block the request
        }
    }

    // Use MutationObserver to observe DOM changes and replace newly added salesdiv elements
    function observeSalesDivs() {
        const observer = new MutationObserver(() => {
            replaceWithMessage(); // Replace content with message as it is added
        });

        // Start observing the body for added nodes
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // Wait for the page to load
    window.addEventListener('load', () => {
        replaceWithMessage(); // Initially replace any matching divs
        observeSalesDivs(); // Start observing for dynamic content
    });
})();