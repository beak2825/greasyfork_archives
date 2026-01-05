// ==UserScript==
// @name        dirtrally stage stats
// @namespace   http://sportscores.de/dirt
// @description leaderboard stage times and rankings for weekly/monthly events
// @include     https://www.dirtgame.com/uk/events
// @version     1.01
// @require  https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @require  https://greasyfork.org/scripts/2199-waitforkeyelements/code/waitForKeyElements.js?version=6349
// @grant         GM_xmlhttpRequest
// @grant    GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/10802/dirtrally%20stage%20stats.user.js
// @updateURL https://update.greasyfork.org/scripts/10802/dirtrally%20stage%20stats.meta.js
// ==/UserScript==


var eventMode = {
	daily : 0,
	weekly : 1,
	monthly : 2,
	daily2 : 3,
	weekly2 : 4
};
var currentEventMode = eventMode.daily;
var eventModeInd = "";
var currentPlayer = null;
var currentPlayerName = "";
var playerList = [];

function initPlayerDataForRow(tableRow, isAdded) {
	var playerNode = tableRow.find(".player_name");
	var player = new Object();
	player.name = playerNode.html();
	if (player.name != "") {
		player.pos = playerNode.prev().prev().find(".ng-binding").html();
		player.car = playerNode.next().html();
		var timeTd = playerNode.next().next();
		player.time = timeTd.html();

		playerList.push(player);

		if (tableRow.hasClass("player_entry")) {
			player.isPlayer = true;
			currentPlayer = player;
			currentPlayerName = player.name;
		}
		
		if (currentEventMode != eventMode.daily && currentEventMode != eventMode.daily2) {
			if (isAdded) {				
				$(".event." + eventModeInd + " .ownplayer").remove();				
				
				timeTd.next().after("<td class='ownplayer'><span id='idDiff_" + eventModeInd + "_own' /></td>")
				.after("<td class='ownplayer'><span id='id_" + eventModeInd + "_own' /><span class='stagerank' id='id_" + eventModeInd + "_own_rank' /></td>");
			} else if ($("#id_" + eventModeInd + "_" + player.pos).length <= 0) {

				timeTd.next().after("<td><span id='idDiff_" + eventModeInd + "_" + player.pos + "' /></td>")
				.after("<td><span id='id_" + eventModeInd + "_" + player.pos + "' /><span class='stagerank' id='id_" + eventModeInd + "_" + player.pos + "_rank' /></td>");
			}
		}
	}
}

function handleAsyncData(jNode) {

	eventModeInd = getEventModePrefix();
	
	var selector = $("#" + eventModeInd + "_prevEvents");
	if (selector.length > 0 && selector[0].selectedIndex != 0)
		return;

	if (jNode.next().length > 0)
		initPlayerDataForRow(jNode);

	if (jNode.next().next().length == 0)
	{
		processData();
		currentPlayer = null;
		playerList = [];
	}
}

function postData(postDataObj) {
	var dataJson = JSON.stringify({
			dirtObj : postDataObj
		});

	GM_xmlhttpRequest({
		method : "POST",
		  url: "http://sportscores.de/dirt/Default.aspx/DirtCall",
		data : dataJson,
		headers : {
			'Content-Type' : 'application/json; charset=UTF-8'
		},
		onload : function (response) {
			postDataResponse(response.responseText);
		}
	});
}


