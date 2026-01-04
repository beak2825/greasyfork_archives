// ==UserScript==
// @name        HowLongDidITake
// @namespace   https://greasyfork.org/en/users/6503-turk05022014
// @description Record how long each HIT took to complete. Lists results on status_details page.
//              Has the ability to Export Times to clipboard in json format.
//              Has the ability to Import Times in json format.
//              When updating or switching browsers, exporting a backup may be beneficial.
// @match       https://worker.mturk.com/status_details/*
// @match       https://worker.mturk.com/projects/*/tasks/*?assignment_id=*
// @require     https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @version     3.0.20180210
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_deleteValue
// @grant       GM_listValues
// @grant       GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/37464/HowLongDidITake.user.js
// @updateURL https://update.greasyfork.org/scripts/37464/HowLongDidITake.meta.js
// ==/UserScript==
this.$ = this.jQuery = jQuery.noConflict(true);
var startTime = Date.now();
var rgxID = /assignment_id[^=]*?=([^&]+)/i;
var hits = JSON.parse(GM_getValue("hits", "{}"));
if (Object.keys(hits).length == 0)
	convert();
$(function () {
	if (location.pathname.indexOf("/status_details/") >= 0) {
		if ((Date.now()-(1000*60*60*24)) > GM_getValue("checkedCache", 0)) {
			GM_setValue("checkedCache", Date.now());
			setTimeout(checkCache, 1000);
		}
		$(".table-row").on('click', insertTime);
		$('.expand-projects-button').on('click', function () {
			$(".table-row").each(insertTime);
		});
		addBorder();
		addButton("Import Times", importTimes);
		addButton("Export Times", exportTimes);
	} else {
		var match = rgxID.exec(location.search);
		if (!match)
			return;
		$(window).on('unload', function () {
			var endTime = Date.now();
			hits = JSON.parse(GM_getValue("hits", "{}"));
			hits[match[1]] = { time: parseInt((endTime-startTime)/1000), added: endTime };
			GM_setValue("hits", JSON.stringify(hits));
		});
	}
});
function convert() {
	GM_listValues().forEach(function (key) {
		if (key == "checkedCache" || key == "hits")
			return;
		var value = JSON.parse(GM_getValue(key));
		hits[key] = value;
	});
	GM_setValue("hits", JSON.stringify(hits));
}
function checkCache() {
	for (var key in hits)
		if (hits[key].added < (Date.now() - (1000 * 60 * 60 * 24 * 151)))
			delete hits[key];
	GM_setValue("hits", JSON.stringify(hits));
}
function importTimes() {
	if ($("#hlditimportbox").length > 0) {
		$("#hlditimportbox").remove();
		return;
	}
	$(".status-details-controls").after('<div id="hlditimportbox">' +
	    '<textarea rows="12" style="resize:none;width:100%;" id="hlditimporttxt"></textarea><br>' +
		'<input id="hlditimportbtn" class="btn btn-secondary" type="button" value="Import">' +
	'</div>');
	$("#hlditimportbtn").on('click', function () {
		hits = JSON.parse(GM_getValue("hits", "{}"));
		try {
			var times = JSON.parse($("#hlditimporttxt").val());
			for (var key in times)
				hits[key] = times[key];
			GM_setValue("hits", JSON.stringify(hits));
			$("#hlditimportbox").append("<br>Imported.<br>");
		} catch(e) {
			$("#hlditimportbox").append("<br>" + e.name + ":" + e.message + "<br>");
		}
	});
}
function exportTimes() {
	hits = JSON.parse(GM_getValue("hits", "{}"));
	GM_setClipboard(JSON.stringify(hits), "text");
}
function insertTime() {
	var row = this;
	var match = rgxID.exec($(row).find('.desktop-row a:contains("Contact Requester")').first().attr("href"));
	if (match && hits[match[1]]) {
		setTimeout(function () {
			if ($(row).find(':contains("Time to complete")').length > 0)
				return;
			$(row).find(".expanded-row-content").append(
				'<h6>Time to complete</h6>' + hms(parseInt(hits[match[1]].time)) +
				'<h6 style="margin-top:14px;">Completed</h6>' + (new Date(hits[match[1]].added)).toLocaleTimeString()
			);
		}, 500);
	}
}
function hms(seconds) {
	var hours = Math.floor(seconds/(60*60));
	seconds -= (hours*60*60);
	var minutes = Math.floor(seconds/60);
	seconds -= (minutes*60);
	return (hours < 10 ? "0" : "") + hours + ":" +
		   (minutes < 10 ? "0" : "") + minutes + ":" +
		   (seconds < 10 ? "0" : "") + seconds;
}
function addButton(title, func) {
	$(".status-details-controls").append(
		'<div style="float:left; margin-left: 10px; margin-top: 2px;">\
		 <input id="hlditbtn'+func.name+'" class="btn btn-secondary" type="button" value="'+title+'"></div>');
	$("#hlditbtn"+func.name).on('click', func);
}
function addBorder() {
	$(".status-details-controls").append('<div style="border-left: 1px solid rgb(220, 140, 27); float: left; margin-top: 6px; margin-left: 14px;">&nbsp;</div>');
}