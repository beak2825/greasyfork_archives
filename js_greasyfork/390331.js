// ==UserScript==
// @name        	thb_tables_base
// @namespace   	csi416_namespace
// @description 	new columns: "G" meaning "played Games" and "Dif" as "Goal Difference"
// @include     	*teamhb.org/index.php?page=home&subpage=competitions*
// @version     	1
// @grant       	none
// @downloadURL https://update.greasyfork.org/scripts/390331/thb_tables_base.user.js
// @updateURL https://update.greasyfork.org/scripts/390331/thb_tables_base.meta.js
// ==/UserScript==

(function() {
    'use strict';
	
	var leagueTable = document.getElementById("league_table");
	// tbody, alap tabla, header + csapatok, 1+10 sor
	var tbody = leagueTable.children[0].children[2].children[0].children[0].children[0];
	
	// osszes meccs kiszamitasa egyszer itt eleg, elso sor alapjan
	var win = parseInt(tbody.children[1].children[4].innerHTML);
	var draw = parseInt(tbody.children[1].children[5].innerHTML);
	var loss = parseInt(tbody.children[1].children[6].innerHTML);
	var games = win + draw + loss;
	
	CreateGamesAndDiffHeaders(tbody.children[0]);
	
	FillGamesAndDiffs(tbody, games);
	
	
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

