// ==UserScript==
// @name     JJB FB filter
// @version  1
// @grant    none
// @description  Remove annoying crap from FB
// @author       Jeremy Bornstein <jeremy@jeremy.org>
// @match        https://*.facebook.com/*
// @grant        none
// @namespace https://greasyfork.org/users/414927
// @downloadURL https://update.greasyfork.org/scripts/407151/JJB%20FB%20filter.user.js
// @updateURL https://update.greasyfork.org/scripts/407151/JJB%20FB%20filter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const debug = true;

    function removeMatchingNodes(parent, selector, predicate, findParent, debugBGColor, debugTextColor, removeIt) {
        const nodes = parent.querySelectorAll(selector);
        for (let i = 0; i < nodes.length; i++) {
            const node = nodes[i];
            if (predicate(node)) {
                const offendingNode = findParent(node);
                if (debugBGColor && debugTextColor) {
                  	console.debug("found", node);
                    offendingNode.style.backgroundColor = debugBGColor;
                    offendingNode.style.color = debugTextColor;
                    console.debug("TARGET", offendingNode);
                }
              	if (removeIt) {
                    //offendingNode.parentNode.removeChild(offendingNode);
                    offendingNode.hidden = true;
                    offendingNode.style.display = "none";
                }
            }
        }
    }

    function removeAds(parent) {
        function isTargetNode(n) {
            const nodeText = n.innerText;
            return nodeText == "Sponsorisé"
                || nodeText == "Sponsored"
                || nodeText == "Promoted"
        }
        removeMatchingNodes(parent, 'h3 div', isTargetNode, n => n.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement, null, null, true);
    }

    removeAds(document);

    const observer = new MutationObserver(function(mutationsList, observer) {
        for(let mutation of mutationsList) {
            if (mutation.type === 'childList') {
                const addedNodes = mutation.addedNodes;
                for (let node of addedNodes) {
                    removeLikedBy(node);
                    removeFollowedBy(node);
                    removeAds(node);
                    removeTrendAds(node);  // trends are only loaded once (and always dynamically) so theoretically we could disable this after it finds any once.
                }
            }
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });

})();