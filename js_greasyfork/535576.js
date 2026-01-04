// ==UserScript==
// @name         YouTube Branding Image Remover
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Removes branding images (elements with class 'branding-img') from YouTube pages to provide a cleaner interface.
// @author       Your Name/AI
// @match        *://*.youtube.com/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/535576/YouTube%20Branding%20Image%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/535576/YouTube%20Branding%20Image%20Remover.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function removeBrandingImages() {
        const images = document.querySelectorAll('img.branding-img');
        let imagesRemovedThisRun = 0;

        images.forEach(img => {
            if (document.body.contains(img)) {
                img.remove();
                imagesRemovedThisRun++;
            }
        });

        if (imagesRemovedThisRun > 0) {
            // console.log(`[YouTube Branding Image Remover] Removed ${imagesRemovedThisRun} branding image(s).`);
        }
    }

    // Initial run
    removeBrandingImages();

    // Observe DOM changes for dynamically loaded content
    const observer = new MutationObserver(function(mutationsList, observerInstance) {
        let potentiallyNewBrandingImages = false;
        for(const mutation of mutationsList) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                for (const node of mutation.addedNodes) {
                    if (node.nodeType === 1) { 
                        if (node.matches && node.matches('img.branding-img')) {
                            potentiallyNewBrandingImages = true;
                            break;
                        }
                        if (node.querySelector && node.querySelector('img.branding-img')) {
                            potentiallyNewBrandingImages = true;
                            break;
                        }
                    }
                }
            }
            if (potentiallyNewBrandingImages) break;
        }

        if (potentiallyNewBrandingImages) {
            removeBrandingImages();
        }
    });

    function startObserver() {
        if (document.body) {
            observer.observe(document.body, { childList: true, subtree: true });
        } else {
            document.addEventListener('DOMContentLoaded', function() {
                observer.observe(document.body, { childList: true, subtree: true });
            });
        }
    }

    startObserver();

})();