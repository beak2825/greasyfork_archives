// ==UserScript==
// @name         Duke academic calendar highlighting
// @namespace    http://duke.edu/
// @version      0.1
// @description  Colorize the Duke University academic calendar for quicker review. Breaks are red, FDOC/LDOC is green, registration is blue.
// @author       Tyler Bletsch (Tyler.Bletsch@duke.edu)
// @match        https://registrar.duke.edu/*calendar*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=duke.edu
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/473591/Duke%20academic%20calendar%20highlighting.user.js
// @updateURL https://update.greasyfork.org/scripts/473591/Duke%20academic%20calendar%20highlighting.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Strings-to-colors dictionary
    const STRINGS2COLORS = {
        'break': '#FCC',
        'resume': '#FCC',
        'recess': '#FCC',
        'no classes are held': '#FCC',
        'holiday': '#FCC',

        'semester begin': '#CFC',
        'classes begin': '#CFC',
        'classes end': '#CFC',

        'carts open': '#CCF',
        'registration begins': '#CCF',
        'registration ends': '#CCF',
        'drop/add begins': '#CCF',
        'drop/add ends': '#CCF'
    };

    // Function to find a color based on a string
    function getColorForString(str) {
        for (const keyword in STRINGS2COLORS) {
            if (str.toLowerCase().includes(keyword)) {
                return STRINGS2COLORS[keyword];
            }
        }
        return null; // Return null if no matching color found
    }

    // Function to highlight cells
    function highlightCells() {
        const tables = document.querySelectorAll('table');
        tables.forEach(table => {
            const cells = table.querySelectorAll('td, th');
            cells.forEach(cell => {
                const color = getColorForString(cell.textContent);
                if (color) {
                    cell.style.backgroundColor = color;
                }
            });
        });
    }

    // Run the highlighting on page load
    window.addEventListener('load', () => {
        highlightCells();
    });

    // Run the highlighting whenever the page content changes (e.g., AJAX updates)
    const observer = new MutationObserver(mutations => {
        highlightCells();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
        characterData: true
    });
})();