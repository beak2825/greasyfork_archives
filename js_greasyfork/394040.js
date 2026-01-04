// ==UserScript==
// @name         UghFacebookAdsSidePanel
// @version      0.1.1
// @description  Remove ads from Facebook right-hand side panel 
// @author       Jeremy Bornstein <jeremy@jeremy.org>
// @match        https://*.facebook.com/*
// @grant        none
// @namespace https://greasyfork.org/users/414927
// @downloadURL https://update.greasyfork.org/scripts/394040/UghFacebookAdsSidePanel.user.js
// @updateURL https://update.greasyfork.org/scripts/394040/UghFacebookAdsSidePanel.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function removeAds(parent) {
        const nodes = parent.querySelectorAll('a');
        for (let i = 0; i < nodes.length; i++) {
            const node = nodes[i];
            const nodeText = nodes[i].innerText;
            if (   nodeText != "Sponsorisé"
                 && nodeText != "Sponsored"
               )
              continue;
            const adNode = node.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode;
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