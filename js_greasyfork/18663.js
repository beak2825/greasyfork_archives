// ==UserScript==
// @name         History
// @namespace    http://github.com/kba
// @version      0.1
// @description  try to take over the world!
// @author       kba
// @match        */*
// @noframes
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_getResourceText
// @grant        GM_registerMenuCommand
// @require      https://code.jquery.com/jquery-2.2.3.min.js
// @require      https://code.jquery.com/ui/1.11.4/jquery-ui.min.js
// @resource     jquery_ui_theme https://code.jquery.com/ui/1.11.4/themes/start/jquery-ui.css
// @downloadURL https://update.greasyfork.org/scripts/18663/History.user.js
// @updateURL https://update.greasyfork.org/scripts/18663/History.meta.js
// ==/UserScript==

/*jshint esversion: 6 */
/*global window */
/*global $ */
/*global GM_registerMenuCommand */
/*global GM_addStyle */
/*global GM_getResourceText */
/*global GM_setValue */
/*global GM_getValue */

var ID_CONFIG = 'gm-history-dialog';
var CLASS_VISITED = 'gm-history-visited';
var CLASS_BLURRED = 'gm-history-class-blurred';
var GM_HISTORY_CSS = `
	.${CLASS_BLURRED}, .${CLASS_BLURRED} * { opacity: 0.2 !important }
	#${ID_CONFIG} { overflow-y: scroll; max-height: 100%; }
	#${ID_CONFIG} h3 { width: 20%; float: left; }
	#${ID_CONFIG} h3 + * { width: 75%; float:right; }
	#${ID_CONFIG} div { clear: left; }
`;
var HTML_CONFIG = `
<div id="${ID_CONFIG}" title="Config GM History">
	<div>
		<h3>Current History</h3>
		<input type='text'></input>
	</div>
	<div>
		<h3>Edit History</h3>
		<textarea rows=10></textarea>
	</div>
</div>
`;


function getCurrentHistoryName() {
	return GM_getValue("current", "default");
}
function setCurrentHistoryName(name) {
	return GM_setValue("current", name);
}
function loadHistory() {
	// return {};
	return JSON.parse(GM_getValue("history_" + getCurrentHistoryName(), "{}"));
}
function saveHistory(hist) {
	var name = getCurrentHistoryName();
	return GM_setValue("history_" + name, JSON.stringify(hist));
}

function cleanURL(url) {
	if (url.substring(0, 1) === '/') {
		url = window.location.protocol + "//" + window.location.host + url;
	}
	return url
		.replace(/#.*$/, "")
		.replace(/&pkey.*$/, '')
		.toLowerCase();
}

function addHistory(url, hist) {
	if (!hist) {
		hist = loadHistory();
	}
	hist[cleanURL(url)] = new Date();
	saveHistory(hist);
}

/*
 * Public API
 */
function afterPageLoad() {
	var hist = loadHistory();
	addHistory(window.location.href, hist);
	markVisited();
}

function markVisited() {
	var hist = loadHistory();
	console.log("History size: " + Object.keys(hist).length);
	$("a[href]").each(function() {
		var $a = $(this);
		var linkUrl = cleanURL($a.attr("href"));
		if (hist[linkUrl]) {
			$a.addClass(CLASS_VISITED);
		}
	});
}

function openDialog() {
	var hist = loadHistory();
	var asText = "";
	for (var url in hist) {
		asText += hist[url] + " :: " + url + "\n";
	}
	$(`#${ID_CONFIG} textarea`).html(asText);
	$(`#${ID_CONFIG}`).dialog("open");
}

function addDialog() {
	$(HTML_CONFIG).appendTo('body').dialog({
		autoOpen: false,
		modal: true,
		resizable: true,
		height: 300,
		width: "95vw",
		buttons: {
			"Save": function() {
				var hist = {};
				var lines = $(`#${ID_CONFIG} textarea`).val().split(/\n/);
				for (var i = 0; i < lines.length ; i++) {
					var line = lines[i].split(/\s*::\s*/);
					hist[line[1]] = line[0];
				}
				saveHistory(hist);
				$(this).dialog("close");
			}
		}
	});
	$(`#${ID_CONFIG} input`).attr('placeholder',  getCurrentHistoryName());
}

function promptName() {
	var newName = window.prompt("New history name? [Current: " + getCurrentHistoryName() + "]");
	if (newName) {
		setCurrentHistoryName(newName);
	}
}

function toggleBlurVisited() {
	markVisited();
	var visited = $(`.${CLASS_VISITED}`);
	console.log(`Marking ${visited.length} links blurred`);
	visited.addClass(CLASS_BLURRED);
}

(function() {
	"use strict";
	GM_addStyle(GM_getResourceText("jquery_ui_theme"));
	GM_addStyle(GM_HISTORY_CSS);
	afterPageLoad();
	addDialog();
	GM_registerMenuCommand("Configure History", openDialog, "f");
	GM_registerMenuCommand("Blur visited", toggleBlurVisited, "b");
}());

// vim: sw=4 noet :
