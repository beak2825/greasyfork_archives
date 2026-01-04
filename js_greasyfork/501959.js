// ==UserScript==
// @name         Refund Tool
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Combines clipboard pasting and refund functionalities
// @author       Ahmed Esslaoui
// @match        https://cherdak.console3.com/mena/user-balance/*
// @icon         https://www.svgrepo.com/download/51300/money.svg
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/501959/Refund%20Tool.user.js
// @updateURL https://update.greasyfork.org/scripts/501959/Refund%20Tool.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to paste clipboard value into the input field
    function pasteClipboardValue() {
        const inputSelector = '#single-spa-application\\:\\@cherdak\\/user-balance-module > div > div.Box-sc-dse4m4-0.cXHdXy > main > div > form > div.styles__Box-dwqAVh.bRINhb > div:nth-child(5) > div > div > div.Box-sc-1tfqw8w-0.lmjjbG > div.Wrapper-sc-cky1l7-1.CHbKx > label > div > div > input';
        const inputElement = document.querySelector(inputSelector);

        if (inputElement) {
            navigator.clipboard.readText().then(text => {
                const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
                nativeInputValueSetter.call(inputElement, text);

                const inputEvent = new Event('input', { bubbles: true });
                inputElement.dispatchEvent(inputEvent);

                const changeEvent = new Event('change', { bubbles: true });
                inputElement.dispatchEvent(changeEvent);
            }).catch(err => {
                console.error('Failed to read clipboard contents: ', err);
            });
        } else {
            console.log('Input field not found.');
        }
    }

    // Observe changes in the DOM to detect when the target input field is added
    const observer = new MutationObserver(mutations => {
        for (let mutation of mutations) {
            if (mutation.type === 'childList' && mutation.addedNodes.length) {
                pasteClipboardValue();
            }
        }
    });

    // Start observing the target node for configured mutations
    observer.observe(document.body, { childList: true, subtree: true });

    // Attempt to paste clipboard value immediately in case the input field is already present
    pasteClipboardValue();

    // Create the floating button
    const button = document.createElement('button');
    button.innerText = 'Refund';
    button.style.position = 'fixed';
    button.style.bottom = '10px';
    button.style.right = '10px';
    button.style.padding = '10px';
    button.style.backgroundColor = '#28a745';
    button.style.color = '#fff';
    button.style.border = 'none';
    button.style.borderRadius = '5px';
    button.style.cursor = 'pointer';
    button.style.zIndex = '1000';

    document.body.appendChild(button);

    button.addEventListener('click', () => {
        // Select all elements that contain the transaction sums
        const transactionElements = document.querySelectorAll('td:nth-child(4)');
        let totalSum = 0;

        transactionElements.forEach(element => {
            const value = parseFloat(element.innerText);
            if (!isNaN(value)) {
                totalSum += value;
            }
        });

        // Convert the total sum to its absolute value
        const absoluteSum = Math.abs(totalSum).toFixed(2);

        // Copy the total sum to the clipboard
        const tempInput = document.createElement('input');
        document.body.appendChild(tempInput);
        tempInput.value = absoluteSum; // Ensures the value has two decimal places
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);

        // Store the sum in localStorage to retrieve it on the next page
        localStorage.setItem('copiedSum', absoluteSum);

        // Extract the dynamic userId from the input field
        const userIdInput = document.querySelector('input[name="userId"]');
        const userId = userIdInput ? userIdInput.value : 'defaultUserId'; // Fallback to a default value if userId is not found

        // Open the new URL with the dynamic userId
        const newUrl = `https://cherdak.console3.com/mena/user-balance/user-balance-transaction/balance-adjustment?countryCode=EG&currencyCode=EGP&type=Paid&userId=${userId}`;
        window.location.href = newUrl;
    });
})();
