// ==UserScript==
// @name         Torn Life Percentage
// @namespace    https://bypxbyp.com
// @version      1.1
// @description  Calculates and displays the life percentage on Torn user profiles.
// @license      MIT
// @author       BypXByp [3243346]
// @match        https://www.torn.com/profiles.php?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/541372/Torn%20Life%20Percentage.user.js
// @updateURL https://update.greasyfork.org/scripts/541372/Torn%20Life%20Percentage.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function calculateAndDisplayLife() {
        const allInfoSections = document.querySelectorAll('div.user-information-section');
        let lifeValueElement = null;

        for (const section of allInfoSections) {
            if (section.textContent.trim().toLowerCase() === 'life') {
                lifeValueElement = section.nextElementSibling;
                break;
            }
        }

        if (!lifeValueElement) {
            return false;
        }

        if (!lifeValueElement.classList.contains('user-info-value') || lifeValueElement.textContent.includes('%')) {
            return true;
        }

        const lifeText = lifeValueElement.textContent;

        const parts = lifeText.split('/');
        if (parts.length !== 2) {
            return true;
        }

        const currentLife = parseInt(parts[0], 10);
        const maxLife = parseInt(parts[1], 10);

        if (!isNaN(currentLife) && !isNaN(maxLife) && maxLife > 0) {
            const percentage = Math.round((currentLife / maxLife) * 100);

            lifeValueElement.textContent = `${lifeText} (${percentage}%)`;

            console.log(`Torn Life Percentage: Successfully updated life to "${lifeValueElement.textContent}".`);
            return true;
        }

        return true;
    }

    const interval = setInterval(() => {
        if (calculateAndDisplayLife()) {
            clearInterval(interval);
        }
    }, 500);

    setTimeout(() => {
        clearInterval(interval);
    }, 20000);
})();