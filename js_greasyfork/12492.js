// ==UserScript==
// @name        Steam - Download remaining card drops as CSV file
// @namespace   valacar.steam.card-csv
// @description Download remaining card drops as CSV file
// @match       http://steamcommunity.com/id/*/badges/
// @match       http://steamcommunity.com/id/*/badges/?sort=*
// @version     1.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/12492/Steam%20-%20Download%20remaining%20card%20drops%20as%20CSV%20file.user.js
// @updateURL https://update.greasyfork.org/scripts/12492/Steam%20-%20Download%20remaining%20card%20drops%20as%20CSV%20file.meta.js
// ==/UserScript==

var b = document.querySelectorAll('.badge_row');

console.log('Found ' + b.length + ' Steam badges.')

var csv = "";

if (b) {
	for (var i = 0; i < b.length; ++i)
	{
		var link = b[i].querySelector('a.badge_row_overlay');
		if (link && link.href)
		{
			var appid = link.href.match(/gamecards\/(\d+)\/$/);
			if (appid)
			{
				var gameTitleEl = b[i].querySelector('.badge_title')
				var cardsRemainingEl = b[i].querySelector('.badge_title_stats .progress_info_bold');

				if (gameTitleEl && cardsRemainingEl)
				{
					var gameTitleText = gameTitleEl.firstChild.nodeValue.trim();
					var cardsRemainingText = cardsRemainingEl.textContent.trim();
					var numCardsRemaining = cardsRemainingText.match(/^(\d+)\s+card drops? remaining/)

					if (numCardsRemaining)
					{
						csv += (numCardsRemaining[1] + ',' + appid[1] + ',' + gameTitleText + '\n');
						// console.log(appid[1] + ',' + gameTitleText + ',' + cardsRemainingText)
					}
					else
					{
						// console.log('app id ' + appid[1] + ' -> ' + cardsRemainingText)
					}
				}
			}
			else
			{
				// console.log('app id failed for: ' + link.href)
			}
		}
		else
		{
			console.log("can't find a.badge_row_overlay")
		}
	}

	console.log('--- CSV file format: cards_remaining,app_id,game_title')
	console.log(csv);
	console.log('---')

	var downloadLink = document.createElement('a');
	downloadLink.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(csv));
	downloadLink.setAttribute('download', 'steam-cards-remaining.csv');
	downloadLink.textContent = '[Download steam-cards-remaining.csv]';

	document.querySelector('.profile_badges_header').appendChild(downloadLink);

}

