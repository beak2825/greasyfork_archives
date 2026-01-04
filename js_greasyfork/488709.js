// ==UserScript==
// @name         Check fees NO
// @namespace    http://tampermonkey.net/
// @version      4.0
// @description  Fee Checker.
// @author       Ahmed Esslaoui
// @match        https://cherdak.console3.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/488709/Check%20fees%20NO.user.js
// @updateURL https://update.greasyfork.org/scripts/488709/Check%20fees%20NO.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function initScript() {
        if (document.getElementById('checkFeesButton')) {
            return;
        }

        function querySelectorWithValidatedFallbacks() {
            const selectors = [
                '#single-spa-application\\:\\@cherdak\\/new-order-module > div.Box-sc-dse4m4-0.cXHdXy > main > div > div:nth-child(2) > div:nth-child(2) > div > div:nth-child(1) > div > div > dd:nth-child(17)',
                '#single-spa-application\\:\\@cherdak\\/new-order-module > div.Box-sc-dse4m4-0.cXHdXy > main > div > div:nth-child(2) > div:nth-child(2) > div > div:nth-child(1) > div > div > dd:nth-child(13)',
                '#single-spa-application\\:\\@cherdak\\/new-order-module > div.Box-sc-dse4m4-0.cXHdXy > main > div > div:nth-child(2) > div:nth-child(2) > div > div:nth-child(1) > div > div > dd:nth-child(11)'
            ];
            const invalidKeywords = ['cash', 'city_common_order_title_ride'];

            for (const selector of selectors) {
                const element = document.querySelector(selector);
                if (element) {
                    let content = element.textContent.trim();
                    if (invalidKeywords.some(keyword => content.toLowerCase().includes(keyword))) {
                        continue;
                    }
                    if (selectors.indexOf(selector) > 0 && !/^[0-9a-zA-Z-]+$/.test(content)) {
                        continue;
                    }
                    return element;
                }
            }
            return null;
        }

        const rideUUIDElement = querySelectorWithValidatedFallbacks();
        if (!rideUUIDElement) {
            console.log('Ride UUID not found or invalid.');
            return;
        }

        const driverIDSelector = '#single-spa-application\\:\\@cherdak\\/new-order-module > div.Box-sc-dse4m4-0.cXHdXy > main > div > div:nth-child(2) > div:nth-child(2) > div > div.styles__InfoWrapper-ioCrot.vJNBD > div:nth-child(1) > div > div:nth-child(2) > div:nth-child(2) > div > div:nth-child(1) > dd > a';
        const buttonPlacementSelector = '#single-spa-application\\:\\@cherdak\\/new-order-module > div.Box-sc-dse4m4-0.cXHdXy > main > div > div:nth-child(2) > div:nth-child(2) > div > div.styles__InfoWrapper-ioCrot.vJNBD > div:nth-child(1) > div > div:nth-child(2) > div:nth-child(2) > div > div:nth-child(1) > dt';

        const driverIDElement = document.querySelector(driverIDSelector);
        const buttonPlacementElement = document.querySelector(buttonPlacementSelector);

        if (driverIDElement && buttonPlacementElement) {
            const rideUUID = rideUUIDElement.textContent.trim();
            const driverID = driverIDElement.textContent.trim();
            const button = document.createElement('button');
            button.id = 'checkFeesButton';
            button.innerHTML = 'Check Fees &#8620;';
            button.style = `
                padding: 10px 15px;
                height: 45px;
                border: none;
                border-radius: 5px;
                background: linear-gradient(90deg, rgba(167,233,47,1) 30%, rgba(70,252,180,1) 68%);
                color: black;
                font-size: 16px;
                font-weight: bold;
                cursor: pointer;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
                margin-top: 10px;
                transition: color 0.3s, box-shadow 0.3s;
            `;

            button.addEventListener('mouseenter', () => {
                button.style.color = 'white';
                button.style.boxShadow = '0 6px 9px rgba(0, 0, 0, 0.3)';
            });
            button.addEventListener('mouseleave', () => {
                button.style.color = 'black';
                button.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.2)';
            });

            button.addEventListener('click', () => {
                const url = `https://cherdak.console3.com/mena/user-balance/user-balance-transaction?sourceUUID=${rideUUID}&userId=${driverID}`;
                window.open(url, '_blank').focus();
            });

            buttonPlacementElement.parentElement.insertBefore(button, buttonPlacementElement.nextSibling);
        } else {
            console.log('Driver ID or placement element not found.');
        }
    }

    function setupMutationObserver() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.addedNodes.length > 0) {
                    initScript();
                }
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    setupMutationObserver(); // Initialize the observer on script start
})();
