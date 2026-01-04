// ==UserScript==
// @name         Via Browser Dark Mode Tweak
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  prevent via browser dark mode image dimming
// @author       Johann
// @match        *
// @grant	     none
// @require      https://ajax.googleapis.com/ajax/libs/jquery/2.0.0/jquery.min.js
// @require      https://unpkg.com/imagesloaded@4/imagesloaded.pkgd.js
// @downloadURL https://update.greasyfork.org/scripts/396063/Via%20Browser%20Dark%20Mode%20Tweak.user.js
// @updateURL https://update.greasyfork.org/scripts/396063/Via%20Browser%20Dark%20Mode%20Tweak.meta.js
// ==/UserScript==


var style = document.createElement("style"); style.type = "text/css"; style.innerHTML = " img  {"+ " opacity: 1 !important; " + "} ";
document.body.appendChild(style);

$('img').imagesLoaded( function() {
  $(this).css('opacity','1 !important');
});