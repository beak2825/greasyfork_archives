// ==UserScript==
// @name         fighters
// @namespace    https://greasyfork.org/en/users/10060-lisugera
// @version      0.1
// @description  type fighters() in console
// @author       lisugera
// @match        https://www.erepublik.com/*/military/battlefield/*
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/381078/fighters.user.js
// @updateURL https://update.greasyfork.org/scripts/381078/fighters.meta.js
// ==/UserScript==

async function fetchData() {
	var fighters = [];
	for (var list = 1; list <= 5; list++) {
		var response = await fetch("https://www.erepublik.com/en/military/battle-console", {
			"credentials": "include",
			"headers": {
				"accept": "application/json, text/plain, */*",
				"accept-language": "en-US",
				"content-type": "application/x-www-form-urlencoded",
				"x-requested-with": "XMLHttpRequest"
			},
			"referrer": "https://www.erepublik.com/en/military/battlefield/" + SERVER_DATA.battleId,
			"referrerPolicy": "same-origin",
			"body": "battleId=" + SERVER_DATA.battleId + "&action=battleStatistics&round=" + SERVER_DATA.zoneId + "&division=" + SERVER_DATA.division + "&type=damage&leftPage=" + list + "&rightPage=" + list + "&_token=" + SERVER_DATA.csrfToken,
			"method": "POST",
			"mode": "cors"
		});
		var data = await response.json();

		for(var key in data[SERVER_DATA.leftBattleId].fighterData) {
			fighters.push(data[SERVER_DATA.leftBattleId].fighterData[key]);
		}
	}
	return fighters;
}

async function fighters() {
	var text = "";
	var data = await fetchData();
	for(var key in data) {
		text += data[key].citizenName + "\t" + data[key].raw_value + "\n";
	}
	console.log(text);
}

if(!unsafeWindow.fighters)
{
    unsafeWindow.fighters = fighters;
}