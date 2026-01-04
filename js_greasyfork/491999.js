// ==UserScript==
// @name         1440 Remove Character
// @namespace    http://tampermonkey.net/
// @version      2024-04-08
// @description  Remove character from newsletter. Searches all text nodes for a certain character and removes it.
// @author       You
// @match        https://news.join1440.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=join1440.com
// @grant        none
// @license      none
// @require      http://code.jquery.com/jquery-1.12.4.min.js

// @downloadURL https://update.greasyfork.org/scripts/491999/1440%20Remove%20Character.user.js
// @updateURL https://update.greasyfork.org/scripts/491999/1440%20Remove%20Character.meta.js
// ==/UserScript==

$(document).ready(function() {
    // Iterate through all text nodes
    $("*").contents().each(function() {
        if (this.nodeType === 3) { // Check if it's a text node
            // Replace ">" characters with an empty string
            this.textContent = this.textContent.replace(/>/g, '');
        }
    });
});
