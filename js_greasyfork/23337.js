// ==UserScript==
// @name         TORN elimination
// @namespace    http://updatetheweb.com/
// @version      1.6.6
// @description  Conquer TORN!
// @author       UpdateTheWeb
// @match        https://www.torn.com/competition.php
// @match        http://www.torn.com/competition.php
// @match        https://www.torn.com/competition.php*
// @match        http://www.torn.com/competition.php*
// @match        torn.com/competition.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/23337/TORN%20elimination.user.js
// @updateURL https://update.greasyfork.org/scripts/23337/TORN%20elimination.meta.js
// ==/UserScript==

var lowest_id_of_13_level_player = 2016501; // Change to lowest id that is level 13

(function() {
	'use strict';
// Global variable
	var gOptions = {
		sUrl: location.href.split(".php")[0]+".php",
		added: 0,
		currentPage: null,
		pageNum: 0,
		hiddenNum: 0,
		idStatus: false,
		hospStatus: false,
		isNewbieHidden: false,
		newbieID: lowest_id_of_13_level_player
	};
// Handle page-ing
	if (location.pathname === "/competition.php") {
		checkPage();

		if (gOptions.currentPage === "team") {
			pullAllTeam();
		}

		$(window).on('hashchange', function () {
			var oldPage = gOptions.currentPage;
			checkPage();
			if (oldPage === "main" && gOptions.currentPage === "team") {
				pullAllTeam();
			} else if (oldPage === "team" && gOptions.currentPage === "main") {
				pullMainView();
			}
		});
	}
// Main functions
function pullAllTeam() {
	$(document).ajaxComplete(function(event, XMLHttpRequest, ajaxOptions) {
		if (ajaxOptions.url.substr(1, 15) === "competition.php") {
			$("#skip-to-content").html("Team - <button id='pullTeams'>Start</button>");
			$("#skip-to-content #pullTeams").on('click', function () {
				$(this).unbind('click');
				$("#skip-to-contents").text("Team");
// Get page number (-0 for string->int)
				gOptions.pageNum = $("#competition-wrap .pagination a.last").attr("page") - 0;
// Remove 1st page + pagination
				$("#competition-wrap .competition-list.bottom-round").children().remove();
				$("#competition-wrap .gallery-wrapper.pagination").remove();
// Loop and pull list into page
				for (var i=0; i<gOptions.pageNum; i++) {
					requestData(getTeamName(), 20*i);
				}
			});
// Stop AjaxComplete
		$(document).unbind('ajaxComplete');
		}
	});
}
function pullMainView() {
	$.ajax({
		url:gOptions.sUrl,
		type:"POST",
		data: {
			p:"main",
			step:"main",
			childMethod:"false"
		}
	})
	.done(function(data) {
		$("#competition-wrap").children().remove();
		$("#competition-wrap").append($(data));
	})
	.fail(function(exception){console.error('Script; Exeption:'+exception);});
}
// Helper functions
	function requestData(rTeam, rStart) {
		$.ajax({
			url:gOptions.sUrl,
			type:"POST",
			data: {
				p:"team",
				team:rTeam,
				start:rStart,
				step:"team",
				childMethod:"false"
			}
		})
		.done(function(data) {
			$("#competition-wrap .competition-list.bottom-round").append($(data)[9].children[1].children);
			gOptions.added += 20;
			if (gOptions.added < gOptions.pageNum*20) {
				$("#skip-to-content").text("Team - Loading ("+ gOptions.added +" out of "+ gOptions.pageNum*20 +")");
			} else {
				$("#skip-to-content").text("Team - Done");
				gOptions.added = 0;
				addControls();
				$("#competition-wrap .team-list-wrap .competition-list.bottom-round > li ul.list-cols > li.attack").width(38);
			}
		})
		.fail(function(exception){console.error('Script; Exeption:'+exception);});
	}
	function addControls() {
		var controls = $('<div/>', {class: 'competition-msg white-grad m-bottom10 border-round clearfix'}).append(
			$('<div/>', {class: 'text', style: "margin: 10px 58px"}).append(
				$("<div>Hidden: <span id='hiddenNum'>"+ gOptions.hiddenNum +"</span></div><div>Hide: <input type='checkbox' id='hosp' /><label for='hosp'>Hospitalized</label> <input type='checkbox' id='trav' /><label for='trav'>Travelling</label> <input type='checkbox' id='fede' /><label for='fede'>In fed. Jail</label> <input type='checkbox' id='okay' /><label for='okay'>Okay</label></div><div>Sort: <input type='radio' name='sort' id='lasc' /><label for='lasc'>Level Asc</label> <input type='radio' name='sort' id='ldesc' /><label for='ldesc'>Level Desc</label> <input type='radio' name='sort' id='aasc' /><label for='aasc'>Attacks Asc</label> <input type='radio' name='sort' id='adesc' /><label for='adesc'>Attacks Desc</label></div><div><button id='shid'>Show/Hide ID</button> <button id='newb'>Hide all newbie</button> <button id='lvlr'>Show specific level range</button> <button id='hosptime'>Show Hospital time</button></div>")
			)
		);
		$("#competition-wrap .competition-msg").after(controls);
		// Handle hide/show click
		$("#competition-wrap #hosp").on("change", function () {hideShowPlayers('hosp', this.checked);});
		$("#competition-wrap #trav").on("change", function () {hideShowPlayers('trav', this.checked);});
		$("#competition-wrap #fede").on("change", function () {hideShowPlayers('fede', this.checked);});
		$("#competition-wrap #okay").on("change", function () {hideShowPlayers('okay', this.checked);});
		$("#competition-wrap input[name=sort]").on("click", function () {sortPlayers($(this).attr('id'));});
		$("#competition-wrap #shid").on("click", function () {showHideId();});
		$("#competition-wrap #newb").on("click", function () {hideNewbies();});
		$("#competition-wrap #lvlr").on("click", function () {showLevelRange();});
		$("#competition-wrap #hosptime").on("click", function () {showHospTime();});
	}
	function checkPage() {
		if (location.hash.split("&")[0].substr(2) === "p=team") {gOptions.currentPage = "team";} // In team view
		else if (location.hash === "" || location.hash === "#/p=main") {gOptions.currentPage = "main";} // In comp. view
		return gOptions.currentPage;
	}
	function getTeamName() {
		return location.hash.substr(2).split("&")[1].split("=")[1];
	}
// Controls functions
function showHideId() {
	if (gOptions.idStatus) {
		$("#mainContainer").width($("#mainContainer").width() - 70);
		$("#mainContainer .content-wrapper").width($("#mainContainer .content-wrapper").width() - 70);

		$("#competition-wrap .competition-list-header .ID").remove();
		$("#competition-wrap .team-list-wrap .competition-list.bottom-round > li").each(function() {
			$(this).find("ul.list-cols > li.playerID").remove();
		});
	} else {
		$("#mainContainer").width($("#mainContainer").width() + 70);
		$("#mainContainer .content-wrapper").width($("#mainContainer .content-wrapper").width() + 70);

		$("#competition-wrap .competition-list-header").append("<li class='ID'style='width:52px'>Player ID</li>");
		$("#competition-wrap .team-list-wrap .competition-list.bottom-round > li").each(function() {
			$(this).find("ul.list-cols").append(
				"<li class='playerID'style='width:52px'>"+
				$(this).find("ul.list-cols > li.name a.user.name").attr('href').split('=')[1]+
				"</li>"
			);
		});
	}

	gOptions.idStatus = !gOptions.idStatus;
}
function hideNewbies() {
	$("#competition-wrap .team-list-wrap .competition-list.bottom-round > li").each(function() {
		if ($(this).find("ul.list-cols > li.name a.user.name").attr('href').split('=')[1] >= gOptions.newbieID) {
			if (!$(this).is(':hidden')) {
				$(this).hide();
				gOptions.hiddenNum++;
			}
		}
	});
	gOptions.isNewbieHidden = true;
	$("#competition-wrap #hiddenNum").text(gOptions.hiddenNum);
}
function hideShowPlayers(listOption, checkStatus) {
	var status;
	$("#competition-wrap .team-list-wrap .competition-list.bottom-round > li").each(function() {
		status = $(this).find("ul.list-cols li.status").text();

		if (checkStatus) {
			if (listOption === "hosp" && status === "Hospital") {
				$(this).hide();
				gOptions.hiddenNum++;
			} else if (listOption === "trav" && status === "Traveling") {
				$(this).hide();
				gOptions.hiddenNum++;
			} else if (listOption === "fede" && status === "Federal") {
				$(this).hide();
				gOptions.hiddenNum++;
			} else if (listOption === "okay" && status === "Okay") {
				$(this).hide();
				gOptions.hiddenNum++;
			}
		} else {
			if (listOption === "hosp" && status === "Hospital") {
				$(this).show();
				gOptions.hiddenNum--;
			} else if (listOption === "trav" && status === "Traveling") {
				$(this).show();
				gOptions.hiddenNum--;
			} else if (listOption === "fede" && status === "Federal") {
				$(this).show();
				gOptions.hiddenNum--;
			} else if (listOption === "okay" && status === "Okay") {
				$(this).show();
				gOptions.hiddenNum--;
			}
		}
	});
	$("#competition-wrap #hiddenNum").text(gOptions.hiddenNum);
}
function showLevelRange() {
	var pLevel = {
		lowLevel: parseInt(prompt('Lowest level shown?', '1')),
		highLevel: parseInt(prompt('Highest level shown?', '100')),
		currentLevel: 0
	};
	$("#competition-wrap .team-list-wrap .competition-list.bottom-round > li").each(function() {
		pLevel.currentLevel = $(this).find("ul.list-cols li.level").text();
		if (pLevel.currentLevel < pLevel.lowLevel || pLevel.currentLevel > pLevel.highLevel) {
			if (!$(this).is(':hidden')) {
				$(this).hide();
				gOptions.hiddenNum++;
			}
		} else if ($(this).is(':hidden')) {
			var status = $(this).find("ul.list-cols li.status").text();
			if (
				!($("#competition-wrap #hosp").prop('checked') && status === "Hospital") &&
				!($("#competition-wrap #trav").prop('checked') && status === "Traveling") &&
				!($("#competition-wrap #fede").prop('checked') && status === "Federal") &&
				!($("#competition-wrap #okay").prop('checked') && status === "Okay")
			) {
				$(this).show();
				gOptions.hiddenNum--;
			}
		}
	});
	if (gOptions.isNewbieHidden) {hideNewbies();}
	$("#competition-wrap #hiddenNum").text(gOptions.hiddenNum);
}
function sortPlayers(order) {
	var elements = [];
	$("#competition-wrap .team-list-wrap .competition-list.bottom-round > li").each(function() {
        elements.push(this);
    }).remove();
	elements.sort(function (a,b) {
		if (order === 'lasc' || order === 'ldesc') {
			a = parseInt($(a).find("ul.list-cols > li.level").text());
			b = parseInt($(b).find("ul.list-cols > li.level").text());
		} else if (order === 'aasc' || order === 'adesc') {
			a = parseInt($(a).find("ul.list-cols > li.rec-attacks").text());
			b = parseInt($(b).find("ul.list-cols > li.rec-attacks").text());
		}
		if (order === 'lasc' || order === 'aasc') {return a - b;}
		else  {return b - a;}
	});
	$(elements).each(function() {
        $("#competition-wrap .team-list-wrap .competition-list.bottom-round").append(this);
    });
}
function showHospTime() {
	if (gOptions.hospStatus) {
		$("#mainContainer").width($("#mainContainer").width() - 80);
		$("#mainContainer .content-wrapper").width($("#mainContainer .content-wrapper").width() - 80);

		$("#competition-wrap .competition-list-header .hTime").remove();
		$("#competition-wrap .team-list-wrap .competition-list.bottom-round > li").each(function() {
			$(this).find("ul.list-cols > li.hospitalTimer").remove();
		});
	} else {
		$("#mainContainer").width($("#mainContainer").width() + 80);
		$("#mainContainer .content-wrapper").width($("#mainContainer .content-wrapper").width() + 80);

		$("#competition-wrap .competition-list-header").append("<li class='hTime' style='width:48px'>Hosp. T</li>");
		$("#competition-wrap .team-list-wrap .competition-list.bottom-round > li").each(function() {
			if ($(this).find("ul.list-cols li.status").text() === "Hospital") {
				$(this).find("ul.list-cols").append(
					"<li class='hospitalTimer' style='width:48px''>"+
					$(this).find("ul.list-cols li.icons ul li#icon15").attr('title').split("data-time")[1].split(">")[1].split("<")[0]+
					"</li>"
				);
			} else {
				$(this).find("ul.list-cols").append("<li class='hospitalTimer' style='width:48px'>NULL</li>");
			}
		});
	}
	gOptions.hospStatus = !gOptions.hospStatus;
}
})();