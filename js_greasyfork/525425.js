// ==UserScript==
// @name         Hide Premium Games on BGA
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Hide only the game divs that contain "premium.svg"
// @author       Spychopat
// @match        *://*.boardgamearena.com/gamelist*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/525425/Hide%20Premium%20Games%20on%20BGA.user.js
// @updateURL https://update.greasyfork.org/scripts/525425/Hide%20Premium%20Games%20on%20BGA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function hidePremiumGames() {
        document.querySelectorAll('div.bga-game-item-container').forEach(container => {
            if (container.innerHTML.includes('premium.svg')) {
                let gameDiv = container.closest('div');

                if (gameDiv) {
                    // Check if it's inside a carousel item
                    let carouselItem = gameDiv.closest('.bga-game-browser-carousel__item');
                    if (carouselItem) {
                        carouselItem.parentElement.style.display = 'none'; // Hide the parent of the carousel item
                    } else {
                        gameDiv.parentElement.parentElement.style.display = 'none'; // Default hiding logic
                    }
                }
            }
        });
    }

    // Run initially
    hidePremiumGames();

    // Observe dynamic changes (e.g., when the page loads more content)
    const observer = new MutationObserver(() => {
        hidePremiumGames();
    });

    observer.observe(document.body, { childList: true, subtree: true });

})();
