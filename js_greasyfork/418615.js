// ==UserScript==
// @name         TMVN InternationalCup Champion
// @namespace    https://trophymanager.com
// @version      5
// @description  Trophymanager: count the number of championships by teams in current tournament, to see successful teams on the continental arena.
// @include      /https://trophymanager.com/international-cup/\d/
// @match        https://trophymanager.com/international-cup/
// @match        https://trophymanager.com/international-cup
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/418615/TMVN%20InternationalCup%20Champion.user.js
// @updateURL https://update.greasyfork.org/scripts/418615/TMVN%20InternationalCup%20Champion.meta.js
// ==/UserScript==

(function () {
	'use strict';

	const LEAGUE_CHAM_TEXT = ['Champion of UETA Champions Cup', 'Champion of FITA RoW League', 'Champion of FATA Liberty League'];
	const CUP_CHAM_TEXT = ['Champion of UETA Cup', 'Champion of FITA RoW Cup', 'Champion of FATA Copa Americana'];

	var clubLeagueMap = new Map();
	var clubCupMap = new Map();
	var clubFlagMap = new Map();
	var clubMap = new Map();
	var sortMap = new Map();

	$('a[club_link]').each(function () {
		let clubId = this.getAttribute("club_link");
		if (!clubMap.has(clubId)) {
			clubMap.set(clubId, this.innerText);
		}
	});

	var clubCount = clubMap.size;

	clubMap.forEach((value, key) => {
		$.ajax('https://trophymanager.com/club/' + key, {
			type: "GET",
			dataType: 'html',
			crossDomain: true,
			success: function (response) {
				var hasPro = $('.column2_a a img[class="pro_icon"]', response).length == 0 ? false : true;
				let leagueCount = 0;
				let cupCount = 0;
				if (hasPro) { //search by image will be more accurate
					let divArr = $('.column3_a .box_body .std .clearfix', response);
					for (let i = 0; i < divArr.length; i++) {
						let style = divArr[i].children[0].getAttribute("style");
						if (style.indexOf('/1_75pct.png') > -1 || style.indexOf('/1_40pct.png') > -1) {
							leagueCount++;
						} else if (style.indexOf('/4_75pct.png') > -1 || style.indexOf('/4_40pct.png') > -1) {
							cupCount++;
						}
					}
				} else {
					let liArr = $('.zebra.nopro_list li', response);
					for (let i = 0; i < liArr.length; i++) {
						let liText = liArr[i].innerText;
						if (LEAGUE_CHAM_TEXT.includes(liText)) {
							leagueCount++;
						} else if (CUP_CHAM_TEXT.includes(liText)) {
							cupCount++;
						}
					}
				}

				let flagHTML = $('.country_link:first', response)[0].innerHTML;
				clubFlagMap.set(key, flagHTML);
				clubLeagueMap.set(key, leagueCount);
				clubCupMap.set(key, cupCount);

				if (leagueCount * 1000 + cupCount > 0) {
					sortMap.set(key, leagueCount * 1000 + cupCount);
				}
			},
			error: function (e) {}
		});
	});

	var myInterval = setInterval(append, 1000);

	function append() {
		if (clubLeagueMap.size < clubCount || clubCupMap.size < clubCount) {
			return;
		}
		clearInterval(myInterval);

		sortMap[Symbol.iterator] = function  * () {
			yield * [...this.entries()].sort((a, b) => b[1] - a[1]);
		}

		/*APPEND CHAMPION HISTORY TABLE*/
		let champion =
			"<div class=\"box\">" +
			"<div class=\"box_head\">" +
			"<h2 class=\"std\">ACTIVE CHAMPION</h2>" +
			"</div>" +
			"<div class=\"box_body\">" +
			"<div class=\"box_shadow\"></div>" +
			"<div id=\"champion_content\" class=\"content_menu\"></div>" +
			"</div>" +
			"<div class=\"box_footer\">" +
			"<div></div>" +
			"</div>" +
			"</div>";
		$(".column3_a .box")[0].innerHTML = champion + $(".column3_a .box")[0].innerHTML;

		let champion_content = "<table>" +
			"<tr><th>#</th><th></th><th>Club</th><th align='right'>League</th><th align='right'>Cup</th></tr>";
		let rowCount = 0;
		for (let[key, value]of sortMap) {
			rowCount++;
			let classOdd = "";
			if ((rowCount % 2) == 1) {
				classOdd = "class='odd'";
			}
			let flagHTML = clubFlagMap.get(key);
			let clubName = clubMap.get(key);
			let leagueCount = clubLeagueMap.get(key);
			let cupCount = clubCupMap.get(key);

			champion_content += "<tr " + classOdd + ">" +
			"<td>" + rowCount + "</td>" +
			"<td>" + flagHTML + "</td>" +
			"<td><span onclick = \"window.open(\'https:\/\/trophymanager.com\/club\/" + key + "\')\">" + clubName + "</td>" +
			"<td align='right'>" + (leagueCount > 0 ? leagueCount : "") + "</td>" +
			"<td align='right'>" + (cupCount > 0 ? cupCount : "") + "</td>" +
			"</tr>";
		}
		champion_content += "</table>";
		$("#champion_content").append(champion_content);
	}
})();
