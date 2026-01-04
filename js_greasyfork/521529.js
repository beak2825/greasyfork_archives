// ==UserScript==
// @name         NZBKing Search Helper
// @namespace    nzbking.userscripts.soon.to
// @version      0.1
// @description  Changes the design and layout of NZBKing, to better help with searches.
// @author       Fox
// @match        https://www.nzbking.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/521529/NZBKing%20Search%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/521529/NZBKing%20Search%20Helper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Remove elements with "wide-banner" or "narrow-banner" classes
    var banners = document.querySelectorAll('.wide-banner, .narrow-banner');
    banners.forEach(function(banner) {
        banner.remove();
    });

    // Restyle the table.
    // Remove the border of elements with class "search-results"
    var searchResults = document.querySelectorAll('.search-results');
    searchResults.forEach(function(result) {
        result.style.border = 'none';
    });

    // Change bright colors
    var allGood = document.querySelectorAll('.allgood');
    allGood.forEach(function(result) {
        result.style.color = '#b3d9b3';
    });

    // Function to make text blue up to the first <br> tag and check for filetypes: .EXE
    function processSearchSubject(element) {
        // Create a range
        var range = document.createRange();
        range.setStart(element.firstChild, 0);

        // Find the first <br> within the element
        var brElement = element.querySelector('br');

        // Check if <br> is found
        if (brElement) {
            range.setEnd(brElement.previousSibling, brElement.previousSibling.textContent.length);
        } else {
            // If <br> is not found, set the end to the end of the text node
            range.setEnd(element.firstChild, element.firstChild.textContent.length);
        }

        // Create a span element with blue color
        var span = document.createElement('span');
        span.style.color = '#354fd9';
        span.style.fontSize = '18px';
        span.style.fontWeight = 'bold';

        // Extract the content of the range and append it to the span
        span.appendChild(range.extractContents());

        // Insert the span before the first child (text content)
        element.insertBefore(span, element.firstChild);

        // Check if the text contains "filetypes: .EXE"
        if (element.textContent.includes('.EXE')) {
            // Add additional styling or perform actions if needed
            var parentElement = element.parentNode;
            parentElement.style.opacity = '0.3';
        }
    }

    // Get all elements with class "search-subject"
    var searchSubjects = document.querySelectorAll('.search-subject');

    // Loop through each element
    searchSubjects.forEach(processSearchSubject);

})();