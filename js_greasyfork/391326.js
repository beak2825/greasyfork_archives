// ==UserScript==
// @name         PTP - Enhanced Bonus Point Rates
// @namespace    Gerbil
// @version      0.1.20201020
// @date         2020-10-20
// @description  Displays all BP-earning torrents in a single sortable table.  Displays bonus points per day/year per GiB for each torrent.
// @author       Gerbil
// @match        https://passthepopcorn.me/bprate.php
// @match        https://passthepopcorn.me/bonus.php
// @downloadURL https://update.greasyfork.org/scripts/391326/PTP%20-%20Enhanced%20Bonus%20Point%20Rates.user.js
// @updateURL https://update.greasyfork.org/scripts/391326/PTP%20-%20Enhanced%20Bonus%20Point%20Rates.meta.js
// ==/UserScript==
/* globals $ */

/*
=====[ Notes ]=====

- Adds a link on page '/bonus.php' (named 'Enhanced bonus point rates') that points to the enhanced page '/bprate.php#enhanced'.
- Only '/bprate.php#enhanced' is operated on; '/bprate.php' functions and appears as normal.
- Torrent summary columns: torrent count, total size, BP/day, BP/month, BP/year, BP/day/GiB, BP/month/GiB, BP/year/GiB.
- Torrent listing columns: name, gp, size, seeders, days seeded, BP/day, BP/day/GiB, BP/year/GiB.
- All torrent listing columns are sortable (on title click) in ascending and descending order.
- BP/day/GiB and BP/year/GiB values are color-coded on a green to yellow to red scale.
- When the setting 'ScrapeSnatchList' is "true", background scraping of 'snatchlist.php' is enabled.
  - This adds a 'ratio' column to the torrent listing table which uses the stock CSS class colors.
  - If a torrent's download amount is 94% or higher and has seed time remaining, its row in the table will have a red(ish) background.

=====[ Change log ]=====

0.1.20201020
- Fixed the no-torrents-seeded check
0.1.20200906
- Fixed issue with scraping torrent ratios shown as '--' (which lack an enclosing 'span' element)
- Fixed issue with scraping torrent size for a small range of values.
- Changed 'PageFetchDelay' setting from 1,000 to 2,000.
0.1.20200514
- Added check for condition when no torrents are being seeded
0.1.20191002
- Initial release version

Tested in Firefox Quantum 69.0.1 64-bit with Violentmonkey v2.11.2
Tested in Chrome 77.0.3865.90 64-bit with Tampermonkey v4.8.41

=====[ Consider ]=====

- Fetch and parse the first bprate.php page manually to avoid potential conflicts with userscripts that alter the DOM of this page.
  - Would do this anyway if we request sorting from the server.  Use name/size sorting to avoid race condition inconsistencies?
- Separate table sorting argument into type and direction.
- Perhaps switch from a linear to logarithmic or parabolic color scale.  Would probably need to test multiple people and multiple displays.
- Name currently-anonymous functions?

=====[ Internal Notes ]=====

- There could be an issue with number formatting differences due to localization if this has been implemented on the site.  Clarification required.
- I have yet to receive feedback on a reasonable page fetch delay to use.
- The internally generated data can be viewed from a developer console with: $("#ScriptLog")[0].Torrents
- It seems that innerText/textContent in the DOM of the fabricated document(s) (when a page is fetched) have trouble (at least in Chrome) parsing the clusterfuck of a way that many cell values are presented, hence the implementation of the 'FixText' function.
- Because of the way developers decided to implement the 'table--striped' style class, we have to re-color every cell in an HnR candidate row
  - .table--striped>tbody>tr:nth-child(odd)>td, .table--striped>tbody>tr:nth-child(odd)>th { background-color: #424242; }

Alternative scripts:
	_Greasemonkey Script: Bonus Point Optimization_ | Chameleon | https://passthepopcorn.me/forums.php?page=1&action=viewthread&threadid=28382
	_Greasemonkey: Bonus point optimization_ | Fermis | https://passthepopcorn.me/forums.php?page=1&action=viewthread&threadid=26519
	_Greasemonkey Script: Optimal BP earning (BP over 1yr per GiB)_ | coj | https://passthepopcorn.me/forums.php?page=1&action=viewthread&threadid=25674
*/

