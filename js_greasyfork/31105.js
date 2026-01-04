// ==UserScript==
// @name        Postfinance
// @namespace   postfinance_ad
// @description Angebote hidden
// @include     https://www.postfinance.ch/ap/ba/fp/html/e-finance/home
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/31105/Postfinance.user.js
// @updateURL https://update.greasyfork.org/scripts/31105/Postfinance.meta.js
// ==/UserScript==

var pfad = document.getElementById("instance-efhome-tiles_pc-efgenericmarketing-home");
pfad.hidden = true;