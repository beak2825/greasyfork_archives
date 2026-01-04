// ==UserScript==
// @name         Dynamic Hyperlink by Ahmed V3
// @match        https://indriver.lightning.force.com/*
// @grant        none
// @version      2023.4.0
// @author       Ahmed Esslaoui
// @description  Created for internal use only, Created by Ahmed.
// @created      2023-04-06
// @icon         https://indriver.com/upload/watchdocs/documents/3148693/8mk65yycyn6hjakq.jpg
// @namespace https://greasyfork.org/users/807598
// @downloadURL https://update.greasyfork.org/scripts/463544/Dynamic%20Hyperlink%20by%20Ahmed%20V3.user.js
// @updateURL https://update.greasyfork.org/scripts/463544/Dynamic%20Hyperlink%20by%20Ahmed%20V3.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Define a function to generate the hyperlink for the first element
    const generateHyperlink = (selector) => {
        // Get the uiOutputText value
        const uiOutputTextElement = document.querySelector(selector);

        // Check if the element exists
        if (uiOutputTextElement) {
            const uiOutputTextValue = uiOutputTextElement.textContent;

            // Generate the hyperlink URL by appending the uiOutputText value to the base URL
            const hyperlinkURL = `https://podval.console3.com/podval/user/view?id=${uiOutputTextValue}`;

            // Create and return the new hyperlink element
            return createHyperlinkElement(hyperlinkURL, uiOutputTextValue);
        } else {
            return null;
        }
    };

    // Define a function to generate the hyperlink for the second element
    const generateNewHyperlink = (selector, uiOutputTextValue) => {
        // Get the second element's text value
        const secondElementTextValue = document.querySelector(selector).textContent;

        // Generate the hyperlink URL using the new format
        const hyperlinkURL = `https://podval.console3.com/podval/user/tender?id=${uiOutputTextValue}&order_id=${secondElementTextValue}`;

        // Create and return the new hyperlink element
        return createHyperlinkElement(hyperlinkURL, secondElementTextValue);
    };

    // Define a function to create a hyperlink element
    const createHyperlinkElement = (hyperlinkURL, textContent) => {
        const hyperlinkElement = document.createElement('a');
        hyperlinkElement.href = hyperlinkURL;
        hyperlinkElement.textContent = textContent;
        hyperlinkElement.className = 'uiOutputText';

        hyperlinkElement.addEventListener('click', function(event) {
            event.preventDefault();
            window.open(hyperlinkURL, '_blank');
        });

        return hyperlinkElement;
    };

    // Create a mutation observer to watch for changes to the uiOutputText element
    const observer = new MutationObserver(() => {
        // Generate the hyperlinks whenever the uiOutputText value changes
        const firstElementSelector = 'div:nth-child(3) > div:nth-child(1) > div > div.slds-form-element__control.slds-grid.itemBody > span > span';
        const firstHyperlinkElement = generateHyperlink(firstElementSelector);

        if (firstHyperlinkElement) {
            const originalFirstSpanElement = document.querySelector(firstElementSelector);
            originalFirstSpanElement.parentNode.replaceChild(firstHyperlinkElement, originalFirstSpanElement);
        }

        const secondElementSelector = 'div > div:nth-child(2) > div:nth-child(1) > div > div.slds-form-element__control.slds-grid.itemBody > span > span';
        const uiOutputTextValue = firstHyperlinkElement ? firstHyperlinkElement.textContent : '';
        const secondHyperlinkElement = generateNewHyperlink(secondElementSelector, uiOutputTextValue);

                if (secondHyperlinkElement) {
            const originalSecondSpanElement = document.querySelector(secondElementSelector);
            originalSecondSpanElement.parentNode.replaceChild(secondHyperlinkElement, originalSecondSpanElement);
        }
    });

    // Start observing the uiOutputText element for changes
    observer.observe(document, { subtree: true, childList: true });
})();

