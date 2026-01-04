// ==UserScript==
// @name         Quick Price Copy!
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Click on a sale price or item name to copy it to the clipboard. Also formats Price as you type with commas like 1,000,000 instead of 1000000
// @author       Lucky11
// @match        https://fairview.deadfrontier.com/onlinezombiemmo/index.php?page=35
// @match        https://fairview.deadfrontier.com/onlinezombiemmo/index.php?page=27*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/535149/Quick%20Price%20Copy%21.user.js
// @updateURL https://update.greasyfork.org/scripts/535149/Quick%20Price%20Copy%21.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // // // // // // // // // // // // //
    //                                  //
    //     Quick Price Copy! Settings   //
    // // // // // // // // // // // // //
    // Toggle variables
    const Price_Undercut_Value = 1;
    let Show_Feedback = true;

    let enablePriceCopying = true;// Set to false to disable price copying
    let enableNameCopying = true;// Set to false to disable name copying

    // // // // // // // // // // // // //
    //         1,000,000                //
    //  Price Input Modifier Settings   //
    // // // // // // // // // // // // //

    let enable_price_modifying = true;


    function showCopyFeedback(price) {
        const feedback = document.createElement('div');
        feedback.textContent = `Copied: ${price}`;

        feedback.style.position = 'absolute';
        feedback.style.bottom = '250px';
        feedback.style.left = '50%';
        feedback.style.width = '90%';
        feedback.style.maxWidth = '300px';
        feedback.style.height = '19px';
        feedback.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
        feedback.style.textAlign = 'center';
        feedback.style.fontSize = '15px';
        feedback.style.border = '2px solid rgb(153, 0, 0)';
        feedback.style.padding = '2px 3px';
        feedback.style.color = 'white';
        feedback.style.zIndex = '1000';
        feedback.style.transform = 'translateX(-50%)';

        const invController = document.getElementById('invController');
        invController.appendChild(feedback);

        setTimeout(() => {
            invController.removeChild(feedback);
        }, 1000);
    }

    function copyToClipboard(text) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        const successful = document.execCommand('copy');
        document.body.removeChild(textarea);
    }

    function addClickListenerToPricesAndNames() {
        const salePrices = document.querySelectorAll('.salePrice');
        const itemNames = document.querySelectorAll('.itemName');

        salePrices.forEach(priceElement => {
            if (enablePriceCopying && !priceElement.dataset.listenerAdded) {
                priceElement.style.cursor = 'pointer';
                priceElement.addEventListener('click', (event) => {
                    event.stopPropagation();
                    const priceText = priceElement.textContent.replace(/[^0-9]/g, '');
                    const priceValue = parseInt(priceText, 10) - Price_Undercut_Value;
                    copyToClipboard(priceValue.toString());
                    if (Show_Feedback) {
                        showCopyFeedback(priceValue.toString());
                    }
                    changeColor(priceElement);
                });
                priceElement.dataset.listenerAdded = 'true';
            }
        });

        itemNames.forEach(nameElement => {
            if (enableNameCopying && !nameElement.dataset.listenerAdded) {
                nameElement.style.cursor = 'pointer';
                nameElement.addEventListener('click', (event) => {
                    event.stopPropagation();
                    const itemName = nameElement.textContent;
                    copyToClipboard(itemName);
                    if (Show_Feedback) {
                        showCopyFeedback(itemName);
                    }
                    changeColor(nameElement);
                });
                nameElement.dataset.listenerAdded = 'true';
            }
        });
    }

    function changeColor(element) {
        const originalColor = element.style.color;
        element.style.color = '#28a745';

        setTimeout(() => {
            element.style.color = originalColor;
        }, 700);
    }

    const observer = new MutationObserver((mutations) => {
        let pricesFound = false;
        mutations.forEach(() => {
            const salePrices = document.querySelectorAll('.salePrice');
            const itemNames = document.querySelectorAll('.itemName');
            if (salePrices.length > 0 || itemNames.length > 0) {
                pricesFound = true;
                addClickListenerToPricesAndNames();
            }
        });
    });

    //observer.observe(document.body, { childList: true, subtree: true });
    // Observe specific elements only not whole body as above
    const targetNode = document.querySelector('#marketplace');
    if (targetNode) {
        observer.observe(targetNode, { childList: true, subtree: true });
    }
    // Create a new style element
    const style = document.createElement('style');

    // Add CSS rules for the classes and pseudo-elements
    style.textContent = `
    .itemName::before,
    .itemName::after {
        z-index: -1; /* Put pseudo-elements below item names */
    }
    .itemName {
        z-index: 10; /* Bring itemName in front */
    }
    .salePrice, .itemName {
        cursor: pointer !important; /* Ensure both classes have pointer cursor */
    }
    `;

    // Append the style element to the head of the document
    document.head.appendChild(style);
