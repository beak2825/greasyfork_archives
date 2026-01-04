// ==UserScript==
// @name         UghTwitterAds
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  Remove ads from Twitter
// @author       Jeremy Bornstein <jeremy@jeremy.org>
// @match        https://twitter.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/393520/UghTwitterAds.user.js
// @updateURL https://update.greasyfork.org/scripts/393520/UghTwitterAds.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function removeAds(parent) {
        const nodes = parent.querySelectorAll('span');
        for (let i = 0; i < nodes.length; i++) {
            const node = nodes[i];
            const nodeText = nodes[i].innerText;
            if (   nodeText != "Sponsorisé"
                && nodeText != "Sponsored"
                && nodeText != "Promoted"
                && !nodeText.startsWith("Promoted by ")
                && !nodeText.startsWith("Sponsored by ")
                && !nodeText.startsWith("Sponsorisé par ")
               )
              continue;
            const adNode = node.parentNode.parentNode.parentNode.parentNode.parentNode;
            adNode.parentNode.removeChild(adNode);
        }
    }

    removeAds(document);

    const observer = new MutationObserver(function(mutationsList, observer) {
        for(let mutation of mutationsList) {
            if (mutation.type === 'childList') {
                const addedNodes = mutation.addedNodes;
                for (let node of addedNodes) {
                    removeAds(node);
                }
            }
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });

})();