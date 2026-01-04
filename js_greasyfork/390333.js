// ==UserScript==
// @name     		thb_tables_wc
// @namespace   	csi416_namespace
// @description 	world cup season selector and new columns: "G" meaning "played Games" and "Dif" as "Goal Difference"
// @include     	*teamhb.org/index.php?page=home&subpage=wc&section=2*
// @version  		1
// @grant    		none
// @downloadURL https://update.greasyfork.org/scripts/390333/thb_tables_wc.user.js
// @updateURL https://update.greasyfork.org/scripts/390333/thb_tables_wc.meta.js
// ==/UserScript==

(function() {
    'use strict';
	
	var groupa_table = document.getElementById("673");
    var groupb_table = document.getElementById("674");
    var groupc_table = document.getElementById("675");
    var groupd_table = document.getElementById("676");
	
	var tr_groupa = groupa_table.children[0].children[0].children[0].children[0].children[0].children[0];
	
	AddSeasonSelection();
	
	function AddSeasonSelection() {
		var td_Label = document.createElement("td");
		td_Label.setAttribute("style", "color: #ffffff; font-size: 12px; font-family: verdana, arial, sans-serif; padding-left: 25px;");
		td_Label.setAttribute("valign", "middle");
		td_Label.setAttribute("width", "52");
		td_Label.innerHTML = "Season";
		
		var selectList = document.createElement("select");
		selectList.id = "season";
		selectList.setAttribute("style", "border: 1px solid #ffffff; color: #ffffff; background-color: #000055; font-size: 12px; font-family: verdana, arial, sans-serif;");
		var td_selectList = document.createElement("td");
		td_selectList.setAttribute("style", "padding-left: 2px;");
		td_selectList.setAttribute("valign", "middle");
		td_selectList.appendChild(selectList);
		tr_groupa.insertBefore(td_selectList, tr_groupa.children[2]);
		tr_groupa.insertBefore(td_Label, tr_groupa.children[2]);
		
		var actualSeason = 41;
		for (var i = 1; i <= actualSeason; i++) {
			var option = document.createElement("option");
			option.value = i;
			option.text = i;
			selectList.appendChild(option);
		}
		
		var str = window.location.search;
		if (str.substring(0, 43) == "?page=home&subpage=wc&section=2&showseason=")	{
			selectList.children[str.substring(43) - 1].setAttribute("selected", "selected");
		} else {
			selectList.children[actualSeason - 1].setAttribute("selected", "selected");
		}
	}
	
	var selectSeason = document.getElementById("season");
	selectSeason.onchange = LoadSelectedSeason;
	
	function LoadSelectedSeason() {
		window.location.href = "https://www.teamhb.org/index.php?page=home&subpage=wc&section=2&showseason=" + this.value;
	}
	
	
	var tbody_groupa = groupa_table.children[0].children[2].children[0].children[0].children[0];
	var tbody_groupb = groupb_table.children[0].children[2].children[0].children[0].children[0];
	var tbody_groupc = groupc_table.children[0].children[2].children[0].children[0].children[0];
	var tbody_groupd = groupd_table.children[0].children[2].children[0].children[0].children[0];

	// osszes meccs kiszamitasa egyszer itt eleg, elso sor alapjan
	var win = parseInt(tbody_groupa.children[1].children[4].innerHTML);
	var draw = parseInt(tbody_groupa.children[1].children[5].innerHTML);
	var loss = parseInt(tbody_groupa.children[1].children[6].innerHTML);
	var games = win + draw + loss;
	
	CreateGamesAndDiffHeaders(tbody_groupa.children[0]);
	FillGamesAndDiffs(tbody_groupa, games);
	
	CreateGamesAndDiffHeaders(tbody_groupb.children[0]);
	FillGamesAndDiffs(tbody_groupb, games);
	
	CreateGamesAndDiffHeaders(tbody_groupc.children[0]);
	FillGamesAndDiffs(tbody_groupc, games);
	
	CreateGamesAndDiffHeaders(tbody_groupd.children[0]);
	FillGamesAndDiffs(tbody_groupd, games);
	
	
	function CreateGamesHeader(tr_header) {
		CreateHeader("G", 30, 4, tr_header);
	}
	function CreateDiffHeader(tr_header) {
		CreateHeader("Diff", 40, 10, tr_header);
	}
	function CreateHeader(header_text, width, pos, tr_header){
		var b = document.createElement("b");
		b.innerHTML = header_text;
		var td = document.createElement("td");
		td.setAttribute("width", width);
		td.setAttribute("valign", "middle");
		td.setAttribute("bgcolor", "#cdcdcd");
		td.setAttribute("align", "center");
		td.setAttribute("style", "border: 1px solid #000000;");
		td.appendChild(b);
		tr_header.insertBefore(td, tr_header.children[pos]);
	}
	function CreateGamesAndDiffHeaders(tr_header) {
		CreateGamesHeader(tr_header);
		CreateDiffHeader(tr_header);
	}
	
	function FillGames(tr, games){
		CreateFill(tr, games, 30, 4);
	}
	function FillDiffs(tr, diff){
		CreateFill(tr, diff, 40, 10);
	}
	function CreateFill(tr, innerHTML, width, pos){
		var td = document.createElement("td");
		td.setAttribute("width", width);
		td.setAttribute("valign", "middle");//
		td.setAttribute("align", "center");//
		td.innerHTML = innerHTML;
		tr.insertBefore(td, tr.children[pos]);
	}
	function FillGamesAndDiffs(tbody, games){
		for (var i = 1; i < tbody.children.length; i++) {
			
			var tr_i = tbody.children[i];
			
			FillGames(tr_i, games);
			
			// golkulonbseg kiszamitasa minden sorban kulon
			var gf = parseInt(tr_i.children[8].innerHTML);
			var ga = parseInt(tr_i.children[9].innerHTML);
			var diff = gf - ga;
			
			FillDiffs(tr_i, diff);
		}
	}
	
})();

