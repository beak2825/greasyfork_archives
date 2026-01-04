// ==UserScript==
// @name         [GC] - Highlight Username on High Score Pages
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  Highlights your name on a high score table
// @author       Your Name
// @match        https://www.grundos.cafe/games/highscores/?game_id=*
// @match        https://www.grundos.cafe/games/highscores_alltime/?game_id=*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/487303/%5BGC%5D%20-%20Highlight%20Username%20on%20High%20Score%20Pages.user.js
// @updateURL https://update.greasyfork.org/scripts/487303/%5BGC%5D%20-%20Highlight%20Username%20on%20High%20Score%20Pages.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your target name to highlight, Replace your name below
    const targetName = 'YOURUSERNAME';

    // Function to highlight target name
    function highlightTargetName() {
        // Find all tbody elements
        const tbodies = document.querySelectorAll('tbody');

        tbodies.forEach((tbody) => {
            // Search for target name within each tbody
            Array.from(tbody.getElementsByTagName('tr')).forEach((row) => {
                Array.from(row.getElementsByTagName('td')).forEach((cell) => {
                    if(cell.textContent.includes(targetName)) {
                        // Highlight cell if target name is found
                        cell.style.backgroundColor = 'yellow';
                    }
                });
            });
        });
    }

    // Run the highlight function when the page has loaded
    window.addEventListener('load', highlightTargetName);
})();
