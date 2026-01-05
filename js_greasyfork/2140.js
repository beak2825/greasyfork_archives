// ==UserScript==
// @name           Redacted.CH :: Extended Main Menu
// @icon           https://redacted.ch/favicon.ico
// @description    Insert logchecker, better and WhatIMG link in the main menu
// @include        http*://*redacted.ch*
// @version        1.0.8
// @require        https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js
// @grant          GM_getValue

// @namespace https://greasyfork.org/users/2290
// @downloadURL https://update.greasyfork.org/scripts/2140/RedactedCH%20%3A%3A%20Extended%20Main%20Menu.user.js
// @updateURL https://update.greasyfork.org/scripts/2140/RedactedCH%20%3A%3A%20Extended%20Main%20Menu.meta.js
// ==/UserScript==

var target = document.getElementById('nav_upload');

// Add Collage subscribed link
$("#nav_upload").after('<li id="nav_better2" class="brackets"><a href="userhistory.php?action=subscribed_collages">Collages</a></li>');

// Add Logchecker link
$("#nav_upload").after('<li id="nav_logchecker" class="brackets"><a href="logchecker.php">Logchecker</a></li>');