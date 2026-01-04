// ==UserScript==
// @name         UWOSLAB Fixer
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Replace UWOSLAB Channel name on Twitch with "You Woah Slab (UWOSLAB)"
// @author       DaxDaFox
// @match        *://*/*
// @grant        none
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/542232/UWOSLAB%20Fixer.user.js
// @updateURL https://update.greasyfork.org/scripts/542232/UWOSLAB%20Fixer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function replaceText() {
        // Use the exact CSS selector provided
        const elements = document.querySelectorAll('.tw-title.ioKjUT.InjectLayout-sc-1i43xsx-0.lbYztg.bqyYtA.ScTitleText-sc-d9mj2s-0.CoreText-sc-1txzju1-0');
        
        elements.forEach(element => {
            if (element.textContent.trim() !== "You Woah Slab (UWOSLAB)") {
                element.textContent = "You Woah Slab (UWOSLAB)";
                console.log('Replaced text in element:', element);
            }
        });
    }

    // run
    replaceText();

    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                // Small delay to ensure elements are fully rendered
                setTimeout(replaceText, 100);
            }
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    //run periodically as a fallback
    setInterval(replaceText, 2000);
})();