// ==UserScript==
// @name        Turbo Subscription Button Remover
// @namespace   https://github.com/mirbyte/TwitchTV-Userscripts/edit/main/Turbo%20Subscription%20Button%20Remover.js
// @match       *://www.twitch.tv/*
// @grant       none
// @version     2.0
// @author      mirbyte
// @description Edits the Turbo ad banner to be a transparent placeholder. Check GitHub page for the demonstration image.
// @icon        https://banner2.cleanpng.com/20180513/xie/kisspng-twitch-computer-icons-logo-5af8037d689af0.0981376915262032614285.jpg
// @downloadURL https://update.greasyfork.org/scripts/524848/Turbo%20Subscription%20Button%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/524848/Turbo%20Subscription%20Button%20Remover.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function editAdBanner() {
        // More robust selector approach
        const adButtons = document.querySelectorAll('button, [role="button"]');
        const adButtonTexts = [
            "Go Ad-Free for Free",
            "Poista mainokset ilmaiseksi", 
            "Poista mainokset",
            "Get Ad-Free",
            "Go Ad-Free",
            "Try Turbo",
            "Get Turbo"
            // add more here
        ];

        adButtons.forEach(button => {
            const buttonText = button.textContent?.trim();
            if (buttonText && adButtonTexts.some(text => buttonText.includes(text))) {
                // Look for parent containers with multiple approaches
                let container = button.closest('[class*="Layout"]') || 
                               button.closest('[class*="InjectLayout"]') ||
                               button.closest('[class*="Banner"]') ||
                               button.closest('[class*="Ad"]');
                
                if (container && container.offsetHeight > 20) {
                    container.style.cssText = `
                        background: transparent !important;
                        border: none !important;
                        padding: 0 !important;
                        margin: 0 !important;
                        height: 0 !important;
                        overflow: hidden !important;
                        opacity: 0 !important;
                    `;
                    console.log("Turbo Subscription Banner hidden:", buttonText);
                }
            }
        });

        // Also target by aria-label or data attributes
        const ariaButtons = document.querySelectorAll('[aria-label*="ad"], [aria-label*="Ad"], [aria-label*="turbo"], [aria-label*="Turbo"]');
        ariaButtons.forEach(button => {
            const container = button.closest('[class*="Layout"], [class*="Banner"], [class*="Ad"]');
            if (container) {
                container.style.display = 'none';
            }
        });
    }

    // Run initially
    editAdBanner();

    // Enhanced observer with better performance
    let observerTimeout;
    const observer = new MutationObserver(function(mutations) {
        clearTimeout(observerTimeout);
        observerTimeout = setTimeout(editAdBanner, 100);
    });
    
    if (document.body) {
        observer.observe(document.body, { 
            subtree: true, 
            childList: true,
            attributes: true,
            attributeFilter: ['class', 'style']
        });
    }
})();
