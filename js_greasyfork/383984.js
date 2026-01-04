// ==UserScript==
// @name         Bazaar Item Market Link
// @namespace    https://github.com/sulsay/torn
// @version      1.2.1
// @description  Adds link "View in item market" on expanded items in bazaar
// @author       Sulsay [2173590]
// @match        https://www.torn.com/bazaar.php*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/383984/Bazaar%20Item%20Market%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/383984/Bazaar%20Item%20Market%20Link.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Add necessary styles for the item market link
    GM_addStyle(`
        .itemmarketlink {
            color: rgb(181, 52, 113);
            text-decoration: none;
            padding-left: 1rem;
            background: url("https://arsonwarehouse.com/images/awh-icon-48.png") .125rem/.75rem no-repeat;
        }
    `);

    // Initialize a new MutationObserver to observe changes made to the bazaar div
    new MutationObserver(mutations => {
        for(const mutation of mutations) { // Loop through MutationRecords
            let { target } = mutation; // Find what element is being changed
            if(target.classList.contains('show-item-info') // If the user is clicking for the first time, a new 'show-item-info' element will be created
               // Else, if the user is clicking the item again,
               || mutation.addedNodes.length === 1 // we check if there are any added nodes,
               && (target = mutation.addedNodes[0]).classList.contains('show-item-info') // if there are, we check if one of the added nodes is the 'show-item-info' element. We set 'target' to this element.
               && target.querySelector('.info-msg')) // We also check if the 'info-msg' element exists so that we can inject the link.
            {
                let itemId = target.querySelector('[itemid]').getAttribute('itemid').replace(/[^0-9]/g, ''), // We then extract the item id
                    shortDescriptionDiv = target.querySelector('.info-msg').firstElementChild; // We want the description to appear right after the first child of the 'info-msg' element

                // We finally inject the link
                shortDescriptionDiv.insertAdjacentHTML('beforeend', `<a class="itemmarketlink" href="https://www.torn.com/imarket.php#/p=shop&type=${itemId}">View in item market</a>`);

                // We return because we don't want multiple links added on the same mutation.
                return;
            }
        }
    }).observe(document.getElementById('bazaar-page-wrap'), {
        childList: true, // We want to observe children
        subtree: true // and their descendants too.
    });
})();