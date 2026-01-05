// ==UserScript==
// @name         GoogleNormal
// @version      0.1
// @description  Hide google's seasonal/holiday logos
// @author       Th3_A11_M1ghty_
// @match        *://*.google.com/*
// @grant        none
// @require      http://code.jquery.com/jquery-latest.js
// @namespace https://greasyfork.org/users/41967
// @downloadURL https://update.greasyfork.org/scripts/23427/GoogleNormal.user.js
// @updateURL https://update.greasyfork.org/scripts/23427/GoogleNormal.meta.js
// ==/UserScript==

(function() {
    $("#hplogo").html('<img border="0" height="175" src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/2000px-Google_2015_logo.svg.png" style="padding-top:25px" width="546" onload="window.lol&amp;&amp;lol()">');
})();