// ==UserScript==
// @name         Backspace to Go Back
// @namespace    gobackxFIRKx
// @description  Go back to the previous page using the backspace key
// @version      1.03
// @author       xFIRKx
// @match        *://*/*
// @grant        none
// @homepageURL  https://greasyfork.org/it/scripts/495770-backspace-to-go-back
// @downloadURL https://update.greasyfork.org/scripts/495770/Backspace%20to%20Go%20Back.user.js
// @updateURL https://update.greasyfork.org/scripts/495770/Backspace%20to%20Go%20Back.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function handleKeydown(event) {
        // Check if the pressed key is the backspace key
        if ((event.key === 'Backspace' || event.keyCode === 8) && !event.defaultPrevented) {
            // Check if the focus is not on an editable element
            const activeElement = document.activeElement;
            const isInput = activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA' || activeElement.isContentEditable;
            const isReadOnly = activeElement.readOnly || activeElement.disabled;

            if (!isInput || isReadOnly) {
                event.preventDefault(); // Prevent the default action
                window.history.back(); // Go back to the previous page
            }
        }
    }

    // Add event listener for keydown events
    document.addEventListener('keydown', handleKeydown, true); // Use capture mode to ensure the event is caught early

    // Use MutationObserver to handle dynamic content changes
    const observer = new MutationObserver(() => {
        // Reattach the event listener if necessary
        document.removeEventListener('keydown', handleKeydown, true);
        document.addEventListener('keydown', handleKeydown, true);
    });

    // Observe changes in the document body
    observer.observe(document.body, { childList: true, subtree: true });

    // Additional observer for YouTube's specific dynamic content
    if (window.location.hostname.includes('youtube.com')) {
        const ytObserver = new MutationObserver(() => {
            const contentElement = document.querySelector('ytd-app');
            if (contentElement) {
                ytObserver.observe(contentElement, { childList: true, subtree: true });
            }
        });

        ytObserver.observe(document.body, { childList: true, subtree: true });
    }
})();