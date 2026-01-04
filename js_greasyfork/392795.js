// ==UserScript==
// @name        Hackaday De-dark
// @namespace   http://hackaday.com/*
// @namespace   https://hackaday.com/*
// @description Invert colour scheme from a dark one to a light one
// @include     Http://hackaday.com/*
// @include     Https://hackaday.com/*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/392795/Hackaday%20De-dark.user.js
// @updateURL https://update.greasyfork.org/scripts/392795/Hackaday%20De-dark.meta.js
// ==/UserScript==

document.body.style.background = "white";

var all = document.getElementsByTagName("*");

for (var i=0, max=all.length; i < max; i++) {
 all[i].style.color = "grey";
}