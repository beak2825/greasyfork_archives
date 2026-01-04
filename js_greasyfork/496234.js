// ==UserScript==
// @name         UConn Rate My Professor Search
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Add a button to get instructor's professor rating from ratemyprof from the UConn catalog
// @author       Michael Santos
// @match        https://catalog.uconn.edu/course-search/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=uconn.edu
// @grant        GM_xmlhttpRequest
// @grant        GM_openInTab
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/496234/UConn%20Rate%20My%20Professor%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/496234/UConn%20Rate%20My%20Professor%20Search.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to perform the Google search
    function searchInstructor(instructorName) {
        const query = encodeURIComponent(`${instructorName} UCONN Rate my Professor`);
        const url = `https://www.google.com/search?q=${query}`;

        GM_xmlhttpRequest({
            method: 'GET',
            url: url,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.3'
            },
            onload: function(response) {
                // Parse the response to find the Rate My Professor link
                const parser = new DOMParser();
                const doc = parser.parseFromString(response.responseText, 'text/html');
                const links = doc.querySelectorAll('a');

                for (let link of links) {
                    if (link.href.includes('ratemyprofessors.com')) {
                        // Open the Rate My Professor link in a new tab
                        GM_openInTab(link.href, { active: true });
                        return;
                    }
                }

                console.error('Rate My Professor link not found');
            },
            onerror: function(error) {
                console.error('Request failed', error);
            }
        });
    }

    // Function to add a search button next to each instructor name
    function addSearchButtons() {
        const instructorElements = document.querySelectorAll('body > main > div.panel.panel--2x.panel--kind-details.panel--visible > div > div.panel__body > div:nth-child(16) > div > div > div');
        instructorElements.forEach(element => {
            // Check if the button is already added to avoid duplicates
            if (!element.querySelector('.search-rmp-button')) {
                const instructorName = element.innerText;
                const button = document.createElement('button');
                button.innerText = 'Search RMP';
                button.className = 'search-rmp-button';
                button.style.marginLeft = '10px';
                button.addEventListener('click', () => searchInstructor(instructorName));
                element.appendChild(button);
            }
        });
    }

    // Set interval to add search buttons every second
    setInterval(addSearchButtons, 1000);

})();
