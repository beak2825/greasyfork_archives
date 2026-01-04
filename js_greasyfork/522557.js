// ==UserScript==
// @name         Mbps-19449 MayhemHub Extension
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  Tampermonkey script extension for the MayhemHub discord bot and website, used for the Near~Death [19449] Torn faction
// @author       IAMAPEX [2523988]
// @match        https://www.torn.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/522557/Mbps-19449%20MayhemHub%20Extension.user.js
// @updateURL https://update.greasyfork.org/scripts/522557/Mbps-19449%20MayhemHub%20Extension.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to create a debug overlay
    // function createDebugOverlay() {
    //     const overlay = document.createElement('div');
    //     overlay.id = 'debug-overlay';
    //     overlay.style.position = 'fixed';
    //     overlay.style.top = '10px';
    //     overlay.style.right = '10px';
    //     overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    //     overlay.style.color = 'white';
    //     overlay.style.padding = '10px';
    //     overlay.style.zIndex = '9999';
    //     overlay.style.maxWidth = '300px';
    //     overlay.style.fontSize = '12px';
    //     overlay.style.overflowY = 'auto';
    //     overlay.style.maxHeight = '200px';
    //     overlay.innerHTML = '<strong>Debug Info:</strong><br>';
    //     document.body.appendChild(overlay);
    //     return overlay;
    // }

    // Function to update the debug overlay
    // function updateDebugOverlay(message) {
    //     const overlay = document.getElementById('debug-overlay');
    //     if (overlay) {
    //         overlay.innerHTML += `${message}<br>`;
    //     }
    // }

    // Function to wait for a specific element to be available
    function waitForElement(selector, callback) {
        const element = document.querySelector(selector);
        if (element) {
            // updateDebugOverlay(`Element found: ${selector}`);
            callback(element);
        } else {
            // updateDebugOverlay(`Waiting for element: ${selector}`);
            setTimeout(() => waitForElement(selector, callback), 100);
        }
    }

    // Function to autofill the user name and amount fields with delay
    function autofillFields(userName, amount) {
        // Autofill the name field
        waitForElement('#money-user', (el) => {
            el.value = userName;
            el.dispatchEvent(new Event('input', { bubbles: true }));// Trigger input event
            // updateDebugOverlay(`Autofilled name: ${userName}`);

            // Only autofill the amount if it's not "all"
            if (amount.toLowerCase() !== "all") {
                setTimeout(() => {
                    autofillAmountField(amount);
                }, 500); // delay time
            }
        });
    }

    // Function to autofill the amount field
    function autofillAmountField(amount) {
        waitForElement('.input-money', (el) => {
            el.value = amount;
            el.dispatchEvent(new Event('input', { bubbles: true })); // Trigger input event
            // updateDebugOverlay(`Amount field populated: ${el.value}`);

            // After auto-filling the amount, click the "GIVE MONEY" button
            setTimeout(() => {
                clickGiveMoneyButton();
            }, 500); // delay time
        });
    }

    // Function to click the "GIVE MONEY" button
    function clickGiveMoneyButton() {
        waitForElement('button[aria-label="Add money"]', (el) => {
            el.click();
            // updateDebugOverlay(`Clicked "GIVE MONEY" button`);

            // Optionally, click the confirm button (commented out)
            // setTimeout(() => {
            //     clickConfirmButton();
            // }, 500); // delay time
        });
    }

    // Function to optionally click the "CONFIRM" button
    // function clickConfirmButton() {
    //     waitForElement('button.confirm-btn', (el) => {
    //         el.click();
    //         updateDebugOverlay(`Clicked "CONFIRM" button`);
    //     });
    // }

    // Auto-fill form function with debugging
    function autoFillForm() {
        // Create the debug overlay
        // const overlay = createDebugOverlay();

        // Parse parameters from the hash part of the URL
        const params = getHashParams();
        const userName = params['user'];
        let amount = params['amount'];

        // updateDebugOverlay(`userName: ${userName}`);
        // updateDebugOverlay(`amount: ${amount}`);

        if (userName && amount) {
            // Remove "$" if present in the amount
            amount = amount.replace('$', '');
            // updateDebugOverlay(`Amount after removing $: ${amount}`);

            autofillFields(userName, amount);
        } else {
            // updateDebugOverlay('userName or amount parameter missing');
        }
    }

    // Function to parse hash parameters manually
    function getHashParams() {
        const hash = window.location.hash.substring(1); // Remove the leading '#'
        const params = {};
        hash.split('&').forEach(function(part) {
            const [key, value] = part.split('=');
            if (key && value) {
                params[key] = decodeURIComponent(value);
            }
        });
        return params;
    }

    // Run the function after the page fully loads
    window.addEventListener('load', autoFillForm);
})();
