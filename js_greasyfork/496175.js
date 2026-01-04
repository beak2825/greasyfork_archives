// ==UserScript==
// @name         Copy t.me Link Button
// @namespace    http://tampermonkey.net/
// @version      0.1
// @license MIT
// @description  Adds a button next to the number to copy t.me link without spaces
// @author       Your Name
// @match        https://fragment.com/number/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/496175/Copy%20tme%20Link%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/496175/Copy%20tme%20Link%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function addCopyButton() {
        // Select the span element containing the phone number
        var phoneNumberElement = document.querySelector("#aj_content > main > section.tm-section.tm-auction-section > div.tm-section-header > h2 > span.tm-section-header-domain");

        if (phoneNumberElement && !document.querySelector('.copy-telegram-link')) { // Ensure button is not added multiple times
            // Create a button element
            var copyButton = document.createElement('button');
            copyButton.innerText = 'Copy t.me Link';
            copyButton.style.marginLeft = '10px'; // Add some space between the number and the button
            copyButton.style.fontSize = '12px'; // Make the font size smaller
            copyButton.style.padding = '4px 6px'; // Adjust padding for a smaller button
            copyButton.style.borderRadius = '10px'; // Add border radius for rounded corners
            copyButton.style.border = '1px'; // Add a light border
            copyButton.style.backgroundColor = '#000'; // Light background color
            copyButton.style.cursor = 'pointer'; // Change cursor to pointer
            copyButton.classList.add('copy-telegram-link');

            // Add click event listener to the button
            copyButton.addEventListener('click', function() {
                // Get the phone number text and remove all spaces
                var phoneNumber = phoneNumberElement.innerText.replace(/\s+/g, '');
                // Create the t.me link
                var telegramLink = `t.me/${phoneNumber}`;

                // Create a temporary textarea element to hold the text to be copied
                var tempTextarea = document.createElement('textarea');
                tempTextarea.value = telegramLink;

                // Append the textarea to the body, copy the text, then remove the textarea
                document.body.appendChild(tempTextarea);
                tempTextarea.select();
                document.execCommand('copy');
                document.body.removeChild(tempTextarea);

                // Optional: alert the user that the link has been copied

            });

            // Insert the button after the phone number element
            phoneNumberElement.parentNode.insertBefore(copyButton, phoneNumberElement.nextSibling);
        }
    }

    // Run the function to add the button
    addCopyButton();

    // Observe changes in the main content area to re-add the button if the content changes
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList') {
                addCopyButton();
            }
        });
    });

    // Start observing the target node for configured mutations
    var targetNode = document.querySelector('#aj_content > main');
    if (targetNode) {
        observer.observe(targetNode, { childList: true, subtree: true });
    }
})();
