// ==UserScript==
// @name         kbin Linked Comment Enhancer
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Highlights the comment you were linked to and scrolls to it
// @author       You
// @match        https://kbin.social/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/468842/kbin%20Linked%20Comment%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/468842/kbin%20Linked%20Comment%20Enhancer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Get page url
    let url = window.location.href;

    let bgcolor = "";

    // Get theme from body classes
    let theme = document.body.classList[0];

    if (theme == "theme--kbin" || theme == "theme--dark") {
        // Dark green background color
        bgcolor = "#2b4b34";
    } else if (theme == "theme--solarized-dark") {
        bgcolor = "#073642"
    } else {
        // Light green background color
        bgcolor = "#d0e8d6";
    }

    // Get comment anchor id from url
    let comment = url.split("#")[1];

    // Check if comment anchor id exists
    if (comment && comment !="settings") {
        // Get comment element
        let commentElement = document.getElementById(comment);

        // Scroll to comment
        commentElement.scrollIntoView();
        window.scrollBy(0, -50); // Account for header

        // Give comment a green background gradient
        commentElement.style.backgroundImage = `linear-gradient(to right, ${bgcolor} 0%, transparent 100%)`;
    }
})();