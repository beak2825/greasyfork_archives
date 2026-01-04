// ==UserScript==
// @name         Force Editable Mode on Any Google Doc (Aggressive)
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Force any Google Docs page into editable mode, regardless of permissions
// @author       You
// @match        https://docs.google.com/document/d/1Lv5lWrvXyUq_o26xyn-pNwGcVKhs8aQYbxdzKbBnk_A/edit?tab=t.0
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/527268/Force%20Editable%20Mode%20on%20Any%20Google%20Doc%20%28Aggressive%29.user.js
// @updateURL https://update.greasyfork.org/scripts/527268/Force%20Editable%20Mode%20on%20Any%20Google%20Doc%20%28Aggressive%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to enable contentEditable on Google Docs document
    function forceEditableMode() {
        // Check for the editor container and enable editing if available
        const editableDiv = document.querySelector('.kix-appview-editor');
        if (editableDiv) {
            editableDiv.contentEditable = true;
            editableDiv.style.pointerEvents = 'auto';

            // Force other elements to be editable
            const editableContent = document.querySelector('.kix-document');
            if (editableContent) {
                editableContent.setAttribute('contenteditable', 'true');
            }

            console.log('Google Docs is now editable!');
        }
    }

    // Aggressively remove any overlays or viewer blocks
    function removeViewerOverlay() {
        const viewerOverlay = document.querySelector('.kix-viewer-overlay');
        if (viewerOverlay) {
            viewerOverlay.remove();
            console.log('Removed viewer overlay.');
        }

        const disallowedMessage = document.querySelector('.docs-viewer-disallowed-message');
        if (disallowedMessage) {
            disallowedMessage.style.display = 'none';
            console.log('Removed disallowed message.');
        }
    }

    // Mutation Observer to monitor page changes
    const observer = new MutationObserver(function() {
        // Force the document to become editable every time something changes
        forceEditableMode();
        removeViewerOverlay();
    });

    // Start observing document body for changes
    observer.observe(document.body, {
        childList: true,
        subtree: true,
    });

    // Initial attempt to force editable mode
    forceEditableMode();
    removeViewerOverlay();
})();
