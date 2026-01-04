// ==UserScript==
// @name         Torn Overseas Bounty Highlighter
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  Color RED bounty players
// @author       SuperGogu[3580072]
// @match        https://www.torn.com/index.php?page=people*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/536979/Torn%20Overseas%20Bounty%20Highlighter.user.js
// @updateURL https://update.greasyfork.org/scripts/536979/Torn%20Overseas%20Bounty%20Highlighter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function highlightBountyPlayers() {
        let listItems = document.querySelectorAll('.users-list li'); // Select all from users-list
        if (listItems.length === 0) {
            console.error("No elements found in .users-list");
            return;
        }

        listItems.forEach(listItem => {
            let bountyLink = listItem.querySelector('a[href^="/bounties.php?userID="]'); // Check if bounty

            if (bountyLink) {
                listItem.style.backgroundColor = 'red'; // Set player on RED
                listItem.style.color = 'white'; // White text
            }
        });
    }

    window.onload = function() {
        highlightBountyPlayers();
    };
})();