// ==UserScript==
// @name         CONCTACTS
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Attempts to fix touch click issues on draggable contact list items on Dreadcast for mobile.
// @author       Your Name
// @match        https://www.dreadcast.net/Main
// @match        https://www.dreadcast.net/Main*
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/jqueryui-touch-punch/0.2.3/jquery.ui.touch-punch.min.js
// @downloadURL https://update.greasyfork.org/scripts/537998/CONCTACTS.user.js
// @updateURL https://update.greasyfork.org/scripts/537998/CONCTACTS.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // jQuery UI Touch Punch is loaded via @require, so it should patch jQuery UI automatically.

    // Function to apply fixes to draggable elements
    function applyDraggableFixes() {
        const contacts = $('.contact.ui-draggable.ui-draggable-handle');
        if (contacts.length > 0) {
            console.log('[Dreadcast Touch Fix] Found', contacts.length, 'draggable contacts. Applying fixes...');
            contacts.each(function() {
                const $contact = $(this);
                try {
                    // Check if it's already draggable and try to set options
                    if ($contact.data('ui-draggable') || $contact.data('draggable')) { // Check for common data keys
                        $contact.draggable('option', 'delay', 150); // Only start dragging after 150ms
                        $contact.draggable('option', 'distance', 10); // Only start dragging if moved 10px
                        // Ensure internal clickable elements don't initiate drag
                        $contact.draggable('option', 'cancel', "input, textarea, button, select, option, .btnTxt, .selecteur");

                        // console.log('[Dreadcast Touch Fix] Applied options to:', $contact.attr('id'));
                    } else {
                        // If not yet initialized, these options might be picked up if the page's script re-initializes
                        // or if our script runs before their init (less likely with setTimeout)
                        // For now, we focus on modifying existing instances.
                        // console.log('[Dreadcast Touch Fix] Contact not yet draggable or no instance found:', $contact.attr('id'));
                    }
                } catch (e) {
                    console.warn('[Dreadcast Touch Fix] Error applying draggable options to:', $contact.attr('id'), e);
                }
            });

            // Additionally, ensure direct click/tap handlers for specific elements
            // This is a fallback in case the above isn't enough or if there are dedicated listeners.
            $('.contact .selecteur input[type="checkbox"], .contact .btnTxt.mail').off('touchend.dcfix').on('touchend.dcfix', function(e) {
                // e.preventDefault(); // Prevent default touchend behavior which might include synthetic click
                // e.stopPropagation(); // Stop event from bubbling to the li if it causes issues
                console.log('[Dreadcast Touch Fix] Touchend on child element, triggering click:', this);
                $(this).trigger('click'); // Manually trigger click
            });

            console.log('[Dreadcast Touch Fix] Fixes applied.');
        } else {
            // console.log('[Dreadcast Touch Fix] No draggable contacts found yet.');
        }
    }

    // The page might initialize draggables after some time, or via AJAX.
    // We'll try to apply fixes periodically or after a delay.
    // A more robust solution would use MutationObserver if elements are added dynamically.

    // Initial attempt after a short delay for page scripts to run
    setTimeout(applyDraggableFixes, 2000); // Wait 2 seconds

    // Re-apply if content might be reloaded (e.g., after AJAX calls that repopulate the list)
    // This is a generic way; if Dreadcast has specific events for content update, those would be better.
    // For simplicity, we can set an interval, but be mindful of performance.
    // setInterval(applyDraggableFixes, 5000); // Re-check every 5 seconds (use with caution)

    // A better way to re-apply if you know when new content might load is to hook into
    // that process. For now, we'll rely on the initial load and the power of Touch Punch.

    console.log('[Dreadcast Touch Fix] Script loaded. Touch Punch injected. Waiting to apply draggable options...');

})();