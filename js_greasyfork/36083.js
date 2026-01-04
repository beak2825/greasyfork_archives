// ==UserScript==
// @name         Wanikani Tawake
// @namespace    Wanikani Tawake
// @version      0.2.1
// @description  Insults you when you make mistakes during a review session.
// @author       Kumirei
// @match        https://www.wanikani.com/review/session
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/36083/Wanikani%20Tawake.user.js
// @updateURL https://update.greasyfork.org/scripts/36083/Wanikani%20Tawake.meta.js
// ==/UserScript==
/*jshint esversion: 8 */

(function() {
    'use strict';

	var ctrlDown;
	var newInsult;
	var remInsult;
	var insults;
	var notFirst = false;
	const defaultInsults = ["You moron, you messed that same thing up last time. Is that really the best you can do? Pathetic.",
							"Everyone and their mother knows how to do this so why don’t you? Your lack of knowledge upsets me.",
							"馬鹿じゃあ？不正解は決まってんだろう。",
							"馬鹿じゃないの?その程度で何も出来ないくせに。",
							"不合格です。無理すな。",
							"You’re dumb. Go make me a sandwich.",
							"You’re ugly and your mother dresses you funny.",
							"You made a mistake? W-Wow! Y-You really are a moron! You need to up your game or you’ll never make it! N-N-NOT THAT I CARE! BAKA!!!"
						   ];

	try {
		insults = localStorage.getItem("WKinsults").split(",");
	}
	catch(err) {
		insults = defaultInsults;
	}

	Math.randomI = Math.random;
	// add the text field

	// hide the text field when thre's a new item
	$.jStorage.listenKeyChange("currentItem", function() {
		$("#insult").css("display","none");
	});
	// add the text field and add a random insult
	$.jStorage.listenKeyChange("wrongCount", function(key, action) {
		if (action === "updated" && notFirst) {
			$("#user-response").after("<input id='insult' type='text' style='display: block, font-size: 18px'/>");
			$("#insult").val(insults[Math.floor(Math.randomI() * insults.length)]);
		}
		notFirst = true;
	});
	// add and remove insults
	$("#insult").on("keydown", function (e) {
		if (e.keyCode === 17) { // 17 is ctrl
			ctrlDown = true;
		}
		// ctrl + shift adds the insult in the text field
		else if (ctrlDown && (e.keyCode === 16)) { // 16 is shift
			newInsult = $("#insult").val();
			if (newInsult !== "") {
				if (insults.includes(newInsult)) {
					insults.splice(insults.indexOf(newInsult), 1);
					modList("Removed", newInsult, insults);
				}
				else {
					insults.push(newInsult);
					localStorage.setItem("WKinsults",insults);
					modList("Added", newInsult, insults);
				}
			}
			ctrlDown = false;
		}
	});
	$("#insult").on("keyup", function (e) {
		if (e.keyCode === 17) { // 17 is ctrl
			ctrlDown = false;
		}
	});

})();

function modList(mode, insult, insults) {
	localStorage.setItem("WKinsults",insults);
	$("#insult").val(mode);
	console.log(mode + " the insult '" + insult + "'.");
	console.log("Current insults:");
	console.log(insults);
}
