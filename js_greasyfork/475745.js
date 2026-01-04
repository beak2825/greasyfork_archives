// ==UserScript==
// @name         Hellcase Win Rate Calculator
// @version      1.0
// @description  Intercept Hellcase API and calculate the chance to earn money on one case
// @author       Altorru
// @match        https://hellcase.com/fr/open/*
// @grant        GM_xmlhttpRequest
// @namespace https://greasyfork.org/users/1177108
// @downloadURL https://update.greasyfork.org/scripts/475745/Hellcase%20Win%20Rate%20Calculator.user.js
// @updateURL https://update.greasyfork.org/scripts/475745/Hellcase%20Win%20Rate%20Calculator.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Initialize a variable to store the total odds
    let totalOdds = 0;

    // Get the current page's URL
    const currentPageUrl = window.location.href;

    // Extract the part of the URL after 'https://hellcase.com/fr/open/'
    const urlSuffix = currentPageUrl.replace('https://hellcase.com/fr/open/', '');

    // Construct the API request URL
    const apiUrl = `https://api.hellcase.com/open/${urlSuffix}`;

    // Intercept the request to the constructed API URL
    GM_xmlhttpRequest({
        method: 'GET',
        url: apiUrl,
        onload: function(response) {
            try {
                // Parse the JSON response
                const data = JSON.parse(response.responseText);

                // Access the 'slice_code' property and log it
                if (data && data.slice_code) {
                    console.log('Value of slice_code:', data.slice_code);

                    // Now you can use the 'data.slice_code' value in your specific API request
                    const specificApiUrl = `https://api.hellcase.com/cases/get_slice/${data.slice_code}?game=csgo`;

                    // Make a new API request using the extracted slice_code
                    GM_xmlhttpRequest({
                        method: 'GET',
                        url: specificApiUrl,
                        onload: function(specificResponse) {
                            try {
                                // Parse the JSON response from the specific API request
                                const specificData = JSON.parse(specificResponse.responseText);

                                // Access and log the specific data here if needed
                                console.log('Specific API Response:', specificData);

                                // Extract the value of <div class="core-price core-price--preset--default">
                                const priceElement = document.querySelector('.core-price.core-price--preset--default');
                                if (priceElement) {
                                    const priceText = priceElement.textContent;

                                    // Use regular expression to extract the decimal number
                                    const priceValueMatch = priceText.match(/\d+\.\d+/);

                                    if (priceValueMatch) {
                                        const priceValue = parseFloat(priceValueMatch[0]); // Convert to a float

                                        // Iterate through the structure and calculate total odds
                                        if (specificData && specificData.items) {
                                            for (const item of specificData.items) {
                                                if (item && item.items) {
                                                    for (const subItem of item.items) {
                                                        if (subItem && subItem.steam_price_en >= priceValue) {
                                                            totalOdds += subItem.odds;
                                                        }
                                                    }
                                                }
                                            }
                                        }

                                        // Create a new HTML element to display the total odds
                                        const oddsElement = document.createElement('h1');
                                        oddsElement.textContent = `Win money : ${totalOdds}%`;
                                        oddsElement.style.position = 'relative';
                                        oddsElement.style.zIndex = '9'; // Set a higher z-index
                                        oddsElement.style.top = '180px';
                                        oddsElement.style.textAlign = 'center';

                                        // Find the target element to insert the odds element
                                        const targetElement = document.querySelector('.core-case-image.core-case-image--case.core-case-image-block__image');

                                        if (targetElement) {
                                            // Insert the odds element next to the target element
                                            targetElement.insertAdjacentElement('afterend', oddsElement);
                                        } else {
                                            console.error('Target element not found');
                                        }
                                    } else {
                                        console.error('Price value not found');
                                    }
                                } else {
                                    console.error('Price element not found');
                                }
                            } catch (error) {
                                console.error('Error parsing specific JSON:', error);
                            }
                        },
                        onerror: function(specificError) {
                            console.error('Error in specific API request:', specificError);
                        }
                    });
                } else {
                    console.error('slice_code not found in the response');
                }
            } catch (error) {
                console.error('Error parsing JSON:', error);
            }
        },
        onerror: function(error) {
            console.error('Error:', error);
        }
    });

})();
