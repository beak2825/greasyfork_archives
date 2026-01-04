// ==UserScript==
// @name         Torn Locked Award Highlighter
// @namespace    https://bypxbyp.com
// @version      1.2
// @description  Adds a soft red highlight to locked awards on the Torn awards page for easier visibility.
// @license      MIT
// @author       BypXByp [3243346]
// @match        https://www.torn.com/page.php?sid=awards
// @match        https://www.torn.com/page.php?sid=awards&tab=honors
// @grant        none
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @downloadURL https://update.greasyfork.org/scripts/541368/Torn%20Locked%20Award%20Highlighter.user.js
// @updateURL https://update.greasyfork.org/scripts/541368/Torn%20Locked%20Award%20Highlighter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const highlightColor = 'rgba(255, 100, 100, 0.2)';
    const selector = 'li[class*="locked__"]';
    const debounceDelay = 500;

    let debounceTimeout;

    function highlightLockedAwards() {
        console.log('[Torn Highlighter] Scanning for locked awards...');
        const lockedAwards = document.querySelectorAll(selector);

        lockedAwards.forEach(liElement => {
            if (liElement.style.backgroundColor !== highlightColor) {
                liElement.style.backgroundColor = highlightColor;
            }
        });

        console.log(`[Torn Highlighter] Found and ensured ${lockedAwards.length} locked awards are highlighted.`);
    }

    function handlePageInteraction() {
        clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(highlightLockedAwards, debounceDelay);
    }

    setTimeout(highlightLockedAwards, 500);

    document.body.addEventListener('click', handlePageInteraction, true);

    console.log('[Torn Highlighter] Script loaded. Will re-scan for locked awards on click.');

})();