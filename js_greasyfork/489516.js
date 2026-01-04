// ==UserScript==
// @name         易仓扫描收货快捷打印
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Try to add a 'Quick Print' button after a certain button appears
// @author       Your Name
// @match        *skykey.eccang.com/receiving/received/list?quick=25*
// @grant        none
// @license      All Rights Reserved
// @downloadURL https://update.greasyfork.org/scripts/489516/%E6%98%93%E4%BB%93%E6%89%AB%E6%8F%8F%E6%94%B6%E8%B4%A7%E5%BF%AB%E6%8D%B7%E6%89%93%E5%8D%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/489516/%E6%98%93%E4%BB%93%E6%89%AB%E6%8F%8F%E6%94%B6%E8%B4%A7%E5%BF%AB%E6%8D%B7%E6%89%93%E5%8D%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const targetButtonXPath = "//a[contains(@href,'getReceived')]";
    const modalButtonXPath = "//div[contains(@style,'display: block')]//span[contains(text(),'打印(50*20)')]";
    let addedButton = false; // To track if the 'Quick Print' button has been added

    // Function to wait for an element to exist in the DOM
    function waitForElement(xpath, callback) {
        const element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        if (element != null) {
            callback(element);
        } else {
            setTimeout(() => waitForElement(xpath, callback), 500); // Check every 500ms
        }
    }

    // Function to add the Quick Print button
    function addQuickPrintButton(targetButton) {
        const existingButton = document.getElementById('quick-print-button');
        if (!existingButton) { // Check to avoid duplicate buttons
            console.log('Adding Quick Print button.');
            const quickPrintButton = document.createElement('button');
            quickPrintButton.textContent = '快捷打印';
            quickPrintButton.style.marginLeft = '10px';
            quickPrintButton.id = 'quick-print-button';

            quickPrintButton.addEventListener('click', function() {
                console.log('Quick Print button clicked. Clicking target button.');
                targetButton.click();

                // Wait for the modal button to appear and then click it
                waitForElement(modalButtonXPath, function(modalButton) {
                    console.log('Modal button found. Clicking modal button.');
                    modalButton.click();
                });
            });

            targetButton.parentNode.insertBefore(quickPrintButton, targetButton.nextSibling);
            addedButton = true; // Update the flag after adding the button
        }
    }

    // MutationObserver to observe DOM changes
    //const observer = new MutationObserver((mutations) => {
    //    mutations.forEach((mutation) => {
    //        if (mutation.addedNodes.length || mutation.removedNodes.length) {
    //            const targetButton = document.evaluate(targetButtonXPath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    //            if (targetButton) addQuickPrintButton(targetButton);
    //        }
    //    });
    //});

    // Start observing the DOM
    //observer.observe(document.body, { childList: true, subtree: true });

    // Event listener for page actions that might trigger AJAX content updates
    document.addEventListener('click', function(event) {
        // Example: If the AJAX trigger is a button, check if it was clicked
        if (event.target.matches('#toSearch')) { // Replace with actual selector
            addedButton = false;
            setTimeout(() => {
                const targetButton = document.evaluate(targetButtonXPath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                if (targetButton) addQuickPrintButton(targetButton);
            }, 500); // Adjust timeout based on expected AJAX load time
        }
    });
        // Optionally, listen for the 'Enter' key on input fields if that triggers AJAX content updates
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') { // Replace '.your-ajax-trigger-input-selector' with the actual selector
            //&& event.target.matches('#toSearch')
            //addedButton = false;
            setTimeout(() => {
                const targetButton = document.evaluate(targetButtonXPath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                if (targetButton) addQuickPrintButton(targetButton);
            }, 500); // Adjust timeout based on expected AJAX load time
        }
    });
})();
