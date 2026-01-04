// ==UserScript==
// @name         J.Crew Deal Filter
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Filter J.Crew sale items by "good" or "great" deals.
// @author       You
// @match        https://www.jcrew.com/sale/*
// @match        https://www.jcrew.com/shop/*
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/515661/JCrew%20Deal%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/515661/JCrew%20Deal%20Filter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function filterDeals(dealType) {
        const productTiles = document.querySelectorAll('.c-product-tile');

        productTiles.forEach(tile => {
            const wasPriceElement = tile.querySelector('.tile__detail--price--was');
            const nowPriceElement = tile.querySelector('.tile__detail--price--sale--old .is-price') || tile.querySelector('.ProductPrice__price-sale____mCxV .is-price'); //select color price or now price
            const selectColorPriceElement = tile.querySelector('.tile__detail--price--sale');

            if (wasPriceElement && nowPriceElement) {
                let wasPrice = parseFloat(wasPriceElement.textContent.replace(/[^0-9.]/g, ''));
                const nowPriceText = nowPriceElement.textContent.replace(/[^0-9.-]/g, '');

                let nowPrice;
                if (nowPriceText.includes('-')) { //handle price ranges
                    const priceRange = nowPriceText.split('-');
                    nowPrice = parseFloat(priceRange[0]);
                    wasPrice = parseFloat(wasPriceElement.textContent.split('-')[0].replace(/[^0-9.]/g, ''));
                } else {
                    nowPrice = parseFloat(nowPriceText);
                }

                const discount = (wasPrice - nowPrice) / wasPrice * 100;

                if (dealType === 'good' && discount >= 50 && discount <= 70) {
                    tile.style.display = 'block';
                } else if (dealType === 'great' && discount > 70) {
                    tile.style.display = 'block';
                } else {
                    tile.style.display = 'none';
                }
            } else if (selectColorPriceElement && selectColorPriceElement.textContent.includes('Select Colors')) {
                tile.style.display = 'none';
            }
        });
    }

    function addFilterButtons() {
        const filterBar = document.createElement('div');


        const goodDealsButton = document.createElement('button');
        goodDealsButton.textContent = 'Good Deals (50-70% off)';
        goodDealsButton.addEventListener('click', () => filterDeals('good'));

        const greatDealsButton = document.createElement('button');
        greatDealsButton.textContent = 'Great Deals (70%+ off)';
        greatDealsButton.addEventListener('click', () => filterDeals('great'));

        const showAllButton = document.createElement('button');
        showAllButton.textContent = 'Show All';
        showAllButton.addEventListener('click', () => {
            const productTiles = document.querySelectorAll('.c-product-tile');
            productTiles.forEach(tile => {
                tile.style.display = 'block';
            });
        });

        filterBar.appendChild(goodDealsButton);
        filterBar.appendChild(greatDealsButton);
        filterBar.appendChild(showAllButton);

        // Style the filter bar
        GM_addStyle(`
            #jcrew-deal-filter {
                padding: 10px;
                background-color: #f0f0f0;
                display: flex;
                align-items: center;
                gap: 10px;
                margin-bottom: 10px;
                flex-wrap: wrap;
            }
            #jcrew-deal-filter button {
                background-color: #fff;
                border: 1px solid #ccc;
                padding: 8px 16px;
                border-radius: 4px;
                cursor: pointer;
                transition: background-color 0.3s ease;
                font-size: 14px;
            }
            #jcrew-deal-filter button:hover {
                background-color: #e0e0e0;
            }
        `);

        filterBar.id = 'jcrew-deal-filter';

        const productList = document.querySelector('.c-product__list');
        if (productList) {
            productList.parentNode.insertBefore(filterBar, productList);
        }
    }

    addFilterButtons();
})();