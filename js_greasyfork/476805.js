// ==UserScript==
// @name     Scryfall Widener
// @description adds another couple lines to scryfall search
// @version  1
// @grant    none
// @run-at   document-end
// @match    https://scryfall.com/*
// @license MIT
// @namespace mouse_fork
// @downloadURL https://update.greasyfork.org/scripts/476805/Scryfall%20Widener.user.js
// @updateURL https://update.greasyfork.org/scripts/476805/Scryfall%20Widener.meta.js
// ==/UserScript==

(function() {
    // Function to insert the CSS rule into the main document's style sheet
    function applyCustomCSSRule() {
        const styleSheet = document.styleSheets[0];

        if (styleSheet) {
            styleSheet.insertRule(".card-grid-item { width: 12% !important; }", 0);
            styleSheet.insertRule(".card-grid-inner { max-width: 2000px !important; }", 0);
            styleSheet.insertRule(".card-grid-inner { justify-content: space-around !important; }", 0);
        }
    }

    // Run the function after the DOM is ready
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        applyCustomCSSRule();
    } else {
        document.addEventListener('DOMContentLoaded', applyCustomCSSRule);
    }
})();