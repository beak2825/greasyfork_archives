// ==UserScript==
// @name         Xbox Wishlist Sale Items Only
// @namespace    http://tampermonkey.net/
// @version      1.9
// @description  Display only sale items from Xbox wishlist, sorted by discount
// @author       Different_Read7708 (https://www.reddit.com/user/Different_Read7708/)
// @match        https://www.xbox.com/en-us/wishlist
// @icon         https://www.google.com/s2/favicons?sz=64&domain=xbox.com
// @grant        none
// @license      MIT
// @source       https://www.reddit.com/r/GreaseMonkey/comments/1gozg59/
// @downloadURL https://update.greasyfork.org/scripts/517071/Xbox%20Wishlist%20Sale%20Items%20Only.user.js
// @updateURL https://update.greasyfork.org/scripts/517071/Xbox%20Wishlist%20Sale%20Items%20Only.meta.js
// ==/UserScript==

/* 
Features:
- Displays only items that are currently on sale from your Xbox wishlist
- Sorts items by discount percentage (highest first)
- Shows original price, sale price, and discount percentage
- Displays game rating
- Custom grid layout with hover effects
- Clickable cards that link to the game's store page
*/

(function() {
    'use strict';

    function getWishlistData() {
        try {
            const scriptTags = document.querySelectorAll('script');
            for (const script of scriptTags) {
                if (script.innerText.includes('window.__PRELOADED_STATE__')) {
                    const dataMatch = script.innerText.match(/window\.__PRELOADED_STATE__\s*=\s*(\{.*\})\s*;/);
                    if (dataMatch && dataMatch[1]) {
                        const wishlistData = JSON.parse(dataMatch[1]);
                        return Object.values(wishlistData.core2?.products?.productSummaries || {});
                    }
                }
            }
            console.error("Wishlist data not found in the current HTML.");
            return [];
        } catch (error) {
            console.error("Error parsing wishlist data:", error);
            return [];
        }
    }

    function injectCustomStyles() {
        const styles = `
            .WishlistPage-module__centerContainer___2dDfq { display: block !important; justify-content: initial !important; }
            .wishlist-container { width: 80%; padding-top: 20px; margin-left: 2%; margin-right: 2%; }
            .wishlist-grid { display: grid; grid-template-columns: repeat(6, 1fr); gap: 16px; padding: 16px; }
            .custom-card { position: relative; width: 250px; height: 400px; background: #2a2a2a; border-radius: 10px; overflow: hidden; font-family: Arial, sans-serif; color: #fff; transition: box-shadow 0.3s ease; }
            .custom-card img { width: 100%; height: 100%; object-fit: cover; border-radius: 10px; transition: transform 0.3s ease; }
            .custom-card:hover img { transform: scale(1.05); box-shadow: 0px 0px 15px rgba(255, 255, 255, 0.5); }
            .overlay { position: absolute; top: 0; left: 0; right: 0; bottom: 0; display: flex; flex-direction: column; justify-content: space-between; padding: 10px; border-radius: 10px; }
            .custom-card-title { text-align: center; text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black; font-size: 18px; font-weight: bold; }
            .price-info { display: flex; justify-content: space-between; align-items: center; font-size: 14px; width: 100%; padding: 5px; background: rgba(25, 25, 25, 0.8); border-radius: 5px; }
            .custom-card-price { color: #4CAF50; font-weight: bold; }
            .custom-card-original-price { color: #888; text-decoration: line-through; }
            .custom-card-discount { color: #FF5733; font-weight: bold; }
            .custom-card-rating { color: #FFD700; font-size: 14px; text-align: right; }
        `;
        const styleSheet = document.createElement("style");
        styleSheet.type = "text/css";
        styleSheet.innerText = styles;
        document.head.appendChild(styleSheet);
    }

    function clearOriginalWishlistItems() {
        const originalItems = document.querySelectorAll('.WishlistProductItem-module__itemContainer___weUfG');
        originalItems.forEach(item => item.remove());
    }

    function displayWishlistData(wishlistItems) {
        clearOriginalWishlistItems();

        const gridContainer = document.querySelector('.wishlist-grid');
        gridContainer.innerHTML = '';

        const filteredItems = wishlistItems
            .filter(item => {
                const salePrice = item.specificPrices?.purchaseable[0]?.listPrice || null;
                const originalPrice = item.specificPrices?.purchaseable[0]?.msrp || null;
                return salePrice && salePrice < originalPrice;
            })
            .sort((a, b) => {
                const discountA = a.specificPrices?.purchaseable[0]?.discountPercentage || 0;
                const discountB = b.specificPrices?.purchaseable[0]?.discountPercentage || 0;
                return discountB - discountA;
            });

        filteredItems.forEach(item => {
            const title = item.title || "Unknown Game";
            const salePrice = item.specificPrices?.purchaseable[0]?.listPrice || null;
            const originalPrice = item.specificPrices?.purchaseable[0]?.msrp || null;
            const discountPercent = item.specificPrices?.purchaseable[0]?.discountPercentage || 0;
            const skuID = item.specificPrices?.purchaseable[0]?.skuId || null;
            const productID = item.productId;
            const imageUrl = item.images?.poster?.url || "https://via.placeholder.com/250x320";
            const rating = item.averageRating || 0;
            const detailUrl = `https://www.xbox.com/en-US/games/store/${title.replace(/\s/g, '-').toLowerCase()}/${productID}/${skuID}`;

            const card = document.createElement('div');
            card.style.cursor = 'pointer';
            card.onclick = () => window.open(detailUrl, '_blank');
            card.className = 'custom-card';

            const imgElement = document.createElement('img');
            imgElement.src = imageUrl;
            card.appendChild(imgElement);

            const overlay = document.createElement('div');
            overlay.className = 'overlay';

            const titleElement = document.createElement('div');
            titleElement.className = 'custom-card-title';
            overlay.appendChild(titleElement);

            const priceInfo = document.createElement('div');
            priceInfo.className = 'price-info';

            if (salePrice) {
                const salePriceElement = document.createElement('span');
                salePriceElement.className = 'custom-card-price';
                salePriceElement.textContent = `$${salePrice.toFixed(2)}`;
                priceInfo.appendChild(salePriceElement);
            }

            if (originalPrice && salePrice < originalPrice) {
                const originalPriceElement = document.createElement('span');
                originalPriceElement.className = 'custom-card-original-price';
                originalPriceElement.textContent = `$${originalPrice.toFixed(2)}`;
                priceInfo.appendChild(originalPriceElement);

                const discountElement = document.createElement('span');
                discountElement.className = 'custom-card-discount';
                discountElement.textContent = `${Math.round(discountPercent, 2)}% OFF`;
                priceInfo.appendChild(discountElement);
            }

            overlay.appendChild(priceInfo);

            const ratingElement = document.createElement('span');
            ratingElement.className = 'custom-card-rating';
            ratingElement.textContent = `★ ${rating.toFixed(1)}`;
            priceInfo.appendChild(ratingElement);

            card.appendChild(overlay);
            gridContainer.appendChild(card);
        });
    }

    function initialize() {
        const wishlistContainer = document.querySelector('.WishlistPage-module__wishListForm___p6wOx');
        if (!wishlistContainer) {
            console.log("Wishlist container not found.");
            return;
        }

        wishlistContainer.classList.add('wishlist-container');

        const gridContainer = document.createElement('div');
        gridContainer.className = 'wishlist-grid';
        wishlistContainer.appendChild(gridContainer);

        const wishlistData = getWishlistData();
        displayWishlistData(wishlistData);
    }

    window.addEventListener('load', () => {
        injectCustomStyles();
        initialize();
    });
})();