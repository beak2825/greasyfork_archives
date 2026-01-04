// ==UserScript==
// @name         TornZ Market Helper
// @namespace    https://tornz.com
// @version      0.1.1
// @description  Shows TornZ bazaar listings on Torn's item market
// @author       ultrapro5000
// @match        https://www.torn.com/page.php?sid=ItemMarket*
// @grant        GM.xmlHttpRequest
// @connect      tornz.com
// @run-at       document-idle
// @license MIT
// @homepageURL  https://tornz.com
// @supportURL   https://www.torn.com/forums.php#/p=threads&f=67&t=16428643
// @downloadURL https://update.greasyfork.org/scripts/514273/TornZ%20Market%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/514273/TornZ%20Market%20Helper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const debug = (msg, ...args) => {
        console.log(`[TornZ] ${msg}`, ...args);
    };

    let isProcessing = false;

    const injectStyles = () => {
        const style = document.createElement('style');
        style.textContent = `
            .tornz-container {
                margin: 10px 0;
                padding: 10px;
                background: rgba(255, 255, 255, 0.05);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 4px;
                width: 100%;
            }
            .tornz-listings {
                display: flex;
                flex-wrap: wrap;
                gap: 10px;
            }
            .tornz-listing {
                flex: 1;
                min-width: 200px;
                padding: 8px;
                background: rgba(0, 0, 0, 0.2);
                border-radius: 4px;
            }
            .tornz-listing a {
                color: inherit;
                text-decoration: none;
            }
            .tornz-header {
                margin-bottom: 10px;
                padding-bottom: 5px;
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                font-weight: bold;
            }
            .tornz-seller {
                color: inherit;
                display: block;
                margin-bottom: 4px;
            }
            .tornz-price {
                color: #00a4ff;
                font-weight: bold;
            }
        `;
        document.head.appendChild(style);
    };

    const getItemIdFromUrl = () => {
        const hash = window.location.hash;
        const match = hash.match(/itemID=(\d+)/);
        return match ? match[1] : null;
    };

    const processPage = async () => {
        if (isProcessing) return;
        isProcessing = true;

        const itemId = getItemIdFromUrl();
        if (!itemId) {
            isProcessing = false;
            return;
        }

        // Find the item market content area
        const marketArea = document.querySelector('[class*="appHeaderWrapper"]');
        if (!marketArea) {
            debug('No market area found');
            isProcessing = false;
            return;
        }

        // Remove any existing containers
        document.querySelectorAll('.tornz-container').forEach(el => el.remove());

        // Create container
        const container = document.createElement('div');
        container.className = 'tornz-container';
        container.innerHTML = 'Loading listings...';

        // Insert after the header
        marketArea.parentNode.insertBefore(container, marketArea.nextSibling);

        try {
            const response = await new Promise((resolve, reject) => {
                GM.xmlHttpRequest({
                    method: 'GET',
                    url: `https://tornz.com/api/three-listings/${itemId}`,
                    headers: {
                        'Accept': 'application/json'
                    },
                    onload: (response) => resolve(response),
                    onerror: (error) => reject(error)
                });
            });

            const data = JSON.parse(response.responseText);
            if (data.data && data.data.length > 0) {
                container.innerHTML = `
                    <div class="tornz-header">Bazaar Listings:</div>
                    <div class="tornz-listings">
                        ${data.data.map(listing => `
                            <div class="tornz-listing">
                                <a href="https://www.torn.com/bazaar.php?userId=${listing.seller_torn_id}">
                                    <span class="tornz-seller">
                                        ${listing.seller_torn_username} [${listing.seller_torn_id}]
                                    </span>
                                    <span class="tornz-price">$${listing.price.toLocaleString()} (${listing.quantity}x)</span>
                                </a>
                            </div>
                        `).join('')}
                    </div>
                `;
            } else {
                //container.innerHTML = '<div class="tornz-header">No bazaar listings found</div>';
            }
        } catch (error) {
            debug('Error:', error);
            container.innerHTML = '<div class="tornz-header">Error loading listings</div>';
        }

        isProcessing = false;
    };

    const init = () => {
        debug('Initializing...');
        injectStyles();

        // Initial processing with longer delay for React
        setTimeout(processPage, 3000);

        // Watch for hash changes
        let lastHash = window.location.hash;
        setInterval(() => {
            const currentHash = window.location.hash;
            if (currentHash !== lastHash) {
                lastHash = currentHash;
                setTimeout(processPage, 1000);
            }
        }, 500);

        // Watch for DOM changes
        const observer = new MutationObserver((mutations) => {
            if (!document.querySelector('.tornz-container')) {
                setTimeout(processPage, 500);
            }
        });

        observer.observe(document, {
            childList: true,
            subtree: true
        });
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
