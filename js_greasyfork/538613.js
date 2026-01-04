// ==UserScript==
// @name         Torn City Bazaar Price Filler (with Recommendation)
// @namespace    http://tampermonkey.net/
// @version      1.9 // Increment version for cache-busting fix
// @description  Fetches prices and recommendations, fills prices, and highlights "Good" items (full row) with button green and white text, bypassing cache.
// @author       Your Name
// @match        https://www.torn.com/bazaar.php*
// @grant        GM_xmlhttpRequest
// @connect      vaaaz.dev
// @downloadURL https://update.greasyfork.org/scripts/538613/Torn%20City%20Bazaar%20Price%20Filler%20%28with%20Recommendation%29.user.js
// @updateURL https://update.greasyfork.org/scripts/538613/Torn%20City%20Bazaar%20Price%20Filler%20%28with%20Recommendation%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const JSON_URL = 'https://vaaaz.dev/scripts/LowestPrice.json';
    const GOOD_ITEM_BACKGROUND_COLOR = '#28a745';
    const GOOD_ITEM_TEXT_COLOR = '#FFFFFF'; // White

    function addPriceFillerButton() {
        const button = document.createElement('button');
        button.id = 'fillPricesButton';
        button.textContent = 'Fill Prices & Highlight';
        button.style.position = 'fixed';
        button.style.top = '10px';
        button.style.right = '10px';
        button.style.zIndex = '9999';
        button.style.backgroundColor = GOOD_ITEM_BACKGROUND_COLOR;
        button.style.color = GOOD_ITEM_TEXT_COLOR;
        button.style.border = 'none';
        button.style.padding = '10px 15px';
        button.style.borderRadius = '5px';
        button.style.cursor = 'pointer';
        button.style.fontWeight = 'bold';
        button.style.fontSize = '14px';

        document.body.appendChild(button);

        button.addEventListener('click', fillItemPrices);
    }

    async function fetchPrices() {
        return new Promise((resolve, reject) => {
            // *** CACHE-BUSTING CHANGE HERE ***
            // Appending a unique timestamp to the URL to bypass browser/proxy caching
            const urlWithCacheBuster = JSON_URL + '?t=' + new Date().getTime();

            GM_xmlhttpRequest({
                method: 'GET',
                url: urlWithCacheBuster, // Use the URL with the timestamp
                onload: function(response) {
                    try {
                        const data = JSON.parse(response.responseText);
                        if (typeof data === 'object' && data !== null) {
                            resolve(data);
                        } else {
                            console.error('Fetched data is not the expected object format:', data);
                            reject(new Error('Fetched JSON data is not in the expected object format.'));
                        }
                    } catch (e) {
                        console.error('Error parsing JSON:', e);
                        reject(e);
                    }
                },
                onerror: function(error) {
                    console.error('Error fetching prices:', error);
                    reject(error);
                }
            });
        });
    }

    async function fillItemPrices() {
        let pricesData;
        try {
            pricesData = await fetchPrices();
        } catch (error) {
            alert(`Failed to fetch price data: ${error.message}. Check console for more details.`);
            return;
        }

        if (typeof pricesData !== 'object' || pricesData === null) {
            alert('Price data is not in the expected object format. Cannot fill prices.');
            console.error('pricesData is not an object:', pricesData);
            return;
        }

        const items = document.querySelectorAll('.items-cont li.clearfix');

        let updatedCount = 0;
        let notFoundCount = 0;
        let noIdCount = 0;
        let goodItemsCount = 0;

        items.forEach(itemElement => {
            const priceInput = itemElement.querySelector('.price input.input-money[type="text"]');
            const itemImage = itemElement.querySelector('.thumbnail .image-wrap img');
            const textElementsToColor = itemElement.querySelectorAll(
                '.name-wrap .t-overflow, ' +
                '.qty, ' +
                '.info-wrap.tt-item-price-color span, ' +
                '.price input.input-money[type="text"]'
            );

            itemElement.style.backgroundColor = '';
            textElementsToColor.forEach(el => {
                el.style.color = '';
            });

            if (priceInput && itemImage) {
                const imgSrc = itemImage.getAttribute('src');
                const match = imgSrc.match(/\/images\/items\/(\d+)\//);

                if (match && match[1]) {
                    const itemId = match[1];
                    const itemData = pricesData[itemId];

                    if (itemData && typeof itemData === 'object' && itemData.hasOwnProperty('price')) {
                        const lowestPrice = itemData.price;
                        const recommendation = itemData.recommendation;

                        const currentPrice = parseInt(priceInput.value.replace(/,/g, ''), 10);

                        if (isNaN(currentPrice) || currentPrice !== lowestPrice) {
                            priceInput.value = lowestPrice.toLocaleString('en-US').replace(/\.00$/, '');
                            priceInput.dispatchEvent(new Event('input', { bubbles: true }));
                            priceInput.dispatchEvent(new Event('change', { bubbles: true }));

                            const marketValueSpan = itemElement.querySelector('.info-wrap.tt-item-price-color span:first-child');
                            if (marketValueSpan) {
                                const currentMarketText = marketValueSpan.textContent;
                                const newMarketValueDisplay = `$${lowestPrice.toLocaleString('en-US')}`;
                                if (!currentMarketText.startsWith(newMarketValueDisplay)) {
                                    marketValueSpan.textContent = newMarketValueDisplay + currentMarketText.substring(currentMarketText.indexOf(' |'));
                                }
                            }
                            console.log(`Updated item ID ${itemId} price to: $${lowestPrice.toLocaleString('en-US')}`);
                            updatedCount++;
                        } else {
                            console.log(`Item ID ${itemId} already has the lowest price ($${lowestPrice.toLocaleString('en-US')}). Skipping price update.`);
                        }

                        if (recommendation && recommendation.toLowerCase() === 'good') {
                            itemElement.style.backgroundColor = GOOD_ITEM_BACKGROUND_COLOR;
                            textElementsToColor.forEach(el => {
                                el.style.color = GOOD_ITEM_TEXT_COLOR;
                            });
                            const itemNameForLog = itemElement.querySelector('.name-wrap .t-overflow');
                            console.log(`Highlighted "${itemNameForLog ? itemNameForLog.textContent.trim() : 'Unknown Name'}" (ID: ${itemId}) as "Good" (full row).`);
                            goodItemsCount++;
                        }

                    } else {
                        const itemNameForLog = itemElement.querySelector('.name-wrap .t-overflow');
                        const itemName = itemNameForLog ? itemNameForLog.textContent.trim() : 'Unknown Name';
                        console.log(`Item ID ${itemId} (${itemName}) found, but price data is malformed or missing.`);
                        notFoundCount++;
                    }
                } else {
                    const itemNameForLog = itemElement.querySelector('.name-wrap .t-overflow');
                    const itemName = itemNameForLog ? itemNameForLog.textContent.trim() : 'Unknown Name';
                    console.log(`Could not extract item ID from image src for "${itemName}". Image src: ${imgSrc}`);
                    noIdCount++;
                }
            } else {
                 console.warn('Could not find price input or image for an item entry. Or relevant text elements missing.');
            }
        });

        console.log(`Price filling finished: ${updatedCount} prices updated, ${goodItemsCount} items highlighted as "Good".`);
        console.log(`${notFoundCount} items had malformed/missing price data, ${noIdCount} IDs could not be extracted.`);
    }

    window.addEventListener('load', addPriceFillerButton);

})();