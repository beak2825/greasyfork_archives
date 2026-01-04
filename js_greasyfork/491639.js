
// ==UserScript==
// @name         Amazon Purchase Automator
// @namespace    http://tampermonkey.net/
// @version      1.3.7
// @description  Automatically buys products on Amazon based on query parameters
// @match        https://www.amazon.com/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/491639/Amazon%20Purchase%20Automator.user.js
// @updateURL https://update.greasyfork.org/scripts/491639/Amazon%20Purchase%20Automator.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function waitForElement(selector, callback, interval = 200, timeout = 10000) {
        const startTime = Date.now();
        const checkInterval = setInterval(() => {
            const element = document.querySelector(selector);
            if (element) {
                clearInterval(checkInterval);
                callback(element);
            } else if (Date.now() - startTime > timeout) { // Timeout to avoid infinite waiting
                clearInterval(checkInterval);
                console.error(`Element ${selector} not found within ${timeout}ms`);
            }
        }, interval);
    }

    function waitForElementXPath(xpath, callback, interval = 200) {
        const checkInterval = setInterval(() => {
            const xpathResult = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
            const element = xpathResult.singleNodeValue;
            if (element) {
                clearInterval(checkInterval);
                callback(element);
            }
        }, interval);
    }

    function buyNew() {
        // This function remains unchanged, provided for context
    }
    function usedonly() {
        const addButtonUbb = document.querySelector('#add-to-cart-button-ubb');
        waitForElement('#add-to-cart-button-ubb', (addToCartButton) => {
            addToCartButton.click();
            document.addEventListener('DOMContentLoaded', (event) => {
                proceedToCheckout();
            });
        }, 2000);
    }
    function buyUsed() {
        const usedOffers = document.querySelector('#all-offers-display');
        
        if (usedOffers) {
            // Click on the '#all-offers-display' if it exists
            waitForElement('#all-offers-display', (allOffersDisplay) => {
                allOffersDisplay.click();

                // After clicking on the offers display, wait for and click on a specific offer by XPath
                waitForElementXPath("//*[@id='a-autoid-2-offer-1']/span/input", (specificOfferButton) => {
                    specificOfferButton.click();

                    // Navigate to the cart page before proceeding to checkout
                    setTimeout(() => {
                        window.location.href = 'https://www.amazon.com/gp/cart/view.html';
                        // Wait for the page to load and then proceed to checkout
                        setTimeout(() => {
                            proceedToCheckout();
                        }, 2000); // Wait 2 seconds for the cart page to fully load before proceeding
                    }, 1000); // Wait 1 second to ensure the click action has been processed
                }, 500);
            }, 500);
        } else {
            // Fallback to other add to cart buttons if #all-offers-display does not exist
            const addButtonUbb = document.querySelector('#add-to-cart-button-ubb');
            const addButton = document.querySelector('#add-to-cart-button');

            if (addButtonUbb) {
                waitForElement('#add-to-cart-button-ubb', (addToCartButton) => {
                    addToCartButton.click();
                    proceedToCheckout();
                }, 500);
            } else if (addButton) {
                waitForElement('#add-to-cart-button', (addToCartButton) => {
                    addToCartButton.click();

                    waitForElement('#attachSiNoCoverage', (noCoverageButton) => {
                        noCoverageButton.click();
                        proceedToCheckout();
                    }, 500);
                }, 500);
            }
        }
    }

    function proceedToCheckout() {
        waitForElement('input[name="proceedToRetailCheckout"]', (proceedToCheckoutButton) => {
            proceedToCheckoutButton.click();
    
            // After clicking 'Proceed to Checkout', wait for the 'Place Your Order' button
            waitForElement('input[name="placeYourOrder1"]', (placeOrderButton) => {
                placeOrderButton.click();
            }, 2000); // Adjust the delay as needed based on typical page load times
        }, 2000); // Initial wait for 'Proceed to Checkout' button
    }

    window.proceedToCheckout = proceedToCheckout;
    window.waitForElement = waitForElement;
    window.waitForElementXPath = waitForElementXPath;
    window.buyNew = buyNew;
    window.buyUsed = buyUsed;
    window.usedonly = usedonly;

    const params = new URLSearchParams(window.location.search);
    const purchaseType = params.get('purchaseType');

    if (purchaseType === 'new') {
        buyNew();
    } else if (purchaseType === 'used') {
        buyUsed();
    } else if (purchaseType === 'usedonly') {
        usedonly();
    }
    else {
        // Fallback or other logic
    }
})();