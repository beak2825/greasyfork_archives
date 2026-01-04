// ==UserScript==
// @name         World Language Games - Automation for "Ping-Pong" (Completely Natural)
// @license      MIT
// @namespace    https://github.com/engelthehyp/Automation-for-World-Language-Games
// @version      2.1
// @description  Sends the signal for correct answer no matter what answer is picked (Correct Answer, Wrong Answer, No Answer) and automatically ends the game once 32 to 35 vollies have been made.
// @author       https://www.github.com/engelthehyp
// @match        *://wlangames.net/PingPong.php*
// @icon         https://www.google.com/s2/favicons?domain=wlangames.net
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/435959/World%20Language%20Games%20-%20Automation%20for%20%22Ping-Pong%22%20%28Completely%20Natural%29.user.js
// @updateURL https://update.greasyfork.org/scripts/435959/World%20Language%20Games%20-%20Automation%20for%20%22Ping-Pong%22%20%28Completely%20Natural%29.meta.js
// ==/UserScript==

(function () {
	'use strict';

	const rightAnswer = window.WrongAnswer - 1;
	const wrongAnswer = window.WrongAnswer;
	const turnsToTake = getRandomInt(32, 35);

	window.CheckAnswer = function () {
		const turnsTaken = document.getElementById('Guesses').innerHTML;
		return parseInt(turnsTaken) < turnsToTake ? rightAnswer : wrongAnswer;
	};

	function getRandomInt(min, max) {
		min = Math.ceil(min);
		max = Math.floor(max);
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}
})();
