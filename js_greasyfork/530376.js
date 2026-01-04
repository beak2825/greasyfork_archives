// ==UserScript==
// @name         Sort Faction List by FF Score
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Sort faction members by FF Score
// @author       You
// @match        https://www.torn.com/factions.php?step=profile*
// @grant        none
// @license      MIT 
// @downloadURL https://update.greasyfork.org/scripts/530376/Sort%20Faction%20List%20by%20FF%20Score.user.js
// @updateURL https://update.greasyfork.org/scripts/530376/Sort%20Faction%20List%20by%20FF%20Score.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function sortMembersByFF() {
        const list = document.querySelector('.table-body.tt-modified-ff-scouter');
        if (!list) return;

        let rows = Array.from(list.querySelectorAll('.table-row'));

        rows.sort((a, b) => {
            let ffA = parseFloat(a.getAttribute('data-ff-scout')) || 0;
            let ffB = parseFloat(b.getAttribute('data-ff-scout')) || 0;
            return ffB - ffA; // Sort descending
        });

        rows.forEach(row => list.appendChild(row));
    }

    function addSortButton() {
        const header = document.querySelector('.tt-ff-scouter-faction-list-header');
        if (!header) return;

        const sortButton = document.createElement('div');
        sortButton.innerText = '⇅';
        sortButton.style.cursor = 'pointer';
        sortButton.style.marginLeft = '5px';
        sortButton.style.display = 'inline-block';
        sortButton.style.fontWeight = 'bold';
        sortButton.addEventListener('click', sortMembersByFF);

        header.appendChild(sortButton);
    }

    function init() {
        const observer = new MutationObserver(() => {
            if (document.querySelector('.table-body.tt-modified-ff-scouter')) {
                addSortButton();
                observer.disconnect();
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    init();
})();
