// ==UserScript==
// @name         TMVN League Squad
// @namespace    https://trophymanager.com
// @version      5
// @description  Trophymanager: using with 'TMVN Squad Value' script to get value of club. The info is for reference only and maybe out of date. You need click on club name to open squad page for update info or click on link in the title of table
// @match        https://trophymanager.com/league/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/414474/TMVN%20League%20Squad.user.js
// @updateURL https://update.greasyfork.org/scripts/414474/TMVN%20League%20Squad.meta.js
// ==/UserScript==

(function () {
	'use strict';

	const APPLICATION_PARAM = {
		DEFAULT_SHOW_MODE: "100",
		LOCAL_STORAGE_KEY: "TMVN_LEAGUE_SQUAD_SHOW_MODE",
		SHOW_MODE_ARR: ["111", "110", "101", "011", "100", "010", "001"]
	}

	try {
		$('.banner_placeholder.rectangle')[0].parentNode.removeChild($('.banner_placeholder.rectangle')[0]);
	} catch (err) {}

	var clubMap = new Map();
	$('#overall_table td').each(function () {
		let clubId = $(this).children('a').attr('club_link');
		if (clubId) {
			let clubName = $(this).children('a')[0].innerHTML;
			clubMap.set(clubId, clubName);
		}
	});

	var squadValue =
		"<div class=\"box\">" +
		"<div class=\"box_head\">" +
		"<h2 class=\"std\"><a href='#' class='fullsquadvalue_link'>Squad Value</a></h2>" +
		"</div>" +
		"<div class=\"box_body\">" +
		"<div class=\"box_shadow\"></div>" +
		"<span style='display: inline-block;'><input id='tm_script_league_squad_value_input_show_mode' type='text' class='embossed' style='min-width: 100px; line-height: 100%; padding: 3px 3px 4px 3px;' placeholder='Show Mode'></span>" +
		"<span id='tm_script_league_squad_value_button_show_mode_set' class='button' style='margin-left: 3px;'><span class='button_border'>Set show mode</span></span>" +
		"<h3>FULL</h3>" +
		"<div id=\"fullSquad_content\" class=\"content_menu\"></div>" +
		"<h3>OVER 21</h3>" +
		"<div id=\"o21Squad_content\" class=\"content_menu\"></div>" +
		"<h3>UNDER 21</h3>" +
		"<div id=\"u21Squad_content\" class=\"content_menu\"></div>" +
		"</div>" +
		"<div class=\"box_footer\">" +
		"<div></div>" +
		"</div>" +
		"</div>";
	$(".column3_a").append(squadValue);

	document.getElementById('tm_script_league_squad_value_button_show_mode_set').addEventListener('click', (e) => {
		setShowMode();
	});
	let showMode = localStorage.getItem(APPLICATION_PARAM.LOCAL_STORAGE_KEY);
	if (showMode == null || showMode == "") {
		showMode = APPLICATION_PARAM.DEFAULT_SHOW_MODE;
	}
	$('#tm_script_league_squad_value_input_show_mode').val(showMode);
	let invidualMode = showMode.split("");
	if (invidualMode[0] == "1") {
		showFullSquad();
	}
	if (invidualMode[1] == "1") {
		showOver21Squad();
	}
	if (invidualMode[2] == "1") {
		showUnder21Squad();
	}

	function showFullSquad() {
		let fullSquad_content = "<table>" +
			"<tr><th>Club</th><th align='right'>BP(M)</th><th align='right'>WA(K)</th><th align='right'>#</th></tr>";

		let today = new Date();
		let clubLinks = [];
		let rowCount = 0;
		clubMap.forEach((value, key) => {
			rowCount++;
			let classOdd = "";
			if ((rowCount % 2) == 1) {
				classOdd = "class='odd'";
			}
			let data = localStorage.getItem(key + "_SQUAD_VALUE");
			if (data !== "" && data !== undefined && data !== null) {
				let clubValue = JSON.parse(data);
				let updateTime = clubValue.Time;
				if (updateTime !== undefined && Math.ceil(Math.abs(today - new Date(updateTime)) / (1000 * 60 * 60 * 24)) < 15) {
					fullSquad_content += "<tr " + classOdd + "><td><span onclick = \"window.open(\'https:\/\/trophymanager.com\/club\/" + key + "\/squad\/\')\">" + value + "</span></td><td align='right'>";
				} else {
					fullSquad_content += "<tr " + classOdd + "><td><span style='color:Orange;' onclick = \"window.open(\'https:\/\/trophymanager.com\/club\/" + key + "\/squad\/\')\">" + value + "</span></td><td align='right'>";
				}

				fullSquad_content += (clubValue.BP !== undefined ? (clubValue.BP / 1000000).toFixed(1) : "") +
				"</td><td align='right'><span style='color:Orange;'>" +
				(clubValue.Wage !== undefined ? (clubValue.Wage / 1000).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",") : "") +
				"</span></td><td align='right'>" +
				(clubValue.Count !== undefined ? clubValue.Count : "") +
				"</td></tr>";
			} else {
				fullSquad_content += "<tr " + classOdd + "><td><span style='color:Orange;' onclick = \"window.open(\'https:\/\/trophymanager.com\/club\/" + key + "\/squad\/\')\">" + value + "</span></td><td></td><td></td><td></td></tr>";
			}
			clubLinks.push("https://trophymanager.com/club/" + key + "/squad/");
		});

		fullSquad_content += "</table>";

		$("#fullSquad_content").append(fullSquad_content);
		$('a.fullsquadvalue_link').click(function (e) {
			e.preventDefault();
			clubLinks.forEach(link => {
				window.open(link);
			});
		});
	}

	function showOver21Squad() {
		let o21Squad_content = "<table>" +
			"<tr><th>Club</th><th align='right'>BP(M)</th><th align='right'>WA(K)</th><th align='right'>#</th></tr>";

		let rowCount = 0;
		clubMap.forEach((value, key) => {
			rowCount++;
			let classOdd = "";
			if ((rowCount % 2) == 1) {
				classOdd = "class='odd'";
			}
			let data = localStorage.getItem(key + "_O21_SQUAD_VALUE");
			if (data !== "" && data !== undefined && data !== null) {
				let clubValue = JSON.parse(data);
				o21Squad_content += "<tr " + classOdd + "><td>" + value + "</td><td align='right'>" +
				(clubValue.BP !== undefined ? (clubValue.BP / 1000000).toFixed(1) : "") +
				"</td><td align='right'><span style='color:Orange;'>" +
				(clubValue.Wage !== undefined ? (clubValue.Wage / 1000).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",") : "") +
				"</span></td><td align='right'>" +
				(clubValue.Count !== undefined ? clubValue.Count : "") +
				"</td></tr>";
			} else {
				o21Squad_content += "<tr " + classOdd + "><td>" + value + "</td><td></td><td></td><td></td></tr>";
			}

		});

		o21Squad_content += "</table>";

		$("#o21Squad_content").append(o21Squad_content);
	}

	function showUnder21Squad() {
		let u21Squad_content = "<table>" +
			"<tr><th>Club</th><th align='right'>BP(M)</th><th align='right'>WA(K)</th><th align='right'>#</th></tr>";

		let rowCount = 0;
		clubMap.forEach((value, key) => {
			rowCount++;
			let classOdd = "";
			if ((rowCount % 2) == 1) {
				classOdd = "class='odd'";
			}
			let data = localStorage.getItem(key + "_U21_SQUAD_VALUE");
			if (data !== "" && data !== undefined && data !== null) {
				let clubValue = JSON.parse(data);
				u21Squad_content += "<tr " + classOdd + "><td>" + value + "</td><td align='right'>" +
				(clubValue.BP !== undefined ? (clubValue.BP / 1000000).toFixed(1) : "") +
				"</td><td align='right'><span style='color:Orange;'>" +
				(clubValue.Wage !== undefined ? (clubValue.Wage / 1000).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",") : "") +
				"</span></td><td align='right'>" +
				(clubValue.Count !== undefined ? clubValue.Count : "") +
				"</td></tr>";
			} else {
				u21Squad_content += "<tr " + classOdd + "><td>" + value + "</td><td></td><td></td><td></td></tr>";
			}

		});

		u21Squad_content += "</table>";

		$("#u21Squad_content").append(u21Squad_content);
	}

	function setShowMode() {
		let showMode = $('#tm_script_league_squad_value_input_show_mode')[0].value;
		if (showMode == '') {
			localStorage.removeItem(APPLICATION_PARAM.LOCAL_STORAGE_KEY);
		} else if (!APPLICATION_PARAM.SHOW_MODE_ARR.includes(showMode)) {
			alert('Allowable show mode values: ' + APPLICATION_PARAM.SHOW_MODE_ARR);
		} else {
			localStorage.setItem(APPLICATION_PARAM.LOCAL_STORAGE_KEY, showMode);
			alert('Set successful, please refresh');
		}
	}
})();
