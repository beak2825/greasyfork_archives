// ==UserScript==
// @name        Axiom快捷打开gmgn
// @namespace   http://tampermonkey.net/
// @version     0.3
// @description Adds a button to pop up wallet address on axiom.trade
// @author      Gufii
// @match       https://axiom.trade/*
// @grant       GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/541150/Axiom%E5%BF%AB%E6%8D%B7%E6%89%93%E5%BC%80gmgn.user.js
// @updateURL https://update.greasyfork.org/scripts/541150/Axiom%E5%BF%AB%E6%8D%B7%E6%89%93%E5%BC%80gmgn.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const SELECTORS = {
        TARGET_ELEMENT: '[class*="group/address flex flex-row gap-[2px] justify-start items-center hover:bg-primaryStroke/40"]',
        WALLET_ADDRESS_ELEMENT: '.hidden.lg\\:inline.text-textTertiary.text-\\[12px\\]',
        BUTTON_CLASS: 'copy-wallet-button',
    };

    const BUTTON_TEXT = 'OPEN GMGN';
    const BUTTON_STYLES = 'px-2 py-1 ml-2 text-xs text-white bg-blue-500 rounded hover:bg-blue-600 transition-colors duration-150 ease-in-out';
    const BUTTON_MARGIN_LEFT = '4px';

    /**
     * Creates a new button element with specified text and classes.
     * @param {string} text - The text content of the button.
     * @param {string} classNames - Space-separated class names for the button.
     * @returns {HTMLButtonElement} The created button element.
     */
    const createButton = (text, classNames) => {
        const button = document.createElement('button');
        button.textContent = text;
        button.className = classNames;
        button.style.marginLeft = BUTTON_MARGIN_LEFT;
        return button;
    };

    /**
     * Handles the click event for the wallet address button.
     * Copies the address to clipboard and opens gmgn.ai in a new tab.
     * @param {Event} event - The click event object.
     * @param {string} walletAddress - The wallet address to process.
     */
    const handleButtonClick = (event, walletAddress) => {
        event.stopPropagation();
        GM_setClipboard(walletAddress);
        window.open(`https://gmgn.ai/sol/address/${walletAddress}`, '_blank');
    };

    /**
     * Processes a single target element to add the wallet button if not already present.
     * @param {HTMLElement} targetElement - The element to which the button should be added.
     */
    const processTargetElement = (targetElement) => {
        if (targetElement.querySelector(`.${SELECTORS.BUTTON_CLASS}`)) {
            return; // Button already exists
        }

        const walletAddressElement = targetElement.querySelector(SELECTORS.WALLET_ADDRESS_ELEMENT);
        if (!walletAddressElement) {
            return; // No wallet address found in this target element
        }

        const walletAddress = walletAddressElement.textContent.trim();
        if (!walletAddress) {
            return; // Wallet address is empty
        }

        const button = createButton(BUTTON_TEXT, `${SELECTORS.BUTTON_CLASS} ${BUTTON_STYLES}`);
        button.addEventListener('click', (event) => handleButtonClick(event, walletAddress));
        targetElement.appendChild(button);
    };

    /**
     * Scans the document for target elements and adds wallet buttons.
     */
    const addWalletButtons = () => {
        document.querySelectorAll(SELECTORS.TARGET_ELEMENT)
            .forEach(processTargetElement);
    };

    // --- Main Execution ---
    // Use a MutationObserver to efficiently watch for DOM changes.
    // This is more performant than repeatedly querying the DOM.
    const observer = new MutationObserver((mutationsList, observer) => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                // Only re-scan if new nodes were added, optimizing performance.
                addWalletButtons();
                break; // Exit after first relevant mutation to avoid redundant scans
            }
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // Initial run in case elements are already present on page load.
    addWalletButtons();
})();