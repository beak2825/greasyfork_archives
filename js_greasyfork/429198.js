// ==UserScript==
// @name         Reddit Deduplicator
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Deduplicates posts in reddit.com/r/friends
// @author       Marquita
// @match        https://www.reddit.com/r/friends/
// @icon         https://www.google.com/s2/favicons?domain=reddit.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/429198/Reddit%20Deduplicator.user.js
// @updateURL https://update.greasyfork.org/scripts/429198/Reddit%20Deduplicator.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const table = document.getElementById("siteTable");

    function checkVisibility(elem) {
        const url = elem.dataset.url
        console.log(url)
        const stored = uniques.get(url)
        switch(stored) {
           case undefined:
               uniques.set(url, elem)
           case elem: // eslint-disable-line no-fallthrough
               return true
           default:
               return false
        }
    }

    function dedupe(elem) {
        var unique = checkVisibility(elem)
        if(!unique) {
            elem.style.display = "none";
        };
        return unique
    }

    function callback() {
        table.querySelectorAll("div#siteTable div.thing").forEach(dedupe)
    }

    const observer = new MutationObserver(callback);
    observer.observe(table, { childList: true });

    var uniques = new Map();
    callback();
})();