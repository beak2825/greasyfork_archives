// ==UserScript==
// @name         Udio License Agreement Clicker
// @namespace    http://www.facebook.com/Tophness
// @version      2024-06-29
// @description  Clicks Udio License Agreement
// @author       You
// @match        https://www.udio.com/my-creations
// @icon         https://www.google.com/s2/favicons?sz=64&domain=udio.com
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/499184/Udio%20License%20Agreement%20Clicker.user.js
// @updateURL https://update.greasyfork.org/scripts/499184/Udio%20License%20Agreement%20Clicker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create a MutationObserver to observe changes in the DOM
    const observer = new MutationObserver((mutationsList, observer) => {
        for(let mutation of mutationsList) {
            if (mutation.type === 'childList') {
                const targetDiv = document.querySelector('div[class*="data-[state=closed]:slide-out-to-top"][class*="data-[state=open]:slide-in-from-top"]');
                if (targetDiv) {
                    const firstButton = targetDiv.querySelector('button.peer.shrink-0.rounded-sm.border.border-primary');
                    const secondButton = targetDiv.querySelector('button.inline-flex.items-center.justify-center.whitespace-nowrap.rounded-md.text-sm.font-medium.bg-primary');

                    if (firstButton) firstButton.click();
                    if (secondButton){
                        setTimeout(function() {
                            secondButton.click();
                        }, 1000);
                    }

                    // Stop observing once the buttons are clicked
                    observer.disconnect();
                }
            }
        }
    });

    // Start observing the document body for added nodes
    observer.observe(document.body, { childList: true, subtree: true });
})();