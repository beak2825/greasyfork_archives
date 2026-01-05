// ==UserScript==
// @name         MyAnimeList Score Hider
// @namespace    https://example.com
// @version      2016.11.05
// @description  MAL scores may be a good indicator, but the nitty-gritty stuff is cancerous. Reduce the meaningless score to something easy to understand.
// @author       Bananaman
// @match        https://myanimelist.net/anime/*
// @match        https://myanimelist.net/anime.php?id=*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/24589/MyAnimeList%20Score%20Hider.user.js
// @updateURL https://update.greasyfork.org/scripts/24589/MyAnimeList%20Score%20Hider.meta.js
// ==/UserScript==

(function($) {
	var $score = $(".score");
	
	// Get score, store in variable and strip whitespace.
	var scoreText = $score.text();
	scoreText = scoreText.replace(/\s+/g, '');
	
	// Remove the score from the DOM.
	$score.text("");
	
	// Get the CSS done now.
	$score.css("cursor", "pointer");
	
	// Figure out verdict for show.
	var verdict;
	switch (true) {
		case (scoreText >= 7):
			verdict = "Gud";
			break;
		case (scoreText >= 5):
			verdict = "Meh";
			break;
		default:
			verdict = "Bad";
			break;
	};
	
	// Insert the divs.
	var $verdictDiv = $("<div>");
	$verdictDiv.attr("id", "verdict");
	$verdictDiv.text(verdict);
	$score.append($verdictDiv);
	
	var $scoreDiv = $("<div>");
	$scoreDiv.attr("id", "score");
	$scoreDiv.css({
		"display": "none"
	});
	$scoreDiv.text(scoreText)
	$score.append($scoreDiv);
	
	// Add the event listener.
	$score.on("click", "div", function() {
		$(this).hide().siblings().show();
	})
})(jQuery)