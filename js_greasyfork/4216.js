// ==UserScript==
// @name           Hide Negatively Voted Posts
// @author         Cameron Bernhardt (AstroCB)
// @version        2.0.0
// @namespace  https://github.com/AstroCB
// @description  Hides questions with a score of less than 0 from the front page
// @include        http://*.stackexchange.com/
// @include        http://stackoverflow.com/
// @include        http://meta.stackoverflow.com/
// @include        http://serverfault.com/
// @include        http://meta.serverfault.com/
// @include        http://superuser.com/
// @include        http://meta.superuser.com/
// @include        http://askubuntu.com/
// @include        http://meta.askubuntu.com/
// @include        http://stackapps.com/
// @downloadURL https://update.greasyfork.org/scripts/4216/Hide%20Negatively%20Voted%20Posts.user.js
// @updateURL https://update.greasyfork.org/scripts/4216/Hide%20Negatively%20Voted%20Posts.meta.js
// ==/UserScript==

document.getElementsByTagName("head")[0].appendChild(show);
var votes = document.getElementsByClassName("votes");
var questions = document.getElementsByClassName("question-summary narrow");

var counts = [];
for (var i = 0; i < votes.length; i++) {
	counts[i] = votes[i].children[0].children[0].innerHTML;
}

for (var i = 0; i < counts.length; i++) {
	if (parseInt(counts[i]) < 0) {
		questions[i].hidden = "hidden";
	}
}