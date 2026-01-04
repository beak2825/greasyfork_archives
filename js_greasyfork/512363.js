// ==UserScript==
// @name         Steam Language Extractor
// @namespace    none
// @version      1.0
// @description  Extracts interface and audio languages from Steam store pages
// @author       bipolar
// @match        https://store.steampowered.com/app/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/512363/Steam%20Language%20Extractor.user.js
// @updateURL https://update.greasyfork.org/scripts/512363/Steam%20Language%20Extractor.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to extract languages from the store page
    function extractLanguages() {
        const languages = {
            'Interface Languages': [],
            'Audio Languages': []
        };

        // Locate the language table
        const languageTable = document.querySelector('#languageTable');
        if (!languageTable) return languages;

        const langRows = languageTable.querySelectorAll('tr');

        langRows.forEach(row => {
            const language = row.querySelector('td.ellipsis')?.textContent.trim();
            const interfaceAvailable = row.querySelector('td.checkcol:nth-child(2) span') !== null;
            const audioAvailable = row.querySelector('td.checkcol:nth-child(3) span') !== null;

            if (language) {
                if (interfaceAvailable) {
                    languages['Interface Languages'].push(language);
                }
                if (audioAvailable) {
                    languages['Audio Languages'].push(language);
                }
            }
        });

        // Join arrays into strings
        languages['Interface Languages'] = languages['Interface Languages'].join(', ');
        languages['Audio Languages'] = languages['Audio Languages'].join(', ');

        return languages;
    }

    // Display languages
    function displayLanguages(languages) {
        const output = document.createElement('div');
        output.style.position = 'fixed';
        output.style.top = '10px';
        output.style.right = '10px';
        output.style.backgroundColor = 'white';
        output.style.border = '2px solid black';
        output.style.padding = '15px';
        output.style.zIndex = 1000;
        output.style.maxWidth = '300px';
        output.style.fontSize = '16px';
        output.style.color = 'black';

        let langOutput = '';
        if (languages['Interface Languages']) {
            langOutput += `[b]Interface Languages:[/b] ${languages['Interface Languages']}<br/>`;
        }
        if (languages['Audio Languages']) {
            langOutput += `[b]Audio Languages:[/b] ${languages['Audio Languages']}`;
        }

        output.innerHTML = langOutput || 'No language information found.';
        document.body.appendChild(output);
    }

    // Main execution
    const languages = extractLanguages();
    displayLanguages(languages);
})();
