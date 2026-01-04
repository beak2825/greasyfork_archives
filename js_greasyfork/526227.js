// ==UserScript==
// @name         Sort THSC Online Pages by Year
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Sort pages on thsconline.github.io by year (newest to oldest) and display as a numbered list
// @author       stuffed
// @match        *://thsconline.github.io/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/526227/Sort%20THSC%20Online%20Pages%20by%20Year.user.js
// @updateURL https://update.greasyfork.org/scripts/526227/Sort%20THSC%20Online%20Pages%20by%20Year.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function extractYear(text) {
        const match = text.match(/\d{4}/);
        return match ? parseInt(match[0], 10) : 0;
    }

    function sortLinks() {
        let container = document.querySelector('.listing'); // Updated selector
        if (!container) return;

        let links = Array.from(container.querySelectorAll('a')) // Get all links
            .filter(link => !/upload files here/i.test(link.textContent)); // Remove 'upload files here'

        links.sort((a, b) => extractYear(b.textContent) - extractYear(a.textContent));

        // Clear container before reappending sorted elements
        container.innerHTML = '';

        // Create ordered list
        let ol = document.createElement('ol');
        ol.style.paddingLeft = '20px'; // Ensure proper indentation

        // Append sorted links as list items
        links.forEach(link => {
            let li = document.createElement('li');
            li.style.marginBottom = '0.5em'; // Adds half a line space between items
            li.appendChild(link);
            ol.appendChild(li);
        });

        container.appendChild(ol);
    }

    sortLinks();
})();
