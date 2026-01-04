// ==UserScript==
// @name         Reset CSS on Economist
// @description  Reset overflow and position properties of .sp-message-open body on Economist.com
// @match        *://*.economist.com/*
// @run-at       document-start
// @version 0.0.1.20250321200314
// @namespace https://greasyfork.org/users/1435046
// @downloadURL https://update.greasyfork.org/scripts/530474/Reset%20CSS%20on%20Economist.user.js
// @updateURL https://update.greasyfork.org/scripts/530474/Reset%20CSS%20on%20Economist.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function resetStyles() {
        if (document.documentElement.classList.contains("sp-message-open")) {
            document.body.style.setProperty("overflow", "visible", "important");
            document.body.style.setProperty("position", "static", "important");
        } else {
            // Restore default styles if the class is removed
            document.body.style.removeProperty("overflow");
            document.body.style.removeProperty("position");
        }
    }

    // Run on page load and at intervals to counteract site scripts
    resetStyles();
    setInterval(resetStyles, 500);  // Reapply fix every 500ms

    // Observe for class changes on <html>
    const observer = new MutationObserver(resetStyles);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
})();
