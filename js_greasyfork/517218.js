// ==UserScript==
// @name         Xbox Wishlist Sale Items Only
// @namespace    http://tampermonkey.net/
// @version      5.2
// @description  Display sale items with sorting options (discount, price, rating) and toggle sort order with icons
// @match        https://www.xbox.com/*/wishlist
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/517218/Xbox%20Wishlist%20Sale%20Items%20Only.user.js
// @updateURL https://update.greasyfork.org/scripts/517218/Xbox%20Wishlist%20Sale%20Items%20Only.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let currentSortKey = 'discountPercentage';
    let sortOrder = 'desc';
    let minRating = 3;
    let maxPrice = Infinity;
    let minDiscount = 5;

    const defaultSortOrders = {
        discountPercentage: 'desc',
        listPrice: 'asc',
        averageRating: 'desc'
    };

    const getWishlistData = () => {
        try {
            const script = [...document.scripts].find(s => s.innerText.includes('window.__PRELOADED_STATE__'));
            const match = script?.innerText.match(/window\.__PRELOADED_STATE__\s*=\s*(\{.*\})\s*;/);
            return match ? Object.values(JSON.parse(match[1]).core2?.products?.productSummaries || {}) : [];
        } catch {
            console.error('Error retrieving wishlist data');
            return [];
        }
    };

    const injectStyles = () => {
        const css = `
            .wishlist-container {
                margin: 20px auto;
                padding: 20px;
                background: #1E1E1E;
                border: 2px solid #333;
                border-radius: 12px;
                box-shadow: 0 4px 10px rgba(0, 0, 0, 0.6);
                max-width: 1200px;
            }

            .wishlist-title {
                text-align: center;
                font-size: 24px;
                font-weight: bold;
                margin-bottom: 20px;
                color: #E0E0E0;
                text-transform: uppercase;
                border-bottom: 2px solid #333;
                padding-bottom: 10px;
            }

            .wishlist-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 15px;
                padding: 0;
            }

            .custom-card {
                position: relative;
                background: #2A2A2A;
                border-radius: 12px;
                overflow: hidden;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.5);
                border: 1px solid transparent;
                transition: transform 0.3s, box-shadow 0.3s;
                cursor: pointer;
            }

            .custom-card .image-wrapper {
                position: relative;
                width: 100%;
                padding-top: 150%;
                overflow: hidden;
                background: #1E1E1E;
            }

            .custom-card img {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                object-fit: cover;
            }

            .custom-card:hover {
                border: 1px solid white !important;
            }

            .info {
                position: absolute;
                bottom: 0;
                left: 0;
                background: rgba(0, 0, 0, 0.8);
                width: 100%;
                display: flex;
                justify-content: space-between;
                padding: 8px 12px;
                box-sizing: border-box;
                font-size: 14px;
                color: #E0E0E0;
            }

            .price {
                color: #4CAF50;
                font-weight: bold;
            }

            .original-price {
                color: #B0BEC5;
                text-decoration: line-through;
                font-size: 12px;
            }

            .discount {
                color: #FF7043;
                font-weight: bold;
            }

            .rating {
                color: #FFD700;
                font-weight: bold;
            }

            .sort-icon {
                margin-left: 6px;
            }

            .sort-options {
                display: flex;
                flex-wrap: wrap;
                justify-content: center;
                margin-bottom: 20px;
                gap: 15px;
            }

            .sort-options select,
            .sort-options button,
            .sort-options input {
                background: #2A2A2A;
                color: #E0E0E0;
                border: 1px solid #444;
                border-radius: 8px;
                padding: 12px 15px;
                font-size: 16px;
                cursor: pointer;
                transition: background 0.3s, box-shadow 0.3s;
                min-width: 170px;
                box-sizing: border-box;
            }

            .sort-options input {
                width: 170px;
            }

            .sort-options select {
                width: 190px;
            }

            .sort-options button {
                min-width: 190px;
                font-weight: bold;
                text-align: center;
            }

            .sort-options select:hover,
            .sort-options button:hover,
            .sort-options input:hover {
                background: #333;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
            }

        .input-container {
            position: relative;
            display: inline-block;
        }

        .input-container input {
            background: #2A2A2A;
            color: #E0E0E0;
            border: 1px solid #444;
            border-radius: 8px;
            padding: 15px;
            font-size: 20px;
            outline: none;
            transition: border 0.3s, box-shadow 0.3s;
            width: 225px;
        }

        .input-container label {
            position: absolute;
            left: 10px;
            top: 15px;
            font-size: 12px;
            color: #888;
            transition: all 0.3s ease;
            pointer-events: none;
        }

        .input-container input:focus + label,
        .input-container input:not(:placeholder-shown) + label {
            top: 5px;
            font-size: 12px;
            color: #4CAF50;
        }

        .input-container input:focus {
            border-color: #4CAF50;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
        }

        `;
        const style = document.createElement('style');
        style.textContent = css;
        document.head.appendChild(style);
    };

    const displayWishlist = (items) => {
        const grid = document.querySelector('.wishlist-grid');
        if (!grid) return;
        grid.innerHTML = '';

        const getValue = (item, key) => {
            const priceData = item.specificPrices?.purchaseable?.[0] || {};
            if (key === 'discountPercentage') return priceData.discountPercentage || 0;
            if (key === 'listPrice') return priceData.listPrice || 0;
            return item.averageRating || 0;
        };

        items
            .filter(({ specificPrices, averageRating }) => {
                const p = specificPrices?.purchaseable?.[0];
                return p && p.listPrice <= maxPrice && p.discountPercentage >= minDiscount && averageRating >= minRating;
            })
            .sort((a, b) => sortOrder === 'asc'
                ? getValue(a, currentSortKey) - getValue(b, currentSortKey)
                : getValue(b, currentSortKey) - getValue(a, currentSortKey))
            .forEach(({ title = 'Unknown', images, specificPrices, averageRating, productId }) => {
                const p = specificPrices?.purchaseable?.[0] || {};
                const skuId = p.skuId || '';
                const url = `https://www.xbox.com/en-US/games/store/${title.replace(/\s/g, '-').toLowerCase()}/${productId}/${skuId}`;
                const card = document.createElement('div');
                card.className = 'custom-card';
                card.onclick = () => window.open(url, '_blank');
                card.innerHTML = `
                    <div class="image-wrapper">
                        <img src="${images?.poster?.url || 'https://via.placeholder.com/720x1080'}" alt="${title}">
                    </div>
                    <div class="info">
                        <div>
                            <div class="price">$${p.listPrice?.toFixed(2) || 'N/A'}
                                <span class="original-price">${p.msrp ? `$${p.msrp.toFixed(2)}` : ''}</span>
                            </div>
                            <div class="discount">${p.discountPercentage ? `${p.discountPercentage.toFixed(0)}% OFF` : ''}</div>
                        </div>
                        <div class="rating">★ ${averageRating?.toFixed(1) || 'N/A'}</div>
                    </div>
                `;
                grid.appendChild(card);
            });
    };

    const addSortOptions = (data) => {
        const container = document.querySelector('.wishlist-container');
        const sortDiv = document.createElement('div');
        sortDiv.className = 'sort-options';
        sortDiv.innerHTML = `
            <div class="input-container">
                <input id="min-rating" type="number" min="0" max="5" step="0.1" placeholder=" " />
                <label for="min-rating">Min Rating</label>
            </div>
            <div class="input-container">
                <input id="max-price" type="number" min="0" placeholder=" " />
                <label for="max-price">Max Price</label>
            </div>
            <div class="input-container">
                <input id="min-discount" type="number" min="0" max="100" placeholder=" " />
                <label for="min-discount">Min Discount %</label>
            </div>
            <select id="sort-select">
                <option value="discountPercentage">Sort by: Discount</option>
                <option value="listPrice">Sort by: Price</option>
                <option value="averageRating">Sort by: Rating</option>
            </select>
            <button id="toggle-order">Sort: Descending <span id="order-icon" class="sort-icon">▼</span></button>
        `;

        container.insertBefore(sortDiv, container.querySelector('.wishlist-grid'));

        const updateSortUI = () => {
            const icon = document.getElementById('order-icon');
            icon.textContent = sortOrder === 'asc' ? '▲' : '▼';
            document.getElementById('toggle-order').innerHTML = `Sort: ${sortOrder === 'asc' ? 'Ascending' : 'Descending'} <span id="order-icon" class="sort-icon">${icon.textContent}</span>`;
        };

        document.getElementById('sort-select').addEventListener('change', (e) => {
            currentSortKey = e.target.value;
            sortOrder = defaultSortOrders[currentSortKey] || 'desc';
            updateSortUI();
            displayWishlist(data);
        });

        document.getElementById('toggle-order').addEventListener('click', () => {
            sortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
            updateSortUI();
            displayWishlist(data);
        });

        ['min-rating', 'max-price', 'min-discount'].forEach((id, idx) => {
            document.getElementById(id).addEventListener('input', (e) => {
                const val = parseFloat(e.target.value);
                if (id === 'min-rating') minRating = val || 0;
                if (id === 'max-price') maxPrice = val || Infinity;
                if (id === 'min-discount') minDiscount = val || 0;
                displayWishlist(data);
            });
        });

        document.getElementById('min-rating').value = minRating;
        document.getElementById('min-discount').value = minDiscount;
        document.getElementById('min-rating').dispatchEvent(new Event('input'));
        document.getElementById('min-discount').dispatchEvent(new Event('input'));
        updateSortUI();
    };

    const init = () => {
        injectStyles();
        const container = document.querySelector('.WishlistPage-module__wishListForm___p6wOx');
        if (!container) return console.error('Wishlist container not found');
        container.classList.add('wishlist-container');
        container.innerHTML = '<div class="wishlist-title">My Wishlist</div><div class="wishlist-grid"></div>';
        const wishlistData = getWishlistData();
        addSortOptions(wishlistData);
        displayWishlist(wishlistData);
    };

    window.addEventListener('load', init);
})();
