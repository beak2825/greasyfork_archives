// ==UserScript==
// @name 	     mycoinads
// @description	 skip timer 
// @version      0.46
// @match	     http://mycoinads.com/surfbtc*
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js
// @grant none
// @namespace https://greasyfork.org/users/25633
// @downloadURL https://update.greasyfork.org/scripts/19866/mycoinads.user.js
// @updateURL https://update.greasyfork.org/scripts/19866/mycoinads.meta.js
// ==/UserScript==

$(document).ready(function() {
    countdowntimeout = 1;

    document.getElementById("waitmsg").innerHTML = document.getElementById("formplaceholder").innerHTML;
    document.getElementById("formplaceholder").innerHTML="";
});