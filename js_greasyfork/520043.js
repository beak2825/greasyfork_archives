// ==UserScript==
// @name         Autotrader UK - remove ads from search results
// @namespace    https://autotrader.co.uk
// @version      0.2
// @description  Removes all "Ad" and "You may also like" items from autotrader.co.uk search results
// @author       Steve Chambers
// @license      MIT
// @match        https://www.autotrader.co.uk/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=autotrader.co.uk
// @downloadURL https://update.greasyfork.org/scripts/520043/Autotrader%20UK%20-%20remove%20ads%20from%20search%20results.user.js
// @updateURL https://update.greasyfork.org/scripts/520043/Autotrader%20UK%20-%20remove%20ads%20from%20search%20results.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    // Function to remove the targeted <li> elements
    function removeTargetedListItems() {
        document.querySelectorAll('li').forEach(li => {
            const spanText = li.querySelector('span')?.textContent.trim();
            if (spanText === 'Ad' || spanText === 'You may also like') {
                li.remove();
                return;
            }
            
            if (li.querySelector('span[data-testid="FEATURED_LISTING"]')) {
                li.remove();
                return;
            }
            
            const adSpans = li.querySelectorAll('span');
            for (const span of adSpans) {
                if (span.textContent.trim().toLowerCase() === 'ad') {
                    li.remove();
                    return;
                }
            }
        });
    }
 
    // Run the function on page load
    removeTargetedListItems();
 
    // Observe the DOM for dynamically loaded content
    const observer = new MutationObserver(() => {
        removeTargetedListItems();
    });
 
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();
