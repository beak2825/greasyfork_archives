1// ==UserScript==
// @name         Walmart Business Name Extractor
// @namespace    talus.dev
// @version      1.2
// @description  Extracts business name from Walmart.com seller page and appends it after the "Sold by" div
// @match        https://www.walmart.com/ip/*
// @grant        none
// @license      GPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/468765/Walmart%20Business%20Name%20Extractor.user.js
// @updateURL https://update.greasyfork.org/scripts/468765/Walmart%20Business%20Name%20Extractor.meta.js
// ==/UserScript==

(function() {
    'use strict';
  function decode(str) {
    let txt = document.createElement("textarea");
    txt.innerHTML = str;
    return txt.value;
  }

    // Function to extract the business name from the seller page
    function extractBusinessName() {
        const linkElement = document.querySelector('a[data-testid="view-seller-info-link"]');
        if (linkElement) {
            const sellerUrl = linkElement.href;
            fetch(sellerUrl)
                .then(response => response.text())
                .then(html => {
                    const businessNameRegex = /Business Name: <!-- -->\s*(.*?)<\/div>/;
                    const match = html.match(businessNameRegex);
                    if (match && match.length > 1) {
                        const businessName = match[1].trim();
                        console.log('Business Name:', businessName);

                        // Find the "Sold by" div on the original page
                        const soldByDivs = document.getElementsByClassName('lh-copy');
                        for (let i = 0; i < soldByDivs.length; i++) {
                            const soldByDiv = soldByDivs[i];
                            if (soldByDiv.textContent.match(/Sold.+by/)) {
                                // Create a new span element for the business name
                                const businessNameDiv = document.createElement('div');
                                businessNameDiv.className = 'mr0 black-90 b';
                                businessNameDiv.textContent = 'Business Name: ' + decode(businessName);

                                // Append the business name after the "Sold by" div
                                soldByDiv.appendChild(document.createTextNode(' '));
                                soldByDiv.appendChild(businessNameDiv);
                                break;
                            }
                        }
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                });
        }
    }

    // Call the extractBusinessName function when the page finishes loading
    window.addEventListener('load', extractBusinessName);
})();
