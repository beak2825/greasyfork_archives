// ==UserScript==
// @name          this is a test 03
// @description   test 03
// @include       https://www.mturk.com/mturk/preview*
// @include       https://www.mturk.com/mturk/continue*
// @include       https://www.mturk.com/mturk/accept*
// @include       https://www.mturk.com/mturk/submit
// @include       https://www.mturk.com/mturk/return*
// @version    ggkjhkjhjhj
// @namespace  ggkjgkjkjhkj
// @downloadURL https://update.greasyfork.org/scripts/20354/this%20is%20a%20test%2003.user.js
// @updateURL https://update.greasyfork.org/scripts/20354/this%20is%20a%20test%2003.meta.js
// ==/UserScript==



function findID() {
	var inputfields = document.getElementsByTagName("INPUT");
	results = "";
	for(var i = 0;i < inputfields.length;i++) {
		//if(inputfields[i].name == "Requester") {
		if(inputfields[i].name == "requesterId") {
			results = inputfields[i].value;
			break;
		}
	}
	window.alert(results);
	return results;
	
	
}

//document.addEventListener("DOMContentLoaded", findID, false);
window.onload = findID;


