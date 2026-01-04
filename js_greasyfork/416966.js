// ==UserScript==
// @name         Webcamdarts statistics french only
// @name:fr      Webcamdarts statistiques en francais
// @version      0.6
// @description  Webcamdarts redesign statistics
// @description:fr Webcamdarts statistiques design et en francais
// @author       Antoine Maingeot
// @match        https://www.webcamdarts.com/GameOn/Game/MatchResult/*
// @match        https://www.webcamdarts.com/GameOn/Game/MemberStats/*
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setClipboard
// @namespace    https://greasyfork.org/fr/users/505971-antoine-maingeot
// @require       https://cdnjs.cloudflare.com/ajax/libs/html2canvas/0.4.1/html2canvas.min.js
// @require       https://ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js


// @downloadURL https://update.greasyfork.org/scripts/416966/Webcamdarts%20statistics%20french%20only.user.js
// @updateURL https://update.greasyfork.org/scripts/416966/Webcamdarts%20statistics%20french%20only.meta.js
// ==/UserScript==
if (/\/Game\/MatchResult/.test (location.pathname) ) {
    // Run code for edit pages


var logo = document.createElement("div")
logo.innerHTML = '<div id="container"><button id="goButton">Enregistrer comme image</button></div>';

var referenceNode = document.querySelector('.rounded.dark.statsComments');

referenceNode.before(logo);

////////////BEGIN AUTO COPY RESULT/////////////////////

// Copy table to clipboard
var targText = $(".full-game-result").text ().trim ();
console.log ("Copied to clipboard: ", targText);
GM_setClipboard (targText);

////////////END AUTO COPY RESULT/////////////////////


////////////BEGIN SHARE RESULT/////////////////////

	// add button
	var button_fb = document.createElement('div');
    button_fb.innerHTML = '<button id="myButton" type="button">Partager mon résultat sur Facebook</button>';
	button_fb.setAttribute('target', '_blank');
    button_fb.style.width = 'fit-content';

button_fb.onclick = function() {
			var ling = document.createElement('a');
			ling.setAttribute('href', 'http://www.facebook.com/share.php?u=' + encodeURIComponent(location.href));
    ling.style.display = 'none';
    ling.setAttribute('target', '_blank');
			simulateClick(ling);
		};
	 var position3 = document.querySelector('.rounded.dark.statsComments');
position3.before(button_fb);
////////////END SHARE RESULT/////////////////////




////////////BEGIN DOWNLOAD PNG RESULT/////////////////////


 $("#goButton").click(function() {
        html2canvas($(".item"), {
          onrendered: function(canvas) {
            saveAs(canvas.toDataURL(), 'resultwda.png');
          }
        });
      });

      function saveAs(uri, filename) {
        var link = document.createElement('a');
        if (typeof link.download === 'string') {
          link.href = uri;
          link.download = filename;

          //Firefox requires the link to be in the body
          document.body.appendChild(link);

          //simulate click
          link.click();

          //remove the link when done
          document.body.removeChild(link);
        } else {
          window.open(uri);
        }
      }
////////////END DOWNLOAD PNG RESULT/////////////////////

// Make sure you write this code inside the
        // script tag of your HTML file

////////////BEGIN SAVE FOR EXCEL/////////////////////
	// simulate click event
	function simulateClick(elem) {
		var evt = new MouseEvent('click');
		var canceled = !elem.dispatchEvent(evt);
	}


	// get closest table parent
	function getTableParent(node){
		while ( node = node.parentNode,
			node !== null && node.tagName !== 'TABLE' );
		return node;
	}


	// assemble csv data
	function getTblData(tbl){
		// csv store
		var csv = [];
		// get all rows inside the table
		tbl.querySelectorAll('tr').forEach(function(trRow) {
			// Only process direct tr children
			if( ! tbl.isEqualNode(getTableParent(trRow))){
				return;
			}
			// assemble row content
			var row = [];
			trRow.querySelectorAll('td, th').forEach(function(col) {
				// remove multiple spaces and linebreaks (breaks csv)
				var data = col.innerText.replace(/(\r\n|\n|\r)/gm, '').replace(/(\s\s)/gm, ' ')
				// escape double-quote with double-double-quote
				data = data.replace(/"/g, '""');
				row.push('"' + data + '"');
			});
			csv.push(row.join(','));
		});
		return csv.join('\n');
	}

	// add button + click action
	function add_btn(tbl){
		var btn = document.createElement('button');
		btn.innerHTML = 'Enregistrer mon résultat pour Excel';
        		btn.setAttribute('type', 'button');
		// Process Table on Click
		btn.onclick = function() {
			var csv_string = getTblData(tbl);
			csvlink.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv_string));
			simulateClick(csvlink);
		};
		// Insert bouton Table

        var position = document.querySelector('.rounded.dark.statsComments');
        position.before(btn);
	}

	// add link
	var csvlink = document.createElement('a');
	csvlink.style.display = 'none';
	csvlink.setAttribute('target', '_blank');
	csvlink.setAttribute('download', 'data.csv');
	document.body.append(csvlink);

	// add buttons
	document.querySelectorAll('.full-game-result').forEach(function(tbl){add_btn(tbl)});

