// ==UserScript==
// @name         Check for Pet and Item Matches in Other Trades
// @namespace    https://www.chickensmoothie.com/Forum/memberlist.php?mode=viewprofile&u=27725
// @version      0.4
// @description  Alerts you if your pets or items in the current trade are also in other active trades
// @author       winx from CS
// @match        https://www.chickensmoothie.com/trades/*
// @grant        GM_xmlhttpRequest
// @grant        GM_cookie
// @downloadURL https://update.greasyfork.org/scripts/523353/Check%20for%20Pet%20and%20Item%20Matches%20in%20Other%20Trades.user.js
// @updateURL https://update.greasyfork.org/scripts/523353/Check%20for%20Pet%20and%20Item%20Matches%20in%20Other%20Trades.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to check if the current URL is a shareable trade link (with extra params like userid and signature)
    function isShareableTradeLink() {
        const currentURL = window.location.href;
        const shareableLinkRegex = /[\?&](userid|signature)=/;
        return shareableLinkRegex.test(currentURL); // Return true if it's a shareable link
    }

    // Prevent the script from running on shareable trade links
    if (isShareableTradeLink()) {
        console.log('Shareable trade link detected. Skipping script.');
        return; // Exit the script if it's a shareable link
    }

    // Extract pet IDs from the trade page HTML
    function extractMyPetIDs(pageHTML) {
        const petIDs = [];
        const parser = new DOMParser();
        const doc = parser.parseFromString(pageHTML, 'text/html');

        // Find all trade panels (your side is always the second panel)
        const tradePanels = doc.querySelectorAll('.section.panel.bg4');
        console.log('Found trade panels:', tradePanels.length);

        if (tradePanels.length > 1) {
            const mySidePanel = tradePanels[1]; // The second panel is your side
            console.log('Found your side of the trade');

            // Extract pet links from your side of the trade
            const petLinks = mySidePanel.querySelectorAll('.trade-things .pets a');
            console.log('Found pet links:', petLinks.length);

            petLinks.forEach(link => {
                const petID = link.href.split('id=')[1]; // Get the pet ID from the URL
                petIDs.push(petID);
            });
        }

        console.log('My pet IDs:', petIDs);
        return petIDs;
    }

    // Extract item IDs from the trade page HTML
    function extractMyItemIDs(pageHTML) {
        const itemIDs = [];
        const parser = new DOMParser();
        const doc = parser.parseFromString(pageHTML, 'text/html');

        // Find the items section on your side of the trade
        const tradePanels = doc.querySelectorAll('.section.panel.bg4');
        console.log('Found trade panels:', tradePanels.length);

        if (tradePanels.length > 1) {
            const mySidePanel = tradePanels[1]; // Your side is always the second panel
            console.log('Found your side of the trade for items');

            // Get item images from your side of the trade
            const itemImages = mySidePanel.querySelectorAll('.trade-things .items img');
            console.log('Found item images:', itemImages.length);

            itemImages.forEach(img => {
                const src = img.src;
                const itemID = src.split('/item/')[1]; // Extract the item ID from the URL
                itemIDs.push(itemID);
            });
        }

        console.log('My item IDs:', itemIDs);
        return itemIDs;
    }

    // Fetch active trade IDs from the active trades section
    function fetchActiveTradeIDs(excludeTradeID) {
        return new Promise((resolve, reject) => {
            const url = 'https://www.chickensmoothie.com/trades/tradingcenter.php';
            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                onload: function(response) {
                    const pageHTML = response.responseText;
                    const tradeIDs = [];

                    // Find the active trades section and extract trade IDs
                    const activeTradesTable = pageHTML.match(/<table class="cstable tradelist" id='active-trades'([\s\S]*?)<\/table>/);
                    if (activeTradesTable) {
                        const tradeLinks = Array.from(activeTradesTable[0].matchAll(/viewtrade\.php\?id=(\d+)/g));
                        tradeLinks.forEach(link => {
                            const tradeID = link[1];
                            if (tradeID !== excludeTradeID) {
                                tradeIDs.push(tradeID);
                            }
                        });
                    }

                    console.log('Fetched active trade IDs:', tradeIDs);
                    resolve(tradeIDs);
                },
                onerror: function(error) {
                    console.error('Failed to fetch trade IDs:', error);
                    reject(error);
                }
            });
        });
    }

    // Fetch pet and item IDs from a specific trade
    function fetchTradeIDs(tradeID) {
        return new Promise((resolve, reject) => {
            const url = `https://www.chickensmoothie.com/trades/viewtrade.php?id=${tradeID}`;
            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                onload: function(response) {
                    console.log('Fetching trade page:', url);
                    const petIDs = extractMyPetIDs(response.responseText);
                    const itemIDs = extractMyItemIDs(response.responseText);
                    resolve({ tradeID, petIDs, itemIDs });
                },
                onerror: function(error) {
                    console.error('Failed to fetch trade page:', url, error);
                    reject(error);
                }
            });
        });
    }

    // Compare your pets and items with other active trades and show a warning if there are matches
    function checkForMatches(currentPetIDs, currentItemIDs) {
        const currentTradeID = window.location.href.split('id=')[1];
        console.log('Current Trade ID:', currentTradeID);

        fetchActiveTradeIDs(currentTradeID)
            .then(tradeIDs => {
                const promises = tradeIDs.map(tradeID => fetchTradeIDs(tradeID));

                Promise.all(promises)
                    .then(results => {
                        const matchingTrades = [];

                        // Look for matching pets or items in other trades
                        results.forEach(({ tradeID, petIDs, itemIDs }) => {
                            const matchedPets = petIDs.filter(petID => currentPetIDs.includes(petID));
                            const matchedItems = itemIDs.filter(itemID => currentItemIDs.includes(itemID));
                            console.log(`Matching pets for trade ${tradeID}:`, matchedPets);
                            console.log(`Matching items for trade ${tradeID}:`, matchedItems);

                            if (matchedPets.length > 0 || matchedItems.length > 0) {
                                matchingTrades.push({ tradeID, matchedPets, matchedItems });
                            }
                        });

                        // If there are matches, show a warning
                        if (matchingTrades.length > 0) {
                            let warningHTML = '<div class="section panel bg5 time">';
                            warningHTML += '<div class="inner">';
                            warningHTML += '<span class="corners-top"><span></span></span>';
                            warningHTML += '<div class="infoline view-trade-share-link-infoline">';
                            warningHTML += '<div class="warning-box">';
                            warningHTML += 'Warning: Your pets or items are in other active trades!';
                            warningHTML += '<ul>';

                            matchingTrades.forEach(({ tradeID, matchedPets, matchedItems }) => {
                                warningHTML += `<li><a href="https://www.chickensmoothie.com/trades/viewtrade.php?id=${tradeID}" target="_blank">Trade ID: ${tradeID}</a> - `;

                                if (matchedPets.length > 0) {
                                    warningHTML += `Matched Pets: `;
                                    matchedPets.forEach(petID => {
                                        warningHTML += `<a href="https://www.chickensmoothie.com/viewpet.php?id=${petID}" target="_blank">Pet ID: ${petID}</a> `;
                                    });
                                }

                                if (matchedItems.length > 0) {
                                    warningHTML += `Matched Items: `;
                                    matchedItems.forEach(itemID => {
                                        // Construct the correct item URL using the base URL "https://static.chickensmoothie.com/item/"
                                        const itemURL = `https://static.chickensmoothie.com/item/${itemID}`;
                                        warningHTML += `<a href="${itemURL}" target="_blank">Item ID: ${itemID}</a> `;
                                    });
                                }

                                warningHTML += '</li>';
                            });

                            warningHTML += '</ul>';
                            warningHTML += '</div>';
                            warningHTML += '</div>';
                            warningHTML += '<span class="corners-bottom"><span></span></span>';
                            warningHTML += '</div>';
                            warningHTML += '</div>';

                            // Insert the warning message into the page
                            const bg5TimeSection = document.querySelector('.section.panel.bg5.time');
                            const tradeActionButtons = document.querySelector('.trade-action-buttons');

                            if (bg5TimeSection && tradeActionButtons) {
                                bg5TimeSection.insertAdjacentHTML('afterend', warningHTML);
                                console.log('Injected warning message with matching trades:', matchingTrades);
                            } else {
                                console.error('Could not find bg5 time section or trade action buttons to insert the warning.');
                            }
                        }
                    })
                    .catch(error => console.error('Error fetching trade IDs:', error));
            })
            .catch(error => console.error('Error fetching active trades:', error));
    }

    // Run the check when the page is fully loaded
    window.addEventListener('load', function() {
        const petIDs = extractMyPetIDs(document.body.innerHTML);
        const itemIDs = extractMyItemIDs(document.body.innerHTML);
        checkForMatches(petIDs, itemIDs);
    });

    // Add custom styles for the warning box
    const style = document.createElement('style');
    style.textContent = `
        .warning-box {
            background-color: #f8d7da;
            color: #721c24;
            padding: 8px 15px; /* Adjust padding for top and bottom, and left and right */
            border: 1px solid #f5c6cb;
            border-radius: 4px;
            font-size: 14px;
            margin-top: 10px;
            margin-bottom: 10px; /* Added bottom margin */
        }

        .warning-box a {
            color: #721c24;
            text-decoration: underline;
        }

        .warning-box a:hover {
            color: #491217;
        }

        .section.panel.bg5.time .trade-icon-info {
            display: none;
        }
    `;
    document.head.appendChild(style);

})();
