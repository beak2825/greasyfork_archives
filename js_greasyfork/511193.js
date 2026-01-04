// ==UserScript==
// @name         Bring Back Default Search in Notion
// @namespace    http://tampermonkey.net/
// @version      2024-10-15
// @description  Notion hijacks the default Command/Control + F shortcut, making it a pain to search the way you're used to. This script restores the standard browser search function, so you can quickly find text like you would anywhere else.
// @author       Yelban
// @match        *://www.notion.so/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=notion.so
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/511193/Bring%20Back%20Default%20Search%20in%20Notion.user.js
// @updateURL https://update.greasyfork.org/scripts/511193/Bring%20Back%20Default%20Search%20in%20Notion.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener('keydown', function(event) {
        if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'f') {
            // Stop the event from propagating to prevent the site from hijacking it
            event.stopImmediatePropagation();
            // Ensure the default behavior still happens
            // Don't call event.preventDefault()
        }
    }, true); // Set the third parameter to true for the capture phase

})();