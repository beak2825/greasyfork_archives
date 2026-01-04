// ==UserScript==
// @name         Check Conferences' Ranking
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Provide a quick link for checking the ranking of conferences from AIDeadlin.es
// @author       Leonardo Lucio Custode
// @match        https://aideadlin.es/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=aideadlin.es
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/469577/Check%20Conferences%27%20Ranking.user.js
// @updateURL https://update.greasyfork.org/scripts/469577/Check%20Conferences%27%20Ranking.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    async function addLinkToConferences() {
        // Select all conference elements
        const conferenceElements = document.querySelectorAll('.ConfItem');

        // Iterate over each conference element
        conferenceElements.forEach(element => {
            // Get the conference title element
            const titleElement = element.querySelector('.conf-title');

            // Get the conference title text
            const title = titleElement.textContent.replaceAll(' ', '').split('2')[0];

            // Create a new <a> link element
            const linkElement = document.createElement('a');

            // Set the link's href attribute to your desired URL
            linkElement.href = 'http://portal.core.edu.au/conf-ranks/?search=' + title + '&by=all&source=all&sort=atitle&page=1'; // Replace 'https://example.com' with the desired URL

            // Set the link's text content
            linkElement.textContent = 'Check ranking'; // Replace 'Check ranking' with the desired link text

            // Insert the <a> link element after the conference element
            element.parentNode.insertBefore(linkElement, element);
        });
    }

    // Wait for the page to finish loading
    window.addEventListener('load', addLinkToConferences);
})();