// ==UserScript==
// @name         Remove Sponsored Offers
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Removes Sponsored Offers by looking for a "Gesponsert" text
// @author       Sandros & ChatGPT
// @match        *://www.gunfinder.de/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/525095/Remove%20Sponsored%20Offers.user.js
// @updateURL https://update.greasyfork.org/scripts/525095/Remove%20Sponsored%20Offers.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Function to remove sponsored offers
    function removeSponsoredOffers() {
        const offers = document.querySelectorAll('.col-6.col-md-4');

        offers.forEach(offer => {
            const sponsoredElement = offer.querySelector('.border-end.me-2.pe-2');
            if (sponsoredElement && sponsoredElement.textContent.includes('Gesponsert')) { //CHANGE THIS LINE IF YOU WANT IT TO REACT TO A DIFFERENT LANGUAGE
                offer.remove();
            }
        });
    }

    // Run the function when the page initially loads
    window.addEventListener('load', function () {
        removeSponsoredOffers();
    });

    // Set up a MutationObserver to detect changes in the DOM (useful for SPA or dynamically loaded content)
    const observer = new MutationObserver(function (mutationsList, observer) {
        mutationsList.forEach(mutation => {
            if (mutation.type === 'childList' || mutation.type === 'subtree') {
                removeSponsoredOffers();
            }
        });
    });

    // Observe changes in the body (typically where page content changes on navigation)
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Optional: Detect URL changes to handle paginated navigation
    let currentUrl = window.location.href;
    setInterval(function () {
        if (window.location.href !== currentUrl) {
            currentUrl = window.location.href;
            removeSponsoredOffers(); // Reapply the removal when the URL changes (i.e., when paginated)
        }
    }, 1000); // Check every second
})();
