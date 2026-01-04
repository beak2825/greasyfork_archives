// ==UserScript==
// @name         TMVN History Transfer
// @namespace    https://trophymanager.com
// @version      4
// @description  Trophymanager: summary all seasons's transfer info and save data for TMVN League Transfer script (https://greasyfork.org/en/scripts/416755)
// @match        https://trophymanager.com/history/club/transfers/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/416753/TMVN%20History%20Transfer.user.js
// @updateURL https://update.greasyfork.org/scripts/416753/TMVN%20History%20Transfer.meta.js
// ==/UserScript==

(function () {
	'use strict';

	var transferSummary = [];
	var loadDone = false;
	var clubId = $('.box_sub_header a')[1].getAttribute('href').substring(6, $('.box_sub_header a')[1].getAttribute('href').toString().length - 1);
	var comboSeason = document.getElementById('stats_season').options;
	var seasonIds = [];
	for (let i = 0; i < comboSeason.length; i++) {
		seasonIds.push(comboSeason[i].value);
	}

	if (clubId != "" && seasonIds.length > 0) {
		seasonIds.forEach((seasonId) => {
			$.ajax('https://trophymanager.com/history/club/transfers/' + clubId + '/' + seasonId, {
				type: "GET",
				dataType: 'html',
				crossDomain: true,
				success: function (response) {
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
							average = 0;
						} else {
							average = Number(((sold + bought) / quantity).toFixed(1));
						}
						transferSummary.push({
							Season: seasonId,
							Bought: bought,
							Sold: sold,
							Balance: balance,
							Quantity: quantity,
							Average: average
						});
						if (transferSummary.length >= seasonIds.length) {
							loadDone = true;
						}
					}
				},
				error: function (e) {}
			});
		});
	}

	var myInterval = setInterval(append, 1000);

	function append() {
		if (!loadDone) {
			return;
		}
		clearInterval(myInterval);

		transferSummary.sort(function (a, b) {
			return b.Season - a.Season
		}); //order an object array
		/*APPEND SUMMARY TRANSFER*/
		var summaryTransfer =
			"<div class=\"column3_a\">" +
			"<div class=\"box\">" +
			"<div class=\"box_head\">" +
			"<h2 class=\"std\">Summary Transfer (M)</h2>" +
			"</div>" +
			"<div class=\"box_body\">" +
			"<div class=\"box_shadow\"></div>" +
			"<div id=\"summaryTransfer_content\" class=\"content_menu\"></div>" +
			"</div>" +
			"<div class=\"box_footer\">" +
			"<div></div>" +
			"</div>" +
			"</div>" +
			"</div>";
		if ($('#bteam_reminder').length == 1) {
			$(".main_center")[3].innerHTML += summaryTransfer;
		} else {
			$(".main_center")[2].innerHTML += summaryTransfer;
		}

		var summaryTransfer_content = "<table>" +
			"<tr><th align='right'>SS</th><th align='right'>Buy</th><th align='right'>Sell</th><th align='right'>+-</th><th align='right'>#</th><th align='right'>Avg</th></tr>";

		var totalBought = 0,
		totalSold = 0,
		totalQuantity = 0;
		transferSummary.forEach((summary) => {
			summaryTransfer_content +=
			'<tr><td align="right">' + summary.Season +
			'</td><td align="right">' + summary.Bought.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") +
			'</td><td align="right">' + summary.Sold.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") +
			'</td><td align="right">' + summary.Balance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") +
			'</td><td align="right">' + summary.Quantity +
			'</td><td align="right">' + summary.Average.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") +
			'</td></tr>';
			totalBought += summary.Bought;
			totalSold += summary.Sold;
			totalQuantity += summary.Quantity;
		});

		summaryTransfer_content +=
		'<tr><td align="right"><span style="color:Orange;">Average</span></td><td align="right">' +
		(totalBought / transferSummary.length).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",") + '</td><td align="right">' +
		(totalSold / transferSummary.length).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",") + '</td><td align="right">' +
		(Math.round(totalSold / transferSummary.length) - Math.round(totalBought / transferSummary.length)).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",") + '</td><td align="right">' +
		(totalQuantity / transferSummary.length).toFixed(0) + '</td><td align="right">' +
		(totalQuantity > 0 ? ((totalSold + totalBought) / totalQuantity).toFixed(1) : 0) + '</td></tr>';

		summaryTransfer_content +=
		'<tr><td align="right"><span style="color:Orange;">Total</span></td><td align="right">' +
		totalBought.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + '</td><td align="right">' +
		totalSold.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + '</td><td align="right">' +
		(totalSold - totalBought).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + '</td><td align="right">' +
		totalQuantity.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + '</td><td align="right">' +
		'</td></tr>';

		summaryTransfer_content += "</table>";
		$("#summaryTransfer_content").append(summaryTransfer_content);
		$('.column3')[0].parentNode.removeChild($('.column3')[0]);

		localStorage.setItem(clubId + "_AVERAGE_TRANSFER", JSON.stringify({
				"Time": new Date(),
				"Bought": Number((totalBought / transferSummary.length).toFixed(0)),
				"Sold": Number((totalSold / transferSummary.length).toFixed(0)),
				"Balance": Math.round(totalSold / transferSummary.length) - Math.round(totalBought / transferSummary.length),
				"Quantity": Number((totalQuantity / transferSummary.length).toFixed(0)),
				"Average": totalQuantity > 0 ? Number(((totalSold + totalBought) / totalQuantity).toFixed(1)) : 0,
				"SeasonCount": transferSummary.length
			}));
	}
})();
