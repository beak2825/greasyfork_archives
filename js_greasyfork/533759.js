// ==UserScript==
// @name         SoftArchive Books to Goodreads
// @namespace    https://greasyfork.org/en/users/807108-jeremy-r
// @version      1.5
// @description  Adds Goodreads or ComicGeeks/StashMyComics search links for book/comic blog posts on SoftArchive. Prioritizes comics if both tags exist. Trims title at first [ or ( character.
// @author       JRem
// @match        https://softarchive.is/blogs/*
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/533759/SoftArchive%20Books%20to%20Goodreads.user.js
// @updateURL https://update.greasyfork.org/scripts/533759/SoftArchive%20Books%20to%20Goodreads.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const isComic = !!document.querySelector('a.post__category-link[href="/comics/"]');
    const isBook = !isComic && !!document.querySelector('a.post__category-link[href="/books/"]');
    if (!isComic && !isBook) return;

    const titleElement = document.querySelector('h1.item_title.Linf');
    if (!titleElement) return;

    let titleText = titleElement.textContent.trim();
    const trimChars = ['[', '('];
    let trimIndex = titleText.length;

    for (const char of trimChars) {
        const index = titleText.indexOf(char);
        if (index !== -1 && index < trimIndex) {
            trimIndex = index;
        }
    }

    titleText = titleText.substring(0, trimIndex).trim();
    const encodedTitle = encodeURIComponent(titleText);

    const links = [];

    if (isComic) {
        links.push({
            url: `https://leagueofcomicgeeks.com/search/?keyword=${encodedTitle}`,
            text: 'Search on League of Comic Geeks'
        });
        links.push({
            url: `https://www.comics.org/series/name/${encodedTitle}/sort/alpha/?language=25`,
            text: 'Search on Comics.org'
        });
        links.push({
            url: `https://www.goodreads.com/search?q=${encodedTitle}`,
            text: 'Search on Goodreads'
        });
    } else if (isBook) {
        links.push({
            url: `https://www.goodreads.com/search?q=${encodedTitle}`,
            text: 'Search on Goodreads'
        });
    }

    for (const { url, text } of links) {
        const link = document.createElement('a');
        link.href = url;
        link.textContent = text;
        link.target = '_blank';
        link.style.display = 'block';
        link.style.marginTop = '10px';
        link.style.fontSize = '16px';
        link.style.color = '#0073b1';
        titleElement.insertAdjacentElement('afterend', link);
    }
})();
