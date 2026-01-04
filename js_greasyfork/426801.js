// ==UserScript==
// @name         Randomizer
// @version      0.2
// @match        *://randomizer.shilov.dev/*
// @description  Predictable winner generation for https://vk.com/app4938347
// @author       Kaimi
// @homepage     https://kaimi.io/2016/01/tampering-vk-contest-results/
// @namespace    https://greasyfork.org/users/228137
// @license      GPLv3
// @downloadURL https://update.greasyfork.org/scripts/426801/Randomizer.user.js
// @updateURL https://update.greasyfork.org/scripts/426801/Randomizer.meta.js
// ==/UserScript==

var bReplacePhoto = false; // Replace photo of the winner with the provided URL
var winnersList =
[
	['Максим Антонов', 'https://pp.userapi.com/c638823/v638823253/43120/RuiiVVlULKc.jpg'],
	['Петр Андреев', 'https://pp.userapi.com/c638823/v638823253/43120/RuiiVVlULKc.jpg'],
	['Илья Новиков', 'https://pp.userapi.com/c638823/v638823253/43120/RuiiVVlULKc.jpg']
];

var getWinnerHTMLPtr = getWinnerHTML;

getWinnerHTML = function(winner)
{
	if(winnersList.length > 0)
	{
		var currentWinner = winnersList.shift();
		var userName = currentWinner[0].split(" ");

		winner.first_name = userName[0];
		winner.last_name = userName[1];

		if(bReplacePhoto)
			winner.photo_50 = currentWinner[1];
	}

	return getWinnerHTMLPtr(winner);
};