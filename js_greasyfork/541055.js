// ==UserScript==
// @namespace      https://greasyfork.org/fr/users/868328-invincible812
// @name           Netflix Household Message Remover
// @name:fr        Suppresseur du message de foyer Netflix
// @version        1.0.1
// @description    Removes messages related to Netflix Household ("Your device isn’t part of the Netflix Household") on Netflix pages.
// @description:fr Supprime les messages liés au foyer Netflix ("Votre appareil ne fait pas partie du foyer Netflix") sur Netflix.
// @author         Invincible812
// @match          https://www.netflix.com/*
// @grant          none
// @license        Free
// @compatible     firefox Violentmonkey
// @compatible     chrome Violentmonkey
// @compatible     brave Violentmonkey
// @compatible     opera Violentmonkey
// @downloadURL https://update.greasyfork.org/scripts/541055/Netflix%20Household%20Message%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/541055/Netflix%20Household%20Message%20Remover.meta.js
// ==/UserScript==


(function() {
    'use strict';

    function removeNoFocusLockDivs(root = document) {
        const divs = root.querySelectorAll('div[data-no-focus-lock="true"]');
        divs.forEach(div => div.remove());
    }

    removeNoFocusLockDivs();

    const observer = new MutationObserver(mutations => {
        for (const mutation of mutations) {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === 1) {
                    if (node.matches?.('div[data-no-focus-lock="true"]')) {
                        node.remove();
                    } else {
                        removeNoFocusLockDivs(node);
                    }
                }
            });
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

})();
