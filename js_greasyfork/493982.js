// ==UserScript==
// @name           Basic Statistics for the next match
// @version        3.7.20240503
// @description	   Upgrade from Star players script
// @author         Spieler17
// @description    You can immediately find out the result of the league match in the viewing mode of the match, as well as the starting lineups in the stars.
// @include	   https://trophymanager.com/matches/*
// @grant       function
// @namespace https://trophymanager.com
// @downloadURL https://update.greasyfork.org/scripts/493982/Basic%20Statistics%20for%20the%20next%20match.user.js
// @updateURL https://update.greasyfork.org/scripts/493982/Basic%20Statistics%20for%20the%20next%20match.meta.js
// ==/UserScript==
 
var funShowStars;
 
function isOKForShow() {
	var loading = document.getElementsByClassName("loading")[0];
	var shown = document.getElementById("mystarbox");
	if (loading != null)
		return false;
	if (shown != null)
		return false;
	return true;
}
 
function countStars(str) {
	var num1 = str.lastIndexOf("_") + 1;
	var num2 = str.lastIndexOf("\"");
	return parseInt(str.substring(num1, num2));
}
 
function getStars(starnum) {
 
	var num = Math.round(starnum * 100 / 55);
 
	if (num < 10)
		return "<img src=\"/pics/half_star.png\"><img src=\"/pics/dark_star.png\"><img src=\"/pics/dark_star.png\"><img src=\"/pics/dark_star.png\"><img src=\"/pics/dark_star.png\"> (";
	if (num < 20)
		return "<img src=\"/pics/star.png\"><img src=\"/pics/dark_star.png\"><img src=\"/pics/dark_star.png\"><img src=\"/pics/dark_star.png\"><img src=\"/pics/dark_star.png\"> (";
	if (num < 30)
		return "<img src=\"/pics/star.png\"><img src=\"/pics/half_star.png\"><img src=\"/pics/dark_star.png\"><img src=\"/pics/dark_star.png\"><img src=\"/pics/dark_star.png\"> (";
	if (num < 40)
		return "<img src=\"/pics/star.png\"><img src=\"/pics/star.png\"><img src=\"/pics/dark_star.png\"><img src=\"/pics/dark_star.png\"><img src=\"/pics/dark_star.png\"> (";
	if (num < 50)
		return "<img src=\"/pics/star.png\"><img src=\"/pics/star.png\"><img src=\"/pics/half_star.png\"><img src=\"/pics/dark_star.png\"><img src=\"/pics/dark_star.png\"> (";
	if (num < 61)
		return "<img src=\"/pics/star.png\"><img src=\"/pics/star.png\"><img src=\"/pics/star.png\"><img src=\"/pics/dark_star.png\"><img src=\"/pics/dark_star.png\"> (";
	if (num < 72)
		return "<img src=\"/pics/star.png\"><img src=\"/pics/star.png\"><img src=\"/pics/star.png\"><img src=\"/pics/half_star.png\"><img src=\"/pics/dark_star.png\"> (";
	if (num < 84)
		return "<img src=\"/pics/star.png\"><img src=\"/pics/star.png\"><img src=\"/pics/star.png\"><img src=\"/pics/star.png\"><img src=\"/pics/dark_star.png\"> (";
	if (num < 93.5)
		return "<img src=\"/pics/star.png\"><img src=\"/pics/star.png\"><img src=\"/pics/star.png\"><img src=\"/pics/star.png\"><img src=\"/pics/half_star.png\"> (";
 
	return "<img src=\"/pics/star.png\"><img src=\"/pics/star.png\"><img src=\"/pics/star.png\"><img src=\"/pics/star.png\"><img src=\"/pics/star.png\"> (";
}
 
function GetPlayerData(playerID) {
	$.ajaxSetup({
		async: false
	});
	var player;
	$.post("/ajax/tooltip.ajax.php", {
		"player_id": playerID
	}, function (responseText) {
		var data = JSON.parse(responseText);
		player = {
			id: data.player.player_id,
			position: data.player.fp,
			ASI: Number(data.player.skill_index.split(',').join('')),
			xp: Number(data.player.routine.split(',').join('')),
			age: Number(data.player.age),
			month: Number(data.player.months),
			wage: Number(data.player.wage.replace("<span class='coin'>", "").replace("<\/span>", "").split(',').join(''))
		};
	});
	return player;
}
 
