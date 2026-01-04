// ==UserScript==
// @name         Tradingview: Auto Click OK Button For "Concurrent Device" Broker Warning
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Automatically clicks the "Ok" button in specified dialog
// @author       ChatGPT lel
// @match        https://www.tradingview.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/494717/Tradingview%3A%20Auto%20Click%20OK%20Button%20For%20%22Concurrent%20Device%22%20Broker%20Warning.user.js
// @updateURL https://update.greasyfork.org/scripts/494717/Tradingview%3A%20Auto%20Click%20OK%20Button%20For%20%22Concurrent%20Device%22%20Broker%20Warning.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to click the "Ok" button
    function clickOkButton() {
        const okButton = document.querySelector('.dialog-qyCw0PaN button[name="yes"]');
        if (okButton) {
            okButton.click();
        }
    }

    // Observe changes in the document to detect the appearance of the dialog
    const observer = new MutationObserver((mutationsList, observer) => {
        for(const mutation of mutationsList) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                clickOkButton();
            }
        }
    });

    // Start observing the document for changes
    observer.observe(document.body, { childList: true, subtree: true });

})();
