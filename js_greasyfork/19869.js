// ==UserScript==
// @name 	     fastbets
// @description	 hide chat
// @version      0.25
// @match	     http://fastbets.io/*
// @grant none
// @namespace https://greasyfork.org/users/25633
// @downloadURL https://update.greasyfork.org/scripts/19869/fastbets.user.js
// @updateURL https://update.greasyfork.org/scripts/19869/fastbets.meta.js
// ==/UserScript==

$(document).ready(function() {
     $("#chat").hide();
});