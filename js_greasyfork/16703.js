// ==UserScript==
// @name        Youtube Enhanced Score
// @description YouTube likes/dislikes ratio may hold very little value on highly rated channel since ie. 94% and 96% can be a difference between bad and good video for that channel. This extension computes a logit out of likes ratio thus unbounding and centering it, so it can be more easily human interpretable.
// @namespace   jonnyrobbie
// @include     /https?:\/\/(www\.)?(youtu\.be\/|youtube\.com\/(watch\?(.*&)?v=|(embed|v)\/))([^\?&"'>]+)/
// @version     1.0.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/16703/Youtube%20Enhanced%20Score.user.js
// @updateURL https://update.greasyfork.org/scripts/16703/Youtube%20Enhanced%20Score.meta.js
// ==/UserScript==


function main() {
	likes = getLikes();
	score = calcScore(likes);
	setScore(score);
}

function getLikes() {
	var score = {
		'likes': parseInt(document.getElementsByClassName("like-button-renderer-like-button")[0].getElementsByClassName("yt-uix-button-content")[0].innerHTML.replace(/,/g, ""), 10),
		'dislikes': parseInt(document.getElementsByClassName("like-button-renderer-dislike-button")[0].getElementsByClassName("yt-uix-button-content")[0].innerHTML.replace(/,/g, ""), 10)
	}
	return score;
}

function calcScore(likes) {
	var score = 0;
	if (likes.likes == 0 || likes.dislikes == 0) {
		score = "N/A";
	} else {
		var ratio = likes.likes / (likes.likes + likes.dislikes);
		score = Math.log(ratio) - Math.log(1-ratio); //logit
		score = score.toFixed(2);
	}
	return score;
}

function setScore(score) {
	var elScore = document.getElementsByClassName("watch-view-count")[0];
	elScore.innerHTML = elScore.innerHTML + " (" + score + ")";
}

main();