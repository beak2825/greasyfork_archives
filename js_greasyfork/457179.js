// ==UserScript==
// @name        Weak Spot Stays In Place
// @namespace   Violentmonkey Scripts
// @match       https://syns.studio/more-ore/
// @grant       none
// @version     1.0
// @author      Gardens
// @description 12/27/2022, 12:54:13 AM
// @downloadURL https://update.greasyfork.org/scripts/457179/Weak%20Spot%20Stays%20In%20Place.user.js
// @updateURL https://update.greasyfork.org/scripts/457179/Weak%20Spot%20Stays%20In%20Place.meta.js
// ==/UserScript==
/// more ore
window.fixedSpot = false;
function tryFixSpot() {
  if (!window.fixedSpot) {

    document.querySelector('.weak-spot').addEventListener("click", resetWeak);
    window.fixedSpot = true;
  } else return;
}
setInterval(tryFixSpot, 1000);
window.resetWeak = function () { document.querySelector('.weak-spot').style = "transform: scale(1); left: 124px; bottom: 9px;"; };