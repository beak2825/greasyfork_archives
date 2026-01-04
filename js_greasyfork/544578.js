// ==UserScript==
// @name      Pokémon Showdown Replay Link Exporter
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Added a button in pokemon showdown replay page to copy all the replay links to paste in the replay scouter
// @author       You
// @match        https://replay.pokemonshowdown.com/*
// @grant        GM_setClipboard
// @grant        GM_addStyle
// @license      WTFPL
// @downloadURL https://update.greasyfork.org/scripts/544578/Pok%C3%A9mon%20Showdown%20Replay%20Link%20Exporter.user.js
// @updateURL https://update.greasyfork.org/scripts/544578/Pok%C3%A9mon%20Showdown%20Replay%20Link%20Exporter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
        .export-replay-button {
            background-color: #4CAF50;
            color: white;
            padding: 8px 15px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 14px;
            margin-left: 15px; 
            vertical-align: middle; 
        }
        .export-replay-button:hover {
            background-color: #45a049;
        }
    `);

    const checkInterval = setInterval(() => {
        const targetElement = document.querySelector('.main h1');
        if (targetElement && !document.querySelector('.export-replay-button')) {
            clearInterval(checkInterval);

            let exportButton = document.createElement('button');
            exportButton.innerHTML = 'Copy all replay links';
            exportButton.className = 'export-replay-button';

            targetElement.appendChild(exportButton);

            exportButton.addEventListener('click', () => {
                const linkElements = document.querySelectorAll('ul.linklist a.blocklink');
                if (linkElements.length > 0) {
                    const links = Array.from(linkElements).map(a => a.href);
                    const linksText = links.join('\n');

                    GM_setClipboard(linksText, 'text');

                    exportButton.innerHTML = `Copied ${links.length} links!`;
                    setTimeout(() => {
                        exportButton.innerHTML = 'Copy all replay links';
                    }, 2000); 
                } else {
                    exportButton.innerHTML = 'Did not find any links';
                     setTimeout(() => {
                        exportButton.innerHTML = 'Copy all replay links';
                    }, 2000);
                }
            });
        }
    }, 500);

})();