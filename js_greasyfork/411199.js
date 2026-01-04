// ==UserScript==
// @name        Download Table as CSV
// @namespace   Violentmonkey Scripts
// @match       *://*/*
// @grant       none 
// @version     1.9
// @author      igorlogius
// @description Add a download button at the top of every html table to download / export it as a CSV (comma seperated values) file 
// @downloadURL https://update.greasyfork.org/scripts/411199/Download%20Table%20as%20CSV.user.js
// @updateURL https://update.greasyfork.org/scripts/411199/Download%20Table%20as%20CSV.meta.js
// ==/UserScript==

(function(){

	// simulate click event 
	function simulateClick(elem) {
		var evt = new MouseEvent('click', {
			bubbles: true,
			cancelable: true,
			view: window
		});
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
		btn.innerHTML = 'Download Table as CSV';
		btn.setAttribute('type', 'button');
		// Process Table on Click
		btn.onclick = function() {
			var csv_string = getTblData(tbl);
			csvlink.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv_string));
			simulateClick(csvlink);
		};
		// Insert before Table
		tbl.parentNode.insertBefore(btn,tbl);
	}

	
	/* * 
	 * M A I N 
	 * */

	// add link
	var csvlink = document.createElement('a');
	csvlink.style.display = 'none';
	csvlink.setAttribute('target', '_blank');
	csvlink.setAttribute('download', 'data.csv');
	document.body.append(csvlink);

	// add buttons
	document.querySelectorAll('table').forEach(function(tbl){add_btn(tbl)});
}());
