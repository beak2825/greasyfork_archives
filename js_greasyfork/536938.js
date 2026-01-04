// ==UserScript==
// @name         HeroesWM Player List Extractor
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Извлечение списка игроков и их уровней для Google Sheets
// @author       Cursor Agent
// @match        *://*.heroeswm.ru/clan_info.php*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/536938/HeroesWM%20Player%20List%20Extractor.user.js
// @updateURL https://update.greasyfork.org/scripts/536938/HeroesWM%20Player%20List%20Extractor.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to extract player names and levels
    function extractPlayerData() {
        const rows = document.querySelectorAll('tr');
        let result = [];
        
        rows.forEach(row => {
            const cells = row.querySelectorAll('td');
            if (cells.length >= 6) {
                const name = cells[2].querySelector('a')?.textContent.trim() || '';
                const level = cells[3].textContent.trim();
                
                if (name && level) {
                    result.push([name, level].join('\t'));
                }
            }
        });
        
        return result.join('\n');
    }

    // Function to copy data to clipboard
    function copyToClipboard() {
        const data = [
            'Name\tLevel',
            extractPlayerData()
        ].join('\n');

        navigator.clipboard.writeText(data)
            .then(() => {
                alert('Player data copied to clipboard! You can now paste it into Google Sheets.');
            })
            .catch(err => {
                console.error('Failed to copy data: ', err);
                alert('Failed to copy data. Please try again.');
            });
    }

    // Add button to the page
    function addButton() {
        const button = document.createElement('button');
        button.textContent = 'Copy Names & Levels';
        button.style.position = 'fixed';
        button.style.top = '10px';
        button.style.right = '10px';
        button.style.zIndex = '9999';
        button.style.padding = '10px';
        button.style.backgroundColor = '#4CAF50';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.style.cursor = 'pointer';
        
        button.addEventListener('click', copyToClipboard);
        document.body.appendChild(button);
    }

    // Wait for the page to load completely
    window.addEventListener('load', function() {
        setTimeout(addButton, 1000);
    });
})();