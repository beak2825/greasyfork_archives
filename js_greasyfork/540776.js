// ==UserScript==
// @name         PoE Trade Enchancer
// @source       https://github.com/KamilChowaniec/PoE-Trade-Enchancer
// @version      1.0
// @description  Adds tilde (~) to mods searching, Adds Seller Analysis to check how many copies of the same item a seller has listed
// @author       KamilChowaniec
// @match        https://www.pathofexile.com/trade/*
// @match        https://www.pathofexile.com/trade2/*
// @match        http://www.poe.sale/*
// @match        http://www.poe2.sale/*
// @grant        GM_setValue
// @grant        GM_getValue
// @namespace https://greasyfork.org/users/1488487
// @downloadURL https://update.greasyfork.org/scripts/540776/PoE%20Trade%20Enchancer.user.js
// @updateURL https://update.greasyfork.org/scripts/540776/PoE%20Trade%20Enchancer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // A key for storing and retrieving the setting
    const MIN_LISTINGS_KEY = 'sa_min_listings_count';

    //================================================================================
    // SECTION 1: Tilde-Adding Functionality (Unchanged)
    //================================================================================
    document.body.addEventListener("keydown", (event) => {
        if (event.target.classList.contains("multiselect__input") && !event.target.value.startsWith("~")) {
            const selStart = event.target.selectionStart;
            const selEnd = event.target.selectionEnd;
            event.target.value = "~" + event.target.value;
            event.target.setSelectionRange(selStart + 1, selEnd + 1);
        }
    });

    //================================================================================
    // SECTION 2: Reactive Seller Analysis Panel
    //================================================================================

    function injectPanelStyles() {
        const panelStyles = `
            #seller-analysis-panel {
                margin-top: 15px; padding-top: 15px; border-top: 1px solid #444;
            }
            .sa-title {
                color: #AAA; font-size: 0.9em; text-transform: uppercase; margin-bottom: 10px; font-weight: bold;
            }
            .sa-controls { display: flex; flex-direction: column; gap: 10px; margin-bottom: 15px; }
            .sa-controls-row { display: flex; align-items: center; gap: 10px; }
            .sa-controls-row label { white-space: nowrap; color: #ccc; }
            .sa-controls-row input[type="number"] {
                background: #111; border: 1px solid #555; color: #fff; padding: 5px; border-radius: 3px; width: 60px;
            }
            .sa-button {
                background-color: #3a3a3a; color: #ccc; border: 1px solid #555; padding: 6px 12px; border-radius: 3px; cursor: pointer; text-align: center;
            }
            .sa-button:hover { background-color: #4a4a4a; }
            .sa-button:disabled { background-color: #2a2a2a; color: #666; cursor: not-allowed; }
            .sa-results {
                max-height: 300px; overflow-y: auto;
                scrollbar-width: thin; scrollbar-color: #9f9f9f transparent;
            }
            .sa-results::-webkit-scrollbar { width: 8px; }
            .sa-results::-webkit-scrollbar-track { background: transparent; }
            .sa-results::-webkit-scrollbar-thumb {
                background-color: #9f9f9f; border-radius: 20px; border: 2px solid transparent; background-clip: content-box;
            }
            .sa-results::-webkit-scrollbar-thumb:hover { background-color: #d1d1d1; }
            .sa-results table { width: 100%; border-collapse: collapse; }
            .sa-results th, .sa-results td {
                padding: 6px 8px; text-align: left; border-bottom: 1px solid #333; font-size: 0.9em;
                vertical-align: middle;
            }
            .sa-results th { background-color: #2a2a2a; color: #aaa; }
            .sa-results tr:last-child td { border-bottom: none; }
            .sa-results .count-col { width: 50px; text-align: right; }
            .sa-results .price-col { width: 95px; text-align: right; white-space: nowrap; }
            .sa-currency-icon {
                height: 1em;
                vertical-align: -0.15em;
                margin-left: 3px;
            }
            .seller-scroll-link {
                background: none; border: none; padding: 0; font: inherit; text-align: left;
                color: #88c9f5; text-decoration: none; cursor: pointer;
            }
            .seller-scroll-link:hover { text-decoration: underline; }
            .item-row-highlight {
                transition: background-color 0.5s ease-in-out;
                background-color: rgba(255, 255, 100, 0.15) !important;
            }
        `;
        const styleSheet = document.createElement("style");
        styleSheet.innerText = panelStyles;
        document.head.appendChild(styleSheet);
    }

    function handleSellerClick(event) {
        const target = event.target.closest('.seller-scroll-link');
        if (!target) return;
        event.preventDefault();
        const sellerName = target.dataset.sellerName;
        if (!sellerName) return;
        // Find the *first* item by that seller in the list
        for (const link of document.querySelectorAll(".results .profile-link a")) {
            if (link.innerText.trim() == sellerName) {
                const itemRow = link.closest('.row');
                if (itemRow) {
                    itemRow.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    itemRow.classList.add('item-row-highlight');
                    setTimeout(() => itemRow.classList.remove('item-row-highlight'), 2500);
                    return; // Stop after finding and scrolling to the first one
                }
            }
        }
    }

    function performAnalysis() {
        const resultsContainer = document.getElementById('sa-results-container');
        const minCountInput = document.getElementById('sa-min-count');
        if (!resultsContainer || !minCountInput) return;

        const minCount = parseInt(minCountInput.value, 10) || 2;
        const sellerData = {};
        const currencyIcons = {};

        document.querySelectorAll(".results .row").forEach(row => {
            const sellerNameEl = row.querySelector(".profile-link a");
            const priceEl = row.querySelector('.price span[data-field="price"]');

            if (!sellerNameEl || !priceEl) return; // Skip if no seller or price element

            const sellerName = sellerNameEl.innerText.trim();
            const priceAmountEl = priceEl.querySelector('span:nth-of-type(2)');
            const currencyImgEl = priceEl.querySelector('.currency-text img');

            if (!priceAmountEl || !currencyImgEl || !sellerName) return;

            const price = parseFloat(priceAmountEl.innerText.replace(/,/g, ''));
            const currency = currencyImgEl.getAttribute('alt');
            const currencyIconSrc = currencyImgEl.getAttribute('src');

            if (isNaN(price) || !currency) return;

            if (currency && !currencyIcons[currency]) {
                currencyIcons[currency] = currencyIconSrc;
            }

            if (!sellerData[sellerName]) {
                sellerData[sellerName] = { pricesByCurrency: {} };
            }
            if (!sellerData[sellerName].pricesByCurrency[currency]) {
                sellerData[sellerName].pricesByCurrency[currency] = [];
            }

            sellerData[sellerName].pricesByCurrency[currency].push(price);
        });

        const processedSellers = Object.entries(sellerData).map(([name, data]) => {
            let totalCount = 0;
            let dominantCurrency = '';
            let maxListingsInCurrency = 0;

            for (const [currency, prices] of Object.entries(data.pricesByCurrency)) {
                const currentCount = prices.length;
                totalCount += currentCount;
                if (currentCount > maxListingsInCurrency) {
                    maxListingsInCurrency = currentCount;
                    dominantCurrency = currency;
                }
            }

            const dominantPrices = data.pricesByCurrency[dominantCurrency] || [];
            const minPrice = dominantPrices.length > 0 ? Math.min(...dominantPrices) : null;
            const maxPrice = dominantPrices.length > 0 ? Math.max(...dominantPrices) : null;

            return {
                name,
                count: totalCount,
                minPrice,
                maxPrice,
                currency: dominantCurrency
            };
        });

        const sortedSellers = processedSellers
            .filter(seller => seller.count >= minCount)
            .sort((a, b) => b.count - a.count);

        if (sortedSellers.length === 0) {
            resultsContainer.innerHTML = `<div style="padding: 8px; color: #888;">No sellers found with ≥ ${minCount} listings.</div>`;
            return;
        }

        let tableHtml = `<table><thead><tr>
                            <th>Seller</th>
                            <th class="price-col">Min</th>
                            <th class="price-col">Max</th>
                            <th class="count-col">Count</th>
                        </tr></thead><tbody>`;

        sortedSellers.forEach(({ name, count, minPrice, maxPrice, currency }) => {
            const safeName = name.replace(/"/g, '""');
            const iconSrc = currencyIcons[currency] || '';
            const iconHtml = iconSrc ? `<img class="sa-currency-icon" src="${iconSrc}" alt="${currency}">` : ` ${currency}`;

            const minPriceHtml = minPrice !== null ? `${minPrice}${iconHtml}` : '—';
            const maxPriceHtml = maxPrice !== null ? `${maxPrice}${iconHtml}` : '—';

            tableHtml += `<tr>
                            <td><button type="button" class="seller-scroll-link" data-seller-name="${safeName}">${name}</button></td>
                            <td class="price-col">${minPriceHtml}</td>
                            <td class="price-col">${maxPriceHtml}</td>
                            <td class="count-col">${count}</td>
                          </tr>`;
        });

        tableHtml += `</tbody></table>`;
        resultsContainer.innerHTML = tableHtml;
    }

    function loadAllResults() {
        const loadBtn = document.getElementById('sa-load-all-btn');
        if (loadBtn) {
            loadBtn.disabled = true;
            loadBtn.innerText = 'Loading...';
        }
        const interval = setInterval(() => {
            const loadMoreBtn = document.querySelector(".load-more-btn");
            if (loadMoreBtn) {
                loadMoreBtn.click();
            } else {
                clearInterval(interval);
                if (loadBtn) {
                    loadBtn.disabled = false;
                    loadBtn.innerText = 'Load All Results';
                }
            }
        }, 200);
    }

    function createAnalysisPanel() {
        if (document.getElementById('seller-analysis-panel')) return;

        // MODIFICATION: Get the persisted value, defaulting to 3
        const savedMinCount = GM_getValue(MIN_LISTINGS_KEY, 3);

        const panelContainer = document.createElement('div');
        panelContainer.id = 'seller-analysis-panel';
        // MODIFICATION: Use the savedMinCount in the input's value attribute
        panelContainer.innerHTML = `
            <div class="sa-title">Seller Analysis</div>
            <div class="sa-controls">
                <button id="sa-load-all-btn" class="sa-button">Load All Results</button>
                <div class="sa-controls-row">
                    <label for="sa-min-count">Min Listings:</label>
                    <input type="number" id="sa-min-count" value="${savedMinCount}" min="1">
                </div>
            </div>
            <div id="sa-results-container" class="sa-results">
                <div style="padding: 8px; color: #888;">Waiting for search results...</div>
            </div>
        `;

        const targetLocation = document.querySelector('._backup_32mn6k') || document.querySelector('.trade-layout.left');
        if (targetLocation && targetLocation.parentNode) {
            targetLocation.parentNode.insertBefore(panelContainer, targetLocation.nextSibling || null);
        }

        document.getElementById('sa-load-all-btn').addEventListener('click', loadAllResults);

        // MODIFICATION: New event handler for the min count input
        document.getElementById('sa-min-count').addEventListener('input', (event) => {
            const value = parseInt(event.target.value, 10);
            // Save the value if it's a valid number
            if (!isNaN(value) && value >= 1) {
                GM_setValue(MIN_LISTINGS_KEY, value);
            }
            // Trigger the debounced analysis to update the view and improve performance
            debouncedAnalysis();
        });

        document.getElementById('sa-results-container').addEventListener('click', handleSellerClick);
    }

    function debounce(func, delay) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), delay);
        };
    }

    injectPanelStyles();
    const debouncedAnalysis = debounce(performAnalysis, 350);

    const mainObserver = new MutationObserver((mutationsList) => {
        const panelTarget = document.querySelector('._backup_32mn6k, .trade-layout.left');
        const sellerAnalysis = document.getElementById('seller-analysis-panel');
        if (panelTarget && !sellerAnalysis) {
            createAnalysisPanel();
        }

        if (panelTarget && sellerAnalysis) {
            for(const mutation of mutationsList) {
                // Only run analysis if a change happened inside the search results area
                if (mutation.target.closest('.results')) {
                    debouncedAnalysis();
                    break;
                }
            }
        }
    });

    mainObserver.observe(document.body, { childList: true, subtree: true });

})();
