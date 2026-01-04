// ==UserScript==
// @name         Dakidex Scraper (Omiai Dakimakura)
// @namespace    http://dakidex.com
// @version      1
// @description  Scrape product details and open a new tab with the data
// @author       Dakidex
// @match        http://omiai-dakimakura.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/531354/Dakidex%20Scraper%20%28Omiai%20Dakimakura%29.user.js
// @updateURL https://update.greasyfork.org/scripts/531354/Dakidex%20Scraper%20%28Omiai%20Dakimakura%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    class ProductScraper {
        static async scrape() {
            const title = document.querySelector('.post-title.entry-title')?.textContent?.trim();

            // Parse product images
            let imageUrls = [...document.querySelectorAll(".entry-inner img")].map(a=>a.src)

            // Ensure imageUrls are unique
            imageUrls = [...new Set(imageUrls)];
            // Move first image to last if there are more than 1 image
            if (imageUrls.length > 1) {
                imageUrls.push(imageUrls.shift());
            }
			
			const info = document.querySelector(".entry .entry-inner>p").innerHTML.split("<br>").reduce((acc,b) => { 
				const [k, v] = b.split("：").map(s=>s.trim()); 
				acc[k]=v
				return acc;
			}, {})
            const data = {
                name: title || '',
                price: '',
				// characters: [info["キャラ名"] || ''],
                currency: 'JPY',
				// circle: info["制作"] || '',
				// artist: info["絵師"] || '',
                urls: ["http://omiai-dakimakura.com"+window.location.pathname],
                variants: imageUrls.map( i => {
				return {
                    name: '',
                    imageUrls: [i],
                    nsfw: false
                }
			})
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