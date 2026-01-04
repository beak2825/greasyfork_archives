// ==UserScript==
// @name         Delete Libby Amazon Button
// @namespace    https://github.com/sudo-nano
// @version      2025-04-22
// @description  Delete the Amazon checkout button from Libby
// @author       sudo-nano
// @match        https://libbyapp.com/shelf/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/533673/Delete%20Libby%20Amazon%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/533673/Delete%20Libby%20Amazon%20Button.meta.js
// ==/UserScript==

function waitForElement(callback) {
    // Initialize a mutation observer
    var observer = new MutationObserver(function(mutations, me) {
        // Query for the element
        var elements = document.getElementsByClassName('circ-option emph');
        var element = elements.item(1);
        if (element) {
            callback(element);
            // Once the element has been found, we can stop observing for mutations
            me.disconnect();
            return;
        }
    });
    // Start observing the document with the configured parameters
    observer.observe(document, { childList: true, subtree: true });
}

function deleteElement(element) {
    element.remove()
}

(function() {
    'use strict';
    waitForElement(deleteElement);
})();