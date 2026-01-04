// ==UserScript==
// @name         Vault Buttons 2
// @namespace    Titanic_, zstorm
// @version      1.6.6
// @description  Adds buttons for quick withdrawal and deposit to the vault, with customizable values and clipboard insertion. See Screenshots.
// @license      MIT
// @author       Titanic_, zstorm
// @match        https://www.torn.com/properties.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/510874/Vault%20Buttons%202.user.js
// @updateURL https://update.greasyfork.org/scripts/510874/Vault%20Buttons%202.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Default and current button values
    const defaultValues = [352500, 15000000, 23000000];
    let currentValues = [...defaultValues];

    // Flag to ensure scrollIntoView is called only once per load
    let hasScrolled = false;

    // Cache selectors to minimize DOM queries
    const selectors = {
        inputVisible: "form.left > div.torn-divider > div.input-money-group > input.input-money",
        depositInput: "form.right > div.torn-divider > div.input-money-group > input.input-money",
        amountOnHand: ".dvalue",
        vaultTabIndicator: "tab=vault",
        vaultContainer: "form.left .cont.torn-divider",
        depositButtonWrapper: ".vault-cont.right.deposit-box .btn-wrap.silver .btn"
    };

    // Helper function to format numbers into shorthand (e.g., 1,000 -> 1k)
    function formatNumber(value) {
        if (Math.abs(value) >= 1e9) return (value / 1e9) % 1 === 0 ? (value / 1e9) + 'b' : (value / 1e9).toFixed(1) + 'b';
        if (Math.abs(value) >= 1e6) return (value / 1e6) % 1 === 0 ? (value / 1e6) + 'm' : (value / 1e6).toFixed(1) + 'm';
        if (Math.abs(value) >= 1e3) return (value / 1e3) % 1 === 0 ? (value / 1e3) + 'k' : (value / 1e3).toFixed(1) + 'k';
        return value.toString();
    }

    // Helper function to parse and validate clipboard input
    function parseClipboardInput(input) {
        const sanitizedInput = input.replace(/,/g, '').trim();
        const numericInput = sanitizedInput.startsWith('$') ? sanitizedInput.substring(1) : sanitizedInput;
        return isNaN(numericInput) ? null : numericInput;
    }

    // Function to display a subtle error notification
    function showErrorNotification(message) {
        const errorDiv = document.createElement("div");
        errorDiv.textContent = message;
        errorDiv.style.position = "fixed";
        errorDiv.style.top = "10px";
        errorDiv.style.right = "10px";
        errorDiv.style.backgroundColor = "#f44336"; // Red background for error
        errorDiv.style.color = "#ffffff"; // White text
        errorDiv.style.padding = "10px 20px";
        errorDiv.style.borderRadius = "5px";
        errorDiv.style.zIndex = 10000;
        errorDiv.style.fontSize = "16px";
        errorDiv.style.boxShadow = "0 0 10px rgba(0,0,0,0.5)";
        document.body.appendChild(errorDiv);

        // Remove notification after 3 seconds
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.parentNode.removeChild(errorDiv);
            }
        }, 3000);
    }

    // Clipboard Button
    function addClipboardButton(parent) {
        const btn = document.createElement("input");
        btn.value = "Clipboard";
        btn.type = "button";
        btn.classList.add("torn-btn");

        btn.addEventListener("click", async () => {
            try {
                const clipboardContent = await navigator.clipboard.readText();
                const parsedValue = parseClipboardInput(clipboardContent);

                if (parsedValue !== null) {
                    const inputVisible = document.querySelector(selectors.inputVisible);
                    if (inputVisible) {
                        inputVisible.value = parsedValue;
                        inputVisible.dispatchEvent(new Event("input", { bubbles: true }));
                    }
                } else {
                    showErrorNotification("Clipboard content is not a valid number. Only numbers and commas are allowed.");
                }
            } catch (err) {
                console.error('Failed to read clipboard contents: ', err);
                showErrorNotification('Failed to read clipboard contents. Please ensure you have granted clipboard permissions.');
            }
        });

        parent.appendChild(btn);
    }

    // Clear Button with long-press to reset
    function addClearButton(parent) {
        const btn = document.createElement("input");
        btn.value = "Clear";
        btn.type = "button";
        btn.classList.add("torn-btn");

        // Regular click: Clear input field
        btn.addEventListener("click", () => {
            const inputVisible = document.querySelector(selectors.inputVisible);
            if (inputVisible) {
                inputVisible.value = "";
                inputVisible.dispatchEvent(new Event("input", { bubbles: true }));
            }
        });

        // Long-press: Reset buttons to default values
        let timer;
        btn.addEventListener("mousedown", () => {
            timer = setTimeout(() => {
                currentValues = [...defaultValues];
                updateButtons();
            }, 1000);
        });
        btn.addEventListener("mouseup", () => clearTimeout(timer));
        btn.addEventListener("mouseleave", () => clearTimeout(timer));

        parent.appendChild(btn);
    }

    // Helper function to parse user input into a valid number
    function parseInput(input) {
        if (!input) return null;
        const sanitizedInput = input.toLowerCase().replace(/[^0-9.kmb]/g, '');
        let multiplier = 1;

        if (sanitizedInput.endsWith('k')) multiplier = 1e3;
        else if (sanitizedInput.endsWith('m')) multiplier = 1e6;
        else if (sanitizedInput.endsWith('b')) multiplier = 1e9;

        const number = parseFloat(sanitizedInput.replace(/[kmb]/g, ''));

        return isNaN(number) ? null : number * multiplier;
    }

    // Function to add elements to the page
    function addElements() {
        if (document.getElementById("custom-buttons-container")) return;

        const parent = document.createElement("div");
        const leftContainer = document.createElement("div");
        const rightContainer = document.createElement("div");

        parent.id = "custom-buttons-container";
        leftContainer.id = "custom-buttons";
        rightContainer.id = "custom-buttonsright";

        // Add buttons to their respective containers
        currentValues.forEach((value, index) => addButton(leftContainer, formatNumber(value), index));
        addClipboardButton(leftContainer);
        addClearButton(leftContainer);
        addMagicButton(); // Add the magic deposit button

        // Append the containers to the parent
        parent.appendChild(leftContainer);
        parent.appendChild(rightContainer);

        const div = document.querySelector(selectors.vaultContainer);

        if (div) {
            div.parentNode.insertBefore(parent, div.nextSibling);

            // Custom Scroll into View with Offset
            if (!hasScrolled) {
                const rect = parent.getBoundingClientRect();
                const absoluteElementTop = rect.top + window.pageYOffset;
                const middle = absoluteElementTop - (window.innerHeight / 2) + (rect.height / 2) - 100; // Adjust offset here (100px above center)
                window.scrollTo({
                    top: middle,
                    behavior: 'smooth'
                });
                hasScrolled = true;
            }
        }
    }

    // Function to add a button with custom value
    function addButton(parent, label, index) {
        const btn = document.createElement("input");
        btn.value = label;
        btn.type = "button";
        btn.classList.add("torn-btn");

        // Click handler
        btn.addEventListener("click", (e) => {
            if (e.shiftKey) {
                // Open prompt to enter new value when shift-clicked
                const userValue = prompt("Enter a new value for this button (e.g., 1m, 10k, 500000):", formatNumber(currentValues[index]));
                const parsedValue = parseInput(userValue);

                if (parsedValue !== null) {
                    currentValues[index] = parsedValue;
                    btn.value = formatNumber(parsedValue);
                } else {
                    alert("Invalid input. Please enter a valid number (e.g., 1m, 10k, 500000).");
                }
            } else {
                // Regular click action using the current button value
                const inputVisible = document.querySelector(selectors.inputVisible);
                if (inputVisible) {
                    const value = parseInt(inputVisible.value) || 0;
                    inputVisible.value = currentValues[index] + value;
                    inputVisible.dispatchEvent(new Event("input", { bubbles: true }));
                }
            }
        });

        // Long-press to edit value
        let timer;
        btn.addEventListener("mousedown", () => {
            timer = setTimeout(() => {
                const userValue = prompt("Enter a new value for this button (e.g., 1m, 10k, 500000):", formatNumber(currentValues[index]));
                const parsedValue = parseInput(userValue);

                if (parsedValue !== null) {
                    currentValues[index] = parsedValue;
                    btn.value = formatNumber(parsedValue);
                } else {
                    alert("Invalid input. Please enter a valid number (e.g., 1m, 10k, 500000).");
                }
            }, 1000);
        });
        btn.addEventListener("mouseup", () => clearTimeout(timer));
        btn.addEventListener("mouseleave", () => clearTimeout(timer));

        parent.appendChild(btn);
    }

    // Function to update existing buttons after reset
    function updateButtons() {
        const buttons = document.querySelectorAll('#custom-buttons > input.torn-btn');
        currentValues.forEach((value, index) => {
            if (buttons[index]) {
                buttons[index].value = formatNumber(value);
            }
        });
    }

    // Add QDeposit Button
    function addMagicButton() {
        const depositButtonWrapper = document.querySelector(selectors.depositButtonWrapper);

        if (depositButtonWrapper && !document.getElementById("qdeposit-btn")) {
            const btn = document.createElement("input");
            btn.value = "$";
            btn.type = "button";
            btn.classList.add("torn-btn");
            btn.id = "qdeposit-btn"; // Give it an ID for easy manipulation

            btn.addEventListener("click", () => {
                const depositInput = document.querySelector(selectors.depositInput);
                const amountOnHandElem = document.querySelector(selectors.amountOnHand);
                if (depositInput && amountOnHandElem) {
                    const amountOnHand = amountOnHandElem.textContent.replace(/[^0-9]/g, '');
                    depositInput.value = amountOnHand;
                    depositInput.dispatchEvent(new Event("input", { bubbles: true }));

                    btn.style.display = "none";
                    const depositButton = depositButtonWrapper.querySelector("input.torn-btn");
                    if (depositButton) {
                        depositButton.disabled = false;
                    }
                }
            });

            depositButtonWrapper.style.position = "relative"; // Ensure the wrapper is positioned relative
            depositButtonWrapper.appendChild(btn);
        }
    }

    // Function to check and add elements
    function inputCheck() {
        const inputElement = document.querySelector(selectors.inputVisible);
        if (inputElement) {
            addElements();
        }
    }

    // Observe DOM changes efficiently
    const observer = new MutationObserver((mutations, obs) => {
        if (window.location.href.includes(selectors.vaultTabIndicator)) {
            inputCheck();
        } else {
            // Reset the scroll flag if navigating away from the vault tab
            hasScrolled = false;
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // Initial check on script load
    if (window.location.href.includes(selectors.vaultTabIndicator)) {
        inputCheck();
    }

    // Consolidated CSS Styles
    const consolidatedCSS = `
        #qdeposit-btn {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(106, 13, 173, 0.8); /* Slightly transparent background */
            color: #ffffff;
            border-radius: 5px;
            z-index: 1000;
            text-shadow: 0 0 5px rgba(255, 255, 255, 0.5);
            font-size: 16px;
        }
        #custom-buttons { justify-content: center; margin: 0 auto 50 auto; display: flex; gap: 10px; padding-top: 2.5px; padding-bottom: 2.5px; }
        #custom-buttons > input:nth-of-type(1) { background: #2aab2a; color: #ffffff; }
        #custom-buttons > input:nth-of-type(1):hover { transform: scale(1.1); box-shadow: 0 0 15px rgba(42, 171, 42, 1), 0 0 15px rgba(42, 171, 42, 1), 0 0 15px rgba(42, 171, 42, 1); }
        #custom-buttons > input:nth-of-type(2) { background: #208220; color: #ffffff; }
        #custom-buttons > input:nth-of-type(2):hover { transform: scale(1.1); box-shadow: 0 0 15px rgba(32, 130, 32, 1), 0 0 15px rgba(32, 130, 32, 1), 0 0 15px rgba(32, 130, 32, 1); }
        #custom-buttons > input:nth-of-type(3) { background: #114511; color: #ffffff; }
        #custom-buttons > input:nth-of-type(3):hover { transform: scale(1.1); box-shadow: 0 0 15px rgba(17, 69, 17, 1), 0 0 15px rgba(17, 69, 17, 1), 0 0 15px rgba(17, 69, 17, 1); }
        #custom-buttons > input:nth-of-type(4) { background: #0000ff; color: #ffffff; }
        #custom-buttons > input:nth-of-type(4):hover { transform: scale(1.1); box-shadow: 0 0 15px rgba(0, 0, 255, 1), 0 0 15px rgba(0, 0, 255, 1), 0 0 15px rgba(0, 0, 255, 1); }
        #custom-buttons > input:nth-of-type(5) { background: #8b0000; color: #ffffff; }
        #custom-buttons > input:nth-of-type(5):hover { transform: scale(1.1); box-shadow: 0 0 15px rgba(139, 0, 0, 1), 0 0 15px rgba(139, 0, 0, 1), 0 0 15px rgba(139, 0, 0, 1); }
        .vault-cont.right.deposit-box .btn-wrap.silver .btn > input:nth-of-type(2) { background: #8b0000; color: #ffffff; border: 1.5px solid #8a2be2; border-radius: 12px; font-size: 16px; box-shadow: 0 0 10px rgba(138, 43, 226, 0.5), 0 0 20px rgba(138, 43, 226, 0.5), 0 0 30px rgba(138, 43, 226, 0.5); text-shadow: 0 0 5px rgba(255, 255, 255, 0.5); transition: transform 0.3s ease, box-shadow 0.3s ease; }
        .vault-cont.right.deposit-box .btn-wrap.silver .btn > input:nth-of-type(2):hover { transform: scale(1.1); box-shadow: 0 0 20px rgba(138, 43, 226, 0.7), 0 0 30px rgba(138, 43, 226, 0.7), 0 0 40px rgba(138, 43, 226, 0.7); }
    `;

    // Function to add consolidated CSS styles
    function addGlobalStyle(css) {
        const head = document.head || document.getElementsByTagName('head')[0];
        if (!head) { return; }
        const style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css;
        head.appendChild(style);
    }

    // Inject all CSS styles at once
    addGlobalStyle(consolidatedCSS);

})();
