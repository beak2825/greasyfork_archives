// ==UserScript==
// @name     ShopSounds
// @version  2
// @grant    none
// @license MIT
// @namespace www.wiishopchannel.net
// @description Adds higher quality sounds to wiishopchannel.net
// // @match http://www.wiishopchannel.net/
// @downloadURL https://update.greasyfork.org/scripts/482782/ShopSounds.user.js
// @updateURL https://update.greasyfork.org/scripts/482782/ShopSounds.meta.js
// ==/UserScript==

if (window.location.hostname == "wiishopchannel.net") {
	document.getElementById("cSE_Forcus").src = "https://drive.google.com/uc?export=download&id=1ZVVo3AZB1ybwbtbu8tlU0Tp76Cef4wpd";
  document.getElementById("cSE_Decide").src = "https://drive.google.com/uc?export=download&id=1QdRgbW1GpY1SLBFxVAFokn7Hs6-L9D9W";
  document.getElementById("cSE_Cancel").src = "https://drive.google.com/uc?export=download&id=1OLsPmVtJJaATtYWsQF4xZ0bH56V3ydQS";
}

