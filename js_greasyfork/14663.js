// ==UserScript==
// @name         Horizon Servers Stats+
// @namespace    rio
// @version      1.8
// @description  Adds filtering and sorting features to the Horizon Servers player stats page
// @author       rio
// @match        https://*.horizonservers.net/*
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/14663/Horizon%20Servers%20Stats%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/14663/Horizon%20Servers%20Stats%2B.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

(function() {
	
var version = 1.8;
var version2 = 18;
var forumPage = "https://www.horizonservers.net/threads/108";

var loadPlayerStats = function() {
	$(".maincontent").append("<style>.player_stats .map-completed-details .tier {width: 60px !important;}.player_stats .map-completed-details .mode {width: 80px !important;text-align: center;font-weight: bold;}.player_stats .map-completed-details .tier span, .player_stats .map-completed-details .percentile span {opacity: 0.5;}.player_stats .map-completed-details .comp {width: 72px !important;}.player_stats .map-completed-details .percentile {width: 85px;width: 70px;}.player_stats .map-completed-details td.percentile {text-align: right;padding-right: 24px !important;}#statsplus_controls, .funModeToggle {padding: 0 2px;-webkit-touch-callout: none;-webkit-user-select: none;-khtml-user-select: none;-moz-user-select: none;-ms-user-select: none;user-select: none;}#statsplus_sorting div, #statsplus_filters div {display: inline-block;padding: 2px 8px;margin: 0 0 10px 5px;cursor: pointer;}#statsplus_sorting div:first-child {margin-left: 0;}#statsplus_sorting div.selected, #statsplus_filters div.selected, #statsplus_reverse {background-color: #4E4E4E;}#statsplus_reverse {padding: 0 8px 4px 8px !important; margin-bottom: 0 !important; position: relative !important; top: -2px !important;}#statsplus_sorting div:hover, #statsplus_showall:hover, .funModeToggle:hover {background-color: rgba(150, 150, 255, 0.5) !important;}#statsplus_filters div[data-type]:hover {border: 2px solid rgba(150, 150, 255, 0.5);margin: -2px -2px 8px 3px;}#statsplus_filters {float: right;}#statsplus_filters input {position: relative;top: 2px;margin-right: 4px;display: none;}#statsplus_filters div.separator {width: 7px;padding: 0;cursor: default;}#statsplus_label {float: right;vertical-align: bottom;font-size: 18px;opacity: 0.5;position: relative;top: 12px;}@media (min-width: 992px) {.player_stats .details .type {width: 107px !important;}}#statsplus_morestats {margin-top: 10px;margin-left: 3px;}#statsplus_actualmaps {margin-left: 11px;}#statsplus_actualmaps a {vertical-align: super;font-size: 15px;}#statsplus_maptotals {margin: 30px auto 0 auto;display: inline-block;font-size: 15px;color:#ccc;}#statsplus_maptotals td, #statsplus_maptotals th {padding: 1px 8px;text-align: center;border: 1px solid #4E4E4E;font-weight: normal;}#statsplus_maptotals th {background-color: #4E4E4E;}#statsplus_sorting span, #statsplus_filters span {background-color: #4E4E4E;padding: 5px 7px;border-right: 1px solid rgb(16, 16, 16);cursor: default;}#statsplus_sorting select, #statsplus_filters select {padding: 4px;background-color: #363636;border: none;cursor: pointer;}#statsplus_sorting select:hover, #statsplus_filters select:hover {padding: 4px 2px;margin: -2px 0;border: 2px solid rgba(150, 150, 255, 0.6);} .col-xs-5,.col-xs-7{width:45% !important;}.funMode{opacity:0.4;border: 1px solid rgba(78,78,78,0.24) !important;}.funModeToggle{cursor: pointer;background-color: #222222 !important;}.maprow_shown1{display:table-row;background:rgba(0,0,0,0.1) !important;}.maprow_shown2{display:table-row;background:rgba(255,255,255,0.03) !important;}.maprow_hidden{display:none;}</style>");

	var BHOP = window.location.pathname.match("^/stats/[^/]+/bhop");
	
	$('.btn-search[onclick="switchStats(\''+(BHOP?"bhop":"surf")+'\');"]').parent().addClass("mapstats-selected-button");
	
	var settings = {};
	if (window.location.hash) {
		var hashPieces = window.location.hash.slice(1).split(":");
		if (hashPieces[0] == version2) {
			settings["sort"] = parseInt(hashPieces[1]);
			settings["reversed"] = parseInt(hashPieces[2]);
			settings["tiers"] = parseInt(hashPieces[3]);
			settings["type"] = parseInt(hashPieces[4]);
			settings["mode"] = parseInt(hashPieces[5]);
		}
	}

	var sorts = [
		["Percentile",		function(a,b) { 
			return (a.percentileNA ? 999 : a.percentile) - (b.percentileNA ? 999 : b.percentile) || b.outOf - a.outOf; 
		}],
		["Rank", 			function(a,b) { return a.rank - b.rank || b.outOf - a.outOf; }],
		["Inverse Rank", 	function(a,b) { return b.outOf-b.rank-a.outOf+a.rank || a.rank - b.rank;}],
		["Total Ranks", 	function(a,b) { return b.outOf - a.outOf || a.rank - b.rank; }],
		["Time", 			function(a,b) { return a.timeInt - b.timeInt; }],
		["Completions", 	function(a,b) { return b.comp - a.comp; }]
	];
	var sortsDict = {};
	sorts.forEach(function(sort, i, self) {
		sortsDict[sort[0]] = sort[1];
	});

	var tiers = (BHOP ? 5 : 6);

	// assume bhop only goes to T5 but check if there's any T6 maps on this page just in case
	// update: keeping T6 hidden by default since it's kind of a "bonus" tier at this point that most people wont do
	if (BHOP && $(".map-completed-details td.tier:contains(6)").length)
		tiers = 6;	

	// list of known modes in desired sort order
	var modes;
	var rankedModes;
	var funModes = [];
	var modeIDs;
	if (BHOP) {
		rankedModes = ["Legit", "Auto", "Sideways", "W-Only", "HSW"];
		funModes = ["D-Only", "A-Only", "S-Only", "SlowMo", "XSlowMo"];
		modes = rankedModes.concat(funModes);
		modeIDs = {"Legit": 4, "Auto": 5, "Sideways": 6, "W-Only": 7, "HSW": 8, "D-Only": 9, "A-Only": 10, "S-Only": 11, "SlowMo": 12, "XSlowMo": 13};
	} else {
		modes = rankedModes = ["Normal", "Sideways"];
		modeIDs = {"Normal": 1, "Sideways": 3};
	}

	// look for new modes that aren't hardcoded in the list above and add them
	(function() {
		var ths = $(".map-completed-details thead").first().find("th");
		for (var i=0; i<ths.length; i++) {
			if ($(ths[i]).html().toLowerCase() == "mode") {
				$(".map-completed-details tbody tr").each(function() {
					var mode = $(this).find("td").eq(i).html();
					if (modes.indexOf(mode) == -1)
						modes.push(mode);
				});
				break;
			}
		}
	})();	

	// create some controls
	$(".table-responsive h2")
	.append('<span id="statsplus_label"><a href="'+forumPage+'" target="_blank">HZ Stats+ Script '+version+'</a></span>')
	.after('<div id="statsplus_controls"><span id="statsplus_sorting"></span><span id="statsplus_filters"></span></div>');

	var sortSelector = $('<select data-type="sorting"></select>');
	sortSelector.append('<option value="Original">Original</option>');
	sorts.forEach(function(sort, i, self) {
		sortSelector.append('<option value="'+sort[0]+'">'+sort[0]+'</option>');
	});
	
	sortSelector[0].selectedIndex = settings["sort"] || 0;
	$("#statsplus_sorting").append("<span>Sort</span>")
	.append(sortSelector)
	.append("<div id='statsplus_reverse'>↓</div>");
	
	$("#statsplus_reverse").data("dir", settings["reversed"] ? "reversed" : "normal")
	.html(settings["reversed"] ? "↑" : "↓");

	var filters = $("#statsplus_filters");
	filters.append('<div id="statsplus_showall">Show All</div>');

	filters.append('<div class="separator">&nbsp;</div>');
	for (var i=1; i<=tiers; i++) {
		var isHidden = typeof settings["tiers"] !== 'undefined' && (settings["tiers"] & (1<<(i-1)));
		filters.append('<div data-type="tier" data-value="'+i+'"'+(isHidden ? '' : ' class="selected"')+'>T'+i+'</div>');
	}

	filters.append('<div class="separator">&nbsp;</div>');
	var typeSelector = $('<select data-type="type"></select>');
	typeSelector.append('<option value="ALL">All</option>')
	.append('<option value="regular">Regular</option>')
	.append('<option value="bonus">Bonus</option>');
	
	typeSelector[0].selectedIndex = settings["type"] || 0;
	filters.append("<span>Type</span>").append(typeSelector);

	filters.append('<div class="separator">&nbsp;</div>');
	var modeSelector = $('<select data-type="mode"></select>');
	modeSelector.append('<option value="ALL">All</option>');
	if (BHOP) {
		modeSelector.append('<option value="ALL_ranked">All Ranked</option>');
		modeSelector.append('<option value="ALL_fun">All Fun</option>');
	}
	modes.forEach(function(mode, i, self) {
		modeSelector.append('<option value="'+mode+'">'+mode+'</option>');
	});	
	
	modeSelector[0].selectedIndex = settings["mode"] || 0;
	filters.append("<span>Mode</span>").append(modeSelector);

	var stats = [];
	var mapLookup = {};
	
	(function() {
		var knownTiers = {};
		var prevTiers = {};
		var prevTier;
		
		var modeColors = {};

		// read and process map stats from the page	
		$(".map-completed-details tbody").children().each(function() {
			var map = {};
			
			var mapLink = $(this).find(".map a");
			var mapName = mapLink.html().trim();
			
			var tierStr = $(this).find(".tier").eq(0).html();
			var tierMatch = tierStr.match(/(\d)(B?)/i);
			var tier = parseInt(tierMatch[1]);
			var isBonus = tierMatch[2].length > 0;
			
			var modeDOM = $(this).find(".tier").eq(1);
			var mode = modeDOM.html();
			
			var modeColor = modeColors[mode];
			if (!modeColor) {
				//modeColor = modeDOM.css("color"); // getPropertyValue sucks				
				var modeColor = modeDOM.prop("style").color || "#ddd";
				modeColors[mode] = modeColor;
			}
			
			if (!isBonus) {
				knownTiers[mapName] = tier;
				map.tier = tier;
			}
			map.actualTier = tier;	

			if (prevTier)
				prevTiers[mapName] = prevTier;
			if (!isBonus)
				prevTier = tier;

			// make links to map stats pages go to the actual correct mode/bonus
			var mapLinkURL = mapLink.prop("href");
			if (mapLinkURL.indexOf("?") == -1) {
				var modeID = modeIDs[mode];
				if (modeID)
					mapLinkURL += "?modeid=" + modeID;
				if (isBonus)
					mapLinkURL += (modeID ? "&" : "?") + "bonusid=1";
				
				mapLink.prop("href", mapLinkURL);
			}
			
			map.link = mapLink.prop("outerHTML");
			map.name = mapName;

			map.time = $(this).find(".time").html();
			map.timeInt = parseInt(map.time.replace(/[^\d]/g,""));

			var rankStr = $(this).find(".rank").html();
			var rankMatch = rankStr.match(/(\d+)\/(\d+)/);
			map.rank = parseInt(rankMatch[1]);
			map.outOf = parseInt(rankMatch[2]);
			if (map.outOf == 1) {
				map.percentile = 0;
				map.percentileNA = true;
			} else
				map.percentile = (map.rank-1)/(map.outOf-1);

			map.comp = parseInt($(this).find(".comp").html());
			
			map.mode = mode;
			map.modeIsRanked = rankedModes.indexOf(mode) != -1;
			
			map.modeColor = modeColor;
			map.modeIndex = modes.indexOf(mode);
			
			map.type = (isBonus ? "bonus" : "regular");
			
			map.id = map.type+map.name+map.mode;
			map.id2 = map.type+map.name;

			stats.push(map);
			mapLookup[map.id] = map;
		});

		for (var i=0; i<stats.length; i++) {
			var map = stats[i];
			if (map.type == "bonus" && knownTiers[map.name])
				map.tier = knownTiers[map.name];
			else if (map.type == "bonus" && prevTiers[map.name]) {
				map.tier = prevTiers[map.name];
				map.tierUnsure = true;
			}
		}
	})();

	// try to sort modes into the "normal" sort order within the original map list
	(function() {
		var start = 0;
		var end = 0;
		while (true) {
			if (end != stats.length-1 && stats[start].id2 == stats[end+1].id2) {
				end++;
				continue;
			}
			if (start != end) {
				var selection = stats.slice(start, end+1);
				selection = selection.sort(function(a, b) { return a.modeIndex - b.modeIndex; });
				stats = stats.slice(0, start).concat(selection).concat(stats.slice(end+1));
			}
			start = end = end+1; // that's pretty neat
			if (end >= stats.length)
				break;
		}
	})();

	(function() {
		var totals = {tiers: {}, reg: {}, bonus: {}};
		var uniqueMaps = [];

		for (var i=0; i<stats.length; i++) {
			var map = stats[i];

			if (map.type == "regular") {
				if (uniqueMaps.indexOf(map.name) == -1) {
					uniqueMaps.push(map.name);
					if (!totals.tiers["t"+map.tier])
						totals.tiers["t"+map.tier] = 0;	
					totals.tiers["t"+map.tier]++;
				}
				
				if (!totals.reg[map.mode])
					totals.reg[map.mode] = 0;
				totals.reg[map.mode]++;	
			} else {
				if (!totals.bonus[map.mode])
					totals.bonus[map.mode] = 0;	
				totals.bonus[map.mode]++;
			}
		}
		
		var morestats = $('<div id="statsplus_morestats"></div>');
		var maptotals = $('<div id="statsplus_maptotals"></div>');
		
		// tables zzzzz...

		var totalstable = "<table><tr>";

		for (var i=1; i<=tiers; i++) 
			totalstable += "<th>T"+i+"</th>";
		modes.forEach(function(mode, i, self) {
			var isFunMode = funModes.indexOf(mode) != -1;
			totalstable += "<th"+(isFunMode ? " class='funMode' style='display:none;'" : "")+">"+mode+"</th>";
		});
		
		if (funModes.length > 0)
			totalstable += "<th class='funModeToggle' rowspan='3' data-state='collapsed'>▶</th>";
		
		totalstable += "</tr><tr>";
		for (var i=1; i<=tiers; i++) 
			totalstable += "<td>"+(totals.tiers["t"+i] || "&nbsp;")+"</td>";
		modes.forEach(function(mode, i, self) {
			var isFunMode = funModes.indexOf(mode) != -1;
			totalstable += "<td"+(isFunMode ? " class='funMode' style='display:none;'" : "")+">"+(totals.reg[mode] || "&nbsp;")+"</td>";
		});

		totalstable += "</tr><tr>";
		totalstable += "<th colspan="+tiers+" style='text-align:right;'>Bonus:</th>";
		modes.forEach(function(mode, i, self) {
			var isFunMode = funModes.indexOf(mode) != -1;
			totalstable += "<td"+(isFunMode ? " class='funMode' style='display:none;'" : "")+">"+(totals.bonus[mode] || "&nbsp;")+"</td>";
		});
		totalstable += "</tr></table>";

		maptotals.append(totalstable);
		morestats.append(maptotals);

		$(".row.text-center").append(morestats);
	})();

	var blockCache = {};
	var rowCache = {};	

	var stats_reversed = stats.slice().reverse();

	var currentBlock;
	var noResultsRow = $('<tr><td colspan="7" style="text-align:center; font-style:italic;opacity:0.5;font-size:larger">No results for selected filters</td></tr>').hide();
	
	// print map list based on sorting and filtering settings
	var updateList = function() {	
		var sortIndex = $("select[data-type=sorting]")[0].selectedIndex;
		var reversedIndex = $("#statsplus_reverse").data("dir") == "reversed" ? 1 : 0;
		var typeIndex = $("select[data-type=type]")[0].selectedIndex;
		var modeIndex = $("select[data-type=mode]")[0].selectedIndex;
		
		var tiers = {};
		$("#statsplus_filters div[data-type=tier]").each(function() {
			tiers[$(this).data("value")] = $(this).hasClass("selected");
		});	
		
		var tiersHash = 0;
		for (var tier in tiers) {
			if (!tiers[tier])
				tiersHash += 1 << (parseInt(tier)-1);
		}
		
		// store filter settings in the url so they can be restored when the page is reloaded
		window.location.hash = version2+":"+sortIndex+":"+reversedIndex+":"+tiersHash+":"+typeIndex+":"+modeIndex;
	
		var block;
		
		var sortType = $("select[data-type=sorting]")[0].value;
		var isReversed = $("#statsplus_reverse").data("dir") == "reversed";
		var sortTypeFull = sortType + (isReversed ? "_reversed" : "");		
		
		if (!blockCache[sortTypeFull]) {			
			var list;
			if (sortType == "Original") 
				list = isReversed ? stats_reversed : stats;
			else {
				list = stats.slice().sort(sortsDict[sortType]);
				if (isReversed)
					list.reverse();
			}
			block = [];
			
			for (var i=0; i<list.length; i++) {
				var map = list[i];
				
				var row;
				if (rowCache[map.id]) {
					row = rowCache[map.id];
				} else {
					row = ""
					+ "<tr data-mapid="+map.id+">"
					+ "<td class='tier'>"+map.actualTier+(map.type=="bonus" ? ("B <span>("+(map.tier || "?")+(map.tierUnsure ? "?" : "")+")</span>") : "")+"</td>" // ayy lmao
					+ "<td class='mode'>"+map.mode+"</td>"
					+ "<td class='map'>"+map.link+"</td>"
					+ "<td class='time'>"+map.time+"</td>"
					+ "<td class='rank'>"+map.rank+"/"+map.outOf+"</td>"
					+ "<td class='percentile'>"+(map.percentileNA ? "<span>N/A</span>" : (map.percentile*100).toFixed(1)+"%")+"</td>"
					+ "<td class='comp'>"+map.comp+"</td>"
					+ "</tr>";
					row = $(row);
					row.find(".mode").css("color", map.modeColor);
					
					//row.data("mapid", map.id);					
					rowCache[map.id] = row;
				}
				
				block.push(row);				
			}
			
			blockCache[sortTypeFull] = block;
		} else {
			block = blockCache[sortTypeFull];
		}
		
		if (!currentBlock) 
			$(".map-completed-details thead").html('<tr><th class="tier">Tier</th><th class="mode">Mode</th><th class="map">Map</th><th class="time">Time</th><th class="rank">Rank</th><th class="percentile">Percentile</th><th class="comp">Compl.</th></tr>');		

		var type = $("select[data-type=type]")[0].value;
		var mode = $("select[data-type=mode]")[0].value;

		var noResults = true;
        
        var rank1s = 0;
        var soloRanks = 0;
		
		var zebra = 1;
		for (var i=0; i<block.length; i++) {
			var row = block[i];
			var map = mapLookup[row.data("mapid")];
						
			if ( (type != "ALL" && map.type != type)	
				|| !(mode == "ALL" || (map.modeIsRanked ? mode == "ALL_ranked" : mode == "ALL_fun") || map.mode == mode)
			    || (map.tier && !tiers[map.tier]) ) 
				row.removeClass("maprow_shown1").removeClass("maprow_shown2").addClass("maprow_hidden");
			else {			
				row.removeClass("maprow_hidden").removeClass("maprow_shown"+(3-zebra)).addClass("maprow_shown"+zebra);
				zebra = 3 - zebra; // \:D/
				
				if (map.rank == 1) {
					if (map.outOf == 1)
						soloRanks++;
					else
						rank1s++;
				}				
				noResults = false;
			}
		}

		if (noResults)
			noResultsRow.show();
        else {
			noResultsRow.hide();
			
            $(".map-completed-details thead .rank").attr("title", "WR: " + rank1s + "\n1/1: " + soloRanks);
			
			if (!currentBlock || currentBlock != block) {
				$(".map-completed-details tbody").html("").append(block).append(noResultsRow);
				currentBlock = block;
			}
		}
	};

	// make controls do stuff
	$("#statsplus_sorting select").change(updateList);

	$("#statsplus_reverse").click(function() {
		if ($(this).data("dir") == "normal")
			$(this).html("↑").data("dir", "reversed");
		else
			$(this).html("↓").data("dir", "normal");
		updateList();
	});

	$("#statsplus_filters div[data-type=tier]").click(function() {
		if ($(this).hasClass("selected"))
			$(this).removeClass("selected");
		else
			$(this).addClass("selected");
		updateList();
	});

	$("#statsplus_filters select").change(updateList);

	$("#statsplus_showall").click(function() {
		$("#statsplus_filters div[data-type=tier]").addClass("selected");
		$("#statsplus_filters select").val("ALL");
		updateList();
	});
	
	$(".funModeToggle").click(function() {
		if ($(this).data("state") == "collapsed") {
			$(".funMode").show();
			$(this).html("◀")
			.data("state", "expanded");
		} else {
			$(".funMode").hide();
			$(this).html("▶")
			.data("state", "collapsed");			
		}
	});

	// reprint the map list right away so we can add new info etc.
	updateList();
};

var loadMapStats = function() {
	var modeMatch = window.location.search.match(/modeid=(\d+)/);
	var bonusMatch = window.location.search.match(/bonusid=(\d+)/);
	var modeid = modeMatch ? modeMatch[1] : 0;
	var bonusid = bonusMatch ? bonusMatch[1] : 0;
	
	$('.btn-search[onclick="SwitchMode('+modeid+');"]').parent().addClass("mapstats-selected-button");
	$('.btn-search[onclick="SwitchBonus('+bonusid+');"]').parent().addClass("mapstats-selected-button");
};	

var checkLoad = function() {
	var isStatsPage = window.location.pathname.match("^/stats/");
	var isMapPage = window.location.pathname.match("^/mapstats/");
	//var statsAreLoaded = $(".map-completed-details").length > 0;
    var scriptIsLoaded = $("#statsplus_loaded").length > 0;
    if (!scriptIsLoaded) {
		$(".maincontent").append('<div id="statsplus_loaded"></div>');	
		console.log("Loading HZ Stats+ "+version+" ("+forumPage+")");
		
		// shared styles
		$(".maincontent").append("<style>.mapstats-selected-button,.input-group-btn:hover{background-color: rgba(0, 0, 0, 0.5);box-shadow: inset 0 0 10px #000;}</style>");
		
        if (isStatsPage)
            loadPlayerStats();
        else if (isMapPage)
            loadMapStats();
    }
};

$(document).bind("ajaxComplete", function(event, xhr, options) {
	checkLoad();
});

checkLoad();

})();