let BP = {
	/**
	 * @param {number} asi
	 * @param {number} age
	 * @param {number} month
	 * @param {number} position
	 * @returns {number} calculated BP
	 */
	compute: function (asi, age, month, position) {
		let pow = Math.pow;
		if (position === "GK") {
			return Math.round((asi * 500 * pow((300 / (age * 12 + month)), 2.5)) * 0.75);
		} else {
			return Math.round(asi * 500 * pow((300 / (age * 12 + month)), 2.5));
		}
	}
};
 
function ShowInfo() {
	if (isOKForShow() == true) {
		var divs = document.getElementsByClassName("player_field")[0].getElementsByTagName("div");
		var i = 0;
		var homeStar = 0;
		var homeXP = 0;
		var homeAge = 0;
		var homeASI = 0;
		var homeWage = 0;
		var homeBP = 0;
 
		var awayStar = 0;
		var awayXP = 0;
		var awayAge = 0;
		var awayASI = 0;
		var awayWage = 0;
		var awayBP = 0;
 
		for (; i <= 10; i++) {
			homeStar += countStars(divs[i * 2].innerHTML);
			let playerID = divs[i * 2].attributes[1].value;
			let player = GetPlayerData(playerID);
			homeXP += player.xp;
			homeAge += player.age * 12 + player.month;
			homeASI += player.ASI;
			homeWage += player.wage;
			homeBP += BP.compute(player.ASI, player.age, player.month, player.position);
		}
		for (; i <= 21; i++) {
			awayStar += countStars(divs[i * 2].innerHTML);
			let playerID = divs[i * 2].attributes[1].value;
			let player = GetPlayerData(playerID);
			awayXP += player.xp;
			awayAge += player.age * 12 + player.month;
			awayASI += player.ASI;
			awayWage += player.wage;
			awayBP += BP.compute(player.ASI, player.age, player.month, player.position);
		}
		homeStar = homeStar / 2;
		homeStar = homeStar.toFixed(1);
		awayStar = awayStar / 2;
		awayStar = awayStar.toFixed(1);
 
		var newdiv = document.createElement("div");
 
		newdiv.innerHTML =
			"<br><div id=\"mystarbox\" class=\"home color\" style=\"background-color:rgb(127,127,127)\"><b style=\"color: gold;\">" + getStars(homeStar) + homeStar + "/55)</b></div><div class=\"away color\"  style=\"background-color:rgb(10,5,76)\"><b style=\"color: gold;\">" + getStars(awayStar) + awayStar + "/55)</b></div>" +
 
			"<br><div id=\"myxp\" class=\"home color\" style=\"background-color:rgb(127,127,127)\"><b style=\"color: gold;\">" + "XP:" + (homeXP / 11).toFixed(1) + " Age:" + (homeAge / 11 / 12).toFixed(1) + " ASI:" + (homeASI / 11).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "</b></div><div class=\"away color\"  style=\"background-color:rgb(10,5,76)\"><b style=\"color: gold;\">" + "XP:" + (awayXP / 11).toFixed(1) + " Age:" + (awayAge / 11 / 12).toFixed(1) + " ASI:" + (awayASI / 11).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "</b></div>" +
 
			"<br><div id=\"myxp\" class=\"home color\" style=\"background-color:rgb(127,127,127)\"><b style=\"color: gold;\">" + "BP:" + (homeBP / 11 / 1000).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " Wage:" + (homeWage / 11 / 1000).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "</b></div><div class=\"away color\"  style=\"background-color:rgb(10,5,76)\"><b style=\"color: gold;\">" + "BP:" + (awayBP / 11 / 1000).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " Wage:" + (awayWage / 11 / 1000).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "</b></div>"
 
			document.getElementsByClassName("nameplate")[0].appendChild(newdiv);
	}
}
 
if (location.href.indexOf("matches") != -1) {
	setTimeout(ShowInfo, 5000);
}