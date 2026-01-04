// ==UserScript==
// @name         Remove Reddit Promoted
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Hide annoying promoted posts by reddit
// @author       pfn0
// @match        https://www.reddit.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=reddit.com
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/468249/Remove%20Reddit%20Promoted.user.js
// @updateURL https://update.greasyfork.org/scripts/468249/Remove%20Reddit%20Promoted.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function removeChild(target) {
        var node = target;
        while (node != null && !node.matches("[data-testid=post-container],[data-scroller-first],[role=presentation]") && document !== node.parentNode) {
            node = node.parentNode;
        }
        if (node) {
            if (node.style.display != "none") {
                node.style.display = "none";
                //console.log("remove " + node);
                //console.log("from " + target);
            }
        }
    }

    function removePromoted() {
            Array.prototype
                .filter.call(document.getElementsByTagName("span"),
                             (x => x.textContent == "promoted" && x.style.color !== undefined))
                             //(x => x.textContent == "promoted" && x.style.color == "rgb(120, 124, 126)"))
                .forEach(x => removeChild(x))
        Array.prototype.forEach.call(document.getElementsByTagName("shreddit-ad-post"), x => x.parentNode.removeChild(x))
        Array.prototype.forEach.call(document.getElementsByTagName("shreddit-comments-page-ad"), x => x.parentNode.removeChild(x))
        Array.prototype.forEach.call(document.getElementsByTagName("shreddit-sidebar-ad"), x => x.parentNode.removeChild(x))
        Array.prototype.forEach.call(document.getElementsByTagName("embed-snippet-share-button"), x => { x.style.display = 'none' });


    }
    removePromoted();
    const config = { attributes: true, childList: true, subtree: true };
    const callback = (mutationList, observer) => {
        removePromoted();
    };
    const observer = new MutationObserver(callback);
    observer.observe(document, config);
})();