////////////END SAVE FOR EXCEL/////////////////////

}
else if (/\/comment\/delete/.test (location.pathname) ) {
    // Run code for delete pages
}
else {
    // Run fall-back code, if any
}

(function() {
    'use strict';
function addGlobalStyle(css) {
   var head, style;
   head = document.getElementsByTagName('head')[0];
   if (!head) { return; }
   style = document.createElement('style');
   style.type = 'text/css';
   style.innerHTML = css;
   head.appendChild(style);
}

addGlobalStyle('#fb-share{text-decoration:none;}');
addGlobalStyle('body > div.content > div > div.sixteen.columns > div:nth-child(9){display: contents;margin-left:10px; margin-right: 10px;}');

addGlobalStyle('body > div.content > div > div.sixteen.columns > button {margin-left:10px; margin-right: 10px;}');
addGlobalStyle('#container{float:left;display:inline;margin-right:10px;}');
addGlobalStyle('body > div.content > div > div.sixteen.columns > button{position:absolute}');
addGlobalStyle('.gr table{text-align:center;}');
addGlobalStyle('.gr table tbody td{color: #7D7D7D;border-left: 1px solid #7D7D7D;font-size: 0.9em;}');
addGlobalStyle('.gr table td{padding: 3px 3px;}');
addGlobalStyle('.full-game-result tr:nth-child(even){background: #525252;  border-bottom: 1px solid white; })');
addGlobalStyle('.full-game-result tr:nth-child(odd){background: #302E2E;  border-bottom: 1px solid white; })');
addGlobalStyle('.full-game-result td {text-transform: uppercase;min-width:150px;text-align: center;})');
addGlobalStyle('.full-game-result tr td {color: unset;text-align: right; font-weight:unset;})');
addGlobalStyle('.full-game-result tr td + td { color: white;font-weight:unset; width:150px;})');
addGlobalStyle('#panelBarStats > ol > li:nth-child(1) > div > div > table > thead > tr{ color: white;font-weight:bolder; text-align:center;})');
addGlobalStyle('#panelBarStats > ol > li:nth-child(1) > div > div > table{ margin-left:20%;margin-right:20%;margin-top:2%;})');
addGlobalStyle('#panelBarStats > ol > li:nth-child(1) > div > div > div > h2:nth-child(1){ color: white;font-weight:bolder; text-align:center;})');
addGlobalStyle('#panelBarStats > ol > li:nth-child(1) > div > div > table > tbody > tr:nth-child(2)   { color: yellow;font-weight:bolder; text-align:center;})');
addGlobalStyle('#panelBarStats > ol > li:nth-child(1) > div > div > table > tbody > tr:nth-child(2) > td:nth-child(2){ color: black;font-weight:bolder; text-align:center;})');
addGlobalStyle('#panelBarStats > ol > li:nth-child(1) > div > div > table > tbody > tr:nth-child(2) > td:nth-child(3){ color: black;font-weight:bolder; text-align:center;})');
addGlobalStyle('#panelBarStats > ol > li:nth-child(1) > div > figcaption > div > table > tbody > tr:nth-child(1) > td:nth-child(2){ color: black;font-weight:bolder; text-align:center;})');
addGlobalStyle('#panelBarStats > ol > li:nth-child(1) > div > figcaption > div > table {font-size:1.2em;border: 2px solid;}');
addGlobalStyle('#panelBarStats > ol > li:nth-child(1) > div > figcaption > div > table > tbody > tr:nth-child(6) > td:nth-child(3) , #panelBarStats > ol > li:nth-child(2) > div > figcaption > div > table > tbody > tr:nth-child(6) > td:nth-child(3){   font-size:0.9em; font-variant-caps: all-petite-caps;}');
addGlobalStyle('#panelBarStats > ol > li:nth-child(1) > div > div > table > thead > tr > th:nth-child(1){background: white;color: black;}');
addGlobalStyle('#panelBarStats > ol > li:nth-child(1) > div > div > table > thead > tr > th:nth-child(2){background: white;color: black;}');
addGlobalStyle('#panelBarStats > ol > li:nth-child(1) > div > div > table > thead > tr > th:nth-child(3){background: white;color: black;}');
addGlobalStyle('#panelBarStats > ol > li:nth-child(1) > div > div > table > tbody{border: solid 2px;border-color: white;}');
addGlobalStyle('#panelBarStats > ol > li:nth-child(1) > div > div > table > thead{border: solid 2px;border-color: white;}');

addGlobalStyle('.liteAccordion.dark .slide > div {background: #302e2e;}');

//addGlobalStyle('#panelBarStats > ol > li:nth-child(1) > div > figcaption > div > table > tbody > tr:nth-child(1) , #panelBarStats > ol > li:nth-child(2) > div > figcaption > div > table > tbody > tr:nth-child(1) > td:nth-child(1) {color:#FFF;font-weight:bold;}');
addGlobalStyle('#panelBarStats > ol > li:nth-child(1) > div > figcaption > div > table > tbody > tr:nth-child(2) , #panelBarStats > ol > li:nth-child(2) > div > figcaption > div > table > tbody > tr:nth-child(2) > td:nth-child(1) {color:#FFF;}');
addGlobalStyle('#panelBarStats > ol > li:nth-child(1) > div > figcaption > div > table > tbody > tr:nth-child(3) , #panelBarStats > ol > li:nth-child(2) > div > figcaption > div > table > tbody > tr:nth-child(3) > td:nth-child(1) {color:#FFF;}');
addGlobalStyle('#panelBarStats > ol > li:nth-child(1) > div > figcaption > div > table > tbody > tr:nth-child(4) , #panelBarStats > ol > li:nth-child(2) > div > figcaption > div > table > tbody > tr:nth-child(4) > td:nth-child(1) {color:#FFF;}');
addGlobalStyle('#panelBarStats > ol > li:nth-child(1) > div > figcaption > div > table > tbody > tr:nth-child(5) , #panelBarStats > ol > li:nth-child(2) > div > figcaption > div > table > tbody > tr:nth-child(5) > td:nth-child(1) {color:#FFF;}');
addGlobalStyle('#panelBarStats > ol > li:nth-child(1) > div > figcaption > div > table > tbody > tr:nth-child(6) , #panelBarStats > ol > li:nth-child(2) > div > figcaption > div > table > tbody > tr:nth-child(6) > td:nth-child(1) {color:#FFF;}');
addGlobalStyle('#panelBarStats > ol > li:nth-child(1) > div > figcaption > div > table > tbody > tr:nth-child(7) , #panelBarStats > ol > li:nth-child(2) > div > figcaption > div > table > tbody > tr:nth-child(7) > td:nth-child(1) {color:#FFF;}');
addGlobalStyle('#panelBarStats > ol > li:nth-child(1) > div > figcaption > div > table > tbody > tr:nth-child(8) , #panelBarStats > ol > li:nth-child(2) > div > figcaption > div > table > tbody > tr:nth-child(8) > td:nth-child(1) {color:#FFF;}');
addGlobalStyle('#panelBarStats > ol > li:nth-child(1) > div > figcaption > div > table > tbody > tr:nth-child(9) , #panelBarStats > ol > li:nth-child(2) > div > figcaption > div > table > tbody > tr:nth-child(9) > td:nth-child(1) {color:#FFF;}');
addGlobalStyle('#panelBarStats > ol > li:nth-child(1) > div > figcaption > div > table > tbody > tr:nth-child(10) , #panelBarStats > ol > li:nth-child(2) > div > figcaption > div > table > tbody > tr:nth-child(10) > td:nth-child(1) {color:#FFF;}');
addGlobalStyle('#panelBarStats > ol > li:nth-child(1) > div > figcaption > div > table > tbody > tr:nth-child(11) , #panelBarStats > ol > li:nth-child(2) > div > figcaption > div > table > tbody > tr:nth-child(11) > td:nth-child(1) {color:#FFF;}');
addGlobalStyle('#panelBarStats > ol > li:nth-child(1) > div > figcaption > div > table > tbody > tr:nth-child(12) , #panelBarStats > ol > li:nth-child(2) > div > figcaption > div > table > tbody > tr:nth-child(12) > td:nth-child(1) {color:#FFF;}');
addGlobalStyle('#panelBarStats > ol > li:nth-child(1) > div > figcaption > div > table > tbody > tr:nth-child(13) , #panelBarStats > ol > li:nth-child(2) > div > figcaption > div > table > tbody > tr:nth-child(13) > td:nth-child(1) {color:#FFF;}');
addGlobalStyle('#panelBarStats > ol > li:nth-child(1) > div > figcaption > div > table > tbody > tr:nth-child(14) , #panelBarStats > ol > li:nth-child(2) > div > figcaption > div > table > tbody > tr:nth-child(14) > td:nth-child(1) {color:#FFF;}');
addGlobalStyle('#panelBarStats > ol > li:nth-child(1) > div > figcaption > div > table > tbody > tr:nth-child(15) , #panelBarStats > ol > li:nth-child(2) > div > figcaption > div > table > tbody > tr:nth-child(15) > td:nth-child(1) {color:#FFF;}');
addGlobalStyle('#panelBarStats > ol > li:nth-child(1) > div > figcaption > div > table > tbody > tr:nth-child(16) , #panelBarStats > ol > li:nth-child(2) > div > figcaption > div > table > tbody > tr:nth-child(16) > td:nth-child(1) {color:#FFF;}');

    addGlobalStyle('#panelBarStats > ol > li:nth-child(1) > div > div > table > tbody > tr:nth-child(1) > td:nth-child(1){color:#FFF;}');
addGlobalStyle('#panelBarStats > ol > li:nth-child(1) > div > div > table > tbody > tr:nth-child(3) > td:nth-child(1){color:#FFF;}');
addGlobalStyle('#panelBarStats > ol > li:nth-child(1) > div > div > table > tbody > tr:nth-child(4) > td:nth-child(1){color:#FFF;}');
addGlobalStyle('#panelBarStats > ol > li:nth-child(1) > div > div > table > tbody > tr:nth-child(5) > td:nth-child(1){color:#FFF;}');
addGlobalStyle('#panelBarStats > ol > li:nth-child(1) > div > div > table > tbody > tr:nth-child(6) > td:nth-child(1){color:#FFF;}');
addGlobalStyle('#panelBarStats > ol > li:nth-child(1) > div > div > table > tbody > tr:nth-child(7) > td:nth-child(1){color:#FFF;}');
addGlobalStyle('#panelBarStats > ol > li:nth-child(1) > div > div > table > tbody > tr:nth-child(9) > td:nth-child(1){color:#FFF;}');
addGlobalStyle('#panelBarStats > ol > li:nth-child(1) > div > div > table > tbody > tr:nth-child(8) > td:nth-child(1){color:#FFF;}');
addGlobalStyle('#panelBarStats > ol > li:nth-child(1) > div > div > table > tbody > tr:nth-child(10) > td:nth-child(1){color:#FFF;}');
addGlobalStyle('#panelBarStats > ol > li:nth-child(1) > div > div > div > h2:nth-child(2){color:#FFF;}');
addGlobalStyle('#panelBarStats > ol > li:nth-child(1) > div > div > div > h2:nth-child(3){color:#FFF;}');



addGlobalStyle('#panelBarStats > ol > li:nth-child(1) > div > div > table > tbody > tr:nth-child(1) > td:nth-child(2){border-right:1px solid;border-color:white;}');
addGlobalStyle('#panelBarStats > ol > li:nth-child(1) > div > div > table > tbody > tr:nth-child(2) > td:nth-child(2){border-right:1px solid;border-color:white;}');
addGlobalStyle('#panelBarStats > ol > li:nth-child(1) > div > div > table > tbody > tr:nth-child(3) > td:nth-child(2){border-right:1px solid;border-color:white;}');
addGlobalStyle('#panelBarStats > ol > li:nth-child(1) > div > div > table > tbody > tr:nth-child(4) > td:nth-child(2){border-right:1px solid;border-color:white;}');
addGlobalStyle('#panelBarStats > ol > li:nth-child(1) > div > div > table > tbody > tr:nth-child(5) > td:nth-child(2){border-right:1px solid;border-color:white;}');
addGlobalStyle('#panelBarStats > ol > li:nth-child(1) > div > div > table > tbody > tr:nth-child(6) > td:nth-child(2){border-right:1px solid;border-color:white;}');
addGlobalStyle('#panelBarStats > ol > li:nth-child(1) > div > div > table > tbody > tr:nth-child(7) > td:nth-child(2){border-right:1px solid;border-color:white;}');
addGlobalStyle('#panelBarStats > ol > li:nth-child(1) > div > div > table > tbody > tr:nth-child(8) > td:nth-child(2){border-right:1px solid;border-color:white;}');
addGlobalStyle('#panelBarStats > ol > li:nth-child(1) > div > div > table > tbody > tr:nth-child(9) > td:nth-child(2){border-right:1px solid;border-color:white;}');
addGlobalStyle('#panelBarStats > ol > li:nth-child(1) > div > div > table > tbody > tr:nth-child(10) > td:nth-child(2){border-right:1px solid;border-color:white;}');

addGlobalStyle('#panelBarStats > ol > li:nth-child(1) > div > figcaption > div > table > tbody > tr:nth-child(6) > td:nth-child(3) , #panelBarStats > ol > li:nth-child(2) > div > figcaption > div > table > tbody > tr:nth-child(6) > td:nth-child(3) {padding-right: 10px;}');

addGlobalStyle('#panelBarStats > ol > li:nth-child(1) > div > figcaption > div > table > tbody > tr:nth-child(1) {background: white;color: black;font-weight:bolder;}');
addGlobalStyle('#panelBarStats > ol > li:nth-child(2) > div > figcaption > div > table > tbody > tr:nth-child(1) {background: white;color: black;font-weight:bolder;}');
addGlobalStyle('#panelBarStats > ol > li:nth-child(1) > div > div > table > tbody > tr:nth-child(2) {background: white;color: black;}');
addGlobalStyle('#panelBarStats > ol > li:nth-child(2) > div > figcaption > div > table > tbody > tr:nth-child(1) > td:nth-child(2) {color: black;font-weight:bolder; text-align:center;}');

addGlobalStyle('#panelBarStats > ol > li:nth-child(2) > div > figcaption > div > table{font-size:1.2em;border: 2px solid;}');
addGlobalStyle('#panelBarStats > ol > li:nth-child(2) > div{padding-top:10px;}');

addGlobalStyle('.leg-info {margin-top: 20px;margin-bottom: 20px;margin-left: 0%;border-color: black;font-weight: unset;text-align:center;white-space: nowrap;    display: table-row;  }');
addGlobalStyle('#panelBarStats > ol > li:nth-child(2) > div > div > table > tbody > tr:nth-child(2){background: #fff;  border: 1px solid white;white-space: nowrap })');
addGlobalStyle('#panelBarStats > ol > li:nth-child(2) > div > div > table > tbody > tr:nth-child(1){background: #fff;  border: 1px solid white;white-space: nowrap})');
addGlobalStyle('#panelBarStats > ol > li:nth-child(2) > div > div > table > tbody > tr:nth-child(1) > td:nth-child(1),#panelBarStats > ol > li:nth-child(2) > div > div > table > tbody > tr:nth-child(2) > td:nth-child(1){padding-left:10px;padding-right:10px;min-width:fit-content;white-space: nowrap;background: #302E2E; color: white;font-weight:bolder; text-align:left;vertical-align: middle;}');
addGlobalStyle('#resultsGrid > div.k-grid-header > div > table > thead > tr {background: white;color:black;  border: 1px solid white;font-weight:bolder;})');

addGlobalStyle('#panelBarStats > ol > li:nth-child(2) > div > div > table > tbody > tr:nth-child(2) > td:nth-child(2) > span {display:inline-flex;min-width:60px;}');
addGlobalStyle('#panelBarStats > ol > li:nth-child(2) > div > div > table > tbody > tr:nth-child(2) > td:nth-child(3) > span {display:inline-flex;}');
addGlobalStyle('#panelBarStats > ol > li:nth-child(2) > div > div > table > tbody > tr:nth-child(2) > td:nth-child(4) > span {display:inline-flex;}');
addGlobalStyle('#panelBarStats > ol > li:nth-child(2) > div > div > table > tbody > tr:nth-child(2) > td:nth-child(5) > span {display:inline-flex;}');
addGlobalStyle('#panelBarStats > ol > li:nth-child(2) > div > div > table > tbody > tr:nth-child(2) > td:nth-child(6) > span {display:inline-flex;}');
addGlobalStyle('#panelBarStats > ol > li:nth-child(2) > div > div > table > tbody > tr:nth-child(2) > td:nth-child(7) > span {display:inline-flex;}');
addGlobalStyle('#panelBarStats > ol > li:nth-child(2) > div > div > table > tbody > tr:nth-child(2) > td:nth-child(8) > span {display:inline-flex;}');
addGlobalStyle('#panelBarStats > ol > li:nth-child(2) > div > div > table > tbody > tr:nth-child(2) > td:nth-child(9) > span {display:inline-flex;}');
addGlobalStyle('#panelBarStats > ol > li:nth-child(2) > div > div > table > tbody > tr:nth-child(2) > td:nth-child(10) > span {display:inline-flex;}');
addGlobalStyle('#panelBarStats > ol > li:nth-child(2) > div > div > table > tbody > tr:nth-child(2) > td:nth-child(11) > span {display:inline-flex;}');
addGlobalStyle('#panelBarStats > ol > li:nth-child(2) > div > div > table > tbody > tr:nth-child(2) > td:nth-child(12) > span {display:inline-flex;}');
addGlobalStyle('#panelBarStats > ol > li:nth-child(2) > div > div > table > tbody > tr:nth-child(2) > td:nth-child(13) > span {display:inline-flex;}');
addGlobalStyle('#panelBarStats > ol > li:nth-child(2) > div > div > table > tbody > tr:nth-child(2) > td:nth-child(14) > span {display:inline-flex;}');
addGlobalStyle('#panelBarStats > ol > li:nth-child(2) > div > div > table > tbody > tr:nth-child(2) > td:nth-child(15) > span {display:inline-flex;}');
addGlobalStyle('#panelBarStats > ol > li:nth-child(2) > div > div > table > tbody > tr:nth-child(2) > td:nth-child(16) > span {display:inline-flex;}');
addGlobalStyle('#panelBarStats > ol > li:nth-child(2) > div > div > table > tbody > tr:nth-child(2) > td:nth-child(17) > span {display:inline-flex;}');
addGlobalStyle('#panelBarStats > ol > li:nth-child(2) > div > div > table > tbody > tr:nth-child(2) > td:nth-child(18) > span {display:inline-flex;}');

addGlobalStyle('#panelBarStats > ol > li:nth-child(2) > div > div > table > tbody > tr:nth-child(1) > td:nth-child(2) > span {display:inline-flex;}');
addGlobalStyle('#panelBarStats > ol > li:nth-child(2) > div > div > table > tbody > tr:nth-child(1) > td:nth-child(3) > span {display:inline-flex;}');
addGlobalStyle('#panelBarStats > ol > li:nth-child(2) > div > div > table > tbody > tr:nth-child(1) > td:nth-child(4) > span {display:inline-flex;}');
addGlobalStyle('#panelBarStats > ol > li:nth-child(2) > div > div > table > tbody > tr:nth-child(1) > td:nth-child(5) > span {display:inline-flex;}');
addGlobalStyle('#panelBarStats > ol > li:nth-child(2) > div > div > table > tbody > tr:nth-child(1) > td:nth-child(6) > span {display:inline-flex;}');
addGlobalStyle('#panelBarStats > ol > li:nth-child(2) > div > div > table > tbody > tr:nth-child(1) > td:nth-child(7) > span {display:inline-flex;}');
addGlobalStyle('#panelBarStats > ol > li:nth-child(2) > div > div > table > tbody > tr:nth-child(1) > td:nth-child(8) > span {display:inline-flex;}');
addGlobalStyle('#panelBarStats > ol > li:nth-child(2) > div > div > table > tbody > tr:nth-child(1) > td:nth-child(9) > span {display:inline-flex;}');
addGlobalStyle('#panelBarStats > ol > li:nth-child(2) > div > div > table > tbody > tr:nth-child(1) > td:nth-child(10) > span {display:inline-flex;}');
addGlobalStyle('#panelBarStats > ol > li:nth-child(2) > div > div > table > tbody > tr:nth-child(1) > td:nth-child(11) > span {display:inline-flex;}');
addGlobalStyle('#panelBarStats > ol > li:nth-child(2) > div > div > table > tbody > tr:nth-child(1) > td:nth-child(12) > span {display:inline-flex;}');
addGlobalStyle('#panelBarStats > ol > li:nth-child(2) > div > div > table > tbody > tr:nth-child(1) > td:nth-child(13) > span {display:inline-flex;}');
addGlobalStyle('#panelBarStats > ol > li:nth-child(2) > div > div > table > tbody > tr:nth-child(1) > td:nth-child(14) > span {display:inline-flex;}');
addGlobalStyle('#panelBarStats > ol > li:nth-child(2) > div > div > table > tbody > tr:nth-child(1) > td:nth-child(15) > span {display:inline-flex;}');
addGlobalStyle('#panelBarStats > ol > li:nth-child(2) > div > div > table > tbody > tr:nth-child(1) > td:nth-child(16) > span {display:inline-flex;}');
addGlobalStyle('#panelBarStats > ol > li:nth-child(2) > div > div > table > tbody > tr:nth-child(1) > td:nth-child(17) > span {display:inline-flex;}');
addGlobalStyle('#panelBarStats > ol > li:nth-child(2) > div > div > table > tbody > tr:nth-child(1) > td:nth-child(18) > span {display:inline-flex;}');
addGlobalStyle('#panelBarStats > ol > li:nth-child(2) > div > div > table > tbody{line-height:250%;border-right: 1px solid;}');

addGlobalStyle('.dark.legstats table tbody td{border: 2px solid;border-color:#cac4c4;  empty-cells: hide;}');
addGlobalStyle('.leg-info {display: table;max-width: 97%;}');
addGlobalStyle('#panelBarStats > ol > li:nth-child(2) > div > div > div > div > figcaption{zoom:0.99;}');
addGlobalStyle('#statsChart {zoom: 0.99;margin-top: 1%;}');
addGlobalStyle('.infobox.rounded.dark.title{ background: #302E2E;}');
addGlobalStyle('.infobox.dark{ background: #525252;}');
addGlobalStyle('body > div.content > div > div.sixteen.columns > div.rounded.dark.statsComments, .band.footer{ display: none;}');
addGlobalStyle('.content {background: none;}');











    /*    //texte form stat
var formstats = document.querySelectorAll('#panelBarStats > ol > li:nth-child(1) > h2 > span');
var wantToHide = true || false;
for (var i=0; i<formstats.length; i++)
{
  var thisformstats = formstats[i];
    thisformstats.textContent = "Vos statistiques des 20 derniers matchs (form stat)"; // change it
}
    //texte overall stat
var overallstats = document.querySelectorAll('#panelBarStats > ol > li:nth-child(2) > h2 > span');
for (var j=0; j<overallstats.length; j++)
{
  var thisoverallstats = overallstats[j];
    thisoverallstats.textContent = "Vos statistiques depuis le début (overall stat)"; // change it
}
*/
    var replaceArry = [

[/FORM/gi,'20 derniers matchs'],
[/Overall Average/gi,'Moyenne (depuis le début)'],
[/HIGHEST/gi,'Meilleure'],
[/LOWEST/gi,'Moins bonne'],
[/BEST LEG/gi,'Meilleure descente'],
[/OUT/gi,'fermeture'],
[/Legs played/gi,'manches jouées'],
[/games won/gi,'matchs gagnés'],
[/games lost/gi,'matchs perdus'],
[/games played/gi,'Matchs joués'],
[/games drawn/gi,'Matchs Nuls'],
[/WIN PERCENTAGE/gi,'Pourcentage de victoire'],
[/AVERAGE/gi,'Moyenne'],
[/OVERALL/gi,'Depuis le début'],
[/Full stats/gi,'Détails'],
[/Stats/gi,'Statistiques'],
[/Opponent/gi,'Adversaire'],
[/Result/gi,'Résultat'],
[/lost/gi,'Défaite'],
[/winner/gi,'Gagnant'],
[/win/gi,'Victoire'],
[/drawn/gi,'Égalité'],
        [/Full Report/gi,'Rapport complet'],
[/History/gi,'Historique'],
[/Game Type/gi,'Format de jeu'],
[/Match Type/gi,'Format de jeu'],
[/Comment/gi,'Commentaire'],
[/No items to display/gi,'Rien à afficher'],
[/leg loser remaining score/gi,'score restant du perdant de la manche'],



        [/Legs for 1/gi,'Combien de manches pour'],];

var numTerms    = replaceArry.length;
                  //-- 5 times/second; Plenty fast.
var transTimer  = setInterval (translateTermsOnPage, 222);

function translateTermsOnPage () {
    /*--- Replace text on the page without busting links or javascript
        functionality.
    */
    var txtWalker   = document.createTreeWalker (
        document.body,
        NodeFilter.SHOW_TEXT, {
            acceptNode: function (node) {
                //-- Skip whitespace-only nodes
                if (node.nodeValue.trim() ) {
                    if (node.tmWasProcessed)
                        return NodeFilter.FILTER_SKIP;
                    else
                        return NodeFilter.FILTER_ACCEPT;
                }
                return NodeFilter.FILTER_SKIP;
            }
        },
        false
    );
    var txtNode     = null;
    while (txtNode  = txtWalker.nextNode () ) {
        txtNode.nodeValue       = replaceAllTerms (txtNode.nodeValue);
        txtNode.tmWasProcessed  = true;
    }
    //
    //--- Now replace user-visible attributes.
    //
    var placeholderNodes    = document.querySelectorAll ("[placeholder]");
    replaceManyAttributeTexts (placeholderNodes, "placeholder");

    var titleNodes          = document.querySelectorAll ("[title]");
    replaceManyAttributeTexts (titleNodes, "title");
}

function replaceAllTerms (oldTxt) {
    for (var J  = 0;  J < numTerms;  J++) {
        oldTxt  = oldTxt.replace (replaceArry[J][0], replaceArry[J][1]);
    }
    return oldTxt;
}

function replaceManyAttributeTexts (nodeList, attributeName) {
    for (var J = nodeList.length - 1;  J >= 0;  --J) {
        var node    = nodeList[J];
        var oldText = node.getAttribute (attributeName);
        if (oldText) {
            oldText = replaceAllTerms (oldText);
            node.setAttribute (attributeName, oldText);
        }
        else
            throw "attributeName does not match nodeList in replaceManyAttributeTexts";
    }
}






})();
