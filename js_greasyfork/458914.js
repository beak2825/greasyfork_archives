// ==UserScript==
// @name         משחזר אשכולות מחוקים
// @namespace    http://tampermonkey.net/
// @version      5.0.0
// @description  משחזר אשכולות מחוקים ומעביר אותם לפורום הרלוונטים
// @copyright    הספסל שבחצר
// @match        https://www.fxp.co.il/forumdisplay.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/458914/%D7%9E%D7%A9%D7%97%D7%96%D7%A8%20%D7%90%D7%A9%D7%9B%D7%95%D7%9C%D7%95%D7%AA%20%D7%9E%D7%97%D7%95%D7%A7%D7%99%D7%9D.user.js
// @updateURL https://update.greasyfork.org/scripts/458914/%D7%9E%D7%A9%D7%97%D7%96%D7%A8%20%D7%90%D7%A9%D7%9B%D7%95%D7%9C%D7%95%D7%AA%20%D7%9E%D7%97%D7%95%D7%A7%D7%99%D7%9D.meta.js
// ==/UserScript==

(function() {

	'use strict';
	var del = document.getElementsByTagName("a");
	var p = document.getElementById('thread_inlinemod_count');
	var move = document.getElementsByTagName("input");
	var back = document.getElementsByTagName("input");



	if (/inlinemod/.test(window.location.href)) {
		document.getElementById("destforumid").value = "9860";
		document.getElementsByClassName("button")[0].click();
	} else {
		if (p.innerText > 175) {
			if (forumname.includes("null")) {
				for (var D = 0; D < move.length; D++) {
					if (back[D].getAttribute('value') == "undeletethread") {
						move[D].click();
						document.getElementsByClassName("button")[2].click();
						window.reload()
					}
				}
			} else {
				for (var C = 0; C < move.length; C++) {
					if (move[C].getAttribute('value') == "movethread") {
						move[C].click();
						document.getElementsByClassName("button")[2].click();
						window.reload()
					}
				}
			}
		} else {
			for (var i = 0; i < del.length; i++) {
				if (del[i].getAttribute('id') == "thread_imodsel:class:deleted") {
					del[i].click();
					console.log("opened");
				}
			}
		}

	}

	document.getElementsByClassName('sp_show showth-next-left')[0].click()


})();