// ==UserScript==
// @name         Source Page Lines Wrapper
// @namespace    U291cmNlIFBhZ2UgTGluZSBXcmFwcGVy
// @version      1.1
// @description  Automatically checks the wrap lines checkbox in view-source page
// @author       smed79
// @license      GPLv3
// @icon         https://i25.servimg.com/u/f25/11/94/21/24/wrap10.png
// @homepage     https://greasyfork.org/en/scripts/544177-source-page-lines-wrapper
// @match        view-source:*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/544177/Source%20Page%20Lines%20Wrapper.user.js
// @updateURL https://update.greasyfork.org/scripts/544177/Source%20Page%20Lines%20Wrapper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Wait for the DOM to be ready
    const checkWrapBox = () => {
        const checkbox = document.querySelector('input[type="checkbox"]');
        if (checkbox && !checkbox.checked) {
            checkbox.checked = true;
            checkbox.dispatchEvent(new Event('change', { bubbles: true }));
        }
    };

    // Try immediately in case DOM is already available
    checkWrapBox();

    // Fallback if it takes time to render
    document.addEventListener("DOMContentLoaded", checkWrapBox);
    window.addEventListener("load", checkWrapBox);
})();