(function() {
	"use strict";

	/* ==========[ Settings ]========== */

	var ScrapeSnatchList = true, // Adds torrent ratio column and HnR status identificattion. Triples (or more) page requests
		DefaultTableSort = "name-asc", // <name, gp, size, seeders, time, bpd, bpdgb, bpygb>-<asc, desc>
		PageFetchDelay = 2000, // Delay in milliseconds between background page fetch requests
		Debugging = false; // When true, limits page requests and doesn't hide the script log table when finished

	/* ==========[ Resources ]========== */

	var icons = {
		seeds: '<svg width="20px" height="20px" style="fill: currentColor" enable-background="new -282.4 400.8 44.9 41.1" fill="#000" version="1.1" viewBox="-282.4 400.8 44.9 41.1" xml:space="preserve" xmlns="http://www.w3.org/2000/svg"><title>Seeders</title><g transform="translate(-406 -285)"><path d="m130.8 705.6c-3.2 3.2-10.2 15.2-5.7 19.8 1 1 2.4 1.5 4.2 1.5s4-0.5 6.5-1.5c3.5-1.4 7.3-3.7 9.1-5.6 3.9-3.9 3.9-10.2 0-14.1-3.9-4-10.2-4-14.1-0.1zm11.3 11.3c-1.3 1.3-4.4 3.3-7.8 4.7-3.8 1.5-5.8 1.4-6.3 0.9-1.4-1.4 1.8-10.3 5.7-14.1 1.2-1.2 2.7-1.8 4.2-1.8 1.1 0 2.2 0.3 3.2 0.9-0.9 0.1-2.1 0.7-3.2 1.7-1.6 1.6-2.2 3.5-1.4 4.2 0.8 0.8 2.7 0.1 4.2-1.4 1.1-1.1 1.7-2.4 1.7-3.3 2 2.5 1.9 6-0.3 8.2z"/><path d="m167 697.9c-1.4-3.5-3.7-7.3-5.6-9.1-3.9-3.9-10.2-3.9-14.1 0-1.9 1.9-2.9 4.4-2.9 7.1s1 5.2 2.9 7.1c2.4 2.4 10.1 7.2 15.6 7.2 1.7 0 3.1-0.4 4.2-1.5 1.9-2.1 1.9-5.8-0.1-10.8zm-2.8 7.8c-1.4 1.4-10.3-1.8-14.1-5.7-1.1-1.1-1.8-2.6-1.8-4.2 0-1.1 0.3-2.1 0.8-3 0.3 0.7 0.8 1.4 1.5 2.1 1.6 1.6 3.5 2.2 4.2 1.4 0.8-0.8 0.1-2.7-1.4-4.2-0.7-0.7-1.4-1.2-2.1-1.4 0.9-0.5 1.9-0.8 3-0.8 1.5 0 3.1 0.6 4.2 1.8 1.3 1.3 3.3 4.4 4.7 7.8 1.6 3.7 1.5 5.8 1 6.2z"/><path d="m137.7 696.6c1.2-1.2 1.2-3.3 0-4.5s-3.3-1.2-4.5 0-3.5 5.5-2.3 6.8 5.5-1.1 6.8-2.3z"/><path d="m156.3 715.9c-1.2 1.2-1.2 3.3 0 4.5s5.5 3.5 6.8 2.3-1-5.5-2.3-6.8-3.3-1.2-4.5 0z"/></g></svg>'
	};

	/* ==========[ Switchboard ]========== */

	var Torrents = {
		list: [], map: {}, stats: {},
		bprPageCount: 0, bprPagesScraped: 0,
		slPageCount: 0, slPagesScraped: 0, slScrapingFinished: false
	},
		StartTime = Now();

	// =====[ /bonus.php
	if (window.location.pathname === "/bonus.php") {
		$(".linkbox").append(' [<a href="/bprate.php#enhanced">Enhanced bonus point rates</a>]');
		return;
	}
	// =====[ /bprate.php#enhanced
	if (window.location.pathname === "/bprate.php" && window.location.hash === "#enhanced") {
		GetStarted();
	}

	/* ==========[ Utility functions ]========== */

	function Log(message) {
		var runTime = "[" + FloatToString((Now() - StartTime) / 1000, 2) + "]";

		Torrents.log = Torrents.log || $("#ScriptLog tbody");
		Torrents.log.prepend('<tr><td>'+ runTime + ' ' + message + '</td></tr>');
	}

	function Now() {
		return new Date().getTime();
	}

	function ToInt(string) {
		return parseInt(string.split(",").join(""));
	}

	function ToFloat(string) {
		return parseFloat(string.split(",").join(""));
	}

	function FloatToString(number, precision) {
		var parts;

		number = parseFloat(number).toFixed(precision || 0);
		parts = String(number).split(".");
		parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
		return parts.join(".");
	}

	function SizeToGiB(size) {
	  var units = [ "KiB", "MiB", "GiB", "TiB" ],
		  scales = [ 1048576, 1024, 1, 0.0009765625 ], // [ 1024 << 10, 1024, 1, 1 / 1024 ]
		  split = size.split(" ");

	  return ToFloat(split[0]) / (scales[ units.indexOf(split[1]) ] || 1);
	}

	function FixText(text) {
		var firstChar;

		text = String(text); // Shouldn't be needed
		while(text.length > 0) {
			firstChar = text.charCodeAt(0);
			if (firstChar !== 10 && firstChar !== 13) { break; }
			text = text.slice(1);
		}
		return text.trim();
	}

	function PickColor(value) {
		return "rgb(" + Math.min(Math.round(512 * (1 - value)), 255) + ", " + Math.min(Math.round(512 * value), 255) + ", 0)";
	}

	function GetPage(url, onSuccess) {
		Log("Requesting page: " + url);
		$.ajax(url, {
			success: function getPageSuccess(data) {
				// Should avoid re-executing scripts in the context of the current page
				var newDoc = document.implementation.createHTMLDocument();
				newDoc.open();
				newDoc.write(data);
				newDoc.close();
				onSuccess(newDoc);
			},
			error: function getPageError(req, status, error) {
				var message = "Failed to fetch page '" + url + "': " + status + " - " + error + ". This has halted the EBPR script.";

				Log(message);
				throw message;
			}
		});
	}

	/* ==========[ Main logic ]========== */

	function GetStarted() {
		var temp;

		// Determine how many BPR pages we have
		if (Debugging) Torrents.bprPageCount = 1;
		else {
			temp = $(".pagination__link--last");
			if (temp.length) Torrents.bprPageCount = parseInt(temp[0].href.split("page=")[1].split("&")[0]);
			else Torrents.bprPageCount = 1;
		}
		// Prep the display area
		PrepDisplay();
		// Scrape the current page
		ScrapeBPR(document);
	}

	function PrepDisplay() {
		var content;

		// Create content closure, append existing linkbox, and add to it
		content = $('<div id="GerbilBPR" class="page__main-content"><h2 style="text-align: center">Bonus point rates (enhanced)</h2>').append(
			$(".linkbox").clone().append(' [<a href="/bprate.php">Switch to original view</a>]'),
			'<div id="ScriptLog" style="padding-bottom: 1em"><table class="table table--panel-like table--bordered table--striped"><thead><tr><th>Gerbil EBPR script log</th><tr></thead><tbody></tbody>',
			'<div id="TorrentSummary">',
			'<div id="TorrentList">'
		);
		// This shouldn't be necessary, but safety first
		$("#GerbilBPR").remove();
		// Hide the stock page 'content' and show our own
		$("#content").hide();
		$("#content").after(content);
	}

	function ScrapeBPR(doc) {
		var cells, summary,
			stats = Torrents.stats,
			rows = $("#content table > tbody", doc).last().find("tr"),
			page = Torrents.bprPagesScraped + 1;

		// Scrape table rows
		if (FixText($("#content table > tbody", document).last().find("tr").children("td").first().text()) === "0") {
			Log("You don't appear to be seeding any torrents.");
			return;
		}
		Log("Scraping page " + page + " / " + Torrents.bprPageCount + " of bprate.php");
		rows.each(function eachRowBPR() {
			var cells = this.cells,
				temp = cells[0].children[0],
				entry = {
					name: FixText(temp.textContent),
					url: temp.href,
					gp: FixText(cells[1].textContent).length,
					size: FixText(cells[2].textContent),
					seeders: FixText(cells[3].textContent),
					time: FixText(cells[4].textContent),
					seedSeconds: parseInt(cells[4].getAttribute("data-seed-seconds")),
					bph: FixText(cells[5].textContent),
					bpd: FixText(cells[6].textContent),
					bpw: FixText(cells[7].textContent),
					bpm: FixText(cells[8].textContent),
					bpy: FixText(cells[9].textContent)
				};
			entry.id = entry.url.split("torrentid=")[1].split("&")[0];
			entry.sizeGiB = SizeToGiB(entry.size);
			entry.bpdgb = ToFloat(entry.bpd) / entry.sizeGiB;
			entry.bpygb = ToFloat(entry.bpy) / entry.sizeGiB;
			Torrents.list.push(entry);
			Torrents.map[entry.id] = entry;

			// Statistical book-keeping
			if (entry.bpdgb < stats.minBpdgb) stats.minBpdgb = entry.bpdgb;
			if (entry.bpdgb > stats.maxBpdgb) stats.maxBpdgb = entry.bpdgb;
			if (stats.minBpdgb === undefined) {
				stats.minBpdgb = entry.bpdgb;
				stats.maxBpdgb = entry.bpdgb;
			}
			if (entry.bpygb < stats.minBpygb) stats.minBpygb = entry.bpygb;
			if (entry.bpygb > stats.maxBpygb) stats.maxBpygb = entry.bpygb;
			if (stats.minBpygb === undefined) {
				stats.minBpygb = entry.bpygb;
				stats.maxBpygb = entry.bpygb;
			}
		});

		// Last BPR page, scrape summary and finish up stats
		if (page === Torrents.bprPageCount) {
			Log("Scraping BPR summary");
			// Scrape summary table
			cells = $("#content table > tbody", doc).first().find("tr")[0].cells;
			summary = {
				torrentCount: FixText(cells[0].textContent),
				totalSize: FixText(cells[1].textContent),
				bph: FixText(cells[2].textContent),
				bpd: FixText(cells[3].textContent),
				bpw: FixText(cells[4].textContent),
				bpm: FixText(cells[5].textContent),
				bpy: FixText(cells[6].textContent)
			};
			summary.totalSizeGiB = SizeToGiB(summary.totalSize);
			summary.bpdgb = ToFloat(summary.bpd) / summary.totalSizeGiB;
			summary.bpmgb = ToFloat(summary.bpm) / summary.totalSizeGiB;
			summary.bpygb = ToFloat(summary.bpy) / summary.totalSizeGiB;
			Torrents.summary = summary;

			// Statistical book-keeping
			stats.rangeBpdgb = stats.maxBpdgb - stats.minBpdgb;
			stats.rangeBpygb = stats.maxBpygb - stats.minBpygb;
		}

		Torrents.bprPagesScraped++;
		Dispatch();
	}

	function ScrapeSL(doc) {
		var temp, index, cells, torrent,
			rows = $("#content table > tbody", doc).last().find("tr"),
			page = Torrents.slPagesScraped + 1;

		// Scrape table rows
		Log("Scraping page " + page + " of snatchlist.php");
		for (index = 0; index < rows.length; index++) {
			cells = rows[index].cells;

			// See if we've reached the end of seeded torrents
			if (cells[7].children[0].textContent === "No") {
				Torrents.slScrapingFinished = true;
				break;
			}
			// Is this a torrent we know about?
			if (!( torrent = Torrents.map[cells[0].children[0].href.split("torrentid=")[1].split("&")[0]] )) continue;
			// Store downloaded%, ratio, seed time left
			torrent.downloadedPercent = parseInt(FixText(cells[2].children[0].textContent).split("(")[1].split("%")[0]);
			torrent.ratio = parseFloat(FixText(cells[3].textContent));
			temp = FixText(cells[3].textContent);
			if (temp === "--") torrent.ratio = temp;
			else if (cells[3].children[0].className === "ratio-infinite") {
				torrent.ratio = "&infin;";
			}
			else { torrent.ratio = parseFloat(temp); }
			if (cells[3].children[0] && cells[3].children[0].className) {
				torrent.ratioClass = cells[3].children[0].className;
            }
			torrent.seedTimeLeft = FixText(cells[8].textContent);
			// HnR candidate?
			if (torrent.downloadedPercent >= 94 && torrent.seedTimeLeft !== "Complete") {
				torrent.hnr = true;
			}
		}

		Torrents.slPagesScraped++;
		// Determine how many SL pages we have
		if (!Torrents.slPageCount) {
			temp = $(".pagination__link--last", doc);
			if (temp.length) Torrents.slPageCount = parseInt(temp[0].href.split("page=")[1].split("&")[0]);
			else Torrents.slPageCount = 1;
		}
		// Determine if we're finished
		if (Debugging || Torrents.slPageCount === Torrents.slPagesScraped) {
			Torrents.slScrapingFinished = true;
		}
		Dispatch();
	}

	function Dispatch() {
		// Request next BPR page
		if (Torrents.bprPagesScraped < Torrents.bprPageCount) {
			setTimeout(function getBprPage() {
				GetPage("bprate.php?page=" + (Torrents.bprPagesScraped + 1), ScrapeBPR);
			}, PageFetchDelay);
			return;
		}
		// Request next SL page
		else if (ScrapeSnatchList && !Torrents.slScrapingFinished) {
			setTimeout(function getSlPage() {
				GetPage("/snatchlist.php?full=1&page=" + (Torrents.slPagesScraped + 1) + "&order_by=seeding&order_way=desc", ScrapeSL);
			}, PageFetchDelay);
			return;
		}

		// Make the Torrents object available for debugging
		$("#ScriptLog")[0].Torrents = Torrents;

		// Finished scraping, display results
		ShowContent();
	}

	function SortName(a, b) {
		if (a.name < b.name) return -1;
		if (a.name > b.name) return 1;
		return 0;
	}
	function SortGP(a, b) { return a.gp - b.gp; }
	function SortSize(a, b) { return a.sizeGiB - b.sizeGiB; }
	function SortSeeders(a, b) { return ToInt(a.seeders) - ToInt(b.seeders); }
	function SortTime(a, b) { return a.seedSeconds - b.seedSeconds; }
	function SortRatio(a, b) {
		if (a.ratio === b.ratio) return 0;
		if (a.ratio === "&infin;") return 1;
		if (b.ratio === "&infin;") return -1;
		if (a.ratio === "--") return 1;
		if (b.ratio === "--") return -1;
		if (a.ratio === undefined) return -1;
		if (b.ratio === undefined) return 1;
		return a.ratio - b.ratio;
	}
	function SortBPD(a, b) { return ToFloat(a.bpd) - ToFloat(b.bpd); }
	function SortBPDGB(a, b) { return a.bpdgb - b.bpdgb; }
	function SortBPYGB(a, b) { return a.bpygb - b.bpygb; }

	function ShowContent(order) {
		order = order || DefaultTableSort;
		var table, tbody, tr, index,
			list = Torrents.list, summary = Torrents.summary, stats = Torrents.stats,
			sortAsc = [ "name-asc", "gp-asc", "size-asc", "seeders-asc", "time-asc", "ratio-asc", "bpd-asc", "bpdgb-asc", "bpygb-asc" ],
			sortDesc = [ "name-desc", "gp-desc", "size-desc", "seeders-desc", "time-desc", "ratio-desc", "bpd-desc", "bpdgb-desc", "bpygb-desc" ],
			sortFunc = [ SortName, SortGP, SortSize, SortSeeders, SortTime, SortRatio, SortBPD, SortBPDGB, SortBPYGB ];

		// Perform torrent sorting
		Log("Creating display content");
		if ((index = sortAsc.indexOf(order)) > -1) {
			list.sort(sortFunc[index]);
		}
		else if ((index = sortDesc.indexOf(order)) > -1) {
			list.sort(sortFunc[index]);
			list.reverse();
		}

		// Create torrent summary table
		table = $('<table id="TorrentSummary" class="table table--panel-like table--bordered table--striped"><thead><tr><th>Torrent count</th><th>Total size</th><th>BP/day</th><th>BP/month</th><th>BP/year</th><th>BP/day/GiB</th><th>BP/month/GiB</th><th>BP/year/GiB</th></tr></thead>');
		$('<tr>').append(
			'<td>' + summary.torrentCount,
			'<td>' + summary.totalSize,
			'<td>' + summary.bpd,
			'<td>' + summary.bpm,
			'<td>' + summary.bpy,
			'<td>' + FloatToString(summary.bpdgb, 1),
			'<td>' + FloatToString(summary.bpmgb, 1),
			'<td>' + FloatToString(summary.bpygb, 1)
		).appendTo('<tbody>').appendTo(table);
		// Replace placeholder with generated table
		$("#TorrentSummary").replaceWith(table);

		// Create torrent list table
		table = $('<table id="TorrentList" class="table table--panel-like table--bordered table--striped">');
		// Create table head
		tr = $('<tr>');
		sortAsc.map(function(sort, index) {
			if (sort === order) return sortDesc[index];
			return sort;
		}).forEach(function(sort, index) {
			$('<th style="text-align: center"><a style="cursor: pointer">' +
				[ "Name", "GP", "Size", icons.seeds, "Days", "Ratio", "BP<br>/day", "BP/day<br>/GiB", "BP/yr<br>/GiB" ][index] + '</a>'
			).click(function() {
				ShowContent(sort);
			}).appendTo(tr);
		});
		tr.children().first().css("text-align", "left");
		$('<thead>').append(tr).appendTo(table);
		// Create table body
		tbody = $('<tbody>');
		list.forEach(function(torrent) {
			$((torrent.hnr ? '<tr class="HnRfix">' : '<tr>')).append(
				'<td><a href="' + torrent.url + '">' + torrent.name,
				'<td style="text-align: center">' + ((torrent.gp > 0) ? "&#x273F;" : ""),
				'<td>' + torrent.size,
				'<td>' + torrent.seeders,
				'<td>' + FloatToString(torrent.seedSeconds / 86400, 1),
				'<td class="EBPRratio EBPRshadow ' + (torrent.ratioClass || '') + '" style="text-align: center">' + (torrent.ratio !== undefined && ((typeof(torrent.ratio) === "string") ? torrent.ratio : FloatToString(torrent.ratio, 2)) || "NA"),
				'<td>' + torrent.bpd,
				'<td class="EBPRshadow"><span style="color: ' + PickColor((torrent.bpdgb - stats.minBpdgb) / stats.rangeBpdgb) + '">' + FloatToString(torrent.bpdgb, 1) + '</span>',
				'<td class="EBPRshadow"><span style="color: ' + PickColor((torrent.bpygb - stats.minBpygb) / stats.rangeBpygb) + '">' + FloatToString(torrent.bpygb, 1) + '</span>'
			).appendTo(tbody);
		});
		// Hide ratio if we didn't scrape snatchlist.php
		if (!ScrapeSnatchList) {
			table.find("th").eq(5).hide();
			tbody.find(".EBPRratio").hide();
		}
		// Must re-color every cell because of how 'table--striped' style class was implemented
		tbody.find(".HnRfix td").css("background-color", "#800000");
		// Add shadow to dynamically-colored text in HnR candidate rows
		tbody.find(".HnRfix .EBPRshadow").css("text-shadow", "0.05em 0.05em 0.1em rgba(0, 0, 0, 0.75)");
		// Replace placeholder with generated table
		$("#TorrentList").replaceWith(table.append(tbody));

		// Hide the script log
		if (!Debugging) $("#ScriptLog").hide();
	}

})();