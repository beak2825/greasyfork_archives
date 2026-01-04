// ==UserScript==
// @name         MercadoLibre Advanced Blocker
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Block specific sellers, delayed shipping, and promoted items on MercadoLibre Mexico
// @author       CL
// @match        https://www.mercadolibre.com.mx/*
// @match        https://listado.mercadolibre.com.mx/*
// @match        https://articulo.mercadolibre.com.mx/*
// @grant        GM_getValue
// @license MIT
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/525611/MercadoLibre%20Advanced%20Blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/525611/MercadoLibre%20Advanced%20Blocker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Configuration
    const config = {
        // List of sellers to block
        blockedSellers: [
            'CHUPAPRECIOS'
            // Add more sellers here as needed, e.g., 'SELLER2', 'SELLER3'
        ],
        // Maximum acceptable shipping delay in days (set to 0 to block all delayed shipping)
        maxShippingDelay: 0,
        // Whether to block promoted/sponsored items
        blockPromoted: true
    };

    // Function to check if the seller is blocked
    function isSellerBlocked(element) {
        const sellerElement = element.querySelector('.poly-component__seller');
        if (!sellerElement) return false;

        const sellerText = sellerElement.textContent.trim();
        return config.blockedSellers.some(seller =>
            sellerText.toLowerCase().includes('por ' + seller.toLowerCase())
        );
    }

    // Function to check if shipping is delayed beyond acceptable time
    function isShippingDelayed(element) {
        const shippingElement = element.querySelector('.poly-component__manufacturing-time');
        if (!shippingElement) return false;

        const shippingText = shippingElement.textContent.trim();
        const daysMatch = shippingText.match(/Disponible (\d+) días/);

        if (daysMatch) {
            const days = parseInt(daysMatch[1]);
            return days > config.maxShippingDelay;
        }

        return false;
    }

    // Function to check if item is promoted/sponsored
    function isPromoted(element) {
        if (!config.blockPromoted) return false;

        const promotedElement = element.querySelector('.poly-component__ads-promotions');
        return promotedElement !== null;
    }

    // Function to check if an element should be hidden
    function shouldHideElement(element) {
        return isSellerBlocked(element) ||
               isShippingDelayed(element) ||
               isPromoted(element);
    }

    // Function to hide blocked items
    function hideBlockedItems() {
        // Find all product cards
        const productCards = document.querySelectorAll('.ui-search-layout__item');

        productCards.forEach(card => {
            if (shouldHideElement(card)) {
                card.style.display = 'none';
            }
        });
    }

    // Create and add a mutation observer to handle dynamically loaded content
    const observer = new MutationObserver((mutations) => {
        mutations.forEach(mutation => {
            if (mutation.addedNodes.length) {
                hideBlockedItems();
            }
        });
    });

    // Start observing changes in the document
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Add configuration UI
    function addConfigUI() {
        const configDiv = document.createElement('div');
        configDiv.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            background: white;
            padding: 10px;
            border: 1px solid #ccc;
            border-radius: 5px;
            z-index: 9999;
            font-size: 12px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        `;

        configDiv.innerHTML = `
            <div style="margin-bottom: 5px;">
                <label>Max shipping delay (days):</label>
                <input type="number" id="maxDelay" value="${config.maxShippingDelay}" min="0" style="width: 50px;">
            </div>
            <div style="margin-bottom: 5px;">
                <label>
                    <input type="checkbox" id="blockPromoted" ${config.blockPromoted ? 'checked' : ''}>
                    Block promoted items
                </label>
            </div>
        `;

        const delayInput = configDiv.querySelector('#maxDelay');
        delayInput.addEventListener('change', (e) => {
            config.maxShippingDelay = parseInt(e.target.value);
            hideBlockedItems();
        });

        const promotedCheckbox = configDiv.querySelector('#blockPromoted');
        promotedCheckbox.addEventListener('change', (e) => {
            config.blockPromoted = e.target.checked;
            hideBlockedItems();
        });

        document.body.appendChild(configDiv);
    }

    // Initial setup
    setTimeout(() => {
        hideBlockedItems();
        addConfigUI();
    }, 1000);
})();