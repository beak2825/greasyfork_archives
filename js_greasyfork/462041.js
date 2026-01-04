// ==UserScript==
// @name         ShipHawk Full Ship Mode Margins
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Check margins and prompt the user before booking a shipment
// @author       You
// @match        https://*.shiphawk.com/app/orders/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=shiphawk.com
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/462041/ShipHawk%20Full%20Ship%20Mode%20Margins.user.js
// @updateURL https://update.greasyfork.org/scripts/462041/ShipHawk%20Full%20Ship%20Mode%20Margins.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const originalXhrOpen = XMLHttpRequest.prototype.open;
    const originalXhrSend = XMLHttpRequest.prototype.send;
    let marginInfo = null;
    let isBookingCanceled = false;

    // Wait for the "Ship" button to appear on the page and add an event listener
    function waitForShipButton() {
        const shipButton = document.querySelector('[data-test-id="ship-button"]');

        if (shipButton) {
            shipButton.addEventListener('click', handleShipButtonClick);
        } else {
            setTimeout(waitForShipButton, 500);
        }
    }

    waitForShipButton();

    // Override the XMLHttpRequest.open method to store the request URL
    XMLHttpRequest.prototype.open = function(method, url) {
        this._url = url;
        originalXhrOpen.apply(this, arguments);
    };

    // Override the XMLHttpRequest.send method to intercept requests
    XMLHttpRequest.prototype.send = async function() {
        if (this._url.includes("proposed_shipments/book") && isBookingCanceled) {
            isBookingCanceled = false;
            return;
        }

        if (this._url.includes("/api/v4/web/orders/find")) {
            this.addEventListener('readystatechange', function() {
                if (this.readyState === 4 && this.status === 200) {
                    const responseData = JSON.parse(this.responseText);
                    marginInfo = responseData.reference_numbers;
                }
            });
        }

        originalXhrSend.apply(this, arguments);
    };

    // Check if the margin is good before booking a shipment
    function checkBooking() {
        return new Promise(async (resolve, reject) => {
            if (marginInfo) {
                let rateContainer = document.querySelector('[data-test-id="proposed-rate"] button div');
                if (rateContainer.textContent === 'Calculate Rate') {
                    rateContainer.click();
                    await waitForRate();
                    rateContainer = document.querySelector('[data-test-id="proposed-rate"] button div');
                }
                const rate = parseFloat(rateContainer.textContent.replace(/[^0-9\.]/g, ''));
                const grossProfit = parseFloat(marginInfo.find(element => element.name == "Gross Profit")?.value);

                const isMarginGood = checkMargin(grossProfit, rate);

                if (!isMarginGood) {
                    const confirmMessage = "The margin on this order is not good. Do you want to continue anyway? Negative Margin: $" + (grossProfit - rate).toFixed(2);
                    if (!window.confirm(confirmMessage)) {
                        reject();
                    } else {
                        resolve();
                    }
                } else {
                    resolve();
                }
            } else {
                resolve();
            }
        });
    }

    // Handle the click event on the "Ship" button
    async function handleShipButtonClick(event) {
        event.stopImmediatePropagation();
        event.preventDefault();
        try {
            await checkBooking();
            isBookingCanceled = false;
            const shipButton = document.querySelector('[data-test-id="ship-button"]');
            shipButton.removeEventListener('click', handleShipButtonClick);
            shipButton.click();
            shipButton.addEventListener('click', handleShipButtonClick);
        } catch (error) {
            isBookingCanceled = true;
        }
    }

    // Check if the margin is good (positive)
    function checkMargin(margin, rate) {
        if (isNaN(rate)) return true;
        return (margin - rate > 0);
    }

    // Wait for the rate to be calculated and available in the DOM
    function waitForRate() {
        return new Promise(resolve => {
            const checkRateInterval = setInterval(() => {
                const rateContainer = document.querySelector('[data-test-id="proposed-rate"] button div');
                if (rateContainer.textContent !== 'Calculate Rate' && !isNaN(parseFloat(rateContainer.textContent.replace(/[^0-9\.]/g, '')))) {
                    clearInterval(checkRateInterval);
                    resolve();
                }
            }, 500);
        });
    }
})();