// ==UserScript==
// @name         Car Listing Filter
// @namespace    http://tampermonkey.net/
// @version      v0.0.3
// @description  Hide specific car makes/models from listing results
// @author       shipit@zerofux.dev
// @match        *://www.autotrader.com/*
// @match        *://www.carfax.com/*
// @match        *://www.cargurus.com/*
// @match        *://www.carmax.com/*
// @match        *://www.cars.com/*
// @match        *://www.carvana.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/526112/Car%20Listing%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/526112/Car%20Listing%20Filter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Enable or disable detailed logging
    const verboseLogging = true;  // Set to false to disable logging

    function log(...args) {
        if (verboseLogging) {
            console.log(...args);
        }
    }

    // Add or modify models you want to block in this array (case-insensitive)
    const blockedModels = [
        'buick encore',
        'dodge journey',
        'ford ecosport',
        'hyundai',
        'jeep',
        'kia',
        'mitsubishi outlander',
        'nissan',
        'trax'
    ];

    // Site-specific configuration
    const siteConfig = {
        'www.autotrader.com': {
            container: '.inventory-listing',
            textElement: '[data-cmp="subheading"]',    
        }, 
        'www.carfax.com': {
            container: '.srp-list-item',
            textElement: '.srp-list-item__header'
        },
        'www.cargurus.com': {
            container: '[data-testid="srp-listing-tile"]', 
            textElement: '[data-testid="srp-tile-listing-title"] h4',
            additionalTextElements: ['dl dd'] 
        },
        'www.carmax.com': {
            container: 'article.car-tile',
            textElement: 'div.scct--make-model-container a.scct--make-model-info-link'
        }, 
        'www.cars.com': {
            container: '.vehicle-card',
            textElement: '.vehicle-card-link'
        },
        'www.carvana.com': {
            container: '[data-qa="result-tile"]', 
            textElement: '[data-qa="make-model"]' 
        }
    };

    function hideBlockedModels() {
        const host = window.location.hostname;
        const config = siteConfig[host];
        if (!config) {
            log("No configuration found for host:", host);
            return;
        }
        log("Blocking with the following settings");
        log("Host:", host);
        log("Config:", config);

        document.querySelectorAll(config.container).forEach(card => {
            let shouldHide = false;
            log("Checking card:", card);

            // Check primary element
            const titleElement = card.querySelector(config.textElement);
            if (titleElement) {
                const titleText = titleElement.textContent.toLowerCase();
                log("Found title text:", titleText);
                shouldHide = blockedModels.some(model => titleText.includes(model.toLowerCase()));
                if (shouldHide) {
                    log("Title matched blocked model:", titleText);
                }
            } else {
                log("Title element not found for card");
            }

            // Additional check for model specification in details
            if (!shouldHide && config.additionalTextElements) {
                shouldHide = config.additionalTextElements.some(selector => {
                    const el = card.querySelector(selector);
                    if (el) {
                        const elText = el.textContent.toLowerCase();
                        log("Checking additional text element:", elText);
                        const match = blockedModels.some(model => elText.includes(model.toLowerCase()));
                        if (match) {
                            log("Additional text matched blocked model:", elText);
                            return true;
                        }
                    }
                    return false;
                });
            }

            if (shouldHide) {
                log("Hiding element:", card);
                card.style.setProperty('display', 'none', 'important');
                // Alternative
                // card.remove();
            }
        });
    }

    hideBlockedModels();

    // Observer for dynamic content
    const observer = new MutationObserver(hideBlockedModels);
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();
