// ==UserScript==
// @name         Net-7 Source Vault Main Script
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Watch for dynamically added 'source_vault' element and delegate logic to another script
// @author       You
// @match        https://www.net-7.org/*
// @grant        none
// @license      CC BY-NC
// @downloadURL https://update.greasyfork.org/scripts/486022/Net-7%20Source%20Vault%20Main%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/486022/Net-7%20Source%20Vault%20Main%20Script.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ID of the target element
    const targetElementId = 'source_vault';

    // Function to check if the node is within the target element
    function isWithinTargetElement(node) {
        return node && node.id === targetElementId || (node.parentNode && isWithinTargetElement(node.parentNode));
    }

    function addCSS() {
        var cssToAdd = `
            /* Style for items disabled by filtering */
            .mark_as_filtered {
                background-color: rgba(255, 0, 0, 0.5);
            }

            /* Style for items added to the move list */
            .mark_as_moving {
                position:relative;
                z-index:1;
                background-color: rgba(0, 255, 0, 0.5);
            }

            /* Custom version of pad-item style for use in the transfer slots. */
            .custom_pad-item {
                position: relative;
                z-index: 4;
            }
            /* Custom version of pad-item style for use in the transfer slots. */
            .custom_pad-background {
                position: absolute;
                top: 0;
                left: 0;
                z-index: 3;
            }
            /* Custom version of pad-item style for use in the transfer slots. */
            .custom_pad-level, .custom_pad-stack {
                position: absolute;
                left: 0;
                z-index: 5;
                cursor: pointer;
                width: 100%;
                text-align: center;
                font-weight: bold;
                color: #00FF00;
                text-shadow: -1px 0 #000, 0 1px #000, 1px 0 #000, 0 -1px #000;
                font-family: courier;
                font-size: 100%;
            }
            .custom_pad-level {
                top:0;
            }
            .custom_pad-stack {
                bottom:0;
            }
        `;

        // Create a <style> element
        var style = document.createElement('style');
        style.type = 'text/css';

        if (style.styleSheet) {
            // For IE
            style.styleSheet.cssText = cssToAdd;
        } else {
            // For other browsers
            style.appendChild(document.createTextNode(cssToAdd));
        }

        // Append the <style> element to the <head> of the document
        document.head.appendChild(style);
        console.log("Custom CSS added.");
    }

    // Function to handle the DOM changes
    function handleChanges(mutationsList, observer) {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList' && isWithinTargetElement(mutation.target)) {
                // Disconnect the observer temporarily to avoid an infinite loop
                observer.disconnect();
                addCSS();
                window.handleHTMLModification(mutation.target);
                // Reconnect the observer after modifications
                observer.observe(document.documentElement, config);
            }
        }
    }

    // Create a MutationObserver to watch for changes on 'source_vault'
    const observer = new MutationObserver(handleChanges);

    // Specify options for the observer
    const config = { childList: true, subtree: true };

    // Start checking for 'source_vault' existence
    observer.observe(document.documentElement, config);

})();
