// ==UserScript==
// @name         Cashapp Changer
// @namespace    https://www.hellboy.lol
// @description  Change cashapp money text to prank friends
// @match        https://cash.app/*
// @grant        GM.setValue
// @license      MIT
// @version 0.0.1.20240727073404
// @downloadURL https://update.greasyfork.org/scripts/501903/Cashapp%20Changer.user.js
// @updateURL https://update.greasyfork.org/scripts/501903/Cashapp%20Changer.meta.js
// ==/UserScript==

var Amount = "$36,439.14"; // edit here
var SavingsAmount = "$29,019.64"; // edit here

function WLRW_ONDISCORD() {
    var thedamntext = document.querySelector(".es052ix0.css-orqp53.e1ycxcmf0");
    var thedamntext2 = document.querySelector(".e1vq9yq42.css-1pz3ssp.e1ycxcmf0");

  //var thedamnsavingstext = document.querySelector(".e1vq9yq42.css-1pz3ssp.e1ycxcmf0");
  // will fix this part in next update.

    if (thedamntext) {
        thedamntext.innerHTML = Amount;
    }

    if (thedamntext2) {
        thedamntext2.innerHTML = Amount;
    }

   // if (thedamnsavingstext) {
   //     thedamnsavingstext.innerHTML = SavingsAmount;
   // }
}
setInterval(WLRW_ONDISCORD, 0.1);
