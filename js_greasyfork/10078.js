// ==UserScript==
// @name         iCampus noAlert
// @namespace    https://github.com/Zibeline/iCampus-noAlert
// @version      0.1
// @description  Removes the annoying "session lost warning" on iCampus
// @author       Zibeline
// @require		 http://code.jquery.com/jquery-latest.js
// @match        *icampus.uclouvain.be/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/10078/iCampus%20noAlert.user.js
// @updateURL https://update.greasyfork.org/scripts/10078/iCampus%20noAlert.meta.js
// ==/UserScript==

$(document).ready(function() {
	for (var i = 0; i < 10; i++) {
		clearTimeout(i);
	}
});