// ==UserScript==
// @name        Flight Rising | Sophie Autocollect
// @namespace   Flight Rising Scripts
// @include     https://www1.flightrising.com/trading/sophie/reduce*
// @include     https://www1.flightrising.com/trading/sophie/create*
// @grant       none
// @version     0.1
// @author      Mythbyte
// @icon        https://i.imgur.com/rnKbnhY.png
// @description Sophie Autocollect
// @downloadURL https://update.greasyfork.org/scripts/539006/Flight%20Rising%20%7C%20Sophie%20Autocollect.user.js
// @updateURL https://update.greasyfork.org/scripts/539006/Flight%20Rising%20%7C%20Sophie%20Autocollect.meta.js
// ==/UserScript==
setInterval(function() {
    if (document.getElementsByClassName('common-npc-dialog')[0]) {
        var SpinGet = document.querySelector("#crafter-status");
        SpinGet.querySelector("button#crafter-status-claim").click();
    }
setTimeout( function() {
window.location.reload();
}, 3000);
}, 2000);