function postDataResponse(response) {
	var json = jQuery.parseJSON(response);

	if (json.d) {
		var stageId = json.d.stageid;
		var indicateMode = json.d.eventmode;		

		// add header columns once
		if ($("#th_" + indicateMode).length <= 0 && $(".event." + indicateMode + " table").length > 0 && stageId > 1) {
			$(".event." + indicateMode + " table thead tr").append("<th style='width:150px; display:none;' id='th_" + indicateMode + "'><div class='" + indicateMode +
				" stageOverlay' style='position:relative'><div class='divStage' style='overflow:hidden'><span id='idStageTime_" + indicateMode +
				"' class='stageHead'></span><span id='idStageTime_" + indicateMode + "_rank' class='stagerank'></span></div></div></th>").append("<th style='width:150px; display:none;' id='thdiff_" +
				indicateMode + "'><span id='idStageTimeDiff_" + indicateMode + "'></span></th>");

			if (((indicateMode == "weekly" || indicateMode == "weekly2") && $("#" + indicateMode + "_stageid")[0].selectedIndex != 0) || indicateMode == "monthly") {
				$("#th_" + indicateMode).show();
				$("#thdiff_" + indicateMode).show();
				$("#idStageTime_" + indicateMode).html("<u>S." + stageId + " Time</u>");
				$("#idStageTimeDiff_" + indicateMode).html("S." + stageId + " Diff");
			}
		}

		var entriesStored = json.d.entries;
		var totalEntries = $(".event." + indicateMode + " .total > span")[0].textContent;

		$("#idStageTime_" + indicateMode + "_rank").html(entriesStored);
		if ($("#" + indicateMode + "_stageid")[0].selectedIndex > 0) {
			$.each(json.d.list, function (index, value) {				
				if (currentPlayerName === value.name && !$(".event." + indicateMode + " .player_entry").hasClass("ng-scope")) {
					
					$("#id_" + indicateMode + "_own").html(value.time);
					if (value.stagerank > 0)
						$("#id_" + indicateMode + "_own_rank").html(value.stagerank);
					$("#idDiff_" + indicateMode + "_own").html(value.diffTime);
				} else {
					$("#id_" + indicateMode + "_" + value.pos).html(value.time);
					if (value.stagerank > 0)
						$("#id_" + indicateMode + "_" + value.pos + "_rank").html(value.stagerank);
					$("#idDiff_" + indicateMode + "_" + value.pos).html(value.diffTime);

				}
			});
		}
		// build overlay table
		var rows = "";
		$.each(json.d.stagelist, function (index, value) {
			rows += "<tr class='" + (value.name == currentPlayerName ? "player" : "") + "'><td style='font-weight:bold;'>" + value.pos + "</td><td class='format'>" + value.name + "</td><td class='format'>" +
			value.car + "</td><td class='format2'>" + value.time + "</td><td class='format2'>" + value.diffTime + "</td></tr>";
		});
		var div = "<div class='topBetsLayer'><table class='overlayTable'><tr style='background-color:#F2F2F2;'><th colspan='3'>Stage " + stageId +
			" - Top 20</th><th colspan='2' style='text-align:right;font-weight:normal;'>Saved: " + entriesStored + " / " + totalEntries + "</th></tr>" + rows + "</table></div>";

		
		var elem = $("." + indicateMode + ".stageOverlay .divStage");		
		if(elem){
			$("." + indicateMode + ".stageOverlay .divStage .topBetsLayer").remove();
			elem.append(div);
		}		
		
		$("." + indicateMode + ".stageOverlay").on("mouseenter", function (event) {
			$(".topBetsLayer").show();
		});

		$("." + indicateMode + ".stageOverlay").on("mouseleave", function () {
			$(".topBetsLayer").hide();
		});
		
	}
}

