// ==UserScript==
// @name         Torn Buy Filter
// @version      0.5.2
// @description  A script to highlight items in the item market when they are listed below a specified threshold.
// @author       Galdyr
// @match        https://www.torn.com/page.php?sid=ItemMarket*
// @exclude      https://www.googletagmanager.com/*
// @exclude      https://td.doubleclick.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// @namespace    https://greasyfork.org/users/1446982
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/530120/Torn%20Buy%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/530120/Torn%20Buy%20Filter.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    if (!window.location.href.startsWith("https://www.torn.com/page.php?sid=ItemMarket")) {
        return;
    }
 
    const buyFilters = JSON.parse(localStorage.getItem('buyFilters')) || {};
 
    function initializeBuyFilters() {
        const itemMarketRoot = document.querySelector('.itemListWrapper___ugBOt');
        if (!itemMarketRoot) {
            console.error('Item market root element not found.');
            return;
        }
 
        const itemElements = document.querySelectorAll('.itemTile___cbw7w');
        const filterOptionsBox = createFilterOptionsBox();
        const mainContent = itemMarketRoot.parentElement;
 
        mainContent.insertBefore(filterOptionsBox, mainContent.firstChild);
 
        // Match the filter box width to the item tile container.
        if (itemMarketRoot) {
            filterOptionsBox.style.width = itemMarketRoot.offsetWidth + 'px';
        }
 
        itemElements.forEach((itemElement) => {
            const itemId = getItemId(itemElement);
            if (itemId) {
                if (!document.getElementById(`filter-item-${itemId}`)) {
                    addBuyFilter(itemElement, itemId, filterOptionsBox);
                    addWatchCheckbox(itemElement, itemId);
                }
            }
        });
 
        highlightItems(); // Use highlightItems() to call both highlight functions
        setInterval(highlightItems, 1000);
    }
 
    function createFilterOptionsBox() {
        const filterOptionsBox = document.createElement('div');
        filterOptionsBox.id = 'filter-options-box';
        filterOptionsBox.style.marginTop = '10px';
        filterOptionsBox.style.borderBottom = '1px solid #ccc';
        filterOptionsBox.style.padding = '10px';
        filterOptionsBox.style.display = 'grid';
        filterOptionsBox.style.gridTemplateColumns = 'repeat(5, 1fr)'; // Fixed 5 columns
        filterOptionsBox.style.gap = '10px';
 
        const titleSpan = document.createElement('span');
        titleSpan.textContent = "Galdyr's Buy Filter";
        titleSpan.style.fontWeight = 'bold';
        filterOptionsBox.insertBefore(titleSpan, filterOptionsBox.firstChild);
 
        for (let i = 0; i < 3; i++) {
            const blankSpace = document.createElement('span');
            filterOptionsBox.insertBefore(blankSpace, filterOptionsBox.firstChild.nextSibling);
        }
 
        const collapseButton = document.createElement('span');
        collapseButton.id = 'collapse-button';
        collapseButton.textContent = '-';
        collapseButton.style.cursor = 'pointer';
        collapseButton.style.fontSize = '20px';
        collapseButton.style.fontWeight = 'bold';
        collapseButton.addEventListener('click', toggleFilters);
        filterOptionsBox.appendChild(collapseButton);
 
        return filterOptionsBox;
    }
 
    function toggleFilters() {
        const filterOptionsBox = document.getElementById('filter-options-box');
        const collapseButton = document.getElementById('collapse-button');
        filterOptionsBox.classList.toggle('collapsed');
        collapseButton.textContent = filterOptionsBox.classList.contains('collapsed') ? '+' : '-'; // Toggle icon
    }
 
    function getItemId(itemElement) {
        const actionsWrapper = itemElement.querySelector('.actionsWrapper___lfaJ0');
        if (actionsWrapper) {
            const buyButton = actionsWrapper.querySelector('.actionButton___pb_Da[aria-label*="Buy item"]');
            if (buyButton) {
                const ariaControls = buyButton.getAttribute('aria-controls');
                if (ariaControls) {
                    const itemId = ariaControls.split('-').pop();
                    return itemId;
                }
            }
        }
        return null;
    }
 
    function getItemName(itemElement) {
        const nameElement = itemElement.querySelector('.name___ukdHN');
        if (nameElement) {
            return nameElement.textContent;
        }
        return "Unknown Item";
    }
    
    function addBuyFilter(itemElement, itemId, filterOptionsBox) {
        const itemName = getItemName(itemElement);
        const filterDiv = document.createElement('div');
        filterDiv.id = `filter-item-${itemId}`;
        filterDiv.innerHTML = `<strong>${itemName}:</strong><br>
                                    <label style="margin-left: 20px;">Threshold:</label><br>
                                    <input type="number" class="buy-threshold" value="${buyFilters[itemId] && buyFilters[itemId].threshold ? buyFilters[itemId].threshold : 0}" style="margin-left: 20px;"><br>`;
    
        filterOptionsBox.appendChild(filterDiv);
    
        const thresholdInput = filterDiv.querySelector('.buy-threshold');
    
        thresholdInput.addEventListener('change', (event) => {
            if (buyFilters[itemId]) {
                buyFilters[itemId].threshold = parseInt(event.target.value, 10);
            } else {
                buyFilters[itemId] = { selected: false, threshold: parseInt(event.target.value, 10) };
            }
            localStorage.setItem('buyFilters', JSON.stringify(buyFilters)); // Save to localStorage
            highlightItems();
        });
    
    // Initialize buyFilters with stored or default values
    buyFilters[itemId] = buyFilters[itemId] || { selected: false, threshold: parseInt(thresholdInput.value, 10) };
    localStorage.setItem('buyFilters', JSON.stringify(buyFilters)); // Save to localStorage
    }

    function highlightItemTiles() {
        const itemElements = document.querySelectorAll('.itemTile___cbw7w');
        itemElements.forEach((itemElement) => {
            const itemId = getItemId(itemElement);
            if (itemId && buyFilters[itemId] && buyFilters[itemId].selected) {
                const itemPrice = getItemPrice(itemElement);
                if (itemPrice !== null && itemPrice <= buyFilters[itemId].threshold) {
                    itemElement.parentElement.style.backgroundColor = "#19166e";
                } else {
                    itemElement.parentElement.style.backgroundColor = "";
                }
            } else {
                itemElement.parentElement.style.backgroundColor = "";
            }
        });
    }

    function highlightSellerRows() {
        const sellerRows = document.querySelectorAll('.rowWrapper___me3Ox');
        sellerRows.forEach((rowElement) => {
            const sellerRow = rowElement.querySelector('.sellerRow___AI0m6');
            if (sellerRow) {
                const itemId = getItemId(sellerRow);
                if (itemId && buyFilters[itemId] && buyFilters[itemId].selected) {
                    const itemPrice = getItemPrice(sellerRow);
                    if (itemPrice !== null && itemPrice <= buyFilters[itemId].threshold) {
                        rowElement.style.backgroundColor = "#19166e";
                    } else {
                        rowElement.style.backgroundColor = "";
                    }
                } else {
                    rowElement.style.backgroundColor = "";
                }
            }
        });
    }

    function highlightItems() {
        highlightItemTiles();
        highlightSellerRows();
    }
 
    function getItemPrice(itemElement) {
        const priceElement = itemElement.querySelector('.priceAndTotal___eEVS7 span');
        if (priceElement) {
            const priceText = priceElement.textContent.replace(/[$,]/g, '');
            return parseInt(priceText, 10);
        }
        return null;
    }
 
    function addWatchCheckbox(itemElement, itemId) {
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.classList.add('watch-checkbox');
        checkbox.checked = buyFilters[itemId] && buyFilters[itemId].selected ? buyFilters[itemId].selected : false;
        checkbox.style.position = 'absolute';
        checkbox.style.bottom = '5px';
        checkbox.style.left = '5px';
 
        itemElement.parentElement.style.position = 'relative';
        itemElement.parentElement.appendChild(checkbox);
 
        checkbox.addEventListener('change', (event) => {
            if (buyFilters[itemId]) {
                buyFilters[itemId].selected = event.target.checked;
            } else {
                buyFilters[itemId] = { selected: event.target.checked, threshold: 0 };
            }
            localStorage.setItem('buyFilters', JSON.stringify(buyFilters)); // Save to localStorage
            highlightItems();
        });
    }
 
    // Embed CSS for collapsing and input width
    const style = document.createElement('style');
    style.textContent = `
        #filter-options-box.collapsed {
            height: 30px;
            overflow: hidden;
            padding: 0 10px;
            border-bottom: none;
            transition: height 0.3s ease-in-out, padding 0.3s ease-in-out;
            width: 100%;
        }
        #filter-options-box > div {
            padding-top: 30px;
        }
 
        .buy-threshold {
            width: 80px; /* Adjust this value as needed */
        }
    `;
    document.head.appendChild(style);
 
    // Use MutationObserver to wait for the item list to load
    const observer = new MutationObserver((mutations) => {
        if (document.querySelector('.itemListWrapper___ugBOt')) {
            initializeBuyFilters();
            observer.disconnect();
        }
    });
 
    observer.observe(document.body, { childList: true, subtree: true });
 
})();