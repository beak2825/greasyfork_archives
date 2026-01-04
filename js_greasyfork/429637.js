// ==UserScript==
// @name         TMVN Coefficients Transfer
// @namespace    https://trophymanager.com
// @version      1
// @description  Trophymanager: aggregate the amount of money bought and sold players of the highest leagues of the countries. You can configure the number of countries and seasons to aggregate. The larger the number, the slower the performance. This is a gift for Voohan.
// @include      https://trophymanager.com/international-cup/coefficients/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/429637/TMVN%20Coefficients%20Transfer.user.js
// @updateURL https://update.greasyfork.org/scripts/429637/TMVN%20Coefficients%20Transfer.meta.js
// ==/UserScript==

(function () {
	'use strict';

	const APPLICATION_PARAM = {
		DEFAULT_TOP_COUNT: 10,
		TOP_COUNT_LOCAL_STORAGE_KEY: "TMVN_COEFFICIENTS_TRANSFER_TOP_COUNT",
		DEFAULT_SEASON_COUNT: 3,
		SEASON_COUNT_LOCAL_STORAGE_KEY: "TMVN_COEFFICIENTS_TRANSFER_SEASON_COUNT",
	}
	const CONTROL_ID = {
		INPUT_TOP_COUNT: 'tmvn_coefficients_transfer_script_input_top_count',
		BUTTON_TOP_COUNT: 'tmvn_coefficients_transfer_script_button_top_count_set',
		INPUT_SEASON_COUNT: 'tmvn_coefficients_transfer_script_input_season_count',
		BUTTON_SEASON_COUNT: 'tmvn_coefficients_transfer_script_button_season_count_set',
	}
	const APPLICATION_COLOR = {
		NATIONAL: 'Aqua',
		SOLD: 'Yellow',
	}

	var topCount,
	seasonCount,
	currentSeason;

	topCount = localStorage.getItem(APPLICATION_PARAM.TOP_COUNT_LOCAL_STORAGE_KEY);
	if (topCount == null || topCount == "") {
		topCount = APPLICATION_PARAM.DEFAULT_TOP_COUNT;
	}
	seasonCount = localStorage.getItem(APPLICATION_PARAM.SEASON_COUNT_LOCAL_STORAGE_KEY);
	if (seasonCount == null || seasonCount == "") {
		seasonCount = APPLICATION_PARAM.DEFAULT_SEASON_COUNT;
	}
	currentSeason = $('#top_menu a[class="none white small"]')[0].innerText.split(/(\s+)/)[2];

	var symbolArr = [];
	var nationalMap = new Map();
	var nationalTrArr = $('div#tab0 table.border_bottom tr');
	for (let i = 1; i < nationalTrArr.length; i++) {
		let tr = nationalTrArr[i];
		let symbol = tr.children[1].children[0].href.split('/')[4];
		let name = tr.children[1].innerText.trim();
		symbolArr.push(symbol);
		let national = {
			Name: name,
			Bought: 0,
			Sold: 0,
		}
		nationalMap.set(symbol, national);
	}

	var ajaxCount,
	ajaxTotal;
	if (symbolArr.length > 0 && topCount > 0 && seasonCount > 0) {
		ajaxCount = 0;
		ajaxTotal = (topCount < symbolArr.length ? topCount : symbolArr.length) * (seasonCount < currentSeason ? seasonCount : currentSeason);

		for (let i = 0; i < topCount && i < symbolArr.length; i++) {
			let j = 0;
			let season = currentSeason;
			while (j < seasonCount && season > 0) {
				$.ajax('https://trophymanager.com/history/league/' + symbolArr[i] + '/1/1/transfers/' + season, {
					type: "GET",
					dataType: 'html',
					crossDomain: true,
					success: function (response) {
						let bought,
						sold;

						let table = $('div.box_body table', response)[2];
						let tdArr = $('td', table);
						bought = tdArr[0].children[0].innerText.replace(/,/g, '');
						sold = tdArr[1].children[0].innerText.replace(/,/g, '');
						let national = nationalMap.get(symbolArr[i]);
						national.Bought += Math.round(parseFloat(bought) * 10) / 10;
						national.Sold += Math.round(parseFloat(sold) * 10) / 10;

						ajaxCount++;
					}
				});
				j++;
				season--;
			}
		}
	}

	var myInterval = setInterval(append, 1000);
	function append() {
		if (!(ajaxTotal > 0 && ajaxCount == ajaxTotal)) {
			return;
		}
		clearInterval(myInterval);

		present();

		try {
			$('.banner_placeholder.rectangle')[0].parentNode.removeChild($('.banner_placeholder.rectangle')[0]);
		} catch (err) {}
	}

	function present() {
		let summaryTransfer =
			"<div class=\"box\">" +
			"<div class=\"box_head\">" +
			"<h2 class=\"std\">SUMMARY Transfer (M)</h2>" +
			"</div>" +
			"<div class=\"box_body\">" +
			"<div class=\"box_shadow\"></div>" +
			"<div id=\"summaryTransfer_content\" class=\"content_menu\"></div>" +
			"<h3>CONFIG</h3>" +
			"<table>" +
			"<tr>" +
			"<td>" +
			"<span style='display: inline-block;'><input id='" + CONTROL_ID.INPUT_TOP_COUNT + "' type='text' class='embossed' style='width: 150px; line-height: 100%; padding: 3px 3px 4px 3px;' placeholder='From top country'></span>" +
			"</td>" +
			"<td>" +
			"<span id='" + CONTROL_ID.BUTTON_TOP_COUNT + "' class='button' style='margin-left: 3px;'><span class='button_border'>Top Count</span></span>" +
			"</td>" +
			"</tr>" +
			"<tr>" +
			"<td>" +
			"<span style='display: inline-block;'><input id='" + CONTROL_ID.INPUT_SEASON_COUNT + "' type='text' class='embossed' style='width: 150px; line-height: 100%; padding: 3px 3px 4px 3px;' placeholder='From current season'></span>" +
			"</td>" +
			"<td>" +
			"<span id='" + CONTROL_ID.BUTTON_SEASON_COUNT + "' class='button' style='margin-left: 3px;'><span class='button_border'>Season Count</span></span>" +
			"</td>" +
			"</tr>" +
			"</table>" +
			"</div>" +
			"<div class=\"box_footer\">" +
			"<div></div>" +
			"</div>" +
			"</div>";
		$(".column3_a").append(summaryTransfer);

		/*** TOP COUNT ***/
		document.getElementById(CONTROL_ID.BUTTON_TOP_COUNT).addEventListener('click', (e) => {
			setTopCount();
		});
		$('#' + CONTROL_ID.INPUT_TOP_COUNT).val(topCount);
		/*********/

		/*** SEASON COUNT ***/
		document.getElementById(CONTROL_ID.BUTTON_SEASON_COUNT).addEventListener('click', (e) => {
			setSeasonCount();
		});
		$('#' + CONTROL_ID.INPUT_SEASON_COUNT).val(seasonCount);
		/*********/

		showSummaryTransfer();
	}

	function showSummaryTransfer() {
		var content = "<table>" +
			"<tr style='color:Orange;'><th align='right'>#</th><th>National</th><th align='right'>Bought</th><th align='right'>Sold</th><th align='right'>Balance</th></tr>";
		let rowCount = 0;
		for (let i = 0; i < topCount && i < symbolArr.length; i++) {
			let national = nationalMap.get(symbolArr[i]);

			rowCount++;
			let classOdd = "";
			if ((rowCount % 2) == 1) {
				classOdd = "class='odd'";
			}
			content +=
			'<tr ' + classOdd + '><td align="right">' + (i + 1) + '. ' +
			'</td><td style="color:' + APPLICATION_COLOR.NATIONAL + ';">' + national.Name +
			'</td><td align="right">' + national.Bought.toFixed(1).replace(/\B(?=(\d{3})+(?!\d))/g, ",") +
			'</td><td align="right" style="color:' + APPLICATION_COLOR.SOLD + ';">' + national.Sold.toFixed(1).replace(/\B(?=(\d{3})+(?!\d))/g, ",") +
			'</td><td align="right">' + (national.Bought - national.Sold).toFixed(1).replace(/\B(?=(\d{3})+(?!\d))/g, ",") +
			'</td></tr>';
		}
		content += "</table>";
		$("#summaryTransfer_content").append(content);
	}

	function setTopCount() {
		let topCount = $('#' + CONTROL_ID.INPUT_TOP_COUNT)[0].value;
		if (topCount == '') {
			localStorage.removeItem(APPLICATION_PARAM.TOP_COUNT_LOCAL_STORAGE_KEY);
		} else if (isNaN(topCount) || topCount <= 0) {
			alert('Top count must be positive integer');
		} else {
			localStorage.setItem(APPLICATION_PARAM.TOP_COUNT_LOCAL_STORAGE_KEY, topCount);
			alert('Set successful, please refresh');
		}
	}

	function setSeasonCount() {
		let seasonCount = $('#' + CONTROL_ID.INPUT_SEASON_COUNT)[0].value;
		if (seasonCount == '') {
			localStorage.removeItem(APPLICATION_PARAM.SEASON_COUNT_LOCAL_STORAGE_KEY);
		} else if (isNaN(seasonCount) || seasonCount <= 0) {
			alert('Season count must be positive integer');
		} else {
			localStorage.setItem(APPLICATION_PARAM.SEASON_COUNT_LOCAL_STORAGE_KEY, seasonCount);
			alert('Set successful, please refresh');
		}
	}
})();