// ==UserScript==
// @name         Hide Gradients on HBO Max
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Hides the annoying gradient layers on play.hbomax.com
// @author       bryce54
// @match        https://play.hbomax.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/542189/Hide%20Gradients%20on%20HBO%20Max.user.js
// @updateURL https://update.greasyfork.org/scripts/542189/Hide%20Gradients%20on%20HBO%20Max.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to hide the gradient layers
    function hideGradients() {
        const topGradient = document.querySelector('[class^="TopGradient"]');
        const bottomGradient = document.querySelector('[class^="BottomGradient"]');

        if (topGradient) {
            topGradient.style.display = 'none';
        }

        if (bottomGradient) {
            bottomGradient.style.display = 'none';
        }
    }

    // Initially hide the gradient layers
    hideGradients();

    // Optionally, you can add a MutationObserver to handle dynamic content
    const observer = new MutationObserver(hideGradients);
    observer.observe(document.body, { childList: true, subtree: true });
})();