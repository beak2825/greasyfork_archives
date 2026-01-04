// ==UserScript==
// @name         Set Promo Code and Retry for diceblox.com (Check every 2 seconds)
// @namespace    http://tampermonkey.net/
// @version      2.4
// @description  Fetch promo code from Pastebin and retry, staying idle if the code is "nav" and checking every 2 seconds
// @author       You
// @match        https://diceblox.com/promo/redeem
// @grant        none
// @license noturs
// @downloadURL https://update.greasyfork.org/scripts/511629/Set%20Promo%20Code%20and%20Retry%20for%20dicebloxcom%20%28Check%20every%202%20seconds%29.user.js
// @updateURL https://update.greasyfork.org/scripts/511629/Set%20Promo%20Code%20and%20Retry%20for%20dicebloxcom%20%28Check%20every%202%20seconds%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const pastebinURL = 'https://pastebin.com/raw/VzqXdsZT'; // Pastebin URL

    // Function to fetch the promo code from Pastebin
    function fetchPromoCode() {
        const noCacheURL = pastebinURL + '?t=' + new Date().getTime(); // Add timestamp to avoid cache

        return fetch(noCacheURL)
            .then(response => response.text())
            .then(code => {
                const promoCode = code.trim();
                if (promoCode === "nav") {
                    console.log('Promo code is "nav", staying idle...');
                    return null; // Stay idle if the promo code is "nav"
                } else {
                    console.log('Fetched Promo Code:', promoCode);
                    return promoCode;
                }
            })
            .catch(error => {
                console.error('Error fetching promo code:', error);
                return null;
            });
    }

    // Function to set the promo code and click the button
    function setPromoCodeAndSubmit(promoCode) {
        if (!promoCode) {
            return; // If promo code is "nav", do nothing and keep fetching
        }
        const input = document.querySelector("input[placeholder='Enter your code...']");
        if (input) {
            let lastValue = input.value;
            input.value = promoCode; // Set the fetched promo code as the value
            let event = new Event('input', { bubbles: true });
            let tracker = input._valueTracker;
            if (tracker) {
                tracker.setValue(lastValue); // Update tracker for React
            }
            input.dispatchEvent(event);
            console.log('Promo code input set.');

            // Wait for the button to appear and click it
            waitForButtonAndClick();
        } else {
            console.log("Promo code input not found or promo code is invalid.");
        }
    }

    // Function to wait for the button and click it using MutationObserver
    function waitForButtonAndClick() {
        const observer = new MutationObserver((mutations, obs) => {
            const button = document.querySelector('button.c-fqXClO.c-fqXClO-fjlSmU-color-DEFAULT.c-fqXClO-eGaVeY-grow-true.c-fqXClO-ihtsGoR-css');
            if (button) {
                console.log("Redeem button found.");
                button.click();
                console.log('Button clicked.');

                // After clicking, stop observing and fetch the promo code again
                obs.disconnect();
                fetchPromoCode().then(setPromoCodeAndSubmit);  // Fetch and retry immediately after button click
            } else {
                console.log("Redeem button not found, still waiting...");
            }
        });

        // Observe changes in the DOM to find the button
        observer.observe(document.body, { childList: true, subtree: true });
    }

    // Function to wait for the input field using MutationObserver
    function waitForInputField() {
        const observer = new MutationObserver((mutations, obs) => {
            const input = document.querySelector("input[placeholder='Enter your code...']");
            if (input) {
                console.log("Promo code input found, proceeding...");
                obs.disconnect();  // Stop observing once input is found
                fetchPromoCode().then(setPromoCodeAndSubmit);  // Fetch promo code and run the function
            }
        });

        // Start observing the body for changes in the DOM
        observer.observe(document.body, { childList: true, subtree: true });
    }

    // Start the process by waiting for the input field to appear
    waitForInputField();

    // Continuously fetch promo code every 2 seconds if it's "nav"
    setInterval(() => {
        fetchPromoCode().then(setPromoCodeAndSubmit);  // Continuously check if promo code has changed
    }, 2000);  // Check every 2 seconds
})();
