// ==UserScript==
// @name         Bloxd.io Leave Popup Remover
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Removes the "Are you sure you want to leave?" popup on bloxd.io
// @author       Gemini
// @license      MIT
// @match        *://*.bloxd.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/547443/Bloxdio%20Leave%20Popup%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/547443/Bloxdio%20Leave%20Popup%20Remover.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // The website uses the 'onbeforeunload' event to trigger the confirmation popup.
    // By setting this event to null, we prevent the popup from ever appearing.
    // This script runs automatically once the page is loaded.
    console.log("Bloxd.io Leave Popup Remover: Script active.");
    window.onbeforeunload = null;

    // You can also add a small message to the console to confirm the script is working.
    // This is optional but can be helpful for debugging.
    console.log("Bloxd.io Leave Popup Remover: Successfully removed the onbeforeunload event.");
})();
