// ==UserScript==
// @name         Open Jstris Live Replays in Background Tabs
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  Adds a button to open versus replay links in background tabs on Jstris user pages.
// @author       intermittence
// @match        https://jstris.jezevec10.com/u/*
// @grant        GM_openInTab
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/522434/Open%20Jstris%20Live%20Replays%20in%20Background%20Tabs.user.js
// @updateURL https://update.greasyfork.org/scripts/522434/Open%20Jstris%20Live%20Replays%20in%20Background%20Tabs.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Create the button
    const button = document.createElement('button');
    button.textContent = 'Open Replays in Background Tabs';
    button.style.position = 'fixed';
    button.style.bottom = '10px';
    button.style.right = '10px';
    button.style.zIndex = '1000';
    button.style.padding = '10px 15px';
    button.style.backgroundColor = '#0078d7';
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.borderRadius = '5px';
    button.style.cursor = 'pointer';

    // Append button to the page
    document.body.appendChild(button);

    // Add click event listener
    button.addEventListener('click', () => {
        const replayLinks = [];
        document
            .querySelectorAll('#app > div > div:nth-child(5) > div > div > table > tbody > tr')
            .forEach(row => {
                const links = Array.from(row.querySelectorAll('td:nth-child(8) > a'))
                    .map(link => link.href)
                    // some links may no longer be valid (Ex: -)
                    .filter(href =>
                        href.startsWith('https://jstris.jezevec10.com/replay/live/') ||
                        href.startsWith('https://jstris.jezevec10.com/replay/1v1/')
                    );
                
                // always choose the last link since 1v1 is displayed last
                if (links.length > 0) {
                    replayLinks.push(links[links.length - 1]);
                }
            });

        if (replayLinks.length === 0) {
            alert('No replay links found!');
            return;
        }
        replayLinks.forEach(link => GM_openInTab(link, { active: false }));
        alert(`Opened ${replayLinks.length} unique replays`)
    });
})();
