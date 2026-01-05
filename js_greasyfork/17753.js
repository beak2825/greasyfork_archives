// ==UserScript==
// @name          NoGameStop *OLD*
// @description   Removed the GameStop banner
// @include       http://www.kongregate.com/*
// @version 0.0.1.20160401090047
// @namespace https://greasyfork.org/users/32649
// @downloadURL https://update.greasyfork.org/scripts/17753/NoGameStop%20%2AOLD%2A.user.js
// @updateURL https://update.greasyfork.org/scripts/17753/NoGameStop%20%2AOLD%2A.meta.js
// ==/UserScript==

var gamestop_ad = document.getElementById("gs_network");
gamestop_ad.parentNode.removeChild(gamestop_ad);

var gamestop_footer = document.getElementsByClassName("footerlinks gs_network")[0];
gamestop_footer.parentNode.removeChild(gamestop_footer);