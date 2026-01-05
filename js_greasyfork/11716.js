// ==UserScript==
// @name                Satoshimines bot
// @namespace           Hash G.
// @description         Bet 105% each time, one bet.
// @include             *satoshimines.com*
// @require             http://ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js
// @version             1.1
// @grant               GM_getValue
// @grant               GM_setValue
// @grant               GM_deleteValue
// @grant               GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/11716/Satoshimines%20bot.user.js
// @updateURL https://update.greasyfork.org/scripts/11716/Satoshimines%20bot.meta.js
// ==/UserScript==

$("#bet").parent().attr("class", "c40 cell");
$("#start_game").parent().attr("class", "c30 cell");
$("#start_game").parent().parent().append("<div class='c30 cell'><button onClick='startBot()' id='startBot'>Start bot</button></div>");
var interval;

function startBot() {
	GM_setValue("initialBalance", $(".num").html());
	$("#startBot").attr("onClick", "stopBot()");
	$("#startBot").html("Stop bot");
	interval = window.setInterval(function(){
		$("div[id^=game]").remove();
		var bet = $("#bet").val();
		var mines = $(".mine_options").find("button[class='active']").html();
		mines = mines.substring(39);
		var tile = Math.floor((Math.random() * 25) + 1); 
		console.log("=========STARTING GAME=========\nBalance: " + $(".num").html() + "\nBet: " + bet + "\nMines: " + mines + "\nTile: " + tile);
		$("#start_game").click();
		setTimeout(function(){ $('li.tile:nth-child('+tile+')').click(); }, 500);
		setTimeout(function(){ $(".cashout").click(); }, 700);
		$("#bet").attr("value", Math.round(bet * 1.05));
		if ($(".num").html() >= GM_getValue("initialBalance", "") * 2) {
			clearInterval(interval);
		}
	}, 1500);
}
exportFunction(startBot, unsafeWindow, {defineAs: "startBot"});

function stopBot() {
	$("#startBot").attr("onClick", "startBot()");
	$("#startBot").html("Start bot");
	clearInterval(interval);
}
exportFunction(stopBot, unsafeWindow, {defineAs: "stopBot"});
