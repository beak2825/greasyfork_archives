// ==UserScript==
// @name        KissManga.org Next/Prev Using Arrowkeys
// @namespace   https://greasyfork.org/en/scripts/446489-kissmanga-org-next-prev-using-arrowkeys
// @match       https://kissmanga.org/chapter/*
// @grant       none
// @license MIT
// @version     1.0
// @author      Onemanleft
// @description Allows navigation between KissManga manga chapters with left and right arrow keys
// @downloadURL https://update.greasyfork.org/scripts/446489/KissMangaorg%20NextPrev%20Using%20Arrowkeys.user.js
// @updateURL https://update.greasyfork.org/scripts/446489/KissMangaorg%20NextPrev%20Using%20Arrowkeys.meta.js
// ==/UserScript==


// Modified version of https://greasyfork.org/en/scripts/404000-kissmanga-next-prev-arrowkeys-script

window.onkeydown = function(e) {
    switch (e.keyCode) {
        // On left arrow key...
        case 37:
            document.getElementById('btnPrevious').click();
            break;
        // On right arrow key...
        case 39:
            document.getElementById('btnNext').click();
            break;
        default:
            break;
    }
};