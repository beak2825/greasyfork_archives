// ==UserScript==
// @name         Copy URL with Fragment ID
// @namespace    svenska.se
// @version      1.3
// @description  Extracts fragment ID and idiom text and adds useful buttons for Wikidata Lexemes
// @author       Nizo Priskorn
// @match        https://svenska.se/so/*
// @license      GPLv3+
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/493671/Copy%20URL%20with%20Fragment%20ID.user.js
// @updateURL https://update.greasyfork.org/scripts/493671/Copy%20URL%20with%20Fragment%20ID.meta.js
// ==/UserScript==
(function() {
    // console.log("violentmonkey running");
    'use strict';

    // Function to add copy button for URL with fragment
    function addCopyURLButton(div, fragmentId) {
        // Create a copy button for URL
        var copyURLButton = document.createElement('button');
        copyURLButton.textContent = 'Copy URL with Fragment';
        copyURLButton.style.marginLeft = '10px';

        // Add click event listener to URL copy button
        copyURLButton.addEventListener('click', function() {
            // Copy URL with fragment ID to clipboard
            var urlWithFragment = window.location.href + '#' + fragmentId;
            navigator.clipboard.writeText(urlWithFragment).then(function() {
                console.log('URL with fragment copied to clipboard:', urlWithFragment);
                // alert('URL with fragment copied to clipboard: ' + urlWithFragment);
            }, function(err) {
                console.error('Failed to copy:', err);
            });
        });

        // Append URL copy button to the div
        div.appendChild(copyURLButton);
    }

    // Function to add copy button for idiom text
    function addCopyIdiomButton(div, idiomText) {
        // Create a copy button for idiom text
        var copyIdiomButton = document.createElement('button');
        copyIdiomButton.textContent = 'Copy Idiom Text';
        copyIdiomButton.style.marginLeft = '10px';

        // Add click event listener to idiom text copy button
        copyIdiomButton.addEventListener('click', function() {
            // Copy idiom text to clipboard
            navigator.clipboard.writeText(idiomText).then(function() {
                console.log('Idiom text copied to clipboard:', idiomText);
                // alert('Idiom text copied to clipboard: ' + idiomText);
            }, function(err) {
                console.error('Failed to copy:', err);
            });
        });

        // Append idiom text copy button to the div
        div.appendChild(copyIdiomButton);
    }

    // Function to add search button
    function addOrdiaButton(div, idiomText) {
        // Create a search button
        var searchButton = document.createElement('button');
        searchButton.textContent = 'Lookup idiom using Ordia';
        searchButton.style.marginLeft = '10px';

        // Add click event listener to search button
        searchButton.addEventListener('click', function() {
            // Open new tab to search for idiom text
            var searchUrl = 'https://ordia.toolforge.org/search?q=' + encodeURIComponent(idiomText);
            window.open(searchUrl, '_blank');
        });

        // Append search button to the div
        div.appendChild(searchButton);
    }

    // Function to add search button for Riksdagen
    function addRiksdagenSearchButton(div, idiomText) {
        // Create a search button for Riksdagen
        var riksdagenSearchButton = document.createElement('button');
        riksdagenSearchButton.textContent = 'Search Riksdagen';
        riksdagenSearchButton.style.marginLeft = '10px';

        var quotedIdiomText = '"' + idiomText + '"';
        // Add click event listener to Riksdagen search button
        riksdagenSearchButton.addEventListener('click', function() {
            // Open new tab to search for idiom text on Riksdagen
            var searchUrl = 'https://www.riksdagen.se/sv/sok/?sok=' + encodeURIComponent(quotedIdiomText);
            window.open(searchUrl, '_blank');
        });

        // Append Riksdagen search button to the div
        div.appendChild(riksdagenSearchButton);
    }

  // Find all div elements with class "idiom"
    var idiomDivs = document.querySelectorAll('div.idiom');

    // Loop through each div
    idiomDivs.forEach(function(div) {
        // Extract fragment ID
        var fragmentId = div.id;

        // Extract idiom text
        var idiomText = div.querySelector('span.fras').textContent;

        // Add copy button for URL with fragment
        addCopyURLButton(div, fragmentId);

        // Add copy button for idiom text
        addCopyIdiomButton(div, idiomText);

        // Add search button
        addOrdiaButton(div, idiomText);

        // Add search button for Riksdagen
        addRiksdagenSearchButton(div, idiomText);
    });
})();