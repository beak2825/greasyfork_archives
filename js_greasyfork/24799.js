// ==UserScript==
// @name        WF scientists overview easy export button
// @namespace   http://www.war-facts.com/
// @include		http://www.war-facts.com/overview.php?view=13
// @description Adds a button onto the scientists overview to easily allow scientists export to sheets, excel, etc
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/24799/WF%20scientists%20overview%20easy%20export%20button.user.js
// @updateURL https://update.greasyfork.org/scripts/24799/WF%20scientists%20overview%20easy%20export%20button.meta.js
// ==/UserScript==
$(document).ready(function () {
	console.log('Adding export button to scientists overview')
	$('#hiredTable').before('<button id="export-btn">Export</button>')
	
	$('#export-btn').on('click', function () {
		var table = document.getElementById("hiredTable");
		scienceString = "<div><pre>"
		for (var i = 1, row; row = table.rows[i]; i++) {   
		  if (i == table.rows.length -1)
			break;
		  
		  for (var j = 0, col; col = row.cells[j]; j++) {
			scienceString += col.innerText
			scienceString += "\t"
		  }
		  scienceString += "</pre><pre>"
		}
		scienceString += "</p></div>"
		window.open().document.write(scienceString)
	})
})