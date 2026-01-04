// ==UserScript==
// @name         Deckstats to Scryfall card redirect
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Redirect the card pages in deckstats directly to the card's scryfall page.
// @author       NormalDream
// @match        *://*.mtg-forum.de/db/magiccard.php*
// @icon         https://scryfall.com/favicon.ico
// @grant        none
// @run-at       document-start
// @license      GNU GPLv2
// @downloadURL https://update.greasyfork.org/scripts/458237/Deckstats%20to%20Scryfall%20card%20redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/458237/Deckstats%20to%20Scryfall%20card%20redirect.meta.js
// ==/UserScript==
window.onload = function() {
    const match = document.getElementsByTagName("body")[0].innerHTML.match(/href="(https:\/\/scryfall.com[^"]+)"/)
    if (match) {
        window.location = match[1]
    }
};