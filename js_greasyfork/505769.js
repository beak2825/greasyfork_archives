// ==UserScript==
// @name         Character.ai Custom CSS
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Apply custom CSS styles to character.ai
// @author       Vishanka
// @match        https://character.ai/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/505769/Characterai%20Custom%20CSS.user.js
// @updateURL https://update.greasyfork.org/scripts/505769/Characterai%20Custom%20CSS.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to create or update a style element
    function updateCSSVariable(variableName, value) {
        document.documentElement.style.setProperty(variableName, value);
    }

    // Update the specific CSS variables
    updateCSSVariable('--G850', '#2B2C2D');
    updateCSSVariable('--G900', '#242525');
    updateCSSVariable('--G950', '#1E1F1F');

    // Custom CSS for specific classes
    const customClassStyles = `
        .mt-1.bg-surface-elevation-2 { background-color: #2B2C2D !important; }
        .mt-1.bg-surface-elevation-3 { background-color: #2B2C2D !important; }
    `;

    // Inject the custom styles for classes into the page
    GM_addStyle(customClassStyles);

})();