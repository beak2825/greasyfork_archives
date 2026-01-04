// ==UserScript==
// @name         Telegram High Light
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  高亮 WUPay Error，點擊右上的checkbox來為 WUPay Error 加上標籤
// @author       Tsukumo
// @match        *://web.telegram.org/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/473102/Telegram%20High%20Light.user.js
// @updateURL https://update.greasyfork.org/scripts/473102/Telegram%20High%20Light.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Define the XPath for the element you want to add the toggle switch to
    const xpath = '//div[@class="messages-layout"]/div[@class="MiddleHeader"]//div[@class="HeaderActions"]';

    // Define the XPath to get the list of elements for printing
    const elementsListXPath = '//div[@class="messages-layout"]/div[@class="Transition"]//div[@class="message-date-group"]/*[@data-message-id]//div[contains(@class, "text-content")]';

    // Function to add a toggle switch to the element
    function addToggleSwitch(element) {
        if (!element.querySelector('input[type="checkbox"]')) {
            const toggleSwitch = document.createElement('input');
            toggleSwitch.type = 'checkbox';
            toggleSwitch.style.marginLeft = '10px';
            element.appendChild(toggleSwitch);

            const label = document.createElement('label');
            label.textContent = 'High Light';
            label.style.marginLeft = '5px';
            element.appendChild(label);

            toggleSwitch.addEventListener('change', function() {
                if (toggleSwitch.checked) {
                    console.log('switch is ON');
                    printElementsText();
                } else {
                    console.log('switch is OFF');
                }
            });
        }
    }

    // Function to print the text of the last element
    function printElementsText() {
        const elementsList = document.evaluate(elementsListXPath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        if (elementsList.snapshotLength > 0) {
            for (let i = 0; i < elementsList.snapshotLength; i++) {
                const element = elementsList.snapshotItem(i);
                const MsgText = element.textContent;

                const urlRegex = /請盡快處理！請點擊查看！(https:\/\/.*?\.html)/;
                const matches = MsgText.match(urlRegex);

                if (matches && matches.length > 0) {
                    const url = matches[1];

                    // Check if "WUPay Error" element already exists as a child
                    const existingErrorElement = element.querySelector('.wupay-error');
                    if (!existingErrorElement) {
                        // Make AJAX request to get the content of the URL
                        const xhr = new XMLHttpRequest();
                        xhr.open('GET', url, true);
                        xhr.onreadystatechange = function () {
                            if (xhr.readyState === 4 && xhr.status === 200) {
                                const responseText = xhr.responseText;

                                // Check if the response contains the specified substrings
                                if (
                                    responseText.includes("/api/payment/tpp/submit") &&
                                    responseText.includes("agmp-dl:ocms-tpp:Deposit 存款要求失敗") &&
                                    responseText.includes("WUPay")
                                ) {
                                    // Create a new element to display the error message
                                    const errorElement = document.createElement('div');
                                    errorElement.textContent = 'WUPay Error';
                                    errorElement.style.backgroundColor = 'black';
                                    errorElement.style.color = 'yellow';
                                    errorElement.className = 'wupay-error'; // Add a class for identification

                                    // Append the error element as a child of the current element
                                    element.appendChild(errorElement);
                                }

                                if (
                                    responseText.includes("/api/payment/tpp/submit") &&
                                    responseText.includes("/TPP/OrderDepositTransaction, overtime") &&
                                    responseText.includes("ApiSpendTime")
                                ) {
                                    // Create a new element to display the error message
                                    const errorElement = document.createElement('div');
                                    errorElement.textContent = 'TPP Error';
                                    errorElement.style.backgroundColor = 'black';
                                    errorElement.style.color = 'yellow';
                                    errorElement.className = 'wupay-error'; // Add a class for identification

                                    // Append the error element as a child of the current element
                                    element.appendChild(errorElement);
                                }
                                if (
                                    responseText.includes("/api/user/forget") &&
                                    responseText.includes("Send SMS Fail") &&
                                    responseText.includes("Request failed with status code 403")
                                ) {
                                    // Create a new element to display the error message
                                    const errorElement = document.createElement('div');
                                    errorElement.textContent = 'SMS Error';
                                    errorElement.style.backgroundColor = 'black';
                                    errorElement.style.color = 'yellow';
                                    errorElement.className = 'wupay-error'; // Add a class for identification

                                    // Append the error element as a child of the current element
                                    element.appendChild(errorElement);
                                }
                            }
                        };
                        xhr.send();
                    }
                } else {
                    console.log('URL not found in the text');
                }
            }
        }
    }

    // Function to observe mutations in the document
    function observeDocument() {
        const observer = new MutationObserver(function(mutations) {
            observer.disconnect(); // Pause the observer
            mutations.forEach(function(mutation) {
                const elementsToAddSwitch = document.evaluate(xpath, mutation.target, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
                for (let i = 0; i < elementsToAddSwitch.snapshotLength; i++) {
                    const element = elementsToAddSwitch.snapshotItem(i);
                    addToggleSwitch(element);
                }
            });
            observer.observe(document, { childList: true, subtree: true }); // Restart the observer
        });

        observer.observe(document, { childList: true, subtree: true });
    }

    // Start observing when the page is loaded
    window.addEventListener('load', observeDocument);
})();
