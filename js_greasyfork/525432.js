// ==UserScript==
// @name         Torn Remove RR Acts of Courage
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Removes the x2 and x3 'Acts of Courage' from Russian Roulette games, and adds a 'x2' button to the RR link menu to toggle visibility
// @author       pawl [1821105]
// @match        https://www.torn.com/page.php?sid=russianRoulette*
// @icon         https://www.google.com/s2/favicons?domain=torn.com
// @grant        GM_addStyle

// @downloadURL https://update.greasyfork.org/scripts/525432/Torn%20Remove%20RR%20Acts%20of%20Courage.user.js
// @updateURL https://update.greasyfork.org/scripts/525432/Torn%20Remove%20RR%20Acts%20of%20Courage.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log("Torn Remove RR Acts of Courage started");

    function toggleButtonVisibility(targetButtons) {
        targetButtons.forEach(button => {
            if (button.style.display === 'none' || button.style.display === '') {
                button.style.setProperty('display', 'inline-block', 'important');
            } else {
                button.style.setProperty('display', 'none', 'important');
            }
        });
    }

    window.addEventListener('load', () => {
        const container = document.querySelector('.linksContainer___LiOTN');

        if (!container) return;

        const toggleButton = document.createElement('button');
        toggleButton.textContent = 'x2';

        toggleButton.style.fontWeight = '700';
        toggleButton.style.fontSize = '12px';
        toggleButton.style.color = 'var(--appheader-links-color)';
        toggleButton.style.textShadow = 'var(--appheader-links-text-shadow-color)';

        container.insertBefore(toggleButton, container.firstChild);

        GM_addStyle(`
            button[data-id='2'],
            button[data-id='3'] {
                display: none !important;
            }
        `);

        function getTargetButtons() {
            return Array.from(document.querySelectorAll('button[data-id="2"], button[data-id="3"]'));
        }

        toggleButton.addEventListener('click', () => {
            const targetButtons = getTargetButtons();
            toggleButtonVisibility(targetButtons);
        });

    });
})();