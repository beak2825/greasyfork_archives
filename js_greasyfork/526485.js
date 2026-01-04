// ==UserScript==
// @name         Torn Slots Streak
// @namespace    http://tampermonkey.net/
// @version      1.10
// @description  Shows slots win / loss streak in Torn
// @author       ChuckFlorist [3135868]
// @match  https://www.torn.com/page.php?sid=slots
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/526485/Torn%20Slots%20Streak.user.js
// @updateURL https://update.greasyfork.org/scripts/526485/Torn%20Slots%20Streak.meta.js
// ==/UserScript==
(function() {

    'use strict';
	const URL_SLOTS = "https://www.torn.com/page.php?sid=slots";
	var currentToken = "";
	var isWinStreak = false;
	var nStreak = 0;

	function displayStreak() {
		var tokens = document.getElementById('tokens');
		var moneyWon = document.getElementById('moneyWon');
		var streakSpan = document.createElement('span');
		tokens.parentNode.appendChild(streakSpan);
		streakSpan.textContent = "(No streak)";

		var observer = new MutationObserver(function(mutationsList, observer) {
			for (var mutation of mutationsList) {
				if (mutation.type === 'childList') {
					if (tokens.textContent != currentToken) { // is new spin ?
						currentToken = tokens.textContent;

						let isWin = (parseInt(moneyWon.textContent, 10) > 0);
						nStreak = (isWin === isWinStreak) ? nStreak + 1 : 1;
						isWinStreak = isWin;
						streakSpan.textContent = "(" + nStreak + (isWin ? " wins)" : " losses)");
					}
				}
			}
		});

		var config = { childList: true };
		observer.observe(moneyWon, config);
	}

	setTimeout(function() {
		if (window.location.href.startsWith(URL_SLOTS)) {
			displayStreak();
		}
	}, 1000); 
})();