// ==UserScript==
// @name         Postoj.sk diskutuj
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  try to take over the world!
// @author       You
// @match        https://*.postoj.sk/*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=www.postoj.sk
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/474812/Postojsk%20diskutuj.user.js
// @updateURL https://update.greasyfork.org/scripts/474812/Postojsk%20diskutuj.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Find the meta tag with the property "og:title"
    const ogTitleMetaTag = document.querySelector('meta[property="og:title"]');

    // Find the <title> element
    const titleElement = document.querySelector('title');

    // Find the element with the class "discussion-btn"
    const elementWithArticleFooterDisqus = document.querySelector('.discussion-btn');

    // Function to sanitize text by removing diacritics and special characters
    function sanitizeText(text) {
        // Normalize the text, remove diacritics, and replace special characters
        text = text.normalize("NFD").replace(/[\u0300-\u036f]/g, '').replace(/[^\w\s]/gi, '');
        // Trim leading and trailing whitespace
        text = text.trim();
        // Replace internal whitespace with underscores
        text = text.replace(/\s+/g, '_').toLowerCase();
        return text;
    }

    // Check if all elements exist
    if (ogTitleMetaTag && titleElement && elementWithArticleFooterDisqus) {
        // Extract the title text from the content attribute of the meta tag
        const ogTitle = ogTitleMetaTag.getAttribute('content');

        // Extract the text from the <title> element
        const titleText = titleElement.textContent.trim(); // Trim the title text here

        // Sanitize the title texts to construct the variable parts
        const variablePart1 = sanitizeText(ogTitle);
        const variablePart2 = sanitizeText(titleText);

        // Construct the new URLs with the anchor text and variable parts
        const newURL1 = `https://disqus.com/home/discussion/postoj/${variablePart1}/`;
        const newURL2 = `https://disqus.com/home/discussion/postoj/${variablePart2}/`;

        // Log the new URLs to the console
        console.log("New URL 1:", newURL1);
        console.log("New URL 2:", newURL2);

        // Add a click event listener to the "discussion-btn" element
elementWithArticleFooterDisqus.addEventListener('click', () => {
    // Open URL1 in a new tab
    window.open(newURL1, '_blank');

    // Redirect the current tab to URL2
    window.location.href = newURL2;
});

    }
})();