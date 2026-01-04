// ==UserScript==
// @name         TMVN League Transfer
// @namespace    https://trophymanager.com
// @version      1
// @description  Trophymanager: using with 'TMVN History Transfer' script to get info of clubs. The info is for reference only and maybe out of date. You need click on club name to open history page for update info or click on link in the title of table.
// @match        https://trophymanager.com/league/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/416755/TMVN%20League%20Transfer.user.js
// @updateURL https://update.greasyfork.org/scripts/416755/TMVN%20League%20Transfer.meta.js
// ==/UserScript==

(function () {
	'use strict';

	var clubMap = new Map();
	$('#overall_table td').each(function () {
		var clubId = $(this).children('a').attr('club_link');
		if (clubId) {
			var clubName = $(this).children('a')[0].innerHTML;
			clubMap.set(clubId, clubName);
		}
	});

	/*APPEND AVERAGE TRANSFER*/
	var averageTransfer =
		"<div class=\"box\">" +
		"<div class=\"box_head\">" +
		"<h2 class=\"std\"><a href='#' class='averagetransfer_link'>Average Transfer (M)</a></h2>" +
		"</div>" +
		"<div class=\"box_body\">" +
		"<div class=\"box_shadow\"></div>" +
		"<div id=\"averageTransfer_content\" class=\"content_menu\"></div>" +
		"</div>" +
		"<div class=\"box_footer\">" +
		"<div></div>" +
		"</div>" +
		"</div>";
	$(".column3_a").append(averageTransfer);

	var averageTransfer_content = "<table>" +
		"<tr><th>Club</th><th align='right'>Buy</th><th align='right'>Sell</th><th align='right'>+-</th><th align='right'>#</th><th align='right'>Avg</th></tr>";

	var today = new Date();
    let rowCount = 0;
    let clubLinks = [];
	clubMap.forEach((value, key) => {
        rowCount++;
        let classOdd = "";
        if ((rowCount % 2) == 1) {
            classOdd = "class='odd'";
        }
		let data = localStorage.getItem(key + "_AVERAGE_TRANSFER");
		if (data !== "" && data !== undefined && data !== null) {
            let clubValue = JSON.parse(data);
            if (clubValue.SeasonCount !== undefined) {
                value = '<span style="color:Orange;">' + clubValue.SeasonCount + '.</span>' + value;
            }

			let updateTime = clubValue.Time;
			if (updateTime !== undefined && Math.ceil(Math.abs(today - new Date(updateTime)) / (1000 * 60 * 60 * 24)) < 30) {
				averageTransfer_content += "<tr " + classOdd + "><td><span onclick = \"window.open(\'https:\/\/trophymanager.com\/history\/club\/transfers\/" + key + "\')\">" + value + "</span></td><td align='right'>";
			} else {
				averageTransfer_content += "<tr " + classOdd + "><td><span style='color:Orange;' onclick = \"window.open(\'https:\/\/trophymanager.com\/history\/club\/transfers\/" + key + "\')\">" + value + "</span></td><td align='right'>";
			}
			averageTransfer_content += (clubValue.Bought !== undefined ? clubValue.Bought.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",") : "") +
			"</td><td align='right'><span  style='color:Orange;'>" +
			(clubValue.Sold !== undefined ? clubValue.Sold.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",") : "") +
			"</span></td><td align='right'>" +
			(clubValue.Balance !== undefined ? clubValue.Balance.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",") : "") +
            "</td><td align='right'><span  style='color:Orange;'>" +
            (clubValue.Quantity !== undefined ? clubValue.Quantity : "") +
            "</span></td><td align='right'>" +
            (clubValue.Average !== undefined ? clubValue.Average : "") +
			"</td></tr>";
		} else {
			averageTransfer_content += "<tr " + classOdd + "><td><span style='color:Orange;' onclick = \"window.open(\'https:\/\/trophymanager.com\/history\/club\/transfers\/" + key + "\')\">" + value + "</span></td><td></td><td></td><td></td><td></td><td></td></tr>";
		}
        clubLinks.push("https://trophymanager.com/history/club/transfers/" + key);
	});

	averageTransfer_content += "</table>";

	$("#averageTransfer_content").append(averageTransfer_content);
    $('a.averagetransfer_link').click(function(e) {
        e.preventDefault();
        clubLinks.forEach(link => {
            window.open(link);
        });
    });
})();