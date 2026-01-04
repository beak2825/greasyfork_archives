// ==UserScript==
// @name         Torn Faction Armory Quick Retrieve
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Moves the confirmation "Yes" button to the same location as the "Retrieve" button for quicker retrievals
// @author       echotte [2834135]
// @match        https://www.torn.com/factions.php*
// @icon         https://static.wikia.nocookie.net/cybernations/images/b/b8/NPObannerflagnew.png/revision/latest/scale-to-width-down/200?cb=20121128045516
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/516721/Torn%20Faction%20Armory%20Quick%20Retrieve.user.js
// @updateURL https://update.greasyfork.org/scripts/516721/Torn%20Faction%20Armory%20Quick%20Retrieve.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.addEventListener('click', function(event) {
        const clickedElement = event.target;
        if (clickedElement.matches('.retrieve.active')) {
            setTimeout(() => {
                const itemRetrieveAct = clickedElement.closest('.item-retrieve-act');
                if (itemRetrieveAct) {
                    const confirmButton = itemRetrieveAct.querySelector('.t-blue.retrieve-yes.bold.m-left20');
                    if (confirmButton) {
                        const retrieveButtonRect = clickedElement.getBoundingClientRect();

                        // Move the confirm button to the location of the retrieve button
                        confirmButton.style.position = 'relative';
                        confirmButton.style.top = `${retrieveButtonRect.top - confirmButton.getBoundingClientRect().top +10}px`;
                        confirmButton.style.left = `${retrieveButtonRect.left - confirmButton.getBoundingClientRect().left +20}px`;

                        // Hide the original retrieve button
                        clickedElement.style.display = 'none';
                    }
                }
            }, 50); // Adjust delay as needed for confirmation button to appear
        }
    });
})();