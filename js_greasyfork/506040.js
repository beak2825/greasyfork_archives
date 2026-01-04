// ==UserScript==
// @name         Dubloon O Matic - Trial
// @version      1.11
// @description  Enhanced Dubloon O Matic selection based on coin availability.
// @match        https://www.neopets.com/pirates/dubloonomatic.phtml
// @icon         https://images.neopets.com/themes/036_ddc_je4z0/events/trade_accept.png
// @author       helpful zafara
// @namespace    https://greasyfork.org/users/1277376
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/506040/Dubloon%20O%20Matic%20-%20Trial.user.js
// @updateURL https://update.greasyfork.org/scripts/506040/Dubloon%20O%20Matic%20-%20Trial.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Coin counts
    let oneCount = 0, twoCount = 0, tenCount = 0, twentyCount = 0;
    let fiftyCount = 0, oneHundredCount = 0, twoHundredCount = 0;
    let fiveHundredCount = 0, thousandCount = 0;

    // Add auto-submit checkbox
    function addAutoSubmitCheckbox() {
        const form = document.querySelector('form[action="process_dubloonomatic.phtml"]');
        if (form) {
            const checkboxContainer = document.createElement('div');
            checkboxContainer.style.textAlign = 'center'; // Center the checkbox
            checkboxContainer.style.marginTop = '15px';

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = 'autoSubmitCheckbox';
            checkbox.style.marginRight = '5px';
            checkbox.style.transform = 'scale(1.5)'; // Make checkbox larger for better visibility

            const label = document.createElement('label');
            label.htmlFor = 'autoSubmitCheckbox';
            label.textContent = 'Enable Auto-Submit';
            label.style.fontSize = '1.2em'; // Increase font size for label

            // Load the checkbox state from localStorage
            const isChecked = localStorage.getItem('autoSubmitEnabled') === 'true';
            checkbox.checked = isChecked;

            // Update localStorage on change
            checkbox.addEventListener('change', () => {
                localStorage.setItem('autoSubmitEnabled', checkbox.checked);
            });

            checkboxContainer.appendChild(checkbox);
            checkboxContainer.appendChild(label);
            form.appendChild(checkboxContainer);
        }
    }

    // Count the available coins
    function countCoins() {
        const labels = document.querySelectorAll('font[size="1"] b');
        for (let label of labels) {
            const coinText = label.textContent.trim();
            switch (coinText) {
                case "One Dubloon Coin": oneCount++; break;
                case "Two Dubloon Coin": twoCount++; break;
                case "Ten Dubloon Coin": tenCount++; break;
                case "Twenty Dubloon Coin": twentyCount++; break;
                case "Fifty Dubloon Coin": fiftyCount++; break;
                case "One Hundred Dubloon Coin": oneHundredCount++; break;
                case "Two Hundred Dubloon Coin": twoHundredCount++; break;
                case "Five Hundred Dubloon Coin": fiveHundredCount++; break;
                case "One Thousand Dubloon Coin": thousandCount++; break;
            }
        }
    }

    function selectCoins() {
        // Reverse order of conditions
        if (twoCount >= 2 && oneCount >= 1) {
            selectCoin("Two Dubloon Coin", 2);
            selectCoin("One Dubloon Coin", 1);
            selectDropDown("5");
            console.log('Selected 2 Two Dubloon Coins and 1 One Dubloon Coin for Five Dubloon Coin.');
        } else if (tenCount >= 5) {
            selectCoin("Ten Dubloon Coin", 5);
            selectDropDown("50");
            console.log('Selected 5 Ten Dubloon Coins and Fifty Dubloon Coin.');
        } else if (twentyCount >= 5) {
            selectCoin("Twenty Dubloon Coin", 5);
            selectDropDown("100");
            console.log('Selected 5 Twenty Dubloon Coins and One Hundred Dubloon Coin.');
        } else if (fiftyCount >= 2) {
            selectCoin("Fifty Dubloon Coin", 2);
            selectDropDown("100");
            console.log('Selected 2 Fifty Dubloon Coins and One Hundred Dubloon Coin.');
        } else if (twoHundredCount >= 2 && oneHundredCount >= 1) {
            selectCoin("Two Hundred Dubloon Coin", 2);
            selectCoin("One Hundred Dubloon Coin", 1);
            selectDropDown("500");
            console.log('Selected 2 Two Hundred Dubloon Coins and One Hundred Dubloon Coin.');
        } else if (oneHundredCount >= 2) {
            selectCoin("One Hundred Dubloon Coin", 2);
            selectDropDown("200");
            console.log('Selected 2 One Hundred Dubloon Coins and Two Hundred Dubloon Coin.');
        } else if (fiveHundredCount >= 2) {
            selectCoin("Five Hundred Dubloon Coin", 2);
            selectDropDown("1000");
            console.log('Selected 2 Five Hundred Dubloon Coins and One Thousand Dubloon Coin.');
        } else {
            console.log('Not enough coins available for the default selection.');
        }

        // Change button color after a delay
        setTimeout(changeButtonColor, 3500);
    }

    function changeButtonColor() {
        const submitButton = document.querySelector('form[action="process_dubloonomatic.phtml"] input[type="submit"]');
        if (submitButton) {
            const success = (twoCount >= 2 && oneCount >= 1) ||
                tenCount >= 5 ||
                twentyCount >= 5 ||
                fiftyCount >= 2 ||
                oneHundredCount >= 2 ||
                (twoHundredCount >= 2 && oneHundredCount >= 1) ||
                fiveHundredCount >= 2;

            submitButton.style.backgroundColor = success ? '#28a745' : '#dc3545';
            submitButton.disabled = !success;
            submitButton.style.color = '#fff';
            submitButton.style.border = 'none';
            submitButton.style.padding = '10px 20px';
            submitButton.style.borderRadius = '5px';
            submitButton.style.fontSize = '1.2em'; // Increase font size for submit button
            submitButton.style.cursor = 'pointer'; // Change cursor on hover
            submitButton.style.transition = 'background-color 0.3s'; // Smooth transition for background color

            // Center the button
            submitButton.parentElement.style.textAlign = 'center';

            // Check if auto-submit is enabled
            const autoSubmitCheckbox = document.getElementById('autoSubmitCheckbox');
            if (autoSubmitCheckbox && autoSubmitCheckbox.checked && success) {
                setTimeout(() => {
                    const randomDelay = Math.floor(Math.random() * 500); // Random delay between 0 and 1000 ms
                    setTimeout(() => {
                        submitButton.click();
                        console.log('Auto-submitting form...');
                    }, randomDelay);
                }, 3500);
            }
        }
    }

    function selectCoin(coinName, count) {
        const labels = document.querySelectorAll('font[size="1"] b');
        let selectedCount = 0;
        for (let label of labels) {
            if (label.textContent.trim() === coinName) {
                const checkbox = label.closest('td').querySelector('input[type="checkbox"]');
                if (checkbox) {
                    checkbox.checked = true;
                    selectedCount++;
                    if (selectedCount >= count) break; // Stop after selecting the required count
                }
            }
        }
    }

    function selectDropDown(value) {
        const select = document.querySelector('select[name="exch_up"]');
        if (select) {
            select.value = value; // Set dropdown to the selected value
            select.dispatchEvent(new Event('change'));
            console.log(`Selected "${value}" from the dropdown.`);
        }
    }

    // Execute functions
    addAutoSubmitCheckbox();
    countCoins();
    selectCoins();

    // Immediately scroll to the bottom
    window.scrollTo(0, document.body.scrollHeight);
})();
