// ==UserScript==
// @name         Upvoter
// @namespace    https://greasyfork.org/en/users/9694-croned
// @version      1.1
// @description  Upvotes every comment
// @author       Croned
// @match        https://epicmafia.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/13156/Upvoter.user.js
// @updateURL https://update.greasyfork.org/scripts/13156/Upvoter.meta.js
// ==/UserScript==

var i = 0;

function scan() {
	if (i < $(".up:has(.icon-thumbs-up)").length) {
		if (!$(".up:has(.icon-thumbs-up)").eq(i).hasClass("sel")) {
			$(".up:has(.icon-thumbs-up)").eq(i).click();
			console.log("Clicked " + i);
			i++;
			setTimeout(scan, 1100);
		}
		else {
			i++;
			scan();
		}
	}
	else {
		console.log("All comments upvoted!");
	}
}

$("[ng-click*='goto_lobby']").click(function() {
    setTimeout(scan, 1000);
});
setTimeout(scan, 1000);