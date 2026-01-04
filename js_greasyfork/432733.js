// ==UserScript==
// @name         r/wishlist profile linkifier and contest search fixer
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Creates links to WLSearch profiles from r/wishlist flair.
// @author       esjay
// @match        https://*.reddit.com/r/Wishlist/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/432733/rwishlist%20profile%20linkifier%20and%20contest%20search%20fixer.user.js
// @updateURL https://update.greasyfork.org/scripts/432733/rwishlist%20profile%20linkifier%20and%20contest%20search%20fixer.meta.js
// ==/UserScript==

/* jshint esversion: 10 */

const addFlairLinksToElement = (element) => {
    try {
        element.querySelectorAll('.flair[title^="http://www.wlsearch.com/u/"]').forEach((flairEl) => {
            const url = flairEl.title;
            const username = /(u\/.*?)$/.exec(url)[1];
            flairEl.innerHTML = `<a target="_blank" href="${url}">${username} on WLSearch 🔗</a>`;
        });
    } catch (e) {
        console.error(e);
    }
};

addFlairLinksToElement(document);

document.addEventListener("DOMContentLoaded", replaceLinks, false );

if( document.readyState === "complete" ) {
    replaceLinks();
}

function replaceLinks() {
    Array.forEach( document.links, function(a) {
        a.href = a.href.replace( "'contest'+OR+flair:'closed'&amp", "'contest'&amp");
    });
}

// Document Mutation Watcher
var observer = new MutationObserver(function (mutations) {
    mutations.forEach((mutation) => {
        if (mutation.addedNodes && mutation.addedNodes.length > 0) {
            for (var i = 0; i < mutation.addedNodes.length; i++) {
                var newNode = mutation.addedNodes[i];
                addFlairLinksToElement(newNode);
            }
        }
    });
});

observer.observe(document.body, {
    childList: true,
    subtree: true
});