// // // // // // // // // //
//         1,000,000       //
//  Price Input Modifier   //
// // // // // // // // // //
//
// This script creates a fake text box positioned beneath the real price input.
// The fake box displays the formatted price with commas (e.g. 1,000,000).
// The real input is made transparent, so users see the formatted value instead
// while their input is captured and formatted seamlessly.
//
    const observer1 = new MutationObserver(() => {
        setup();
    });

    const setup = () => {
        if (!enable_price_modifying) return; // Early exit if disabled
        const df_prompt = document.getElementById('prompt');
        if (df_prompt) {
            const gameContent = document.getElementById('gamecontent');
            let priceHolder = gameContent.querySelector('#priceHolder');
            let priceInput = gameContent.querySelector("input[data-type='price']");
            let priceInputFake = gameContent.querySelector('#priceInputFake');

            if (!priceHolder) {
                priceHolder = document.createElement("div");
                priceHolder.id = "priceHolder";
                priceHolder.style.position = "absolute";
                priceHolder.style.width = "100%";
                priceHolder.style.textAlign = "center";
                priceHolder.style.bottom = "30px";
                priceHolder.style.display = "flex";
                priceHolder.style.flexDirection = "column";
                priceHolder.style.alignItems = "center";
                gameContent.appendChild(priceHolder);
            }

            if (priceInput && !priceInputFake) {
                const dollarLabel = document.createElement('label');
                dollarLabel.textContent = '$';
                dollarLabel.style.color = 'rgb(255, 255, 0)';
                dollarLabel.style.alignSelf= 'start';
                dollarLabel.style.paddingLeft= '35px';

                priceHolder.appendChild(dollarLabel);

                priceInputFake = document.createElement('input');
                priceInputFake.setAttribute('type', 'text');
                priceInputFake.setAttribute('id', 'priceInputFake');
                priceInputFake.setAttribute('readonly', true);
                priceInputFake.setAttribute('placeholder', 'Enter your price');

                // Apply styles to priceInput
                priceInput.style.cssText = `
                    width: 180px;
                    padding: 2px;
                    height: 13px;
                    font-family: MS Shell Dlg 2;
                    font-size: 11px;
                    position: absolute;
                    left: 50%;
                    transform: translateX(-50%);
                    background: transparent !important; /* Make background transparent of real text input without commas 1000000 */
                    border: none !important; /* Remove border */
                    color: transparent !important; /* clear real input box text by making it transparent */
                `;

                // Appending fake input styles
                priceInputFake.style.cssText = `
                    width: 180px;
                    color: #ffff00;
                    padding: 2px;
                    border: none;
                    height: 13px;
                    font-family: MS Shell Dlg 2;
                    font-size: 11px;
                    position: absolute;
                    left: 50%;
                    transform: translateX(-50%);
                    background: rgba(89, 0, 0, 0.9);/* Remove image and repeat below to change color of the input box for price! */
                    background-image: url(https://fairview.deadfrontier.com/onlinezombiemmo/Themes/deadfrontier/images/HD/input.gif);
                    background-repeat: repeat-x;
                    `;

                priceHolder.appendChild(priceInputFake); // Append fake input
                priceHolder.appendChild(priceInput); // Append real input

                // Sync initial value of priceInput to priceInputFake
                priceInputFake.value = formatWithCommas(priceInput.value); // Add this line
                // Focus the priceInput when it is added to the DOM
                priceInput.focus();
            }

            if (priceInputFake) {
                priceInput.addEventListener('input', () => {
                    const numericValue = priceInput.value;
                    priceInputFake.value = formatWithCommas(numericValue);
                });
            }
        }
    };

    const formatWithCommas = (value) => {
        const num = Number(value);
        return isNaN(num) ? '' : num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    };

    const prompt = document.getElementById('prompt');
    if (prompt) {
        observer1.observe(prompt, { childList: true, subtree: true });
        setup(); // Initial setup
        //console.log('Price Input Modifier Started');
    }
})();
