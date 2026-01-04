// ==UserScript==
// @name         Auto Add Free or 100% Off Items to Cart on DAZ 3D Shop with Toggle
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Automatically add free or 100% off items to the shopping cart on DAZ 3D Shop, unless already purchased or in cart.
// @author       ChatGPT
// @license      MIT
// @match        https://www.daz3d.com/shop/*
// @match        https://www.daz3d.com/shop
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/495815/Auto%20Add%20Free%20or%20100%25%20Off%20Items%20to%20Cart%20on%20DAZ%203D%20Shop%20with%20Toggle.user.js
// @updateURL https://update.greasyfork.org/scripts/495815/Auto%20Add%20Free%20or%20100%25%20Off%20Items%20to%20Cart%20on%20DAZ%203D%20Shop%20with%20Toggle.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Customizable Arguments
    const DEFAULT_AUTO_ADD = false; // Default state: true (On), false (Off)
    const HIGHLIGHT_FREE = true; // Highlight free items: true or false

    const log = (msg) => console.log(`[auto_free_DAZ] ${msg}`);
    let autoAddEnabled = DEFAULT_AUTO_ADD;

    // Utility Functions
    const debounce = (func, wait) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    };

    const checkIfItemIsFree = (priceElement) => {
        return priceElement && (priceElement.textContent.trim() === 'Free' || priceElement.querySelector('.percent_off')?.textContent.trim() === '-100%');
    };

    const checkIfItemAlreadyInCart = (productElement) => {
        const inCartButton = productElement.querySelector('.btn-in-cart');
        return inCartButton && inCartButton.style.display !== 'none';
    };

    const checkIfItemAlreadyPurchased = (productElement) => {
        const purchasedButton = productElement.querySelector('.btn-purchased');
        return purchasedButton && purchasedButton.style.display !== 'none';
    };

    const addToCart = (cartButton) => {
        cartButton.click();
        log('Clicked "Add to Cart" button.');
        setTimeout(() => {
            hideModal();
        }, 2000); // Adjust the timeout as needed
    };

    const hideModal = () => {
        const modal = document.querySelector('#add_to_cart_modal');
        const modalBackground = document.querySelector('#modal_background');
        if (modal && modalBackground) {
            modal.style.display = 'none';
            modalBackground.style.display = 'none';
            document.body.style.overflow = 'auto'; // Re-enable scrolling
            log('Hid "Added to Cart" modal and re-enabled scrolling.');
        }
    };

    const highlightItem = (product, color) => {
        if (HIGHLIGHT_FREE) {
            product.style.border = `2px solid ${color}`;
        }
    };

    const processFreeItems = () => {
        if (!autoAddEnabled) return;
        log('Checking for free items...');
        const products = document.querySelectorAll('.item, .slab-card');
        products.forEach(product => {
            const priceElement = product.querySelector('.normal_price, .sale_price');
            const cartButton = product.querySelector('.btn-cart');
            if (checkIfItemIsFree(priceElement)) {
                log(`Found free item: ${product.querySelector('.slab-data h3').innerText}`);

                if (checkIfItemAlreadyInCart(product)) {
                    highlightItem(product, 'blue');
                    log('Item already in cart.');
                } else if (checkIfItemAlreadyPurchased(product)) {
                    highlightItem(product, 'green');
                    log('Item already purchased.');
                } else {
                    highlightItem(product, 'red');
                    addToCart(cartButton);
                }
            }
        });
    };

    const debouncedProcessFreeItems = debounce(processFreeItems, 500);

    const observeMutations = () => {
        const observer = new MutationObserver(() => {
            debouncedProcessFreeItems();
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
        });

        log('Mutation observer set up.');
    };

    const createToggleButton = () => {
        const button = document.createElement('button');
        button.textContent = `Auto Add: ${autoAddEnabled ? 'ON' : 'OFF'}`;
        styleToggleButton(button);
        button.addEventListener('click', toggleAutoAdd);

        document.body.appendChild(button);
    };

    const styleToggleButton = (button) => {
        button.style.position = 'fixed';
        button.style.bottom = '10px';
        button.style.right = '10px';
        button.style.backgroundColor = autoAddEnabled ? 'green' : 'red';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.padding = '10px';
        button.style.borderRadius = '5px';
        button.style.cursor = 'pointer';
        button.style.zIndex = '1000';
    };

    const toggleAutoAdd = (event) => {
        autoAddEnabled = !autoAddEnabled;
        event.target.textContent = `Auto Add: ${autoAddEnabled ? 'ON' : 'OFF'}`;
        event.target.style.backgroundColor = autoAddEnabled ? 'green' : 'red';
        log(`Auto Add is now ${autoAddEnabled ? 'enabled' : 'disabled'}`);
    };

    // Initial setup
    createToggleButton();
    observeMutations();
})();
