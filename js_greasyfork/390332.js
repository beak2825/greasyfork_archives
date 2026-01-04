// ==UserScript==
// @name         	thb_tables_loc
// @namespace    	csi416_namespace
// @description  	new columns: "G" meaning "played Games" and "Dif" as "Goal Difference"
// @include        	*teamhb.org/index.php?page=home&subpage=hblc*
// @version      	1
// @grant        	none
// @downloadURL https://update.greasyfork.org/scripts/390332/thb_tables_loc.user.js
// @updateURL https://update.greasyfork.org/scripts/390332/thb_tables_loc.meta.js
// ==/UserScript==

(function() {
    'use strict';
	
	var groupa_table = document.getElementById("groupa_table");
	var groupb_table = document.getElementById("groupb_table");
	
	var tbody_groupa = groupa_table.children[0].children[2].children[0].children[0].children[0];
	var tbody_groupb = groupb_table.children[0].children[2].children[0].children[0].children[0];
	
	// osszes meccs kiszamitasa egyszer itt eleg, elso sor alapjan
	var win = parseInt(tbody_groupa.children[1].children[4].innerHTML);
	var draw = parseInt(tbody_groupa.children[1].children[5].innerHTML);
	var loss = parseInt(tbody_groupa.children[1].children[6].innerHTML);
	var games = win + draw + loss;
	
	CreateGamesAndDiffHeaders(tbody_groupa.children[0]);
	FillGamesAndDiffs(tbody_groupa, games);
	
	CreateGamesAndDiffHeaders(tbody_groupb.children[0]);
	FillGamesAndDiffs(tbody_groupb, games);
	
	
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