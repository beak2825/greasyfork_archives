// ==UserScript==
// @name        Next Page with arrow keys - ebay-kleinanzeigen.de
// @namespace   Violentmonkey Scripts
// @match       https://www.ebay-kleinanzeigen.de/*
// @grant       none
// @version     1.0
// @author      coxtor
// @description 7.12.2022, 18:58:27
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/456219/Next%20Page%20with%20arrow%20keys%20-%20ebay-kleinanzeigende.user.js
// @updateURL https://update.greasyfork.org/scripts/456219/Next%20Page%20with%20arrow%20keys%20-%20ebay-kleinanzeigende.meta.js
// ==/UserScript==

function doc_keyUp(e) {
    switch (e.keyCode) {
        case 37:
            document.getElementsByClassName("pagination-prev")[0].click();
            break;
        case 39: // right
            document.getElementsByClassName("pagination-next")[0].click();
            break;
        default:
            break;
    }
}
document.addEventListener('keyup', doc_keyUp, false);