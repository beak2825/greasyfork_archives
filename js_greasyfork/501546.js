// ==UserScript==
// @name         Torn Bazaar Scraper
// @namespace    http://tampermonkey.net/
// @version      1.13
// @description  Scrape bazaars for a specific item in Torn City and display results
// @author       dingus
// @match        https://www.torn.com/imarket.php*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @connect      api.torn.com
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/501546/Torn%20Bazaar%20Scraper.user.js
// @updateURL https://update.greasyfork.org/scripts/501546/Torn%20Bazaar%20Scraper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const apiKey = 'YOUR API KEY HERE';
    let isRequestMade = false;

    function getItemIdFromUrl() {
        const urlParams = new URLSearchParams(window.location.hash.replace('#/', '').split('&').join('&'));
        return urlParams.get('type');
    }

    function getItemName() {
        const itemNameElement = document.querySelector('.name.t-gray-6');
        return itemNameElement ? itemNameElement.textContent.trim() : 'Unknown Item';
    }

    function fetchBazaarData(itemId) {
        const bazaarsApiUrl = `https://api.torn.com/market/${itemId}?selections=bazaar&key=${apiKey}`;
        GM_xmlhttpRequest({
            method: "GET",
            url: bazaarsApiUrl,
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            onload: function(response) {
                if (response.status === 200) {
                    try {
                        const data = JSON.parse(response.responseText);

                        if (data.bazaar && Array.isArray(data.bazaar)) {
                            const listings = data.bazaar.map(bazaarItem => ({
                                price: bazaarItem.cost,
                                quantity: bazaarItem.quantity
                            }));

                            displayResults(listings);
                            isRequestMade = true;
                        }
                    } catch (error) {
                        console.error('Error parsing API response:', error);
                    }
                } else {
                    console.error('Failed to fetch bazaar data.');
                }
            },
            onerror: function(error) {
                console.error('API Request Error:', error);
            }
        });
    }

    function displayResults(listings) {
        let container = document.getElementById('bazaar-results-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'bazaar-results-container';
            container.style.position = 'fixed';
            container.style.right = '10px';
            container.style.bottom = '50px';
            container.style.width = '350px';
            container.style.height = '450px';
            container.style.backgroundColor = '#1c1c1c';
            container.style.border = '1px solid #333';
            container.style.borderRadius = '8px';
            container.style.boxShadow = '0 0 8px rgba(0, 0, 0, 0.5)';
            container.style.padding = '15px';
            container.style.zIndex = '1000';
            container.style.overflowY = 'auto';
            document.body.appendChild(container);
        } else {
            container.innerHTML = '';
        }

        const title = document.createElement('h2');
        title.textContent = `Bazaars with Item: ${getItemName()}`;
        title.style.fontSize = '16px';
        title.style.marginBottom = '10px';
        title.style.color = '#e0e0e0';
        title.style.fontWeight = 'normal';
        container.appendChild(title);

        if (listings.length === 0) {
            const noResults = document.createElement('div');
            noResults.textContent = 'No bazaars found for this item.';
            noResults.style.color = '#aaa';
            noResults.style.fontStyle = 'italic';
            noResults.style.fontSize = '14px';
            container.appendChild(noResults);
        } else {
            listings.forEach(listing => {
                const itemDiv = document.createElement('div');
                itemDiv.style.marginBottom = '10px';
                itemDiv.style.padding = '10px';
                itemDiv.style.backgroundColor = '#2c2c2c';
                itemDiv.style.border = '1px solid #444';
                itemDiv.style.borderRadius = '4px';
                itemDiv.style.color = '#e0e0e0';
                itemDiv.style.fontSize = '14px';
                itemDiv.style.lineHeight = '1.4';
                itemDiv.style.fontWeight = 'normal';
                itemDiv.innerHTML = `<strong>Price:</strong> $${listing.price.toLocaleString()} <br> <strong>Quantity:</strong> ${listing.quantity}`;
                container.appendChild(itemDiv);
            });
        }
    }

    function refreshResults() {
        const itemId = getItemIdFromUrl();
        if (itemId && !isRequestMade) {
            fetchBazaarData(itemId);
        }
    }

    refreshResults();

    const observer = new MutationObserver(() => {
        refreshResults();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true
    });

    window.addEventListener('popstate', refreshResults);
    window.addEventListener('load', refreshResults);
})();
