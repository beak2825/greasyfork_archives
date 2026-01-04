// ==UserScript==
// @name         IMDb Credits Copier
// @namespace    https://greasyfork.org/en/users/1060007-dsumner12
// @version      1.0
// @description  Extract and copy names from IMDb credit pages.
// @author       ChatGPT
// @match        *://*.imdb.com/title/*/fullcredits*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/481197/IMDb%20Credits%20Copier.user.js
// @updateURL https://update.greasyfork.org/scripts/481197/IMDb%20Credits%20Copier.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to create a button
    function createButton(id, text) {
        let button = document.createElement('button');
        button.innerText = text;
        button.id = id;
        button.style.margin = '5px';
        return button;
    }

    // Function to extract and copy names from a specific section
    function copyNames(section) {
        let namesSet = new Set();
        let nextElement = section.nextElementSibling;

        while (nextElement && nextElement.tagName !== 'H4') {
            let links;
            if (section.getAttribute('name') === 'cast') {
                // Specific handling for cast
                links = nextElement.querySelectorAll('tr:not(.castlist_label) td:nth-child(2) a');
            } else {
                // For other categories
                links = nextElement.querySelectorAll('td.name a');
            }
            links.forEach(link => namesSet.add(link.textContent.trim()));
            nextElement = nextElement.nextElementSibling;
        }

        navigator.clipboard.writeText(Array.from(namesSet).join('\n'));
    }

    // Adding buttons
    let categories = ['director', 'writer', 'cast', 'producer', 'composer', 'cinematographer'];
    categories.forEach(category => {
        let section = document.querySelector(`h4[name='${category}']`);
        if (section) {
            let button = createButton(`copy_${category}`, `Copy ${category}`);
            button.addEventListener('click', () => copyNames(section));
            section.parentNode.insertBefore(button, section.nextSibling);
        }
    });
})();
