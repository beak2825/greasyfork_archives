// ==UserScript==
// @name         Close eBay App Discount Pop-Up Only
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Close only the eBay $10 app discount pop-up
// @author       Your Name
// @match        *://*.ebay.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/527973/Close%20eBay%20App%20Discount%20Pop-Up%20Only.user.js
// @updateURL https://update.greasyfork.org/scripts/527973/Close%20eBay%20App%20Discount%20Pop-Up%20Only.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Function to determine if an element is visible
    function isVisible(element) {
        return element.offsetWidth > 0 && element.offsetHeight > 0;
    }

    // Function to click the close button on the specific pop-up
    function clickSpecificCloseButton() {
        const dialogs = document.querySelectorAll('.lightbox-dialog');
        dialogs.forEach((dialog) => {
            if (isVisible(dialog) && dialog.textContent.includes("Get $10.00 off when you purchase in our app!")) {
                const closeButton = dialog.querySelector('.icon-btn.lightbox-dialog__close');
                if (closeButton && isVisible(closeButton)) {
                    closeButton.click();
                    console.log('Specific $10 app discount pop-up closed');
                }
            }
        });
    }

    // Run on page load
    window.addEventListener('load', clickSpecificCloseButton);

    // Observe dynamic changes
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    clickSpecificCloseButton();
                }
            });
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();
