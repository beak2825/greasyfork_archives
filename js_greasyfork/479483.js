// ==UserScript==
// @name         Fix Discogs Links
// @version      1.1
// @description  Redirect external links to the original version if lang is not "en" and modify artist links based on the lang attribute
// @author       Kai
// @match        *://www.discogs.com/*
// @grant        none
// @namespace https://greasyfork.org/users/1215012
// @downloadURL https://update.greasyfork.org/scripts/479483/Fix%20Discogs%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/479483/Fix%20Discogs%20Links.meta.js
// ==/UserScript==
(function() {
    'use strict';
    // Check the lang attribute in the <html> tag
    var langAttribute = document.documentElement.getAttribute('lang');
    // Function to modify links
    function modifyLinks() {   
        // Check if lang is not "en"
        if (langAttribute !== 'en') {
            // Find all links that contain the "/x/" fragment and have the hrefLang="x" attribute
            var links = document.querySelectorAll('a[href*="/' + langAttribute + '"][hrefLang="' + langAttribute + '"]:not([href*="discogs.com/"])');

            // Iterate over all found links
            links.forEach(function(link) {
                // Replace the link with the version without "/x/"
                link.href = link.href.replace('/' + langAttribute, '');
            });
                 var artistLinks = document.querySelectorAll('a');

        // Iterate through the links and make modifications
        artistLinks.forEach(function(link) {
            var originalUrl = link.href;
            // Check if it is an artist link without a languge attribute
            if (originalUrl.includes('com/artist/')) {
                // Replace 'com/artist' with 'com/lang/artist'
                var newUrl = originalUrl.replace('com/artist/', 'com/' + langAttribute + '/artist/');
                // Set the modified link
                link.href = newUrl;
            }
        });

    }}
    // Execute the script when the page is loaded
    window.addEventListener('load', modifyLinks);
})
();