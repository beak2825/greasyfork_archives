// ==UserScript==
// @name         Facebook Marketplace Overlay Remover
// @namespace    http://github.com/tlorien
// @version      0.1
// @description  Access Facebook Marketplace and listings without an account! Removes overlays via heuristic detection
// @author       tlorien
// @match        *://*.facebook.com/marketplace*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/530191/Facebook%20Marketplace%20Overlay%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/530191/Facebook%20Marketplace%20Overlay%20Remover.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function isLikelyOverlay(element) {
        const rect = element.getBoundingClientRect();
        const viewportArea = window.innerWidth * window.innerHeight;
        const elementArea = rect.width * rect.height;
        const coversMostOfTheViewport = elementArea > viewportArea * 0.5; // covers more than 50% of the viewport
        const isFixedOrAbsolute = ['fixed', 'absolute'].includes(getComputedStyle(element).position);
        const hasHighZIndex = parseInt(getComputedStyle(element).zIndex, 10) > 100;

        return coversMostOfTheViewport && isFixedOrAbsolute && hasHighZIndex;
    }

    function removeSuspectedOverlays() {
        document.querySelectorAll('body *').forEach(element => {
            if (isLikelyOverlay(element)) {
                element.remove();
            }
        });
    }

    removeSuspectedOverlays();

    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.addedNodes.length) {
                removeSuspectedOverlays();
            }
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

})();