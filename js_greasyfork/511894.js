// ==UserScript==
// @name         Kinguin Offer Redirect Button
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Adds a redirect button to each offer on Kinguin offers page after the page has fully loaded.
// @author       ChatGPT
// @match        https://www.kinguin.net/app/merchant/13766922/offer/myOffers*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/511894/Kinguin%20Offer%20Redirect%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/511894/Kinguin%20Offer%20Redirect%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to create and add the button
    function addButtonToOffers() {
        // Select all the offers in the table
        const offerLinks = document.querySelectorAll(".table-column a[href^='/app/merchant/']");

        offerLinks.forEach(offerLink => {
            const offerIdMatch = offerLink.href.match(/offer\/([a-z0-9]+)/);
            if (offerIdMatch) {
                const offerId = offerIdMatch[1];
                // Check if button already exists to avoid duplicate buttons
                if (!offerLink.parentElement.querySelector('.custom-offer-button')) {
                    const button = document.createElement('button');
                    button.textContent = 'Otomatikleştir Kankssss';
                    button.className = 'custom-offer-button';
                    button.style.backgroundColor = 'yellow';
                    button.style.color = 'black';
                    button.style.border = 'none';
                    button.style.padding = '5px 10px';
                    button.style.marginLeft = '10px';
                    button.style.cursor = 'pointer';
                    button.style.zIndex = '9999'; // Make sure the button is on top
                    button.onclick = () => {
                        window.open(`https://kinguintakip.com/ortakapifiltretablo.php?offerId=${offerId}`, '_blank'); // Open in a new tab
                    };

                    // Insert the button after the offer link
                    offerLink.parentElement.appendChild(button);
                }
            }
        });
    }

    // Observe changes to the DOM to ensure the table is fully loaded before adding buttons
    const observer = new MutationObserver((mutations, observer) => {
        const offerTable = document.querySelector(".sc-69ttrk-0.bwHZuU");
        if (offerTable) {
            addButtonToOffers();
        }
    });

    // Start observing the body for changes
    observer.observe(document.body, { childList: true, subtree: true });

    // Run addButtonToOffers every 5 seconds to catch dynamically loaded offers
    setInterval(addButtonToOffers, 5000);
})();