// ==UserScript==
// @name         GGn Forum Search Dedupe+Expander
// @namespace    http://greasyfork.org/
// @version      1.0
// @license      MIT
// @description  Adds 2 buttons. One to deduplicate all forum search results, and one to expand all forum search results
// @author       SleepingGiant
// @match        https://gazellegames.net/forums.php?action=search*
// @match        https://gazellegames.net/forums.php?page=*&action=search*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/523883/GGn%20Forum%20Search%20Dedupe%2BExpander.user.js
// @updateURL https://update.greasyfork.org/scripts/523883/GGn%20Forum%20Search%20Dedupe%2BExpander.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function expandAllPosts() {
        const showLinks = document.querySelectorAll('a[onclick*="toggle"]');
        showLinks.forEach(link => link.click());
    }

    function deduplicatePosts() {
        const rows = document.querySelectorAll('.forum_list tr');
        const fullTextMap = new Map(); // To store unique posts
        const rowsToRemove = [];

        // Effectively use the "full text" (hidden next row by default) to dedupe on instead of the shortened preview string.
        rows.forEach(row => {
            if (row.classList.contains('hidden')) {
                const fullText = row.innerText.trim();
                if (fullTextMap.has(fullText)) {
                    rowsToRemove.push(row);
                    const prevRow = row.previousElementSibling;
                    if (prevRow && !prevRow.classList.contains('hidden')) {
                        rowsToRemove.push(prevRow);
                    }
                } else {
                    fullTextMap.set(fullText, true);
                }
            }
        });

        rowsToRemove.forEach(row => row.remove());
    }

    function addButtons() {
        // Gets the first linkbox - the page list section and adds there to blend in.
        const container = document.querySelector('.linkbox');

        const dedupeButton = document.createElement('button');
        dedupeButton.textContent = 'Dedupe Posts';
        dedupeButton.style.marginLeft = '5px';
        dedupeButton.style.cursor = 'pointer';
        dedupeButton.style.border = '1px solid black';
        dedupeButton.style.borderRadius = '3px';
        dedupeButton.style.boxShadow = '1px 1px 1px black';
        dedupeButton.onclick = deduplicatePosts;

        const expandButton = document.createElement('button');
        expandButton.textContent = 'Expand All';
        expandButton.style.marginLeft = '5px';
        expandButton.style.cursor = 'pointer';
        expandButton.style.border = '1px solid black';
        expandButton.style.borderRadius = '3px';
        expandButton.style.boxShadow = '1px 1px 1px black';
        expandButton.onclick = expandAllPosts;

        container.appendChild(dedupeButton);
        container.appendChild(expandButton);
    }

    // Initialize the script
    addButtons();
})();
