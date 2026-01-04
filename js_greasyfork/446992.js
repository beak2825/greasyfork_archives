// ==UserScript==
// @name         World Language Games - Automation for "Millions" (DEFUNCT)
// @license      MIT
// @namespace    https://github.com/engelthehyp/Automation-for-World-Language-Games
// @version      2.1
// @description  This script will automatically launch and complete the game "Millions" on World Language Games, while adding a random duration between 1:00 and 3:59, and 0 to 4 wrong guesses. PLEASE NOTE - This script is defunct and was made for an older version of Millions that has since been updated.
// @author       https://www.github.com/engelthehyp
// @match        *://wlangames.net/PlayGame.php?Game=Millions4Pts.php*
// @icon         https://www.google.com/s2/favicons?domain=wlangames.net
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/446992/World%20Language%20Games%20-%20Automation%20for%20%22Millions%22%20%28DEFUNCT%29.user.js
// @updateURL https://update.greasyfork.org/scripts/446992/World%20Language%20Games%20-%20Automation%20for%20%22Millions%22%20%28DEFUNCT%29.meta.js
// ==/UserScript==

/**
 * gotoCongrats() is the command which completes the game.
 * It does record the time, so if your teacher sees that you played your games in 0 seconds,
 * they would be aufully suspicious. I've fixed this problem.
 */

(function () {
	'use strict';

	const wrongGuessCount = getRandomInt(0, 4);
	const minutesPlayed = getRandomInt(1, 3);
	const secondsPlayed = getRandomInt(0, 59);

	const timeElementsAndAmounts = {
		TotalMins: minutesPlayed,
		Minutes: minutesPlayed,
		TotalSecs: secondsPlayed,
		Seconds: secondsPlayed,
		pTimeCenter: formatTime(minutesPlayed, secondsPlayed),
	};

	const element = document.getElementById;

	document.PlayBingo.JulianTime.value = new Date().getTime();
	document.PlayBingo.pGuessLabel.value = String(wrongGuessCount);

	Object.entries(timeElementsAndAmounts).forEach(
		([id, amount]) => (element(id).value = amount)
	);

	function formatTime(minutes, seconds) {
		return `${minutes}:${String(seconds).padStart(2, '0')}`;
	}

	function getRandomInt(min, max) {
		min = Math.ceil(min);
		max = Math.floor(max);
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}
})();
