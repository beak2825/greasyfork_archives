// ==UserScript==
// @name         Genius+
// @namespace    https://github.com/alengaa/genius-plus
// @version      0.1
// @description  Enhances genius.com with a custom artist song search and future improvements.
// @author       Alén
// @match        https://genius.com/artists/*
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/531576/Genius%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/531576/Genius%2B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function addSearchBar() {
        if (document.getElementById('genius-artist-search')) return; // Prevent duplicates

        const artistHeader = document.querySelector('h1');
        if (!artistHeader) return;

        const actionRow = document.querySelector('.profile_identity_and_description-action_row');
        if (!actionRow) return;

        const artistName = artistHeader.childNodes[0].nodeValue.trim(); // Ensures only the name is captured
        const searchBar = document.createElement('input');
        searchBar.id = 'genius-artist-search';
        searchBar.type = 'text';
        searchBar.placeholder = `Search ${artistName} songs...`;

        // Styling to match Genius' design
        searchBar.style.width = '100%';
        searchBar.style.marginTop = '10px';
        searchBar.style.marginBottom = '10px';
        searchBar.style.padding = '8px';
        searchBar.style.fontSize = '16px';
        searchBar.style.fontFamily = 'Programme, sans-serif'; // Genius uses Programme
        searchBar.style.color = '#000000'; // Fully black text
        searchBar.style.backgroundColor = 'white';
        searchBar.style.border = 'none';
        searchBar.style.outline = 'none';
        searchBar.style.display = 'block';
        searchBar.style.boxShadow = '4px 4px 6px rgba(0, 0, 0, 0.1)'; // Shadow at the corner
        searchBar.style.fontWeight = '900'; // Ensure full black text
        searchBar.style.caretColor = '#000000'; // Ensure cursor is black

        // Insert after the action row
        actionRow.parentNode.insertBefore(searchBar, actionRow.nextSibling);

        searchBar.addEventListener('keydown', function(event) {
            if (event.key === 'Enter' && searchBar.value.trim() !== '') {
                const query = encodeURIComponent(`${artistName} ${searchBar.value.trim()}`);
                window.location.href = `https://genius.com/search?q=${query}`;
            }
        });
    }

    function observePageChanges() {
        const observer = new MutationObserver(() => {
            addSearchBar(); // Re-add the search bar if it disappears
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    addSearchBar();
    observePageChanges();
})();