function processData() {
	var eventId = -1;
	var stageId = -1;
	var stageName = "";
	var location = "";
	var weather1 = "";
	var weather2 = "";
	
	var userEntry = $(".event." + eventModeInd + " .player_entry");
	if (userEntry && currentPlayer == null) {		
		initPlayerDataForRow(userEntry, true);
	}

	eventId = $(".event." + eventModeInd).data().ngEventId;
	var locationVisible = false;

	switch (currentEventMode) {
	case eventMode.daily:
	case eventMode.daily2:
		stageId = 0;
		locationVisible = true;
		break;
	case eventMode.weekly:
	case eventMode.weekly2:
	case eventMode.monthly:
	
		stageId = $("#" + eventModeInd + "_stageid")[0].selectedIndex;
		
		if (currentEventMode == eventMode.monthly)
			stageId = stageId + 1;
		if (stageId == 0) {
			stageId = $("#" + eventModeInd + "_stageid")[0].options.length - 1;
			$("#th_" + eventModeInd).hide();
			$("#thdiff_" + eventModeInd).hide();
		} else if (stageId <= 1) {
			$("#th_" + eventModeInd).hide();
			$("#thdiff_" + eventModeInd).hide();
			locationVisible = true;
		} else {
			$("#th_" + eventModeInd).show();
			$("#thdiff_" + eventModeInd).show();
			$("#idStageTime_" + eventModeInd).html("<u>S." + stageId + " Time</u>");
			$("#idStageTimeDiff_" + eventModeInd).html("S." + stageId + " Diff");
			locationVisible = true;
		}
		break;
	}

	if (locationVisible && $(".event." + eventModeInd + " li.ng-scope").length > 0) {
		
		location = $(".event." + eventModeInd + " li.ng-scope")[0].textContent;
		stageName = $(".event." + eventModeInd + " li.ng-scope")[1].textContent;
		weather1 = $(".event." + eventModeInd + " .name > span")[0].textContent,
		weather2 = $(".event." + eventModeInd + " .name > span")[1].textContent
	}

	var trackData = {
		location : location,
		stageName : stageName,
		stageId : stageId,
		eventid : eventId,
		eventMode : currentEventMode,
		weather1 : weather1,
		weather2 : weather2
	};

	var postDataObj = {
		trackData : trackData,
		data : playerList
	};

	postData(postDataObj);
}

waitForKeyElements(".event.daily.ng-scope .table tbody tr.ng-scope", handleAsyncDataD);
waitForKeyElements(".event.daily2.ng-scope .table tbody tr.ng-scope", handleAsyncDataD2);
waitForKeyElements(".event.weekly .table tbody tr.ng-scope", handleAsyncDataW);
waitForKeyElements(".event.weekly2 .table tbody tr.ng-scope", handleAsyncDataW2);
waitForKeyElements(".event.monthly.ng-scope .table tbody tr.ng-scope", handleAsyncDataM);

GM_addStyle("div.topBetsLayer { z-index: 2; top: -39px; left:-500px; padding-top:2px; min-height: 70px; width: 500px; background-color: #fff; position: absolute; display:none; color: #000; font-family:Tahoma; font-size:12px; font-weight: normal; };" +
	".stageBoard { font-weight:bold;font-size:12px;padding-left:10px;}" +
	".overlayTable {width:98%;margin-top:5px;border:1px solid #000;background-color:#fff;}" +
	".stagerank {font-weight:bold;position:relative;top:-6px;left:5px; font-size:11px;font-family:Arial;}" +
	".player {background-color: #E0F4F3;}" +
	".stageHead {cursor:pointer;}" +
	".overlayTable .format {overflow:hidden; white-space:nowrap; max-width:120px;}" +
	".overlayTable .format2 {text-align:right;}");

function handleAsyncDataD(jNode) {
	currentEventMode = eventMode.daily;
	handleAsyncData(jNode);
}
function handleAsyncDataD2(jNode) {
	currentEventMode = eventMode.daily2;
	handleAsyncData(jNode);
}
function handleAsyncDataW(jNode) {
	currentEventMode = eventMode.weekly;
	handleAsyncData(jNode);
}
function handleAsyncDataW2(jNode) {
	currentEventMode = eventMode.weekly2;
	handleAsyncData(jNode);
}
function handleAsyncDataM(jNode) {
	currentEventMode = eventMode.monthly;
	handleAsyncData(jNode);
}

function getEventModePrefix() {
	switch (currentEventMode) {
	case eventMode.daily:
		return "daily";
	case eventMode.daily2:
		return "daily2";
	case eventMode.weekly:
		return "weekly";
	case eventMode.weekly2:
		return "weekly2";
	case eventMode.monthly:
		return "monthly";
	}
	return "";
}
