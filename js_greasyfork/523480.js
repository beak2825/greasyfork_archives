// ==UserScript==
// @name         Torn Holdem Opponent Linker
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Converts seat names into Torn profile links
// @match        https://www.torn.com/page.php?sid=holdem*
// @author       Ask [1935081]
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/523480/Torn%20Holdem%20Opponent%20Linker.user.js
// @updateURL https://update.greasyfork.org/scripts/523480/Torn%20Holdem%20Opponent%20Linker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function replaceNames() {
        const opponents = document.querySelectorAll('.opponent___ZyaTg');

        opponents.forEach(opponent => {
            const opponentId = opponent.id;
            if (!opponentId) return;
            if (!opponentId.startsWith('player-')) return;

            const idNumber = opponentId.replace('player-', '');

            const nameElement = opponent.querySelector('.name___cESdZ');
            if (!nameElement) return;

            if (nameElement.querySelector('a')) return;

            const link = document.createElement('a');
            link.href = `https://www.torn.com/profiles.php?XID=${idNumber}`;
            link.textContent = nameElement.textContent.trim();
            link.target = '_blank';

            nameElement.textContent = '';
            nameElement.appendChild(link);
        });
    }

    setInterval(replaceNames, 1000);
})();
