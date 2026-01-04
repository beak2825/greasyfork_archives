// ==UserScript==
// @name         Rental Helper
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  Automatically Set Rent & Days
// @author       Stig [2648238]
// @match        https://www.torn.com/properties.php*
// @downloadURL https://update.greasyfork.org/scripts/488098/Rental%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/488098/Rental%20Helper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const rentStorageKey = 'userRentAmount';

    function convertAcronym(input) {
        // Convert input to lowercase for case-insensitive matching
        const lowerInput = input.toLowerCase();

        // Define a dictionary to map suffixes to their multiplier values
        const suffixes = {
            'k': 1000,
            'm': 1000000,
            'b': 1000000000
            // Add more suffixes if needed
        };

        // Regular expression to match the input format (e.g., '23.9m' or '23900k')
        const regex = /^(\d*\.?\d+)([km]?)/;

        // Use regex to extract the numerical value and suffix from the input
        const matches = lowerInput.match(regex);

        // If matches are found
        if (matches && matches.length === 3) {
            // Extract the numerical value and suffix
            const value = parseFloat(matches[1]);
            const suffix = matches[2];

            // If a valid suffix is found in the dictionary, multiply the value
            if (suffixes.hasOwnProperty(suffix)) {
                return value * suffixes[suffix];
            } else {
                // If no suffix is found, return the original value
                return value;
            }
        } else {
            // If no matches are found, return NaN (Not a Number)
            return NaN;
        }
    }

    function promptAndStoreRent() {
        const rentAmount = convertAcronym(prompt("What do you want the rent to be?"));
        if (rentAmount) {
            localStorage.setItem(rentStorageKey, rentAmount);
        }
    }

    function addSetRentButton() {
        const customBtnCss = `
              /* Custom CSS for .torn-new-btn */
              .torn-new-btn {
                  height: 34px;
                  font-family: fjalla one,Arial,serif;
                  font-size: 14px;
                  font-weight: 400;
                  text-align: center;
                  text-transform: uppercase;
                  border-radius: 5px;
                  padding: 0 10px;
                  cursor: pointer;
                  color: #555;
                  color: var(--btn-color);
                  text-shadow: 0 1px 0 #ffffff40;
                  text-shadow: var(--btn-text-shadow);
                  background: linear-gradient(180deg,#DEDEDE 0%,#F7F7F7 25%,#CFCFCF 60%,#E7E7E7 78%,#D9D9D9 100%);
                  background: var(--btn-background);
                  border:1px solid red;
                  display: inline-block;
                  vertical-align: middle;
              }
        `;

        // Add the custom CSS to the page
        const styleElement = document.createElement('style');
        styleElement.type = 'text/css';
        styleElement.appendChild(document.createTextNode(customBtnCss));
        document.head.appendChild(styleElement);

        const specificButton = document.querySelector('input.torn-btn[type="submit"][value="NEXT"][data-to="market"][disabled]');

        if (specificButton) {
            const btnWrapSilver = specificButton.closest('.btn-wrap.silver');
            if (btnWrapSilver) {
                const newButton = document.createElement('input');
                newButton.type = 'submit';
                newButton.className = 'torn-new-btn'; // Use the new custom class
                newButton.value = 'SET RENT';
                newButton.disabled = false;

                newButton.addEventListener('click', function(event) {
                    promptAndStoreRent();
                });

                const newBtnWrap = document.createElement('span');
                newBtnWrap.className = 'btn-wrap silver';
                newBtnWrap.appendChild(newButton);

                btnWrapSilver.parentNode.insertBefore(newBtnWrap, btnWrapSilver.nextSibling);
            }
        }
    }

    function setValues() {
        // Enable Rent to Stored Value
        const rentStorageKey = localStorage.getItem('userRentAmount'); // Assuming 'userRentAmount' is the key you're using
        const moneyInputs = document.querySelectorAll('input.lease.input-money[data-name="money"]');

        if (rentStorageKey) {
            if (moneyInputs.length > 0) {
                const formattedRentStorageKey = parseFloat(rentStorageKey).toLocaleString(); // Format the number with commas
                moneyInputs.forEach(function(moneyInput) {
                    moneyInput.value = formattedRentStorageKey;
                });
            }
        }

        // Set to 30 Days
        const daysInputs = document.querySelectorAll('input.lease.input-money[data-name="days"]');

        if (daysInputs.length > 0) {
            daysInputs.forEach(function(daysInput) {
                daysInput.value = '30';
            });
        }

        // Enable Next Button
        const button = document.querySelector('input.torn-btn[type="submit"][value="NEXT"][data-to="market"]');
        if (button) {
            button.removeAttribute('disabled');
        }
    }

    function initializeMutationObserver() {
        const targetNode = document.getElementById('properties-page-wrap');
        const config = { childList: true, subtree: true };

        const callback = function(mutationsList, observer) {
            for (const mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    const leaseOpt = targetNode.querySelector('.lease-opt');
                    if (leaseOpt) {
                        const btnWrapSilver = leaseOpt.querySelector('.btn-wrap.silver');
                        if (btnWrapSilver) {
                            addSetRentButton();
                            setValues();
                        }
                        // observer.disconnect();
                        return;
                    }
                }
            }
        };
        const observer = new MutationObserver(callback);
        observer.observe(targetNode, config);
    }

    initializeMutationObserver();
})();