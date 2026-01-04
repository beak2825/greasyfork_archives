// ==UserScript==
// @name         Torn Faction War Attack Links
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds attack links to all players in faction war page who don't have one
// @author       Your Name
// @match        https://www.torn.com/factions.php?step=your*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/534100/Torn%20Faction%20War%20Attack%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/534100/Torn%20Faction%20War%20Attack%20Links.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to add attack links
    function addAttackLinks() {
        // Find all enemy elements
        const enemies = document.querySelectorAll('li.enemy___uiAJH');

        enemies.forEach(enemy => {
            // Get the attack div
            const attackDiv = enemy.querySelector('.attack.left.attack___wBWp2');

            // Check if it has a span instead of an attack link
            if (attackDiv && attackDiv.querySelector('span.t-gray-9') && !attackDiv.querySelector('a')) {
                // Get the user ID from the profile link
                const profileLink = enemy.querySelector('.honorWrap___BHau4 a.linkWrap___ZS6r9');
                if (profileLink) {
                    const href = profileLink.getAttribute('href');
                    const userIdMatch = href.match(/XID=(\d+)/);

                    if (userIdMatch && userIdMatch[1]) {
                        const userId = userIdMatch[1];

                        // Create attack link
                        const attackLink = document.createElement('a');
                        attackLink.className = 't-blue h c-pointer';
                        attackLink.href = `loader2.php?sid=getInAttack&user2ID=${userId}`;
                        attackLink.textContent = 'Attack';

                        // Clear the attack div and add the new link
                        attackDiv.innerHTML = '';
                        attackDiv.appendChild(attackLink);
                    }
                }
            }
        });
    }

    // Run initially
    addAttackLinks();

    // Set up a mutation observer to handle dynamically loaded content
    const targetNode = document.getElementById('factions');
    if (targetNode) {
        const observer = new MutationObserver(function(mutations) {
            addAttackLinks();
        });

        observer.observe(targetNode, { childList: true, subtree: true });
    }

    // Also run periodically to catch any updates
    setInterval(addAttackLinks, 5000);
})();