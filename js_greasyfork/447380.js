// ==UserScript==
// @name TechInAsia Premium Mode (Tech in Asia)
// @description - Remove Paywall Protection on TechInAsia -
// @match https://*.techinasia.com/*
// @require https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @version 0.1.3
// @namespace thetitoo
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/447380/TechInAsia%20Premium%20Mode%20%28Tech%20in%20Asia%29.user.js
// @updateURL https://update.greasyfork.org/scripts/447380/TechInAsia%20Premium%20Mode%20%28Tech%20in%20Asia%29.meta.js
// ==/UserScript==

var i = $(".paywall-content").length;

var myInterval = setInterval(unhide, 250);

function unhide () {
  $(".paywall-content").removeClass("paywall-content");
}

if (i != 0) {
  clearInterval(myInterval);
}