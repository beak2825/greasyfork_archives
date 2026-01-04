// ==UserScript==
// @name         Bloxd.io Item Duplicator
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Duplicates items in Bloxd.io
// @author       gamedubdub
// @match        https://bloxd.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/529340/Bloxdio%20Item%20Duplicator.user.js
// @updateURL https://update.greasyfork.org/scripts/529340/Bloxdio%20Item%20Duplicator.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to duplicate the item
    function duplicateItem() {
        // Try to find the item by a common class or ID
        let selectedItem = document.querySelector('.item, .block, .inventory-item');  // You can try changing these if they don't work
        
        if (selectedItem) {
            let clonedItem = selectedItem.cloneNode(true);  // Clone the selected item
            selectedItem.parentNode.appendChild(clonedItem);  // Add the duplicated item to the page
            console.log('Item duplicated!');
        } else {
            console.log('Item not found!');
        }
    }

    // Add an event listener to trigger duplication on 'D' key press
    document.addEventListener('keydown', function(event) {
        if (event.key === 'D') {  // Press 'D' to trigger duplication
            duplicateItem();
        }
    });

})();