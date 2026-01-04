// ==UserScript==
// @name         Redirect Images on Archived.moe
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Redirect images from archived.moe to warosu.org with dynamic URLs
// @author       Anon
// @license      MIT
// @icon         https://s.4cdn.org/image/favicon-ws.ico
// @match      https://archived.moe/3/thread/*
// @match      https://archived.moe/biz/thread/*
// @match      https://archived.moe/cgl/thread/*
// @match      https://archived.moe/ck/thread/*
// @match      https://archived.moe/diy/thread/*
// @match      https://archived.moe/fa/thread/*
// @match      https://archived.moe/ic/thread/*
// @match      https://archived.moe/lit/thread/*
// @match      https://archived.moe/sci/thread/*
// @match      https://archived.moe/vr/thread/*
// @match      https://archived.moe/vt/thread/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/474477/Redirect%20Images%20on%20Archivedmoe.user.js
// @updateURL https://update.greasyfork.org/scripts/474477/Redirect%20Images%20on%20Archivedmoe.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Get the current URL
    var currentUrl = window.location.href;

    // Define a regular expression pattern to capture the board name and number sequence
    var regexPattern = /\/(3|biz|cgl|ck|diy|fa|ic|lit|sci|vr|vt)\/thread\/(\d+)/;
    var match = currentUrl.match(regexPattern);

    if (match) {
        // Extract the board name and the number sequence from the URL
        var boardName = match[1];
        var rawNumberSequence = match[2];

        // Ensure that numberSequence is at least 8 digits long by adding leading zeros
        var numberSequence = rawNumberSequence.padStart(8, '0');

        // Add an additional leading '0' to make for warosu's image link structure
        numberSequence = '0' + numberSequence;


        // Find all anchor elements with class 'thread_image_link' and update their href attributes
        var imageLinks = document.querySelectorAll('a.thread_image_link');
        imageLinks.forEach(function(link) {
            var href = link.getAttribute('href');
            // Extract the last part of the href (the filename)
            var filename = href.substring(href.lastIndexOf('/') + 1);

            // Construct the new image URL using both sequences
            var newImageUrl = "https://warosu.org/data/" + boardName + "/img/" + numberSequence.substr(0, 4) + "/" + numberSequence.substr(4, 2) + "/" + filename;

            // Update the href attribute with the new URL
            link.setAttribute('href', newImageUrl);
        });
    }
})();