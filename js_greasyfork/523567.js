// ==UserScript==
// @name         VRoid Hub Remove Blur Filter
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Removes blur filter from images on the site
// @author       lola8
// @match        *://hub.vroid.com/*
// @grant        none
// @license MI
// @downloadURL https://update.greasyfork.org/scripts/523567/VRoid%20Hub%20Remove%20Blur%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/523567/VRoid%20Hub%20Remove%20Blur%20Filter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to remove blur filter
    function removeBlur() {
        // Find all elements with inline styles
        const elements = document.querySelectorAll('[style*="filter: blur"]');
        elements.forEach(el => {
            // Remove only the blur style
            el.style.filter = '';
        });
    }

    // Launch deletion when the page loads
    window.addEventListener('load', removeBlur);

    // We launch a repeated deletion when the page changes (dynamic content)
    const observer = new MutationObserver(() => removeBlur());
    observer.observe(document.body, { childList: true, subtree: true });
})();
