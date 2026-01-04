// ==UserScript==
// @name         Torn Trade Page Clipboard Paster (Refined)
// @namespace    http://tampermonkey.net/
// @version      2.3
// @description  Adds "Paste" button that switches to "Submit" and "Clear" when input has content, with validation and improved error visibility.
// @author       YourName
// @match        https://www.torn.com/trade.php*
// @grant        GM_addStyle
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/511296/Torn%20Trade%20Page%20Clipboard%20Paster%20%28Refined%29.user.js
// @updateURL https://update.greasyfork.org/scripts/511296/Torn%20Trade%20Page%20Clipboard%20Paster%20%28Refined%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Inject CSS Styles
    GM_addStyle(`
        .clipboard-button-container {
            position: absolute;
            top: 50%;
            right: 10px;
            transform: translateY(-50%);
            z-index: 1000;
            display: flex;
            gap: 5px;
        }

        .clipboard-paste-button, .clipboard-submit-button, .clipboard-clear-button {
            padding: 6px 12px;
            font-size: 14px;
            cursor: pointer;
            color: white;
            border: none;
            border-radius: 4px;
            opacity: 0.9;
            transition: opacity 0.2s, background-color 0.2s;
        }

        .clipboard-paste-button {
            background-color: #4CAF50; /* Green */
        }

        .clipboard-paste-button:hover {
            opacity: 1;
        }

        .clipboard-submit-button {
            background-color: #008CBA; /* Blue */
            font-weight: bold;
        }

        .clipboard-submit-button:hover {
            background-color: #007B9E;
            opacity: 1;
        }

        .clipboard-clear-button {
            background-color: #D8000C; /* Red */
        }

        .clipboard-clear-button:hover {
            background-color: #B00000;
            opacity: 1;
        }

        .clipboard-paste-error {
            position: absolute;
            top: 110%;
            left: 0;
            font-size: 12px;
            color: #D8000C;
            background-color: #FFBABA;
            padding: 4px 8px;
            border: 1px solid #D8000C;
            border-radius: 4px;
            opacity: 0;
            transition: opacity 0.3s;
            pointer-events: none;
            white-space: nowrap;
            z-index: 1001;
        }

        .clipboard-paste-input-error {
            border: 2px solid #D8000C !important;
        }
    `);

    // Utility Functions
    function showError(parent, message) {
        const existingError = parent.querySelector('.clipboard-paste-error');
        if (existingError) return;

        const error = document.createElement('div');
        error.className = 'clipboard-paste-error';
        error.innerText = message;
        parent.appendChild(error);

        void error.offsetWidth;
        error.style.opacity = '1';

        const inputField = parent.querySelector('input.input-money');
        if (inputField) {
            inputField.classList.add('clipboard-paste-input-error');
        }

        setTimeout(() => {
            error.style.opacity = '0';
            setTimeout(() => {
                if (error.parentNode) error.parentNode.removeChild(error);
                if (inputField) {
                    inputField.classList.remove('clipboard-paste-input-error');
                }
            }, 300);
        }, 3000);
    }

    function parseNumber(str) {
        return parseFloat(str.replace(/,/g, ''));
    }

    function isOnAddMoneyStep() {
        return /^#step=addmoney/.test(window.location.hash);
    }

    function createPasteButton() {
        const button = document.createElement('button');
        button.innerText = 'Paste';
        button.type = 'button';
        button.className = 'clipboard-paste-button';
        return button;
    }

    function createSubmitButton() {
        const button = document.createElement('button');
        button.innerText = 'Submit';
        button.type = 'button';
        button.className = 'clipboard-submit-button';
        return button;
    }

    function createClearButton() {
        const button = document.createElement('button');
        button.innerText = 'Clear';
        button.type = 'button';
        button.className = 'clipboard-clear-button';
        return button;
    }

    function initializeButtons(targetDiv) {
        if (targetDiv.classList.contains('clipboard-paste-initialized')) return;

        targetDiv.style.position = 'relative';

        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'clipboard-button-container';

        const pasteButton = createPasteButton();
        buttonContainer.appendChild(pasteButton);
        targetDiv.appendChild(buttonContainer);

        const form = targetDiv.closest('form');
        if (!form) return;

        const originalSubmit = form.querySelector('input[type="submit"]');
        if (originalSubmit) {
            originalSubmit.style.display = 'none'; // Hide original submit
        }

        pasteButton.addEventListener('click', async (e) => {
            e.preventDefault();
            try {
                if (!navigator.clipboard) {
                    showError(targetDiv, 'Clipboard API not supported.');
                    return;
                }

                const clipboardText = await navigator.clipboard.readText();
                let processedText = clipboardText.trim();

                if (processedText.startsWith('$')) {
                    processedText = processedText.substring(1).trim();
                }

                const pastedValue = parseNumber(processedText);

                if (isNaN(pastedValue) || !isFinite(pastedValue)) {
                    showError(targetDiv, 'Invalid number in clipboard.');
                    return;
                }

                const moneyValueSpan = document.querySelector('span.money-value');
                if (!moneyValueSpan) {
                    showError(targetDiv, 'Unable to retrieve your available funds.');
                    return;
                }

                const availableMoney = parseNumber(moneyValueSpan.textContent.trim());

                if (isNaN(availableMoney) || !isFinite(availableMoney)) {
                    showError(targetDiv, 'Invalid available funds value.');
                    return;
                }

                if (pastedValue > availableMoney) {
                    showError(targetDiv, 'You don\'t have enough for what you\'re trying to enter.');
                    return;
                }

                const inputField = targetDiv.querySelector('input.input-money');
                inputField.value = pastedValue;
                inputField.dispatchEvent(new Event('input', { bubbles: true }));

            } catch (err) {
                showError(targetDiv, 'Failed to read clipboard.');
            }
        });

        // Listen for input changes to toggle buttons
        const inputField = targetDiv.querySelector('input.input-money');
        if (!inputField) return;

        inputField.addEventListener('input', () => {
            const currentValue = inputField.value.trim();

            if (currentValue !== '') {
                // If Submit and Clear buttons already exist, do nothing
                if (buttonContainer.querySelector('.clipboard-submit-button') || buttonContainer.querySelector('.clipboard-clear-button')) {
                    return;
                }

                // Switch to Submit and Clear
                pasteButton.style.display = 'none';

                const submitButton = createSubmitButton();
                const clearButton = createClearButton();
                buttonContainer.appendChild(clearButton);
                buttonContainer.appendChild(submitButton); // Submit on the right

                submitButton.addEventListener('click', () => {
                    if (originalSubmit) {
                        originalSubmit.click();
                    }
                });

                clearButton.addEventListener('click', () => {
                    inputField.value = '';
                    inputField.dispatchEvent(new Event('input', { bubbles: true }));
                });
            } else {
                // Switch back to Paste
                const submitButton = buttonContainer.querySelector('.clipboard-submit-button');
                const clearButton = buttonContainer.querySelector('.clipboard-clear-button');
                if (submitButton) submitButton.remove();
                if (clearButton) clearButton.remove();
                pasteButton.style.display = 'inline-block';
            }
        });

        targetDiv.classList.add('clipboard-paste-initialized');
    }

    function debounce(func, wait) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }

    // Monitor and Initialize
    function monitorAndInitialize() {
        if (isOnAddMoneyStep()) {
            const targetDiv = document.querySelector('div.input-money-group');
            if (targetDiv && !targetDiv.classList.contains('clipboard-paste-initialized')) {
                initializeButtons(targetDiv);
            }
        }
    }

    const observer = new MutationObserver(debounce(monitorAndInitialize, 50));
    observer.observe(document.body, { childList: true, subtree: true });

    monitorAndInitialize();

    window.addEventListener('hashchange', debounce(monitorAndInitialize, 50));
    window.addEventListener('popstate', debounce(monitorAndInitialize, 50));

})();