// ==UserScript==
// @name         SPNATI Auto Win
// @namespace    https://www.reddit.com/r/spnati/comments/m4b8we/updated_cheat_v121080/
// @version      12.108.0
// @description  Automatically get the best possible hand in SPNatI
// @author       Originally made by u/No-Butterscotch4972, made into a userscript by anonfoxer
// @match        https://spnati.net/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/423223/SPNATI%20Auto%20Win.user.js
// @updateURL https://update.greasyfork.org/scripts/423223/SPNATI%20Auto%20Win.meta.js
// ==/UserScript==

var button = document.createElement("button");

button.innerHTML = "Win game";



var body = document.getElementById("player-name-label-minimal");

document.body.appendChild (button);



button.addEventListener ("click", function() {

players[0].hand.cards = [ 14, 13, 12, 11, 10 ].map(function(n) { return new Card(0 - 1, n); });

});