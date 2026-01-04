// ==UserScript==
// @name         NTV Context Menu and Selection Change Remover
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Remove context menu and set userSelect to 'text'
// @author       Iso
// @match        https://*.ntv.co.jp/*
// @grant        none
// @run-at       document-body
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/512599/NTV%20Context%20Menu%20and%20Selection%20Change%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/512599/NTV%20Context%20Menu%20and%20Selection%20Change%20Remover.meta.js
// ==/UserScript==

/**
 * Override the default oncontextmenu event on the document
 * to disable the context menu completely.
 */
Object.defineProperty(document, 'oncontextmenu', {
  get: function () { return null },  // Return null to indicate no context menu
  set: function() {}                  // Ignore any attempts to set the context menu
});

/**
 * Set user-select property on the document body to 'text'
 * to allow text selection.
 * This function runs when the document body loads.
 */
document.body.onload = (function() {
    'use strict';  // Enable strict mode for cleaner code

    // Initialize the body style object
    document.body.style = {};

    // Set the user-select CSS property to 'text', allowing users to select text
    document.body.style.userSelect = 'text';
})();
