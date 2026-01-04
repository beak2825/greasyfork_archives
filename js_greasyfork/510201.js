// ==UserScript==
// @name         Send New Quote & Follow-up SMS from Quotient
// @namespace    http://tampermonkey.net/
// @version      2.8
// @description  Adds Send SMS button to QuotientApp Send quote page, sends SMS to customer on quote.
// @author       ChatGPT4 & Will
// @match        https://go.quotientapp.com/*
// @grant        none
// @license      All Rights Reserved
// @downloadURL https://update.greasyfork.org/scripts/510201/Send%20New%20Quote%20%20Follow-up%20SMS%20from%20Quotient.user.js
// @updateURL https://update.greasyfork.org/scripts/510201/Send%20New%20Quote%20%20Follow-up%20SMS%20from%20Quotient.meta.js
// ==/UserScript==

(function () {
    'use strict';

    var quoteType;
    const customerData = extractCustomerData();

    // Function to add the "Send SMS" checkbox inside the div.flex
    async function addSMSCheckBox() {
        const targetDiv = document.querySelector('div.flex'); // Locate the div with class "flex"
        if (targetDiv && !document.getElementById('smsCheckBoxContainer')) { // Check if button has not been added yet
            console.log(targetDiv + ' found');
            const smsCheckBoxContainer = document.createElement('div');
            smsCheckBoxContainer.id = 'smsCheckBoxContainer'; // Give it an ID for reference

            // Create the checkbox
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = 'smsCheckbox';
            checkbox.checked = true; // Checked by default

            // Create a label for the checkbox
            const label = document.createElement('label');
            label.htmlFor = 'smsCheckbox';
            label.innerText = ' Send SMS'; // Label for the checkbox

            // Add the checkbox and label to the div
            smsCheckBoxContainer.appendChild(checkbox);
            smsCheckBoxContainer.appendChild(label);

            // Style the container div (adjust to fit inside the layout)
            smsCheckBoxContainer.style.display = 'flex';
            smsCheckBoxContainer.style.alignItems = 'center';
            smsCheckBoxContainer.style.marginLeft = '10px'; // Add some space between this and other buttons
            smsCheckBoxContainer.style.marginRight = '10px'; // Add some space between this and other buttons

            // Insert the new button inside the target div
            targetDiv.insertBefore(smsCheckBoxContainer, targetDiv.lastChild); // Insert before the last child (the "Cancel" button)
            console.log('SMS Checkbox added');
        }
    }

    // Function to remove the smsCheckBoxContainer
    function removeSMSCheckBox() {
        const smsCheckBoxContainer = document.getElementById('smsCheckBoxContainer');
        if (smsCheckBoxContainer) { // Only remove the button if it exists
            smsCheckBoxContainer.remove();
        }
    }


    // Function to send SMS via Zapier Webhook (updated to async)
    async function sendSMS() {
        console.log('Sending SMS...');  // Debugging to see if sendSMS is triggered
        // Replace with your quote number extraction logic (or a function to get the quote number)
        const quoteNumber = getQuoteNumber();
        const custData = extractCustomerData();
        const reactData = extractReactProps(); //name_first, followups, quote number

        // Replace with your Zapier Webhook URL
        var zapierWebhookUrl;
        if (quoteType == 'new') {
            zapierWebhookUrl = 'https://hooks.zapier.com/hooks/catch/14481495/2diimoi/'; // New quote URL
        } else if (quoteType == 'followup' || reactData.quote_status == 'expired') {
            zapierWebhookUrl = 'https://hooks.zapier.com/hooks/catch/14481495/2mmmpqe/';  // Follow-up/Expired Webhook URL
        }


        // Data you want to send to Zapier
        const data = {
            "timeID": new Date().toISOString(), // Add a timestamp to make the data unique
            ...custData, // Spread the customer data
            ...reactData,
            "quote_URL": window.location.href
        };

        // Send the POST request to Zapier webhook
        fetch(zapierWebhookUrl, {
            method: 'POST',
            body: JSON.stringify(data)  // Send the data as JSON
        })
            .then(response => response.json())
            .then(response => {
                console.log('Quote type: ' + quoteType + '. SMS sent successfully via Zapier:', response);
            })
            .catch(error => {
                console.error('Quote type: ' + quoteType + '. Error sending SMS via Zapier:', error);
            });
    }

    // Function to extract the quote number (replace with actual logic)
    function getQuoteNumber() {
        const quoteNumberElement = document.querySelector('#zBody > form > div > div > div.quoteCanvas-page > div.quote-detail.qCustomCssBlock.quote-detail-inline > div:nth-child(6) > span:nth-child(1)');
        if (quoteNumberElement) {
            return quoteNumberElement.textContent.trim();
        }
        return 'N/A';
    }


// Get customer info via updated webpage selectors
function extractCustomerData() {
    const mainDiv = document.querySelector('.quote-detail.qCustomCssBlock.quote-detail-columns');
    if (!mainDiv) {
        return {
            customerPhone: 'Phone number not found',
            customerMobile: 'Mobile number not found'
        };
    }

    const columns = mainDiv.querySelectorAll('.quote-detail-columns-col');
    if (columns.length < 2) {
        return {
            customerPhone: 'Phone number not found',
            customerMobile: 'Mobile number not found'
        };
    }

    const customerCol = columns[1]; // The second column contains the customer info

    function findDataByLabel(labelText) {
        const label = Array.from(customerCol.querySelectorAll('label.label-detail'))
            .find(lbl => lbl.textContent.trim() === labelText);
        if (label) {
            const siblingElement = label.nextElementSibling;
            if (siblingElement) {
                const anchorElement = siblingElement.querySelector('a');
                return anchorElement ? anchorElement.textContent.trim() : siblingElement.textContent.trim();
            }
        }
        return 'Data not found';
    }

    function findCustomerName() {
        const label = Array.from(customerCol.querySelectorAll('label.label-detail'))
            .find(lbl => lbl.textContent.trim() === 'For');
        if (label && label.nextElementSibling) {
            const anchorElement = label.nextElementSibling.querySelector('a');
            return anchorElement ? anchorElement.textContent.trim() : 'Data not found';
        }
        return 'Data not found';
    }

    const phone = findDataByLabel('Phone');
    const mobile = findDataByLabel('Mobile');

    return {
        customerPhone: phone,
        customerMobile: mobile
    };
}



    function extractReactProps() {
        const divElement = document.querySelector('div[data-react="ControlMain"]');
        if (!divElement) return null;

        const reactPropsString = divElement.getAttribute('data-react-props');
        // Check if reactPropsString exists and is not null
        if (!reactPropsString) {
            //console.error('React props not found on the element');
            return null;
        }

        const reactProps = JSON.parse(reactPropsString.replace(/&quot;/g, '"'));
        if (!reactProps) {

            console.log("No reactProps");
        } else {
        return {
            name_first: reactProps.props.contacts[0].name_first,
            email: reactProps.props.contacts[0].email,
            followups: reactProps.props.stats.followups,
            quote_number: reactProps.props.placeholders['[quote-number]'],
            sender_firstname: reactProps.props.placeholders['[your-first-name]'],
            quote_status: reactProps.props.quote.status
        }
        };
    }

    // Function to handle the click event on the "Send Now" or "Send Follow-up" button
    function handleSendNowClick(event) {
        const isChecked = document.getElementById('smsCheckbox').checked;
        console.log(`"Send Now" or "Send Follow-up" button clicked! Checkbox is ${isChecked ? 'checked' : 'unchecked'}`);
        if (isChecked) {
            sendSMS();
        }
    }

    // Function to start observing for the "Send Now" and "Send Follow-up" buttons inside a specific container
    function observeForSendNowButton() {
        const observer = new MutationObserver(function (mutationsList) {
            for (let mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    const container = document.querySelector('.navCrumbFixed.shadow-scrolling');
                    // Check if the ControlMain div is present
                    const controlMainDiv = document.querySelector('div[data-react="ControlMain"]');
                    if (controlMainDiv) {
                        const status = extractReactProps().quote_status; // Extract the status
                        if (!status) console.log("no reactProps");
                        console.log(controlMainDiv + ' found');
                        if (status) {
                            //console.log('Quote status found:', status);
                            addExpiredQuoteSmsButton();
                        }
                    }
                    if (container) {
                        const sendNowButton = [...container.querySelectorAll('button')].find(btn => btn.textContent.trim() === 'Send Now');
                        const sendFollowupButton = [...container.querySelectorAll('button')].find(btn => btn.textContent.trim().includes('Follow-up'));

                        if (sendFollowupButton) {
                            addSMSCheckBox();
                            quoteType = "followup";
                            sendFollowupButton.addEventListener('click', handleSendNowClick);
                            console.log('Send Follow-up button found and event listener attached.');
                            return;
                        }

                        if (sendNowButton) {
                            addSMSCheckBox();
                            quoteType = "new";
                            sendNowButton.addEventListener('click', handleSendNowClick);
                            console.log('Send Now button found and event listener attached.');
                            return;
                        }
                    }
                }
            }
        });

        // Start observing the entire document for changes
        observer.observe(document.body, { childList: true, subtree: true });
    }

    // Function to handle URL checking
    function checkURL() {
        const currentURL = window.location.href;
        if (currentURL.includes('review-send=') || currentURL.includes('do-follow-up') || currentURL.includes('/q/')) {
            observeForSendNowButton();
            console.log('Send or Follow up URL found...');
        } else {
            removeSMSCheckBox();
        }
    }

    // Function to listen for URL changes via History API and popstate
    function observeURLChanges() {
        const originalPushState = history.pushState;
        const originalReplaceState = history.replaceState;

        history.pushState = function () {
            originalPushState.apply(history, arguments);
            checkURL();
        };

        history.replaceState = function () {
            originalReplaceState.apply(history, arguments);
            checkURL();
        };

        window.addEventListener('popstate', function () {
            checkURL();
        });

        checkURL();
    }

    observeURLChanges();

        // Function to add the "Send SMS" checkbox inside the div.flex
    async function addExpiredQuoteSmsButton() {
        const targetDiv = document.querySelector('.lg\\:w-1\\/2.p-2.py-3'); // Locate the div with class "flex"
        if (targetDiv && !document.getElementById('expiredQuoteSmsButtonContainer') && extractReactProps().quote_status == 'expired') { // Check if button has not been added yet
            const expiredQuoteSmsButtonContainer = document.createElement('div');
            expiredQuoteSmsButtonContainer.id = 'expiredQuoteSmsButtonContainer'; // Give it an ID for reference
            expiredQuoteSmsButtonContainer.classList.add('p-2.5', 'btn', 'btn-lg');

            // Create the button
            const button = document.createElement('button');
            //button.type = 'button';
            button.id = 'expiredQuoteSms';
            button.classList.add('btn', 'btn-sm', 'btn-save');
            button.innerText = "Send SMS";
            button.style.fontSize = '14px';
            button.style.padding = '10px 40px'

            // Add the button and label to the div
            expiredQuoteSmsButtonContainer.appendChild(button);

            // Style the container div (adjust to fit inside the layout)
            expiredQuoteSmsButtonContainer.style.display = 'flex';
            //expiredQuoteSmsButtonContainer.style.alignItems = 'center';
            //expiredQuoteSmsButtonContainer.style.marginLeft = '10px'; // Add some space between this and other buttons
            //expiredQuoteSmsButtonContainer.style.marginRight = '10px'; // Add some space between this and other buttons

            // Insert the new button inside the target div
            targetDiv.insertBefore(expiredQuoteSmsButtonContainer, targetDiv.firstChild); // Insert before the last child (the "Cancel" button)
            console.log('SMS Checkbox added');
            button.addEventListener('click', handleExpiredQuoteSmsButton);
            quoteType = 'expired';

        }
    }

    // Function to remove the expiredQuoteSmsButtonContainer
    function removeExpiredQuoteSmsButton() {
        const expiredQuoteSmsButtonContainer = document.getElementById('expiredQuoteSmsButtonContainer');
        if (expiredQuoteSmsButtonContainer) { // Only remove the button if it exists
            expiredQuoteSmsButtonContainer.remove();
        }
    }

        // Function to handle the click event on the "Send Now" or "Send Follow-up" button
    function handleExpiredQuoteSmsButton(event) {
        const button = event.target; // Get the button that triggered the event
        console.log(`Expired Quote SMS Button clicked`);
        sendSMS();
        // Set the initial button text to indicate sending
        button.innerText = "SMS Sent";
        button.disabled = true; // Disable the button to prevent multiple clicks
    }

})();