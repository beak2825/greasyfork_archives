// ==UserScript==
// @name         Torn Enemy List Attack Button
// @namespace    https://www.torn.com
// @version      2.1
// @description  Add a dark red attack button for each enemy on the blacklist page
// @match        https://www.torn.com/blacklist.php
// @author       Star
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/514076/Torn%20Enemy%20List%20Attack%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/514076/Torn%20Enemy%20List%20Attack%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Add CSS to hide the ::before pseudo-element in .edit.right
    const style = document.createElement('style');
    style.innerHTML = `
        .edit.right::before {
            content: none !important;
        }
    `;
    document.head.appendChild(style);

    function addAttackButtons() {
        const enemies = document.querySelectorAll('li[data-id]');
        enemies.forEach(enemy => {
            const nameLink = enemy.querySelector('a.user.name');
            if (nameLink) {
                const userIdMatch = nameLink.title.match(/\[(\d+)\]/);
                if (userIdMatch && userIdMatch[1]) {
                    const userId = userIdMatch[1];
                    const descriptionDiv = enemy.querySelector('.description');

                    if (descriptionDiv && !enemy.querySelector('.attack-button')) {
                        // Create the attack button
                        const attackButton = document.createElement('a');
                        attackButton.href = `https://www.torn.com/loader.php?sid=attack&user2ID=${userId}`;
                        attackButton.target = '_blank';
                        attackButton.innerText = 'Attack';
                        attackButton.style.color = '#FFFFFF';
                        attackButton.style.backgroundColor = '#8B0000';
                        attackButton.style.padding = '0px 6px';
                        attackButton.style.marginLeft = 'auto';
                        attackButton.style.borderRadius = '3px';
                        attackButton.style.fontWeight = 'bold';
                        attackButton.style.fontSize = '10px';
                        attackButton.style.textDecoration = 'none';
                        attackButton.style.display = 'inline-block';
                        attackButton.classList.add('attack-button');

                        // Style the description container to use flex layout for alignment
                        descriptionDiv.style.display = 'flex';
                        descriptionDiv.style.alignItems = 'center';
                        descriptionDiv.appendChild(attackButton);
                    }
                }
            }
        });
    }

    // Observe DOM mutations to ensure the script works even when the content is dynamically loaded
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes.length || mutation.removedNodes.length) {
                addAttackButtons(); // Add buttons when DOM changes
            }
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });

    window.addEventListener('load', function() {
        addAttackButtons(); // Add buttons when the page fully loads
    });

})();
