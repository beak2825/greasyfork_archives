// ==UserScript==
// @name         ::Steam Search: Hide Games Under Minimum Price::
// @namespace    masterofobzene-Hide Games Under Minimum Price
// @version      1.5
// @description  Hides games by minimum price set by the user, also can hide no-reviews or mixed/negative reviewed games on Steam search.
// @author       masterofobzene
// @homepage     https://github.com/masterofobzene/UserScriptRepo
// @icon         https://store.steampowered.com/favicon.ico
// @match        https://store.steampowered.com/search*
// @license      GNU GPLv3
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/528071/%3A%3ASteam%20Search%3A%20Hide%20Games%20Under%20Minimum%20Price%3A%3A.user.js
// @updateURL https://update.greasyfork.org/scripts/528071/%3A%3ASteam%20Search%3A%20Hide%20Games%20Under%20Minimum%20Price%3A%3A.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Load settings from localStorage or use defaults
    let minPrice = parseFloat(localStorage.getItem('minPrice')) || 5.00;
    let enablePriceFilter = localStorage.getItem('enablePriceFilter') === 'true' || true;
    let hideMixedNegative = localStorage.getItem('hideMixedNegative') === 'true' || false;
    let hideNoRating = localStorage.getItem('hideNoRating') === 'true' || false;

    function createToggleUI() {
        const insertAfter = document.querySelector('#narrow_category1');
        if (!insertAfter) {
            console.warn('Could not find #narrow_category1 to insert filters.');
            return;
        }

        const container = document.createElement('div');
        container.className = 'additional_filters_ctn';
        container.style.padding = '10px';
        container.style.marginTop = '10px';
        container.style.backgroundColor = '#2a475e';
        container.style.border = '1px solid #66c0f4';
        container.style.color = '#c6d4df';
        container.style.fontSize = '13px';

        container.innerHTML = `
            <div style="margin-bottom: 6px;"><strong>🧹 Custom Filter</strong></div>

            <label style="display: block; margin-bottom: 6px;">
                <input type="checkbox" id="enablePriceFilter" ${enablePriceFilter ? 'checked' : ''}> Enable Price Filter
            </label>
            <label style="display: block; margin-bottom: 4px;">
                Min Price: $<span id="priceValue">${minPrice.toFixed(2)}</span><br>
                <input type="range" id="priceSlider" min="0" max="60" step="0.5" value="${minPrice}" style="width: 100%;">
            </label>

            <hr style="margin: 10px 0; border-color: #66c0f4;">

            <label style="display: block; margin-bottom: 4px;">
                <input type="checkbox" id="hideMixedNegative" ${hideMixedNegative ? 'checked' : ''}> Hide Mixed/Negative
            </label>
            <label style="display: block;">
                <input type="checkbox" id="hideNoRating" ${hideNoRating ? 'checked' : ''}> Hide No Rating
            </label>
        `;

        insertAfter.parentNode.insertBefore(container, insertAfter.nextSibling);

        document.getElementById('enablePriceFilter').addEventListener('change', e => {
            enablePriceFilter = e.target.checked;
            localStorage.setItem('enablePriceFilter', enablePriceFilter);  // Save setting
            console.log('Enable Price Filter:', enablePriceFilter);
            hideLowPriceGames();
        });

        document.getElementById('priceSlider').addEventListener('input', e => {
            minPrice = parseFloat(e.target.value);
            localStorage.setItem('minPrice', minPrice);  // Save setting
            document.getElementById('priceValue').textContent = minPrice.toFixed(2);
            hideLowPriceGames();
        });

        document.getElementById('hideMixedNegative').addEventListener('change', e => {
            hideMixedNegative = e.target.checked;
            localStorage.setItem('hideMixedNegative', hideMixedNegative);  // Save setting
            console.log('Hide Mixed/Negative:', hideMixedNegative);
            hideLowPriceGames();
        });

        document.getElementById('hideNoRating').addEventListener('change', e => {
            hideNoRating = e.target.checked;
            localStorage.setItem('hideNoRating', hideNoRating);  // Save setting
            console.log('Hide No Rating:', hideNoRating);
            hideLowPriceGames();
        });
    }

    function hideLowPriceGames() {
        const rows = document.querySelectorAll('.search_result_row');
        rows.forEach(row => {
            let shouldHide = false;

            const priceElement = row.querySelector('.discount_final_price');
            if (!priceElement) return;

            const priceText = priceElement.textContent.trim();
            if (/free/i.test(priceText)) {
                shouldHide = enablePriceFilter;
            } else {
                const priceMatch = priceText.match(/\$(\d+\.\d{2})/);
                if (priceMatch && enablePriceFilter) {
                    const price = parseFloat(priceMatch[1]);
                    if (price < minPrice) shouldHide = true;
                }
            }

            const reviewElement = row.querySelector('.search_review_summary');
            const hasRating = !!reviewElement;
            const ratingClass = reviewElement?.classList?.[1];

            if (hideNoRating && !hasRating) {
                shouldHide = true;
            }

            if (hideMixedNegative && (ratingClass === 'mixed' || ratingClass === 'negative')) {
                shouldHide = true;
            }

            row.style.display = shouldHide ? 'none' : '';
        });
    }

    function setupObserver() {
        const resultsContainer = document.getElementById('search_resultsRows');
        if (!resultsContainer) return;

        const observer = new MutationObserver(() => {
            hideLowPriceGames();
        });

        observer.observe(resultsContainer, {
            childList: true,
            subtree: true
        });
    }

    function waitForSidebarAndInit() {
        const checkInterval = setInterval(() => {
            const anchor = document.querySelector('#narrow_category1');
            if (anchor) {
                clearInterval(checkInterval);
                createToggleUI();
                hideLowPriceGames();
                setupObserver();
            }
        }, 300);
    }

    waitForSidebarAndInit();
})();
