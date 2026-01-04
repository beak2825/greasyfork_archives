// ==UserScript==
// @name         Sukebei to Javlibrary
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  add link to Javlibrary
// @include      https://sukebei.nyaa.si/*
// @author       You
// @match        http://*/*
// @grant        https://sukebei.nyaa.si/
// @require      http://code.jquery.com/jquery-3.6.0.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/472029/Sukebei%20to%20Javlibrary.user.js
// @updateURL https://update.greasyfork.org/scripts/472029/Sukebei%20to%20Javlibrary.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Iterate over each row
    $('table tr').each(function() {
        // Find the second <td> element containing a <a> tag within the current row
        var secondTd = $(this).find('td:nth-child(2)').has('a');
        // Extract the text from the second <td> using the first regular expression

        //var regex = /[A-Za-z]+-\d+/;
        var regex = /T\d{2}-\d{3}|[A-Za-z]+-\d+/;
        var extractText = secondTd.text().match(regex);

        //console.log(extractText);

        if (extractText) {

            // Create an <a> tag and set its attributes
            var anchorTag = $('<a>', {
                href: 'https://www.javlibrary.com/en/vl_searchbyid.php?keyword=' + extractText[0],
            }).append($('<img>').attr({
                src: 'https://www.javlibrary.com/favicon.ico',
                width: 20,
                height: 20
            }));
            // Find the third <td> element within the current row and append the <a> tag
            $(this).find('td:nth-child(3)').append(anchorTag);
        }
    });
})();