// ==UserScript==
// @name         Linkhut Auto-focus and Private
// @namespace    https://ln.ht
// @version      0.1
// @description  Automatically focus tags input and check private checkbox on linkhut
// @author       Dave
// @match        https://ln.ht/_/add*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/535273/Linkhut%20Auto-focus%20and%20Private.user.js
// @updateURL https://update.greasyfork.org/scripts/535273/Linkhut%20Auto-focus%20and%20Private.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Wait for the page to load
    window.addEventListener('load', function() {
        // Find the tags input and focus it
        const tagsInput = document.getElementById('link_tags');
        if (tagsInput) {
            tagsInput.focus();
        }

        // Find the private checkbox and check it
        const privateCheckbox = document.getElementById('link_is_private');
        if (privateCheckbox) {
            privateCheckbox.checked = true;
        }
    });
})();