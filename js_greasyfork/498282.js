// ==UserScript==
// @name         Thingworx Expression Expander
// @namespace    http://tampermonkey.net/
// @version      2024-06-18
// @description  Attempt to expand Thingworx' default expression editor. Likely going to cause problems on smaller window sizes.
// @author       Puma
// @match        *://*/Thingworx/Composer/*
// @match        *://*/Thingworx/Builder/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/498282/Thingworx%20Expression%20Expander.user.js
// @updateURL https://update.greasyfork.org/scripts/498282/Thingworx%20Expression%20Expander.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to adjust the height of elements
    function adjustHeights() {
        // Select the popup element and set its height
        // ux-dialog-body.function-editor-dialog.au-target
        var popup = document.querySelector('ux-dialog-body.function-editor-dialog.au-target');
        if (popup) {
            popup.style.height = '1200px';
            popup.style.width = '1200px';
        }
        // expression-editor.au-target
        popup = document.querySelector('expression-editor.au-target');
        if (popup) {
            popup.style.height = '600px';
        }
        // div.script-input
        popup = document.querySelector('div.script-input');
        if (popup) {
            popup.style.height = '595px';
        }
    }

    // Observe changes in the DOM to catch dynamic popups
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes.length) {
                adjustHeights();
            }
        });
    });

    // Start observing the document body for added nodes
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Initial adjustment in case elements are already present
    adjustHeights();
})();