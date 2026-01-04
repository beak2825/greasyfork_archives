// ==UserScript==
// @name         Dynamic Hyperlink by Ahmed V4
// @match        https://indriver.lightning.force.com/*
// @grant        none
// @version      2023.3.7
// @author       Ahmed Esslaoui
// @description  Created for internal use only, Created by Ahmed.
// @created      2023-04-06
// @icon         https://indriver.com/upload/watchdocs/documents/3148693/8mk65yycyn6hjakq.jpg
// @namespace https://greasyfork.org/users/807598
// @downloadURL https://update.greasyfork.org/scripts/464110/Dynamic%20Hyperlink%20by%20Ahmed%20V4.user.js
// @updateURL https://update.greasyfork.org/scripts/464110/Dynamic%20Hyperlink%20by%20Ahmed%20V4.meta.js
// ==/UserScript==

(function() {
    'use strict';

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

    const processElements = (firstElementSelector, secondElementSelector) => {
        const firstElement = document.querySelector(firstElementSelector);

        if (firstElement && !firstElement.closest('a')) {
            const firstElementValue = firstElement.textContent;
            const firstElementHyperlinkURL = `https://podval.console3.com/podval/user/view?id=${firstElementValue}`;
            const firstHyperlinkElement = createHyperlinkElement(firstElementHyperlinkURL, firstElementValue);
            firstElement.parentNode.replaceChild(firstHyperlinkElement, firstElement);

            const secondElement = document.querySelector(secondElementSelector);

            if (secondElement && !secondElement.closest('a')) {
                const secondElementValue = secondElement.textContent;
                const secondElementHyperlinkURL = `https://podval.console3.com/podval/user/tender?id=${firstElementValue}&order_id=${secondElementValue}`;
                const secondHyperlinkElement = createHyperlinkElement(secondElementHyperlinkURL, secondElementValue);
                secondElement.parentNode.replaceChild(secondHyperlinkElement, secondElement);
            }
        }
    };

    const observer = new MutationObserver(() => {
        const firstElementSelector1 = 'div:nth-child(3) > div:nth-child(1) > div > div.slds-form-element__control.slds-grid.itemBody > span > span';
        const secondElementSelector1 = 'div > div:nth-child(2) > div:nth-child(1) > div > div.slds-form-element__control.slds-grid.itemBody > span > span';

        processElements(firstElementSelector1, secondElementSelector1);

        const firstElementSelector2 = 'div > div > div:nth-child(1) > div.slds-form-element__control.slds-grid.itemBody > span > span';
        const secondElementSelector2 = 'div > div > div:nth-child(2) > div.slds-form-element__control.slds-grid.itemBody > span > span';

        processElements(firstElementSelector2, secondElementSelector2);
    });

    observer.observe(document, { subtree: true, childList: true });
})();
