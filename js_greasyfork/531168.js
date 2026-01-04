// ==UserScript==
// @name         AudiobookBay to Goodreads
// @namespace    https://greasyfork.org/en/users/807108-jeremy-r
// @version      1.1
// @description  Adds a Goodreads search link below the audiobook title on AudiobookBay
// @author       JRem
// @match        https://audiobookbay.lu/abss/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/531168/AudiobookBay%20to%20Goodreads.user.js
// @updateURL https://update.greasyfork.org/scripts/531168/AudiobookBay%20to%20Goodreads.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Get the title element
    const titleElement = document.querySelector('.postTitle h1[itemprop="name"]');
    if (titleElement) {
        const bookTitle = titleElement.innerText.trim();
        const encodedTitle = encodeURIComponent(bookTitle);
        const fullyEncodedTitle = encodedTitle.replace(/[!'()*]/g, c => '%' + c.charCodeAt(0).toString(16));
        const searchUrl = `https://www.goodreads.com/search?q=${fullyEncodedTitle}`;

        // Create a new div for the link (before)
        const linkDivBefore = document.createElement('div');
        linkDivBefore.style.marginTop = '10px';

        // Create the Goodreads link
        const goodreadsLink = document.createElement('a');
        goodreadsLink.href = searchUrl;
        goodreadsLink.target = '_blank';
        goodreadsLink.innerText = 'Search this book on Goodreads';
        goodreadsLink.style.color = '#0073b1';
        goodreadsLink.style.fontSize = '16px';
        goodreadsLink.style.fontWeight = 'bold';

        // Append the link to the new div
        linkDivBefore.appendChild(goodreadsLink);

        // Insert the new div after the title
        titleElement.parentNode.insertBefore(linkDivBefore, titleElement.nextSibling);

        // Create another new div for additional content (after)
        const linkDivAfter = document.createElement('div');
        linkDivAfter.style.marginTop = '10px';
        linkDivAfter.innerText = '';
        linkDivAfter.style.fontSize = '14px';
        linkDivAfter.style.fontStyle = 'italic';
        linkDivAfter.style.color = '#555';

        // Insert the second div after the first one
        linkDivBefore.parentNode.insertBefore(linkDivAfter, linkDivBefore.nextSibling);
    }
})();
