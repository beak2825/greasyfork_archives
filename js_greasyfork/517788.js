// ==UserScript==
// @name         Dakidex Scraper
// @namespace    http://dakidex.com
// @version      1.5
// @description  Scrape product details and open a new tab with the data
// @author       Dakidex
// @match        http*://booth.pm/*/items/*
// @match        http*://*.booth.pm/items/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/517788/Dakidex%20Scraper.user.js
// @updateURL https://update.greasyfork.org/scripts/517788/Dakidex%20Scraper.meta.js
// ==/UserScript==

(function () {
    'use strict';

    class ProductScraper {
        static async scrape() {
            const title = document.querySelector('.summary h2')?.textContent?.trim();
            const price = document.querySelector('.variation-price')?.textContent;

            let productUrl = window.location.href;
            const realUrl = document.querySelector('a[data-product-list="from market_show via market_item_detail to shop_index"]')?.href;
            if (realUrl) {
                productUrl = realUrl + "items/" + productUrl.split('/').pop();
            }

            // Parse product images
            let imageUrls = [];
            const imageElements = document.querySelectorAll('.market-item-detail-item-image-wrapper img');
            imageElements.forEach(img => {
                const imageUrl = img.getAttribute('data-origin') ?? img.getAttribute('src');
                if (imageUrl) {
                    imageUrls.push(imageUrl);
                }
            });

            // Ensure imageUrls are unique
            imageUrls = [...new Set(imageUrls)];
            // Move first image to last if there are more than 1 image
            if (imageUrls.length > 1) {
                imageUrls.push(imageUrls.shift());
            }

            const data = {
                name: title || '',
                price: this.parsePrice(price || ''),
                currency: 'JPY',
                urls: [productUrl],
                variants: [{
                    name: 'Default',
                    imageUrls: imageUrls,
                    nsfw: true
                }]
            };

            const encodedData = btoa(encodeURIComponent(JSON.stringify(data)));
            window.open(`https://dakidex.com/create?data=${encodedData}`, '_blank');
        }

        static parsePrice(price) {
            return Number(price.replace(/[^0-9]/g, ''));
        }
    }

    // Add a button to trigger the scraping
    const button = document.createElement('button');
    button.textContent = 'Add to Dakidex';
    button.style.position = 'fixed';
    button.style.bottom = '10px';
    button.style.right = '10px';
    button.style.zIndex = 1000;
    button.style.padding = '10px';
    button.style.borderRadius = '6px';
    button.style.fontWeight = 'bold'; // Made font bold
    button.style.backgroundColor = 'rgba(112, 112, 112, 0.7)'; // 70% gray background
    button.style.color = 'white'; // White text
    button.addEventListener('click', () => ProductScraper.scrape());
    document.body.appendChild(button);
})();