// ==UserScript==
// @name         Reddit Comment Warning
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Displays a warning message before making a comment on Reddit.
// @author       Your Name
// @match        https://www.reddit.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/469595/Reddit%20Comment%20Warning.user.js
// @updateURL https://update.greasyfork.org/scripts/469595/Reddit%20Comment%20Warning.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Override the default comment form submission
    document.querySelector('form[action="/comment"]').addEventListener('submit', function(event) {
        // Prompt the warning message
        var confirmation = confirm("Are you sure you want to talk to this loser?");

        // If the user cancels the submission, prevent the comment from being posted
        if (!confirmation) {
            event.preventDefault();
        }
    });
})();
