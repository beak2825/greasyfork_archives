// ==UserScript==
// @name        Hide Chess.com Opponent Ratings
// @description Hide ratings in games, and on your homepage.  For those who don't want a constant reminder that their opponent is better (or worse) than them.
// @namespace   http://xyxyx.org/
// @include     http://www.chess.com/*
// @version     0.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/490/Hide%20Chesscom%20Opponent%20Ratings.user.js
// @updateURL https://update.greasyfork.org/scripts/490/Hide%20Chesscom%20Opponent%20Ratings.meta.js
// ==/UserScript==

try {

	var elements = document.getElementsByClassName("playerrating");
	if (elements) {
		for (var i = 0; i < elements.length; i++) {
			elements.item(i).style.visibility = 'hidden';
		}
	}

	var getElementByXpath = function (path) {
		return document.evaluate(path, document, null, 9, null).singleNodeValue;
	};

	var linkPrefix    =  "http://www.chess.com/members/view/";
	var linkPrefixLen = linkPrefix.length;
	var ratingPattern = / \([0-9]+\)/;

	elements = document.getElementById("mv-table-c16").getElementsByTagName("a");
	// console.log("Found " + elements.length);
	if (elements) {
		for (var i = 0; i < elements.length; i++) {
			var link = elements.item(i);
			//console.log("link = " + link);
			if (link && link.href.substring(0, linkPrefixLen) === linkPrefix) {
				var next = link.nextSibling;
				if (next && next.data) {
					//console.log("sibling " + link.href + ": " + next.data);
					if (ratingPattern.test(next.data)) {
						next.data = next.data.replace(ratingPattern, "");
					}
				}
			}
		}

	}

} catch(e) {
   console.log("Hide chess.com opponent ratings failed: " + e);
}