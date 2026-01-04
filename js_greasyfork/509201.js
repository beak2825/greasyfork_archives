// ==UserScript==
// @name         Danbooru Tag Extractor
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Extract tags from Danbooru image pages and copy them to the clipboard when a button is clicked.
// @author       Shinnpuru
// @match        https://danbooru.donmai.us/posts/*
// @grant        GM_setClipboard
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/509201/Danbooru%20Tag%20Extractor.user.js
// @updateURL https://update.greasyfork.org/scripts/509201/Danbooru%20Tag%20Extractor.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function extractTags() {
        // Select all tag links within the tag list section
        let tagElements = document.querySelectorAll('#tag-list a.search-tag');

        // Extract the text content of each tag
        let tags = [];
        tagElements.forEach(function(tagElement) {
            tags.push(tagElement.textContent.trim());
        });

        // Join the tags into a string separated by spaces
        return tags.join(',');
    }

    function createCopyButton() {
        // Create the button element
        let button = document.createElement('button');
        button.innerText = 'Copy Tags';
        button.style.position = 'fixed';
        button.style.bottom = '10px';
        button.style.right = '10px';
        button.style.padding = '10px';
        button.style.backgroundColor = '#008CBA';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.style.cursor = 'pointer';
        button.style.zIndex = '9999';

        // Add click event listener to the button
        button.addEventListener('click', function() {
            let tags = extractTags();
            GM_setClipboard(tags);
            alert('Tags copied to clipboard!');
        });

        // Append the button to the body
        document.body.appendChild(button);
    }

    // Run the script when the page is fully loaded
    window.addEventListener('load', createCopyButton);

})();
