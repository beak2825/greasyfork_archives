// ==UserScript==
// @name         Megamarket Price Calculator
// @namespace    http://tampermonkey.net/
// @version      0.7.3
// @description  Calculate prices with subtracted bonuses, and sort elements on the page
// @author       xb0t
// @match        https://megamarket.ru/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/481324/Megamarket%20Price%20Calculator.user.js
// @updateURL https://update.greasyfork.org/scripts/481324/Megamarket%20Price%20Calculator.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const sortingEnabled = true;
    const sortByBonusPercent = true; // if flase, sort by price
    const priceColor = 'green';

    function sortItems(items) {
        return Array.from(items).sort((a, b) => {
            if (sortByBonusPercent === false) {
                // sorting by new price low -> high
                const priceA = parseInt(a.dataset.newPrice || '0', 10);
                const priceB = parseInt(b.dataset.newPrice || '0', 10);
                return priceA - priceB;
            } else if (sortByBonusPercent === true) {
                // sorting by bonus percent high -> low
                const percentA = parseInt(a.dataset.bonusPercent || '0', 10);
                const percentB = parseInt(b.dataset.bonusPercent || '0', 10);
                return percentB - percentA;
            }
        });
    }

    function processHorizontalProducts(horizontalProductLists) {
        horizontalProductLists.forEach(horizontalProductList => {
            const horizontalProductListItems = horizontalProductList.querySelectorAll('.horizontal-view:not(.processed)');
            let newElementsAdded = false;

            horizontalProductListItems.forEach(horizontalProductListItem => {
                if (horizontalProductListItem.className.includes('processed')) {
                    return;
                }

                const priceElement = horizontalProductListItem.querySelector('.horizontal-view__price span');
                const bonusElement = horizontalProductListItem.querySelector('.money-bonus_loyalty');

                if (priceElement && bonusElement) {
                    const oldPrice = parseInt(extractDigitsFromString(priceElement.textContent.trim()), 10);
                    let bonusAmount = horizontalProductListItem.querySelector('.bonus-amount');
                    bonusAmount = parseInt(extractDigitsFromString(bonusAmount.textContent.trim()), 10);
                    let bonusPercent = horizontalProductListItem.querySelector('.bonus-percent');
                    bonusPercent = parseInt(extractDigitsFromString(bonusPercent.textContent.trim()), 10);
                    let newPrice = oldPrice - bonusAmount;

                    // Update or set dataset attribute on the item
                    horizontalProductListItem.dataset.newPrice = newPrice;
                    horizontalProductListItem.dataset.bonusPercent = bonusPercent;
                    newPrice = insertSpaceBeforeLastThree(newPrice);

                    // Create a new element to display the resulted amount
                    const newPriceElement = document.createElement('div');
                    newPriceElement.classList.add('horizontal-view__main-price-info');

                    const priceElementChild = document.createElement('div');
                    priceElementChild.classList.add('horizontal-view__price', 'new');

                    const amountElement = document.createElement('span');
                    amountElement.textContent = `${newPrice} ₽`;
                    amountElement.style.setProperty('color', priceColor, 'important');

                    // Append elements to each other
                    priceElementChild.appendChild(amountElement);
                    newPriceElement.appendChild(priceElementChild);

                    // Insert the new elements above existing price
                    const pricesContainer = horizontalProductListItem.querySelector('.horizontal-view__price-conditions');
                    const existingPriceElement = pricesContainer.querySelector('.horizontal-view__main-price-info');
                    if (existingPriceElement) {
                        pricesContainer.insertBefore(newPriceElement, existingPriceElement);
                    } else {
                        pricesContainer.insertBefore(newPriceElement, pricesContainer.firstChild);
                    }

                    console.log('horizontal item price calculated');
                    newElementsAdded = true;
                } else if (priceElement) {
                    const oldPrice = parseInt(extractDigitsFromString(priceElement.textContent.trim()), 10);
                    horizontalProductListItem.dataset.newPrice = oldPrice;
                }
                horizontalProductListItem.classList.add('processed');
            });

            if (newElementsAdded && sortingEnabled) {
                const sortedItems = sortItems(horizontalProductListItems)
                // Clear the container before appending sorted items
                while (horizontalProductList.firstChild) {
                    horizontalProductList.removeChild(horizontalProductList.firstChild);
                }

                sortedItems.forEach(horizontalProductListItem => {
                    horizontalProductList.appendChild(horizontalProductListItem);
                });
                console.log('horizontal products sorted');
            }
        });
    }

    function processProductGrids(productGrids) {
        productGrids.forEach(grid => {

            const gridItems = grid.querySelectorAll('.catalog-item:not(.processed)');
            let newElementsAdded = false;

            gridItems.forEach(gridItem => {
                if (gridItem.className.includes('processed')) {
                    return;
                }

                const priceElement = gridItem.querySelector('.item-price span');
                const bonusElement = gridItem.querySelector('.money-bonus_loyalty');

                if (priceElement && bonusElement) {
                    const oldPrice = parseInt(extractDigitsFromString(priceElement.textContent.trim()), 10);
                    let bonusAmount = gridItem.querySelector('.bonus-amount');
                    bonusAmount = parseInt(extractDigitsFromString(bonusAmount.textContent.trim()), 10);
                    let bonusPercent = gridItem.querySelector('.bonus-percent');
                    bonusPercent = parseInt(extractDigitsFromString(bonusPercent.textContent.trim()), 10);
                    let newPrice = oldPrice - bonusAmount;

                    // Update or set dataset attribute on the item
                    gridItem.dataset.newPrice = newPrice;
                    gridItem.dataset.bonusPercent = bonusPercent;
                    newPrice = insertSpaceBeforeLastThree(newPrice);

                    // Create a new element to display the resulted amount
                    const newPriceElement = document.createElement('div');
                    newPriceElement.classList.add('item-money', 'new');

                    const priceElementChild = document.createElement('div');
                    priceElementChild.classList.add('item-price');

                    const amountElement = document.createElement('span');
                    amountElement.textContent = `${newPrice} ₽`;
                    amountElement.style.setProperty('color', priceColor, 'important');

                    // Append elements to each other
                    priceElementChild.appendChild(amountElement);
                    newPriceElement.appendChild(priceElementChild);

                    // Insert the new elements into the item
                    const pricesContainer = gridItem.querySelector('.inner.catalog-item__prices-container');
                    pricesContainer.insertBefore(newPriceElement, pricesContainer.children[1]);

                    console.log('grid item price calculated');
                    newElementsAdded = true;
                } else if (priceElement) {
                    const oldPrice = parseInt(extractDigitsFromString(priceElement.textContent.trim()), 10);
                    gridItem.dataset.newPrice = oldPrice;
                }
                gridItem.classList.add('processed');
            });

            if (newElementsAdded && sortingEnabled) {
                const sortedGridItems = sortItems(gridItems)

                // Clear the container before appending sorted items
                while (grid.firstChild) {
                    grid.removeChild(grid.firstChild);
                }

                sortedGridItems.forEach(item => {
                    grid.appendChild(item);
                });
                console.log('item grid sorted');
            }
        });
    }

    function processProductStrips(productStripList) {
        let newElementsAdded = false;
        productStripList.forEach(productStrip => {
            const productList = productStrip.querySelectorAll('.product-list-items__col');
            productList.forEach(product => {
                if (product.className.includes('processed')) {
                    return
                }
                const priceElement = product.querySelector('.amount');
                const bonusElement = product.querySelector('.money-bonus_loyalty');

                if (priceElement && bonusElement) {
                    const oldPrice = parseInt(extractDigitsFromString(priceElement.textContent.trim()), 10);
                    let bonusAmount = product.querySelector('.bonus-amount');
                    bonusAmount = parseInt(extractDigitsFromString(bonusAmount.textContent.trim()), 10);
                    let bonusPercent = product.querySelector('.bonus-percent');
                    bonusPercent = parseInt(extractDigitsFromString(bonusPercent.textContent.trim()), 10);
                    let newPrice = oldPrice - bonusAmount;

                    // Update or set dataset attribute on the item
                    product.dataset.newPrice = newPrice;
                    product.dataset.bonusPercent = bonusPercent;
                    newPrice = insertSpaceBeforeLastThree(newPrice);

                    const newResultElement = document.createElement('div');
                    newResultElement.classList.add('product-list-item-price__money', 'new');

                    const newResultSpan = document.createElement('div');
                    newResultSpan.classList.add('amount');
                    newResultSpan.textContent = `${newPrice} ₽`;
                    newResultSpan.style.color = priceColor;

                    newResultElement.appendChild(newResultSpan);

                    // Find the insertion point and insert the new element
                    const productPriceContainer = product.querySelector('.product-list-item-price');
                    productPriceContainer.insertBefore(newResultElement, productPriceContainer.firstChild);

                    console.log('product strip price calculated');
                } else if (priceElement) {
                    const oldPrice = parseInt(extractDigitsFromString(priceElement.textContent.trim()), 10);
                    product.dataset.newPrice = oldPrice;
                }
                product.classList.add('processed');
                newElementsAdded = true;
            });
            if (newElementsAdded && sortingEnabled) {
                const sortedProductList = sortItems(productList)

                // Clear the product strip before appending sorted offers
                while (productStrip.firstChild) {
                    productStrip.removeChild(productStrip.firstChild);
                }

                sortedProductList.forEach(product => {
                    productStrip.appendChild(product);
                });
                console.log('product strip sorted');
            }
        });

    }

    function processProductOffers(productOffersTableList) {
        let newElementsAdded = false;
        productOffersTableList.forEach(table => {
            const productOffersList = table.querySelectorAll('.product-offer');
            if (productOffersList.length > 0) {
                productOffersList.forEach(offer => {
                    if (offer.className.includes('processed')) {
                        return
                    }
                    const priceElement = offer.querySelector('.product-offer-price__amount');
                    const bonusElement = offer.querySelector('.money-bonus_loyalty');

                    if (priceElement && bonusElement) {
                        const oldPrice = parseInt(extractDigitsFromString(priceElement.textContent.trim()), 10);
                        let bonusAmount = offer.querySelector('.bonus-amount');
                        bonusAmount = parseInt(extractDigitsFromString(bonusAmount.textContent.trim()), 10);
                        let bonusPercent = offer.querySelector('.bonus-percent');
                        bonusPercent = parseInt(extractDigitsFromString(bonusPercent.textContent.trim()), 10);
                        let newPrice = oldPrice - bonusAmount;

                        // Update or set dataset attribute on the item
                        offer.dataset.newPrice = newPrice;
                        offer.dataset.bonusPercent = bonusPercent;
                        newPrice = insertSpaceBeforeLastThree(newPrice);
                        // Create the new elements
                        const newResultElement = document.createElement('div');
                        newResultElement.classList.add('product-offer-price'); // Adjust this class accordingly

                        const newResultSpan = document.createElement('span');
                        newResultSpan.classList.add('product-offer-price__amount');
                        newResultSpan.textContent = `${newPrice} ₽`;

                        // Append the span to the div
                        newResultElement.appendChild(newResultSpan);
                        newResultElement.style.color = priceColor;

                        // Get the parent of the price element and insert the new elements before it
                        offer.insertBefore(newResultElement, priceElement.parentElement);

                        console.log('offer price calculated');


                    } else if (priceElement) {
                        const oldPrice = parseInt(extractDigitsFromString(priceElement.textContent.trim()), 10);
                        offer.dataset.resultedAmount = oldPrice;
                    }
                    offer.classList.add('processed');
                    newElementsAdded = true;
                });
                if (newElementsAdded && sortingEnabled) {
                    const sortedOffers = sortItems(productOffersList)

                    sortedOffers.forEach(offer => {
                        table.appendChild(offer);
                    });
                    console.log('offers sorted');
                }
            }
        });

    }

    function processSaleBocks(saleBlocks) {
        saleBlocks.forEach(block => {
            if (block.className.includes('processed')) {
                return
            }
            const priceElement = block.querySelector('[itemprop="price"]');
            const bonusElement = block.querySelector('.bonus-amount');
            if (priceElement && bonusElement) {
                const price = parseInt(extractDigitsFromString(priceElement.getAttribute('content').trim()), 10);
                const bonus = parseInt(extractDigitsFromString(bonusElement.textContent.trim()), 10);
                let result = price - bonus;
                result = insertSpaceBeforeLastThree(result)
                // Create the new elements
                const newResultElement = document.createElement('div');
                newResultElement.classList.add('sales-block-offer-price', 'sales-block-offer-price_active');
                const newResultElement1 = document.createElement('div');
                newResultElement1.classList.add('sales-block-offer-price__container-price');
                const newResultElement2 = document.createElement('span');
                newResultElement2.classList.add('sales-block-offer-price__price-final');
                newResultElement2.textContent = `${result} ₽`;
                newResultElement2.style.color = priceColor;


                // Append
                newResultElement1.appendChild(newResultElement2);
                newResultElement.appendChild(newResultElement1);


                // insert new element before old price
                block.insertBefore(newResultElement, block.firstChild);

                console.log('block price calculated');
                block.classList.add('processed');
            }

        });
    }

    function insertSpaceBeforeLastThree(input) {
        // Convert input to a string
        let str = String(input);

        // Check if the string has at least three characters
        if (str.length > 3) {
            // Insert space before the last three characters
            str = str.slice(0, -3) + " " + str.slice(-3);
        }

        return str;
    }

    function extractDigitsFromString(str) {
        return str.replace(/\D/g, '');
    }

    function calculatePricesAndSort() {
        const productOffersTableList = document.querySelectorAll('.product-offers');
        const productStripList = document.querySelectorAll('.product-list-items.product-list-items');
        const productGrids = document.querySelectorAll('[class*="catalog-listing__items"]:not(.catalog-listing__items_horizontal)');
        const horizontalProductLists = document.querySelectorAll('[class*="catalog-listing__items_horizontal"]');
        const saleBlocks = document.querySelectorAll('.pdp-sales-block');

        if (saleBlocks.length > 0) {
            processSaleBocks(saleBlocks)
        }

        if (productOffersTableList.length > 0) {
            processProductOffers(productOffersTableList)
        }
        if (productStripList.length > 0) {
            processProductStrips(productStripList)
        }

        if (productGrids.length > 0) {
            processProductGrids(productGrids)
        }
        if (horizontalProductLists.length > 0) {
            processHorizontalProducts(horizontalProductLists)
        }
    }

    setInterval(calculatePricesAndSort, 2000); // simple and robust


})();