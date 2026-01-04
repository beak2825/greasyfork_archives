// ==UserScript==
// @name         TMVN Club Transfer
// @namespace    https://trophymanager.com
// @version      13
// @description  Trophymanager: transfer statistics of all seasons, the most expensive players, the most successful trades, revenue from the academy... It made by request of Vasco Vitkovice, Tirana Smokers, Bones and Langevåg IL.
// @include      https://trophymanager.com/club/*
// @include      https://trophymanager.com/club/*/
// @exclude      https://trophymanager.com/club/
// @exclude      https://trophymanager.com/club/*/squad/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/419575/TMVN%20Club%20Transfer.user.js
// @updateURL https://update.greasyfork.org/scripts/419575/TMVN%20Club%20Transfer.meta.js
// ==/UserScript==

(function () {
	'use strict';

	const APPLICATION_PARAM = {
		DEFAULT_TOP_COUNT: 10,
		TOP_COUNT_LOCAL_STORAGE_KEY: "TMVN_CLUB_TRANSFER_TOP_COUNT",
		DEFAULT_SEASON_COUNT: 0,
		SEASON_COUNT_LOCAL_STORAGE_KEY: "TMVN_CLUB_TRANSFER_SEASON_COUNT",
		TO_SEASON_LOCAL_STORAGE_KEY: "TMVN_CLUB_TRANSFER_TO_SEASON",
		MIN_PROFIT_LOCAL_STORAGE_KEY: "TMVN_CLUB_TRANSFER_MIN_PROFIT",
		DEFAULT_MIN_PROFIT: -999999,
		MAX_PROFIT_LOCAL_STORAGE_KEY: "TMVN_CLUB_TRANSFER_MAX_PROFIT",
		DEFAULT_MAX_PROFIT: 999999,
		DEFAULT_SHOW_MODE: "11111",
		SHOW_MODE_LOCAL_STORAGE_KEY: "TMVN_CLUB_TRANSFER_SHOW_MODE",
		SEASON_SHOW: 2
	}
	const CLASS_NAME = {
		SUMMARY_TRANSFER: 'tmvn_club_transfer_script_classname_summary_transfer',
		ACADEMY_REVENUE: 'tmvn_club_transfer_script_classname_academy_revenue'
	}
	const CONTROL_ID = {
		INPUT_SHOW_MODE: 'tmvn_club_transfer_script_input_show_mode',
		BUTTON_SHOW_MODE: 'tmvn_club_transfer_script_button_show_mode_set',
		INPUT_TOP_COUNT: 'tmvn_club_transfer_script_input_top_count',
		BUTTON_TOP_COUNT: 'tmvn_club_transfer_script_button_top_count_set',
		INPUT_SEASON_COUNT: 'tmvn_club_transfer_script_input_season_count',
		INPUT_TO_SEASON: 'tmvn_club_transfer_script_input_to_season',
		BUTTON_SEASON_COUNT: 'tmvn_club_transfer_script_button_season_count_set',
		BUTTON_SHOW_ALL_SUMMARY_TRANSFER: 'tmvn_club_transfer_script_button_show_all_summary_transfer',
		BUTTON_SHOW_ALL_ACADEMY_REVENUE: 'tmvn_club_transfer_script_button_show_all_academy_revenue',
		INPUT_MIN_PROFIT: 'tmvn_club_transfer_script_input_min_profit',
		INPUT_MAX_PROFIT: 'tmvn_club_transfer_script_input_max_profit',
		BUTTON_TRADE_PROFIT: 'tmvn_club_transfer_script_button_trade_profit_set',
	}
	const APPLICATION_COLOR = {
		AVERAGE: 'Aqua',
		TOTAL: 'Yellow',
		ONSQUAD: 'Blue',
	}

	var topCount,
	seasonCount,
	toSeason,
	minProfit,
	maxProfit,
	totalTradeBuy,
	totalTradeSell,
	totalTradeProfit,
	totalSquadBuy,
	squadCount;

	seasonCount = localStorage.getItem(APPLICATION_PARAM.SEASON_COUNT_LOCAL_STORAGE_KEY);
	if (seasonCount == null || seasonCount == "") {
		seasonCount = APPLICATION_PARAM.DEFAULT_SEASON_COUNT;
	}

	minProfit = localStorage.getItem(APPLICATION_PARAM.MIN_PROFIT_LOCAL_STORAGE_KEY);
	if (minProfit == null || minProfit == "") {
		minProfit = APPLICATION_PARAM.DEFAULT_MIN_PROFIT;
	}
	maxProfit = localStorage.getItem(APPLICATION_PARAM.MAX_PROFIT_LOCAL_STORAGE_KEY);
	if (maxProfit == null || maxProfit == "") {
		maxProfit = APPLICATION_PARAM.DEFAULT_MAX_PROFIT;
	}

	var boughtArr = [];
	var soldArr = [];
	var tradeArr = [];
	var academySoldMap = new Map();
	var academySummary = [];
	var transferSummary = [];
	var squadPlayerIdArr = [];
	var playerMap = new Map();
	var loadCount = 0;
	var loadDone = false;
	var clubId = location.href.split('/')[4];
	var seasonIds = [];
	$.ajaxSetup({
		async: false
	});
	$.ajax('https://trophymanager.com/history/club/transfers/' + clubId, {
		type: "GET",
		dataType: 'html',
		crossDomain: true,
		success: function (response) {
			let comboSeason = $('#stats_season', response)[0].options;
			for (let i = 0; i < comboSeason.length; i++) {
				seasonIds.push(comboSeason[i].value);
			}
		},
		error: function (e) {}
	});

	$.ajax('https://trophymanager.com/club/' + clubId + '/squad/', {
		type: "GET",
		dataType: 'html',
		crossDomain: true,
		success: function (response) {
			let player = $('a[player_link]', response);
			for (let i = 0; i < player.length; i++) {
				squadPlayerIdArr.push(player[i].getAttribute('player_link'));
			}
		},
		error: function (e) {}
	});
	$.ajaxSetup({
		async: true
	});
	if (seasonCount > 0 && seasonCount < seasonIds.length) {
		toSeason = localStorage.getItem(APPLICATION_PARAM.TO_SEASON_LOCAL_STORAGE_KEY);
		if (toSeason == null || toSeason == "") {
			do {
				seasonIds.pop();
			} while (seasonCount < seasonIds.length);
		} else {
			let fromSeason = toSeason - seasonCount + 1;
			while (fromSeason > seasonIds[seasonIds.length - 1]) {
				seasonIds.pop();
			}
			while (toSeason < seasonIds[0]) {
				seasonIds.shift();
			}
		}
	}

	if (clubId != "" && seasonIds.length > 0) {
		seasonIds.forEach((seasonId) => {
			$.ajax('https://trophymanager.com/history/club/transfers/' + clubId + '/' + seasonId, {
				type: "GET",
				dataType: 'html',
				crossDomain: true,
				success: function (response) {
					let tbl = $('.zebra.hover', response);
					if (tbl.length != 2) {
						return;
					}

					let trBuy = $('tr', tbl[0]);
					let playerId,
					playerName,
					price;

					for (let i = 1; i < trBuy.length; i++) {
						let td = $('td', trBuy[i]);
						if (td.length < 4)
							continue;
						let a = $('a', td[0]);
						if (a.length == 0)
							continue;

						playerName = a[0].innerText;
						playerId = a[0].getAttribute('player_link');
						price = td[3].innerText.replace(/,/g, '');

						setMap(playerId, playerName, seasonId, price, 1);
					}

					let trSell = $('tr', tbl[1]);
					for (let i = 1; i < trSell.length; i++) {
						let td = $('td', trSell[i]);
						if (td.length < 4)
							continue;
						let a = $('a', td[0]);
						if (a.length == 0)
							continue;

						playerName = a[0].innerText;
						playerId = a[0].getAttribute('player_link');
						price = td[3].innerText.replace(/,/g, '');

						setMap(playerId, playerName, seasonId, price, 2);
					}

					let tdArr = $('.zebra.hover td', response);
					if (tdArr.length >= 3) {
						var bought,
						sold,
						balance,
						quantity,
						average;

						bought = Math.round(tdArr[tdArr.length - 3].children[0].innerText.replace(/,/g, ''));
						sold = Math.round(tdArr[tdArr.length - 2].children[0].innerText.replace(/,/g, ''));
						balance = sold - bought;
						if (bought > 0 && sold > 0) {
							quantity = (tdArr.length - 3) / 4;
						} else if ((bought == 0 && sold > 0) || (bought > 0 && sold == 0)) {
							quantity = Math.round((tdArr.length - 4) / 4); //bug when has sell/buy players but all prices = 0 --> round and accept wrong result
						} else if (bought == 0 && sold == 0) {
							quantity = 0;
						}
						if (quantity == 0) {
							average = '0.0';
						} else {
							average = ((sold + bought) / quantity).toFixed(1);
						}
						transferSummary.push({
							Season: seasonId,
							Bought: bought,
							Sold: sold,
							Balance: balance,
							Quantity: quantity,
							Average: average
						});
					}

					loadCount++;
					if (loadCount >= seasonIds.length) {
						loadDone = true;
					}
				},
				error: function (e) {}
			});
		});
	} else {
		loadDone = true;
	}

	var myInterval = setInterval(append, 1000);

	function append() {
		if (!loadDone) {
			return;
		}
		clearInterval(myInterval);

		processPlayer();
		boughtArr.sort((a, b) => parseFloat(b.Price) - parseFloat(a.Price));
		soldArr.sort((a, b) => parseFloat(b.Price) - parseFloat(a.Price));
		tradeArr.sort((a, b) => parseFloat(b.Profit) - parseFloat(a.Profit));

		transferSummary.sort(function (a, b) {
			return b.Season - a.Season
		}); //order an object array
		processAcademy();

		present();

		try {
			$('.banner_placeholder.rectangle')[0].parentNode.removeChild($('.banner_placeholder.rectangle')[0]);
		} catch (err) {}
	}

	//buyOrSell: 1 - buy, 2 - sell
	function setMap(playerId, playerName, seasonId, price, buyOrSell) {
		let player;
		if (playerMap.has(playerId)) {
			player = playerMap.get(playerId);
			player.Transaction.push({
				SeasonBS: seasonId + '.' + buyOrSell,
				Price: price
			});
			try {
				if (player.Name.trim() == '') {
					player.Name = playerName; //fix bug of TM not show playername
				}
			} catch (e) {}
		} else {
			player = {
				Id: playerId,
				Name: playerName,
				Transaction: [{
						SeasonBS: seasonId + '.' + buyOrSell,
						Price: price
					}
				]
			}
			playerMap.set(playerId, player);
		}
	}

	function processPlayer() {
		totalTradeBuy = 0;
		totalTradeSell = 0;
		totalTradeProfit = 0;
		totalSquadBuy = 0;
		squadCount = 0;
		for (let[key, value]of playerMap) {
			value.Transaction.sort((a, b) => parseFloat(a.SeasonBS) - parseFloat(b.SeasonBS));
			let waitSellForTrade = false;
			let buyForTrade;
			value.Transaction.forEach(tran => {
				let temp = tran.SeasonBS.split('.');
				if (temp[1] == 1) {
					boughtArr.push({
						Id: value.Id,
						Name: value.Name,
						Season: temp[0],
						Price: tran.Price
					});
					waitSellForTrade = true;
					buyForTrade = tran.Price;
				} else {
					if (waitSellForTrade) {
						let afterTax = (tran.Price * 0.94).toFixed(1);
						let tradeProfit = Math.round((afterTax - buyForTrade) * 10) / 10;
						if (tradeProfit >= minProfit && tradeProfit <= maxProfit) {
							tradeArr.push({
								Id: value.Id,
								Name: value.Name,
								Buy: buyForTrade,
								Sell: afterTax,
								Profit: tradeProfit
							});
							totalTradeBuy += Math.round(parseFloat(buyForTrade) * 10) / 10;
							totalTradeSell += Math.round(parseFloat(afterTax) * 10) / 10;
							totalTradeProfit += Math.round(parseFloat(tradeProfit) * 10) / 10;
						}
						soldArr.push({
							Id: value.Id,
							Name: value.Name,
							Season: temp[0],
							Price: tran.Price,
							YoungAcademy: false
						});
					} else {
						soldArr.push({
							Id: value.Id,
							Name: value.Name,
							Season: temp[0],
							Price: tran.Price,
							YoungAcademy: true
						});
						if (academySoldMap.has(temp[0])) {
							let academySoldSeasonData = academySoldMap.get(temp[0]);
							academySoldSeasonData.Quantity++;
							academySoldSeasonData.Sold += Math.round(parseFloat(tran.Price) * 10) / 10;
							academySoldMap.set(temp[0], academySoldSeasonData);
						} else {
							academySoldMap.set(temp[0], {
								Quantity: 1,
								Sold: Math.round(parseFloat(tran.Price) * 10) / 10
							});
						}
					}
					waitSellForTrade = false;
				}
			});
			if (squadPlayerIdArr.includes(value.Id)) { //player is still playing in squad. Can not be inferred from transfer history data because bug data of TM
				totalSquadBuy += Math.round(parseFloat(buyForTrade) * 10) / 10;
				squadCount++;
			}
		}
	}

	function processAcademy() {
		seasonIds.forEach((seasonId) => {
			if (academySoldMap.has(seasonId)) {
				let season = academySoldMap.get(seasonId);

				let seasonAverage = (Math.round(season.Sold) / season.Quantity).toFixed(1);
				academySummary.push({
					Season: seasonId,
					Quantity: season.Quantity,
					Sold: Math.round(season.Sold),
					Average: seasonAverage
				});
			} else {
				academySummary.push({
					Season: seasonId,
					Quantity: 0,
					Sold: 0,
					Average: '0.0'
				});
			}
		});
	}

	function present() {
		let clubTransfer =
			"<div class=\"box\">" +
			"<div class=\"box_head\">" +
			"<h2 class=\"std\">Club Transfer (M)</h2>" +
			"</div>" +
			"<div class=\"box_body\">" +
			"<div class=\"box_shadow\"></div>" +
			"<h3>TOP BOUGHT</h3>" +
			"<div id=\"topBought_content\" class=\"content_menu\"></div>" +
			"<h3>TOP SOLD</h3>" +
			"<div id=\"topSold_content\" class=\"content_menu\"></div>" +
			"<h3>TOP TRADE PROFIT (INCLUDE TAX)</h3>" +
			"<div id=\"topTrade_content\" class=\"content_menu\"></div>" +
			"<h3>SUMMARY TRANSFER</h3>" +
			"<div id=\"summaryTransfer_content\" class=\"content_menu\"></div>" +
			"<h3>ACADEMY REVENUE</h3>" +
			"<div id=\"academyRevenue_content\" class=\"content_menu\"></div>" +
			"<h3>CONFIG</h3>" +
			"<table>" +
			"<tr>" +
			"<td>" +
			"<span style='display: inline-block;'><input id='" + CONTROL_ID.INPUT_SHOW_MODE + "' type='text' class='embossed' style='width: 150px; line-height: 100%; padding: 3px 3px 4px 3px;' placeholder='Mode'></span>" +
			"</td>" +
			"<td>" +
			"<span id='" + CONTROL_ID.BUTTON_SHOW_MODE + "' class='button' style='margin-left: 3px;'><span class='button_border'>Show Mode</span></span>" +
			"</td>" +
			"</tr>" +
			"<tr>" +
			"<td>" +
			"<span style='display: inline-block;'><input id='" + CONTROL_ID.INPUT_TOP_COUNT + "' type='text' class='embossed' style='width: 150px; line-height: 100%; padding: 3px 3px 4px 3px;' placeholder='Top count'></span>" +
			"</td>" +
			"<td>" +
			"<span id='" + CONTROL_ID.BUTTON_TOP_COUNT + "' class='button' style='margin-left: 3px;'><span class='button_border'>Top Count</span></span>" +
			"</td>" +
			"</tr>" +
			"<tr>" +
			"<td>" +
			"<span style='display: inline-block;'><input id='" + CONTROL_ID.INPUT_SEASON_COUNT + "' type='text' class='embossed' style='width: 65px; line-height: 100%; padding: 3px 3px 4px 3px;' placeholder='Count'></span>" +
			" - " +
			"<span style='display: inline-block;'><input id='" + CONTROL_ID.INPUT_TO_SEASON + "' type='text' class='embossed' style='width: 65px; line-height: 100%; padding: 3px 3px 4px 3px;' placeholder='To season'></span>" +
			"</td>" +
			"<td>" +
			"<span id='" + CONTROL_ID.BUTTON_SEASON_COUNT + "' class='button' style='margin-left: 3px;'><span class='button_border'>Season Count</span></span>" +
			"</td>" +
			"</tr>" +
			"<tr>" +
			"<td>" +
			"<span style='display: inline-block;'><input id='" + CONTROL_ID.INPUT_MIN_PROFIT + "' type='text' class='embossed' style='width: 65px; line-height: 100%; padding: 3px 3px 4px 3px;' placeholder='Min profit'></span>" +
			" - " +
			"<span style='display: inline-block;'><input id='" + CONTROL_ID.INPUT_MAX_PROFIT + "' type='text' class='embossed' style='width: 65px; line-height: 100%; padding: 3px 3px 4px 3px;' placeholder='Max profit'></span>" +
			"</td>" +
			"<td>" +
			"<span id='" + CONTROL_ID.BUTTON_TRADE_PROFIT + "' class='button' style='margin-left: 3px;'><span class='button_border'>Profit (M)</span></span>" +
			"</td>" +
			"</tr>" +
			"</table>" +
			"</div>" +
			"<div class=\"box_footer\">" +
			"<div></div>" +
			"</div>" +
			"</div>";
		$(".column3_a").append(clubTransfer);

		/*** SHOW MODE ***/
		document.getElementById(CONTROL_ID.BUTTON_SHOW_MODE).addEventListener('click', (e) => {
			setShowMode();
		});
		let showMode = localStorage.getItem(APPLICATION_PARAM.SHOW_MODE_LOCAL_STORAGE_KEY);
		if (showMode == null || showMode == "") {
			showMode = APPLICATION_PARAM.DEFAULT_SHOW_MODE;
		}
		$('#' + CONTROL_ID.INPUT_SHOW_MODE).val(showMode);
		/*********/

		/*** TOP COUT ***/
		document.getElementById(CONTROL_ID.BUTTON_TOP_COUNT).addEventListener('click', (e) => {
			setTopCount();
		});
		topCount = localStorage.getItem(APPLICATION_PARAM.TOP_COUNT_LOCAL_STORAGE_KEY);
		if (topCount == null || topCount == "") {
			topCount = APPLICATION_PARAM.DEFAULT_TOP_COUNT;
		}
		$('#' + CONTROL_ID.INPUT_TOP_COUNT).val(topCount);
		/*********/

		/*** SEASON COUT ***/
		document.getElementById(CONTROL_ID.BUTTON_SEASON_COUNT).addEventListener('click', (e) => {
			setSeasonCount();
		});
		$('#' + CONTROL_ID.INPUT_SEASON_COUNT).val(seasonCount);
		$('#' + CONTROL_ID.INPUT_TO_SEASON).val(toSeason);
		/*********/

		/*** MIN PROFIT ***/
		document.getElementById(CONTROL_ID.BUTTON_TRADE_PROFIT).addEventListener('click', (e) => {
			setTradeProfit();
		});
		$('#' + CONTROL_ID.INPUT_MIN_PROFIT).val(minProfit);
		$('#' + CONTROL_ID.INPUT_MAX_PROFIT).val(maxProfit);
		/*********/

		let invidualMode = showMode.split("");
		if (invidualMode[0] == "1") {
			showTopBought();
		}
		if (invidualMode[1] == "1") {
			showTopSold();
		}
		if (invidualMode[2] == "1") {
			showTopTradeProfit();
		}
		if (invidualMode[3] == "1") {
			showSummaryTransfer();
		}
		if (invidualMode[4] == "1") {
			showAcademyRevenue();
		}
	}

	function showTopBought() {
		if (boughtArr.length > 0) {
			var topBought_content = "<table>" +
				"<tr style='color:Orange;'><th align='right'>#</th><th>Player</th><th align='right'>SS</th><th align='right'>Price</th></tr>";
			let rowCount = 0;
			for (let i = 0; i < boughtArr.length && i < topCount; i++) {
				rowCount++;
				let classOdd = "";
				if ((rowCount % 2) == 1) {
					classOdd = "class='odd'";
				}
				topBought_content +=
				'<tr ' + classOdd + '><td align="right">' + (i + 1) + '. ' +
				'</td><td>' + '<span onclick = \"window.open(\'https:\/\/trophymanager.com\/players\/' + boughtArr[i].Id + '\')\">' + boughtArr[i].Name + '</span>' +
				'</td><td align="right">' + boughtArr[i].Season +
				'</td><td align="right">' + boughtArr[i].Price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") +
				'</td></tr>';
			}
			topBought_content += "</table>";
			$("#topBought_content").append(topBought_content);
		}
	}

	function showTopSold() {
		if (soldArr.length > 0) {
			var topSold_content = "<table>" +
				"<tr style='color:Orange;'><th align='right'>#</th><th>Player</th><th align='right'>SS</th><th align='right'>Price</th></tr>";
			let rowCount = 0;
			for (let i = 0; i < soldArr.length && i < topCount; i++) {
				rowCount++;
				let classOdd = "";
				if ((rowCount % 2) == 1) {
					classOdd = "class='odd'";
				}
				if (soldArr[i].YoungAcademy && seasonCount == APPLICATION_PARAM.DEFAULT_SEASON_COUNT) {
					topSold_content += "<tr style='color:Yellow;' " + classOdd + ">";
				} else {
					topSold_content += "<tr " + classOdd + ">";
				}
				topSold_content +=
				'<td align="right">' + (i + 1) + '. ' +
				'</td><td>' + '<span onclick = \"window.open(\'https:\/\/trophymanager.com\/players\/' + soldArr[i].Id + '\')\">' + soldArr[i].Name + '</span>' +
				'</td><td align="right">' + soldArr[i].Season +
				'</td><td align="right">' + soldArr[i].Price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") +
				'</td></tr>';
			}
			topSold_content += "</table>";
			$("#topSold_content").append(topSold_content);
		}
	}

	function showTopTradeProfit() {
		if (tradeArr.length > 0) {
			var topTrade_content = "<table>" +
				"<tr style='color:Orange;'><th align='right'>#</th><th>Player</th><th align='right'>Buy</th><th align='right'>Sell</th><th align='right'>Profit</th></tr>";

			topTrade_content +=
			'<tr class="odd" style="color:' + APPLICATION_COLOR.AVERAGE + ';"><td></td><td>Average (' + tradeArr.length + ' players)</td><td align="right">' +
			(totalTradeBuy / tradeArr.length).toFixed(1).replace(/\B(?=(\d{3})+(?!\d))/g, ",") + '</td><td align="right">' +
			(totalTradeSell / tradeArr.length).toFixed(1).replace(/\B(?=(\d{3})+(?!\d))/g, ",") + '</td><td align="right">' +
			(totalTradeProfit / tradeArr.length).toFixed(1).replace(/\B(?=(\d{3})+(?!\d))/g, ",") + '</td></tr>';

			topTrade_content +=
			'<tr style="color:' + APPLICATION_COLOR.TOTAL + ';"><td></td><td>Total (' + tradeArr.length + ' players)</td><td align="right">' +
			totalTradeBuy.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",") + '</td><td align="right">' +
			totalTradeSell.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",") + '</td><td align="right">' +
			totalTradeProfit.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",") + '</td></tr>';

			let rowCount = 0;
			for (let i = 0; i < tradeArr.length && i < topCount; i++) {
				rowCount++;
				let classOdd = "";
				if ((rowCount % 2) == 1) {
					classOdd = "class='odd'";
				}
				topTrade_content +=
				'<tr ' + classOdd + '><td align="right">' + (i + 1) + '. ' +
				'</td><td>' + '<span onclick = \"window.open(\'https:\/\/trophymanager.com\/players\/' + tradeArr[i].Id + '\')\">' + tradeArr[i].Name + '</span>' +
				'</td><td align="right">' + tradeArr[i].Buy.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") +
				'</td><td align="right" style="color:Orange;">' + tradeArr[i].Sell.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") +
				'</td><td align="right">' + tradeArr[i].Profit.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") +
				'</td></tr>';
			}
			topTrade_content += "</table>";
			$("#topTrade_content").append(topTrade_content);
		}
	}

	function showSummaryTransfer() {
		let summaryTransfer_content = "<table>" +
			"<tr style='color:Orange;'><th align='right'>SS</th><th align='right'>Buy</th><th align='right'>Sell</th><th align='right'>+-</th><th align='right'>#</th><th align='right'>Avg</th></tr>";

		let totalBought = 0,
		totalSold = 0,
		totalQuantity = 0;
		let rowCount = 0;
		let seasonTrArr = [];
		transferSummary.forEach((summary) => {
			rowCount++;
			let trClass = "",
			display = "";
			if (rowCount <= APPLICATION_PARAM.SEASON_SHOW) {
				if ((rowCount % 2) == 0) {
					trClass = "class='odd'";
				}
			} else {
				display = "style='display:none'";
				if ((rowCount % 2) == 0) {
					trClass = "class='odd " + CLASS_NAME.SUMMARY_TRANSFER + "'";
				} else {
					trClass = "class='" + CLASS_NAME.SUMMARY_TRANSFER + "'";
				}
			}

			let seasonTr =
				'<tr ' + trClass + ' ' + display + '><td align="right">' + summary.Season +
				'</td><td align="right">' + summary.Bought.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") +
				'</td><td align="right">' + summary.Sold.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") +
				'</td><td align="right">' + summary.Balance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") +
				'</td><td align="right">' + summary.Quantity +
				'</td><td align="right">' + summary.Average.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") +
				'</td></tr>';
			seasonTrArr.push(seasonTr);

			totalBought += summary.Bought;
			totalSold += summary.Sold;
			totalQuantity += summary.Quantity;
		});

		summaryTransfer_content +=
		'<tr class="odd" style="color:' + APPLICATION_COLOR.AVERAGE + ';"><td align="right">Average</td><td align="right">' +
		(totalBought / transferSummary.length).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",") + '</td><td align="right">' +
		(totalSold / transferSummary.length).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",") + '</td><td align="right">' +
		(Math.round(totalSold / transferSummary.length) - Math.round(totalBought / transferSummary.length)).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",") + '</td><td align="right">' +
		(totalQuantity / transferSummary.length).toFixed(0) + '</td><td align="right">' +
		(totalQuantity > 0 ? ((totalSold + totalBought) / totalQuantity).toFixed(1).replace(/\B(?=(\d{3})+(?!\d))/g, ",") : 0) + '</td></tr>';

		summaryTransfer_content +=
		'<tr style="color:' + APPLICATION_COLOR.TOTAL + ';"><td align="right">Total</td><td align="right">' +
		totalBought.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + '</td><td align="right">' +
		totalSold.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + '</td><td align="right">' +
		(totalSold - totalBought).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + '</td><td align="right">' +
		totalQuantity.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + '</td><td align="right">' +
		'</td></tr>';

		if (seasonCount == APPLICATION_PARAM.DEFAULT_SEASON_COUNT) { //only display onSquadTotalBuy if show all seasons
			summaryTransfer_content +=
			'<tr class="odd" style="color:' + APPLICATION_COLOR.ONSQUAD + ';"><td align="right">Squad (' + squadCount + ')</td><td align="right">' +
			totalSquadBuy.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",") + '</td><td align="right"></td><td align="right">' +
			(totalSquadBuy + totalSold - totalBought).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",") + '</td><td align="right"></td><td align="right">' +
			'</td></tr>';
		} else {
			summaryTransfer_content +=
			'<tr class="odd" style="color:' + APPLICATION_COLOR.ONSQUAD + ';"><td align="right">Squad</td><td align="right" colspan="5">Show if summary all seasons</td></tr>';
		}

		seasonTrArr.forEach((seasonTr) => {
			summaryTransfer_content += seasonTr;
		});
		if (rowCount > APPLICATION_PARAM.SEASON_SHOW) {
			let buttonLabel = "Show all season " + seasonIds[seasonIds.length - 1] + " - " + seasonIds[0];
			summaryTransfer_content += "<tr align='center'><td colspan='6'>" + "<span id='" + CONTROL_ID.BUTTON_SHOW_ALL_SUMMARY_TRANSFER + "' class='button' style='margin-left: 3px;'><span class='button_border'>" + buttonLabel + "</span></span>" + "</td></tr>";
		}
		summaryTransfer_content += "</table>";
		$("#summaryTransfer_content").append(summaryTransfer_content);

		if (rowCount > APPLICATION_PARAM.SEASON_SHOW) {
			document.getElementById(CONTROL_ID.BUTTON_SHOW_ALL_SUMMARY_TRANSFER).addEventListener('click', (e) => {
				showAll(CLASS_NAME.SUMMARY_TRANSFER, CONTROL_ID.BUTTON_SHOW_ALL_SUMMARY_TRANSFER);
			});
		}
	}

	function showAcademyRevenue() {
		let academyRevenue_content = "<table>" +
			"<tr style='color:Orange;'><th align='right'>SS</th><th align='right'>Sell</th><th align='right'>#</th><th align='right'>Avg</th></tr>";

		let totalSold = 0,
		totalQuantity = 0;
		let rowCount = 0;
		let seasonTrArr = [];
		academySummary.forEach((summary) => {
			rowCount++;
			let trClass = "",
			display = "";
			if (rowCount <= APPLICATION_PARAM.SEASON_SHOW) {
				if ((rowCount % 2) == 1) {
					trClass = "class='odd'";
				}
			} else {
				display = "style='display:none'";
				if ((rowCount % 2) == 1) {
					trClass = "class='odd " + CLASS_NAME.ACADEMY_REVENUE + "'";
				} else {
					trClass = "class='" + CLASS_NAME.ACADEMY_REVENUE + "'";
				}
			}

			let seasonTr =
				'<tr ' + trClass + ' ' + display + '><td align="right">' + summary.Season +
				'</td><td align="right">' + summary.Sold.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") +
				'</td><td align="right">' + summary.Quantity +
				'</td><td align="right">' + summary.Average.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") +
				'</td></tr>';
			seasonTrArr.push(seasonTr);

			totalSold += summary.Sold;
			totalQuantity += summary.Quantity;
		});

		academyRevenue_content +=
		'<tr class="odd" style="color:' + APPLICATION_COLOR.AVERAGE + ';"><td align="right">Average</td><td align="right">' +
		(totalSold / academySummary.length).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",") + '</td><td align="right">' +
		(totalQuantity / academySummary.length).toFixed(0) + '</td><td align="right">' +
		(totalQuantity > 0 ? (totalSold / totalQuantity).toFixed(1).replace(/\B(?=(\d{3})+(?!\d))/g, ",") : 0) + '</td></tr>';

		academyRevenue_content +=
		'<tr style="color:' + APPLICATION_COLOR.TOTAL + ';"><td align="right">Total</td><td align="right">' +
		totalSold.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + '</td><td align="right">' +
		totalQuantity.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + '</td><td align="right">' +
		'</td></tr>';

		seasonTrArr.forEach((seasonTr) => {
			academyRevenue_content += seasonTr;
		});
		if (rowCount > APPLICATION_PARAM.SEASON_SHOW) {
			let buttonLabel = "Show all season " + seasonIds[seasonIds.length - 1] + " - " + seasonIds[0];
			academyRevenue_content += "<tr align='center'><td colspan='4'>" + "<span id='" + CONTROL_ID.BUTTON_SHOW_ALL_ACADEMY_REVENUE + "' class='button' style='margin-left: 3px;'><span class='button_border'>" + buttonLabel + "</span></span>" + "</td></tr>";
		}
		academyRevenue_content += "</table>";
		$("#academyRevenue_content").append(academyRevenue_content);

		if (rowCount > APPLICATION_PARAM.SEASON_SHOW) {
			document.getElementById(CONTROL_ID.BUTTON_SHOW_ALL_ACADEMY_REVENUE).addEventListener('click', (e) => {
				showAll(CLASS_NAME.ACADEMY_REVENUE, CONTROL_ID.BUTTON_SHOW_ALL_ACADEMY_REVENUE);
			});
		}
	}

	function showAll(className, controlId) {
		let trArr = $('.' + className);
		for (let i = 0; i < trArr.length; i++) {
			trArr[i].style = 'display:""';
		}
		$('#' + controlId)[0].style = 'display:none';
	}

	function setShowMode() {
		let showMode = $('#' + CONTROL_ID.INPUT_SHOW_MODE)[0].value;
		if (showMode == '') {
			localStorage.removeItem(APPLICATION_PARAM.SHOW_MODE_LOCAL_STORAGE_KEY);
		} else if (!isValidShowMode(showMode)) {
			alert('Allowable show mode value has the form XXXXX where X is 0 or 1');
		} else {
			localStorage.setItem(APPLICATION_PARAM.SHOW_MODE_LOCAL_STORAGE_KEY, showMode);
			alert('Set successful, please refresh');
		}
	}

	function isValidShowMode(mode) {
		let arr = mode.split('');
		if (arr.length != 5)
			return false;
		for (let i = 0; i < arr.length; i++) {
			if (arr[i] != '0' && arr[i] != '1') {
				return false;
			}
		}
		return true;
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
		let toSeason = $('#' + CONTROL_ID.INPUT_TO_SEASON)[0].value;
		let valid = true;
		if (seasonCount == '') {
			localStorage.removeItem(APPLICATION_PARAM.SEASON_COUNT_LOCAL_STORAGE_KEY);
		} else if (isNaN(seasonCount) || seasonCount < 0) {
			alert('Season count must be positive integer. Season count = 0 means all seasons.');
			valid = false;
		} else {
			localStorage.setItem(APPLICATION_PARAM.SEASON_COUNT_LOCAL_STORAGE_KEY, seasonCount);
		}
		if (toSeason == '') {
			localStorage.removeItem(APPLICATION_PARAM.TO_SEASON_LOCAL_STORAGE_KEY);
		} else if (isNaN(toSeason) || toSeason < 0) {
			alert('To season must be positive integer. To season = 0 means current season.');
			valid = false;
		} else {
			localStorage.setItem(APPLICATION_PARAM.TO_SEASON_LOCAL_STORAGE_KEY, toSeason);
		}
		if (valid) {
			alert('Set successful, please refresh');
		}
	}

	function setTradeProfit() {
		let minProfit = $('#' + CONTROL_ID.INPUT_MIN_PROFIT)[0].value;
		let maxProfit = $('#' + CONTROL_ID.INPUT_MAX_PROFIT)[0].value;
		let valid = true;
		if (minProfit == '') {
			localStorage.removeItem(APPLICATION_PARAM.MIN_PROFIT_LOCAL_STORAGE_KEY);
		} else if (isNaN(minProfit)) {
			alert('Min profit must be number');
			valid = false;
		} else {
			localStorage.setItem(APPLICATION_PARAM.MIN_PROFIT_LOCAL_STORAGE_KEY, minProfit);
		}
		if (maxProfit == '') {
			localStorage.removeItem(APPLICATION_PARAM.MAX_PROFIT_LOCAL_STORAGE_KEY);
		} else if (isNaN(maxProfit)) {
			alert('Max profit must be number');
			valid = false;
		} else {
			localStorage.setItem(APPLICATION_PARAM.MAX_PROFIT_LOCAL_STORAGE_KEY, maxProfit);
		}
		if (valid) {
			alert('Set successful, please refresh');
		}
	}
})();
