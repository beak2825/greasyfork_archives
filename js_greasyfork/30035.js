// ==UserScript==
// @name         Moodle Edit Mode
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://ecampus.nmit.ac.nz/moodle/course/view.php*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/30035/Moodle%20Edit%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/30035/Moodle%20Edit%20Mode.meta.js
// ==/UserScript==

(function() {
    'use strict';
function getQueryVariable(variable) {
	var query = window.location.search.substring(1);
	var vars = query.split("&");
	for (var i = 0; i < vars.length; i++) {
		var pair = vars[i].split("=");
		if (pair[0] == variable) {
			return pair[1];
		}
	}
	return false;
}

    var sess = M.cfg.sesskey;
	var currentId = getQueryVariable("id");
	var currentSection = getQueryVariable("section");
	var txt = "Add Label";
	var labelLink =
		"add Label".link(
			"http://ecampus.nmit.ac.nz/moodle/course/modedit.php?add=label&course=" +
				currentId +
				"&section=" +
				currentSection +
				"&return=0&sr=" +
				currentSection
		);
    var assignmentLink =
		"add Assignment".link(
			"http://ecampus.nmit.ac.nz/moodle/course/modedit.php?add=assign&course=" +
				currentId +
				"&section=" +
				currentSection +
				"&return=0&sr=" +
				currentSection
		);
    var editOn =
        		"turn on Editing".link(
			"http://ecampus.nmit.ac.nz/moodle/course/view.php?id=" +
				currentId +
				"&section=" +
				currentSection +
				"&notifyeditingon=1"
		);
// Toolbar
    document.querySelector(".nav").innerHTML = "<li>" + labelLink + "</li><li>" + assignmentLink + "</li>" ;

//CSS Styles
    GM_addStyle('.decaf-awesome-bar .nav li a{ color: lightgreen !important; }');
})();