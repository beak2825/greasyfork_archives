// ==UserScript==
// @name        	thb_spreadsheet_column_highlighting
// @namespace   	csi416_namespace
// @description 	setting column highlighting when mouse is over any skill
// @include     	*teamhb.org/index.php?page=team&subpage=spreadsheet*
// @version     	1
// @grant       	none
// @downloadURL https://update.greasyfork.org/scripts/390334/thb_spreadsheet_column_highlighting.user.js
// @updateURL https://update.greasyfork.org/scripts/390334/thb_spreadsheet_column_highlighting.meta.js
// ==/UserScript==

(function() {
    'use strict';
	
	var table_spreadsheet = document.getElementById("offense");
	var tbody_spreadsheet = table_spreadsheet.children[0];
	var tr_spreadsheet = tbody_spreadsheet.children;
	var spreadsheet_length = tbody_spreadsheet.children.length;
	
	for (var i = 2; i < spreadsheet_length; i++) {
		for (var j = 5; j < 20; j++) {
		  //alert("a");
			tr_spreadsheet[i].children[j].onmouseover = SetHighlighting;
			tr_spreadsheet[i].children[j].onmouseout = RemoveHighlighting;
		}
	}
	
	function SetHighlighting() {
		var sor = 0;
		var oszlop = 0;
		for (var k = 2; k < spreadsheet_length; k++) {
			for (var l = 5; l < 20; l++) {
				if (tr_spreadsheet[k].children[l] == this) {
					oszlop = l;
					sor = k;
					k = spreadsheet_length;
					l = 20;
				}
			}
		}
		for (k = 2; k < spreadsheet_length; k++) {
			for (l = 5; l < 20; l++) {
				if (oszlop == l) {
					tr_spreadsheet[k].children[l].className = 'tr_highlighted';
				}
				if (sor == k) {
					tr_spreadsheet[k].children[l].className = 'tr_highlighted';
				}
			}
		}
	}
	
	function RemoveHighlighting() {
		for (var k = 2; k < spreadsheet_length; k++) {
			for (var l = 5; l < 20; l++) {
				tr_spreadsheet[k].children[l].className = 'tr_normal';
			}
		}
	}
	
})();