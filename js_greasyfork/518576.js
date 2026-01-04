// ==UserScript==
// @name           Contact Us Stock Response Adder
// @namespace      http://www.plus.net/
// @description    Adds custom buttons to streamline ticket responses and actions
// @include        https://workplace.plus.net/tickets/ticket_create.html*
// @include        https://workplace.plus.net/tickets/ticket_escalate.html*
// @include        https://workplace.plus.net/tickets/ticket_close.html*
// @include        https://workplace.plus.net/tickets/ticket_on_hold.html*
// @include        https://workplace.plus.net/tickets/ticket_amend.html*
// @exclude        https://*.btwholesale.com/*
// @author         James Prestwood (edited by Rob Clayton)
// @version        2.5
// @license        MIT License
// @downloadURL https://update.greasyfork.org/scripts/518576/Contact%20Us%20Stock%20Response%20Adder.user.js
// @updateURL https://update.greasyfork.org/scripts/518576/Contact%20Us%20Stock%20Response%20Adder.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Override the canSendSms function to prevent the popup
    window.canSendSms = function() {
        console.log('canSendSms function overridden. No popup triggered.');
    };

    window.addEventListener('load', function() {
        // Get the ticket comment text area
        var ticketCommentText = document.getElementsByName('ticket_comment_text')[0];

        if (!ticketCommentText) {
            console.error('Ticket comment text area not found.');
            return;
        }

        // Create the custom buttons
        var contactButtonDiv = document.createElement("div");
        contactButtonDiv.innerHTML = `
            <input type="button" value="PN Res Details" onclick="document.forms.theform.ticket_comment_text.value += '\\n\\nPlease do not hesitate to get back in touch online at http://contactus.plus.net if we can be of further assistance.';" />
            <input type="button" value="Pre Call SMS" id="preCallSmsButton" />
            <input type="button" value="CAT Update" id="catUpdateButton" />
        `;

        // Insert the custom buttons after the ticket comment text area
        ticketCommentText.parentNode.insertBefore(contactButtonDiv, ticketCommentText.nextSibling);

        // Find the 'Pre Call SMS' link dynamically
        var preCallSmsLink = Array.from(document.querySelectorAll('a')).find(link =>
            link.textContent.includes('Pre Call SMS') &&
            link.getAttribute('onclick') &&
            link.getAttribute('onclick').includes('clickOnLink')
        );

        // Find the 'CAT Update' link similarly
        var catUpdateLink = Array.from(document.querySelectorAll('a')).find(link =>
            link.textContent.includes('CAT Update') &&
            link.getAttribute('onclick') &&
            link.getAttribute('onclick').includes('clickOnLink')
        );

        // Function to perform common actions
        function performActions(buttonName, additionalMessage, ensureTwoWaySMS = false) {
            // Add custom message
            ticketCommentText.value += `\n\n${additionalMessage}`;

            // Select the checkboxes
            var smsOptIn = document.getElementById('sms_optin');
            var smsCustomer = document.getElementById('sms_customer');
            var notifyCustomer = document.getElementById('notify_customer');
            var smsTicketComment = document.getElementById('sms_ticket_comment');

            if (smsOptIn) smsOptIn.checked = true;
            if (smsCustomer) smsCustomer.checked = true;
            if (notifyCustomer) notifyCustomer.checked = true;

            // Enable the SMS ticket comment field
            if (smsTicketComment) {
                smsTicketComment.disabled = false; // Make it editable
                smsTicketComment.value = `${buttonName} message added automatically.`; // Set a default value
                console.log(`${buttonName}: SMS ticket comment field enabled and updated.`);
            } else {
                console.error(`${buttonName}: SMS ticket comment field not found.`);
            }

            // Enable the radio buttons
            var smsTwoWayYes = document.querySelector('input[name="sms_two_way"][value="1"]');
            var smsTwoWayNo = document.querySelector('input[name="sms_two_way"][value="0"]');

            if (smsTwoWayYes && smsTwoWayNo) {
                smsTwoWayYes.disabled = false;
                smsTwoWayNo.disabled = false;

                if (ensureTwoWaySMS) {
                    setTimeout(() => {
                        smsTwoWayYes.checked = true; // Select "Yes" for two-way SMS
                        console.log(`${buttonName}: SMS two-way "Yes" selected.`);
                    }, 100); // Delay to ensure it's the last action
                } else {
                    smsTwoWayNo.checked = true; // Default to "No" if not enforcing two-way SMS
                    console.log(`${buttonName}: SMS two-way "No" selected.`);
                }
            } else {
                console.error(`${buttonName}: SMS two-way radio buttons not found.`);
            }
        }

        // Set up Pre Call SMS button
        if (preCallSmsLink) {
            document.getElementById('preCallSmsButton').onclick = function() {
                performActions('Pre Call SMS', 'Custom message or notes before Pre Call SMS');
                preCallSmsLink.click();
            };
        } else {
            console.error('Pre Call SMS link not found.');
        }

        // Set up CAT Update button
        if (catUpdateLink) {
            document.getElementById('catUpdateButton').onclick = function() {
                performActions('CAT Update', 'Custom message or notes before CAT Update', true);
                catUpdateLink.click();
            };
        } else {
            console.error('CAT Update link not found.');
        }
    });
})();
