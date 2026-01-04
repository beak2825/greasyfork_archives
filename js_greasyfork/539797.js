// ==UserScript==
// @name         Amazon hide giftcard reload
// @namespace    http://tampermonkey.net/
// @version      v1.3
// @description  2025-09-29
// @author       You
// @match        https://www.amazon.com/*order*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=amazon.com
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/539797/Amazon%20hide%20giftcard%20reload.user.js
// @updateURL https://update.greasyfork.org/scripts/539797/Amazon%20hide%20giftcard%20reload.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create the floating button
    var floatingButton = document.createElement('button');
    floatingButton.innerText = 'Filter';
    floatingButton.style.position = 'fixed';
    floatingButton.style.bottom = '20px';
    floatingButton.style.right = '20px';
    floatingButton.style.padding = '10px';
    floatingButton.style.backgroundColor = '#4CAF50';
    floatingButton.style.color = 'white';
    floatingButton.style.border = 'none';
    floatingButton.style.borderRadius = '5px';
    floatingButton.style.cursor = 'pointer';
    floatingButton.style.zIndex = '1000';

    // Append the button to the body
    document.body.appendChild(floatingButton);

    // Function to simulate the click on the actual publish button
    floatingButton.addEventListener('click', function() {
        main()
    });
})();

function main() {
    'use strict';
    // Your code here...
    document.querySelectorAll('.order-card.js-order-card').forEach(card => {
        if (card.innerText.includes('Gift Card balance is added to your account')||card.innerText.includes('Amazon Gift Card Balance Reload')) {
            card.remove();
        }
    });
}

GM_registerMenuCommand('Run this now', function() {
    main()
}, 'r');

main()