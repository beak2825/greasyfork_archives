// ==UserScript==
// @name         kogama remove paste protection!!!
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Fix the paste restriction bug in Kogama without checking link type
// @author       XPander
// @match        *www.kogama.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/547486/kogama%20remove%20paste%20protection%21%21%21.user.js
// @updateURL https://update.greasyfork.org/scripts/547486/kogama%20remove%20paste%20protection%21%21%21.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to handle pasting
    function allowPaste(event) {
        const clipboardData = event.clipboardData || window.clipboardData;
        const pastedText = clipboardData.getData('Text');

        // Prevent the default pasting behavior and manually insert the text
        event.preventDefault();
        document.activeElement.value += pastedText;
    }

    // Add event listener for paste event
    document.addEventListener('paste', allowPaste, false);

    console.log('Kogama Paste Fix Active (No Link Check)');
})();

// thank you for using my userscript!

                         // -xpander (prvisrpanj2025tegodine)!