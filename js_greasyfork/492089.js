// ==UserScript==
// @name         250Helper
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Check for Biz Plat 250k offer
// @author       AlleriaSun
// @match        https://www.americanexpress.com/us/credit-cards/business/business-credit-cards/american-express-business-platinum-credit-card-amex/
// @grant        GM_notification
// @downloadURL https://update.greasyfork.org/scripts/492089/250Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/492089/250Helper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const searchString = "250,000 Membership";
    const checkIntervalMs = 60000; // 1 minute
    const retryButtonXpath = "//button[text()='Refresh']";
    const applyButtonXpath = "//button[@title='Click here to apply for Business Platinum Card from American Express']";

    let attempts = 1;

    function initializeInfoDiv() {
        const infoDiv = document.createElement('div');
        infoDiv.style.position = 'fixed';
        infoDiv.style.top = '20px';
        infoDiv.style.right = '20px';
        infoDiv.style.padding = '10px';
        infoDiv.style.backgroundColor = 'white';
        infoDiv.style.border = '1px solid black';
        infoDiv.style.zIndex = '10000';
        infoDiv.textContent = "Page loaded. Waiting for the first check...";
        document.body.appendChild(infoDiv);
        return infoDiv;
    }

    const infoDiv = initializeInfoDiv();

    function showNotification(title, message) {
        GM_notification({
            title: title,
            text: message,
            timeout: 5000 // Notification display duration in milliseconds
        });
    }

    function clickButtonUsingXPath(xpathExpression, successMessage, failureMessage) {
        const button = document.evaluate(xpathExpression, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

        if (button) {
            button.click();
            showNotification(successMessage.title, `${successMessage.body} Attempts: ${attempts}.`);
            // Not updating infoDiv on successful clicks as per your instruction
            return true; // Indicates the button was successfully clicked
        } else {
            // Update infoDiv only for failure cases, as navigating away will clear the message
            infoDiv.textContent = `${failureMessage.body} Attempts: ${attempts}.`;
            return false; // Indicates the button was not found
        }
    }

    const intervalId = setInterval(() => {
        if (document.body.innerText.includes(searchString)) {
            clickButtonUsingXPath(
                applyButtonXpath,
                { title: 'Apply Button Clicked', body: `Found the offer for '${searchString}' and clicked the apply button. Please check the page.` },
                { title: 'Offer Found; Apply Button Not Found', body: "Found the offer but not the apply button. Will try again..." }
            );
        } else {
            clickButtonUsingXPath(
                retryButtonXpath,
                { title: 'Page Refreshed', body: `Could not find the offer for '${searchString}' and clicked the refresh button.` },
                { title: 'Offer Not Found; Waiting To Refresh', body: "Could not find the offer and waiting for the refresh button to show up. Will try again..." }
            );
        }
        attempts++;
    }, checkIntervalMs);
})();
