// ==UserScript==
// @name        Helper script for sello.io for linking products to Dolibarr
// @namespace   Violentmonkey Scripts
// @match       https://ui.sello.io/inventory/list*
// @grant       none
// @version     1.0
// @author      Nizo Priskorn
// @description 4/29/2024, 7:23:55 AM
// @require https://cdn.jsdelivr.net/npm/@violentmonkey/dom@2
// @downloadURL https://update.greasyfork.org/scripts/495251/Helper%20script%20for%20selloio%20for%20linking%20products%20to%20Dolibarr.user.js
// @updateURL https://update.greasyfork.org/scripts/495251/Helper%20script%20for%20selloio%20for%20linking%20products%20to%20Dolibarr.meta.js
// ==/UserScript==

// Function to create the button and attach it to the input field
function createButton() {
    // Find the label with for="private_reference"
    var label = document.querySelector('label[for="private_reference"]');

    // Check if the label is found
    if(label) {
        // Find the associated input element
        var input = label.parentElement.querySelector('input');

        // Check if the input element is found
        if(input) {
            // Get the value of the input field
            var value = input.value;

            // Check if the button is already created
            if (!document.getElementById('gotoDolibarrButton')) {
                // Create a button element
                var button = document.createElement('button');
                button.textContent = 'Goto Dolibarr';
                button.id = 'gotoDolibarrButton';

                // Add click event listener to the button
                button.addEventListener('click', function() {
                    // Open the URL with the input value appended to it
                    var url = 'http://162.19.226.24/product/stock/product.php?id=' + encodeURIComponent(value);
                    window.open(url, '_blank');
                });

                // Append the button to the parent element of the label
                label.parentElement.appendChild(button);
            }
        } else {
            console.error('Associated input element not found.');
        }
    }
  //else {
  //      console.error('Label with for="private_reference" not found.');
  //  }
}

// Observe changes in the DOM
const disconnect = VM.observe(document.body, createButton);

// Disconnect the observer when it's not used anymore
//disconnect();
