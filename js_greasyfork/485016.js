// ==UserScript==
// @name         DescargasNRQ Destination Link Extractor
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Extracts and displays the URL starting with "https://www.textpaste.net/?v=" on descargasnrq.com
// @author       Rust1667
// @match        https://descargasnrq.com/*
// @require      https://code.jquery.com/jquery-2.1.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/485016/DescargasNRQ%20Destination%20Link%20Extractor.user.js
// @updateURL https://update.greasyfork.org/scripts/485016/DescargasNRQ%20Destination%20Link%20Extractor.meta.js
// ==/UserScript==

(function($) {
    'use strict';

    // Your main function
    function main() {
        // Extract the URL from the HTML source code
        var urlRegex = /https:\/\/(?:www\.)?textpaste\.net\/\?v=[^'"]+/;
        var urlMatch = $('body').html().match(urlRegex);

        // Check if the URL was found in the HTML source code
        if (urlMatch) {
            // Display the URL in an alert
            alert('Download links in: ' + urlMatch[0]);
        }
    }

    // Run the main function when the page is fully loaded
    $(document).ready(function() {
        main();
    });
})(jQuery);