// ==UserScript==
// @name         Prevent CRM Redirect on Text Select
// @namespace    http://your-namespace-here
// @version      1.1
// @description  Prevents redirect when selecting text on CRM table
// @match        https://glsolar.my.site.com/partners/s/opportunity/Opportunity/00B8c00000CTbDHEA1
// @grant        GM_log
// @license      MIT
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/542337/Prevent%20CRM%20Redirect%20on%20Text%20Select.user.js
// @updateURL https://update.greasyfork.org/scripts/542337/Prevent%20CRM%20Redirect%20on%20Text%20Select.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('[CRM Fix] Script initialized');

    function handleClick(e) {
        try {
            const selection = window.getSelection();
            const selectedText = selection ? selection.toString().trim() : '';

            if (selectedText.length > 0) {
                console.log('[CRM Fix] Prevented click during text selection of:', selectedText);
                e.stopImmediatePropagation();
                e.preventDefault();
                return false;
            }
        } catch (error) {
            console.error('[CRM Fix] Error in click handler:', error);
        }
        return true;
    }

    // Remove existing listener if any (to prevent duplicates)
    document.removeEventListener('click', handleClick, true);
    // Add new listener
    document.addEventListener('click', handleClick, true);

    console.log('[CRM Fix] Click listener registered');
})();