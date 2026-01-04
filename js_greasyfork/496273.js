// ==UserScript==
// @name         Enhanced Google Shopping Search
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Search for items on Google Shopping with various filters and sorting options.
// @match        *://*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/496273/Enhanced%20Google%20Shopping%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/496273/Enhanced%20Google%20Shopping%20Search.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create UI elements
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.top = '50%';
    container.style.right = '-500px';
    container.style.zIndex = '1000';
    container.style.backgroundColor = '#333';
    container.style.color = '#fff';
    container.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)';
    container.style.padding = '10px';
    container.style.border = '1px solid #ccc';
    container.style.borderRadius = '5px';
    container.style.width = '300px';
    container.style.transform = 'translateY(-50%)';
    container.style.transition = 'right 0.3s';

    const inputBox = document.createElement('input');
    inputBox.type = 'text';
    inputBox.placeholder = 'Enter search terms...';
    inputBox.style.display = 'block';
    inputBox.style.marginBottom = '10px';
    inputBox.style.width = '100%';
    inputBox.style.backgroundColor = '#444';
    inputBox.style.color = '#fff';
    inputBox.style.border = '1px solid #555';

    const minPrice = document.createElement('input');
    minPrice.type = 'number';
    minPrice.placeholder = 'Min price';
    minPrice.style.display = 'block';
    minPrice.style.marginBottom = '10px';
    minPrice.style.width = '100%';
    minPrice.style.backgroundColor = '#444';
    minPrice.style.color = '#fff';
    minPrice.style.border = '1px solid #555';

    const maxPrice = document.createElement('input');
    maxPrice.type = 'number';
    maxPrice.placeholder = 'Max price';
    maxPrice.style.display = 'block';
    maxPrice.style.marginBottom = '10px';
    maxPrice.style.width = '100%';
    maxPrice.style.backgroundColor = '#444';
    maxPrice.style.color = '#fff';
    maxPrice.style.border = '1px solid #555';

    const sortSelect = document.createElement('select');
    const sortOptions = {
        'r': 'Relevance',
        'pd': 'Price: High to Low',
        'p': 'Price: Low to High',
        'rv': 'Review Score'
    };
    for (const [value, text] of Object.entries(sortOptions)) {
        const option = document.createElement('option');
        option.value = value;
        option.textContent = text;
        sortSelect.appendChild(option);
    }
    sortSelect.style.display = 'block';
    sortSelect.style.marginBottom = '10px';
    sortSelect.style.width = '100%';
    sortSelect.style.backgroundColor = '#444';
    sortSelect.style.color = '#fff';
    sortSelect.style.border = '1px solid #555';

    const conditionSelect = document.createElement('select');
    const conditionOptions = {
        '1': 'New',
        '3': 'Used',
        'both': 'Both'
    };
    for (const [value, text] of Object.entries(conditionOptions)) {
        const option = document.createElement('option');
        option.value = value;
        option.textContent = text;
        conditionSelect.appendChild(option);
    }
    conditionSelect.style.display = 'block';
    conditionSelect.style.marginBottom = '10px';
    conditionSelect.style.width = '100%';
    conditionSelect.style.backgroundColor = '#444';
    conditionSelect.style.color = '#fff';
    conditionSelect.style.border = '1px solid #555';

    const filterContainer = document.createElement('div');
    filterContainer.style.display = 'flex';
    filterContainer.style.justifyContent = 'space-between';
    filterContainer.style.marginBottom = '10px';

    const freeShippingLabel = document.createElement('label');
    freeShippingLabel.textContent = 'Free Shipping';
    const freeShippingCheckbox = document.createElement('input');
    freeShippingCheckbox.type = 'checkbox';
    freeShippingCheckbox.style.marginLeft = '10px';
    freeShippingLabel.appendChild(freeShippingCheckbox);

    const freeReturnsLabel = document.createElement('label');
    freeReturnsLabel.textContent = 'Free Returns';
    const freeReturnsCheckbox = document.createElement('input');
    freeReturnsCheckbox.type = 'checkbox';
    freeReturnsCheckbox.style.marginLeft = '10px';
    freeReturnsLabel.appendChild(freeReturnsCheckbox);

    const fastShippingLabel = document.createElement('label');
    fastShippingLabel.textContent = '1-3 Day Delivery';
    const fastShippingCheckbox = document.createElement('input');
    fastShippingCheckbox.type = 'checkbox';
    fastShippingCheckbox.style.marginLeft = '10px';
    fastShippingLabel.appendChild(fastShippingCheckbox);

    filterContainer.appendChild(freeShippingLabel);
    filterContainer.appendChild(freeReturnsLabel);
    filterContainer.appendChild(fastShippingLabel);

    const ratingSelect = document.createElement('select');
    const ratingOptions = {
        '': 'Any Rating',
        '100': '1 Star & Up',
        '200': '2 Stars & Up',
        '300': '3 Stars & Up',
        '400': '4 Stars & Up'
    };
    for (const [value, text] of Object.entries(ratingOptions)) {
        const option = document.createElement('option');
        option.value = value;
        option.textContent = text;
        ratingSelect.appendChild(option);
    }
    ratingSelect.style.display = 'block';
    ratingSelect.style.marginBottom = '10px';
    ratingSelect.style.width = '100%';
    ratingSelect.style.backgroundColor = '#444';
    ratingSelect.style.color = '#fff';
    ratingSelect.style.border = '1px solid #555';

    const searchButton = document.createElement('button');
    searchButton.textContent = 'Search';
    searchButton.style.display = 'block';
    searchButton.style.marginBottom = '10px';
    searchButton.style.width = '100%';
    searchButton.style.backgroundColor = '#555';
    searchButton.style.color = '#fff';
    searchButton.style.border = '1px solid #666';

    const historyDiv = document.createElement('div');
    historyDiv.style.marginTop = '10px';

    container.appendChild(inputBox);
    container.appendChild(minPrice);
    container.appendChild(maxPrice);
    container.appendChild(sortSelect);
    container.appendChild(conditionSelect);
    container.appendChild(filterContainer);
    container.appendChild(ratingSelect);
    container.appendChild(searchButton);
    container.appendChild(historyDiv);
    document.body.appendChild(container);

    let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];

    function updateHistoryDiv() {
        historyDiv.innerHTML = '<strong>Recent Searches:</strong><br>';
        searchHistory.slice(0, 5).forEach((search, index) => {
            const searchItem = document.createElement('div');
            searchItem.textContent = `${index + 1}. ${search}`;
            historyDiv.appendChild(searchItem);
        });
    }

    updateHistoryDiv();

    searchButton.addEventListener('click', () => {
        const searchTerms = inputBox.value;
        const min = minPrice.value;
        const max = maxPrice.value;
        const sort = sortSelect.value;
        const condition = conditionSelect.value;
        const freeShipping = freeShippingCheckbox.checked;
        const freeReturns = freeReturnsCheckbox.checked;
        const fastShipping = fastShippingCheckbox.checked;
        const rating = ratingSelect.value;

        if (searchTerms) {
            let query = `https://www.google.com/search?sca_upv=1&tbm=shop&q=${encodeURIComponent(searchTerms)}&tbs=mr:1,price:1`;

            if (min) {
                query += `,ppr_min:${min}`;
            }
            if (max) {
                query += `,ppr_max:${max}`;
            }
            if (sort) {
                query += `,p_ord:${sort}`;
            }
            if (condition !== 'both') {
                query += `,new:${condition}`;
            }
            if (freeShipping) {
                query += `,ship:1`;
            }
            if (freeReturns) {
                query += `,free_return:1`;
            }
            if (fastShipping) {
                query += `,shipspeed:3`;
            }
            if (rating) {
                query += `,avg_rating:${rating}`;
            }

            // Update search history
            searchHistory.unshift(searchTerms);
            localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
            updateHistoryDiv();

            window.location.href = query;
        } else {
            alert('Please enter search terms.');
        }
    });

    // Show or hide the menu when pressing Ctrl + Alt + G
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.altKey && e.key === 'g') {
            if (container.style.right === '0px') {
                container.style.right = '-500px';
            } else {
                container.style.right = '0px';
            }
        }
    });
})();