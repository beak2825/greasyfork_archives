// ==UserScript==
// @name         QuillBot Sign Up Modal Remover
// @namespace    http://tampermonkey.net/
// @version      2025-08-27
// @description  Remove the annoying sign up modal on QuillBot grammar check page
// @author       zzoka
// @match        https://quillbot.com/grammar-check
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/547501/QuillBot%20Sign%20Up%20Modal%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/547501/QuillBot%20Sign%20Up%20Modal%20Remover.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function removeModal() {
        // Select the div by role and specific classes
        const modal = document.querySelector('div[role="presentation"].MuiModal-root.MuiDialog-root.css-yslrk6');
        if (modal) {
            modal.remove();
            console.log("QuillBot sign up modal removed");
            return true;
        }
        return false;
    }

    // Try to remove immediately in case it exists on load
    if (!removeModal()) {
        // If not found, observe DOM changes and remove when it appears
        const observer = new MutationObserver(() => {
            if (removeModal()) {
                observer.disconnect(); // Stop observing once removed
            }
        });
        observer.observe(document.body, {childList: true, subtree: true});
    }
})();
