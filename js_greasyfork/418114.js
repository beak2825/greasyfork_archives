// ==UserScript==
// @name        Download Table as CSV
// @namespace   https://greasyfork.org/en/scripts/418114-download-table-as-csv
// @match       *://*/*
// @grant       GM_registerMenuCommand
// @grant       unsafeWindow
// @version     2.01
// @author      igorlogius & drshajul
// @description Add a download / copy button at the top of every html table to download / export it as a CSV file
// @downloadURL https://update.greasyfork.org/scripts/418114/Download%20Table%20as%20CSV.user.js
// @updateURL https://update.greasyfork.org/scripts/418114/Download%20Table%20as%20CSV.meta.js
// ==/UserScript==

(function(){

	// simulate click event 
	function simulateClick(elem) {
		var evt = new MouseEvent('click', {
			bubbles: true,
			cancelable: true,
			view: unsafeWindow
		});
		var canceled = !elem.dispatchEvent(evt);
	}

	// get closest table parent
	function getTableParent(node){
		while ( node = node.parentNode, node !== null && node.tagName !== 'TABLE' );
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
        tbl.style.border = "2px solid yellow";
		var btn = document.createElement('img');
        btn.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAADsAAAA7AF5KHG9AAAAGXRFWHRTb2Z0d2FyZQB3d3cuaW5rc2NhcGUub3Jnm+48GgAAARdJREFUWIXtlj0KwkAQhb8YELSxtfH3EpJC7yLY6ynEwttZS1BPICgkNrHIbIqQJZl1g00evGKT3XkfCZkM6HUCUiArOQWODvXUqgo3TrTFAgeAzGfNngOAV3UAHUAH0AHYAHbAm+p2W6eqM29gqwHYAMMGYU01BNaaAzMgxv7T0ToGplrqKXD1EH4DFtpwXxA/hf8K4SXcFcJruBbiBix9hzeFaDW8DsI53Dbllv0EIjlT7hMxMJd7keytq1dM0U3CbRAXsTbcOEGx2fhF3qrL0oYbOzWYF7AHxuKDXFPXCgzFv9TmPPAQ29aFXF5Bne/AQHyvWBd7/z4RBeSfYb+F2uZxTyxrgDQkn1ZWQOgZYCS2rT/A+Qu+RBVvAUbgRQAAAABJRU5ErkJggg==";
        btn.alt = btn.title = "Download Table";
        var btnCopy = document.createElement('img');
        btnCopy.src = " data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAIAAAD8GO2jAAAACXBIWXMAAAsTAAALEwEAmpwYAAACFklEQVRIie2Wv6riQBTGjzEJin/wgiCKiNppJWgrdjYWFpaCYKGd6CP4DBYWplOEFD6BZcROFExhbBIQxFJEEM1oZovZzb13NZp13WbxVx3IzPedMzM5MxaMMfxLaD06HA4cx02nU03TTE622Wy5XC6fz1ssFsNBGGOM8eFwSKVSz+XYaDSwMRayRK1Wq16vA0AoFHK73Sal1+v1drulKEoUxXg8fq+CcrkMAMFgECF0J53fmM/nRKTf7xuNociIy+UCAC6Xi6bp24nc4uPjgwR3tu2B3HA4FAQBIXTz636/JwHP86IoAgDDMOl0OpvNfm47KaRUKgFALBbTS9M0rVqtmq/mK5VKRdM0omNYgSAInU4HAFiWtdlsJqWPx6OqqhzHFYvFTCYDd5ZoPB4DAMMwsiz7/X6TBpvNJhKJIIRGo9EDg/P5DAA0Tft8PoqiTBr4fD6aphFC5NQAgNmZT/M2eBu8DfQ/mTReRVHa7bbH4wEA0h1fAOl5k8nk5k1gt9v/6ApCCNntdgBoNpvfLpxkMsnzfCAQeE3WX/jcg0KhsFqtFEWRJEmSpFqt9hKDb8titVrD4TCJvV7vSwz+m2N6jcPhAABVVQeDQTQaNSkny/LpdNKnA/w6ptcsl0uWZZ/LmmXZxWJBdAwNMMa9Xs/8K0/H6XR2u11d5OfT0YjdbjebzYzeRdcwDJNIJEgvIDww+Ht+AFt8q8cWNQVnAAAAAElFTkSuQmCC";
        btnCopy.alt = btnCopy.title = "Copy Table";
        btn.classList.add("drshajul-download");
        btnCopy.classList.add("drshajul-download");
		// Process Table on Click
        var csv_string = getTblData(tbl);
		btn.onclick = function() {
			csvlink.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv_string));
			simulateClick(csvlink);
		};
        btnCopy.onclick = function() {
            var copy_string = csv_string.replace(/","/gm,"\t").replace(/"/gm,'');
            var dummy = document.createElement("textarea");
            document.body.appendChild(dummy);
            dummy.value = copy_string;
            dummy.select();
            dummy.setSelectionRange(0, 99999); /*For mobile devices*/
            document.execCommand("copy");
            document.body.removeChild(dummy);
        };
		// Insert before Table
		tbl.parentNode.insertBefore(btn,tbl);
		tbl.parentNode.insertBefore(btnCopy,tbl);
	}


	/* * *
	 * M A I N *
	 * */

    GM_registerMenuCommand('Show Table Downloads', () => {
        document.querySelectorAll('table').forEach(function(tbl){
            add_btn(tbl);
        });
    });

  var style = document.createElement('style');
  style.innerHTML = `
.drshajul-download {
display: inline-block;
width: 24px;
height: 24px;
cursor: pointer;
opacity: 0.5;
background-color: white;
margin: 5px;
}
.drshajul-download:hover {
opacity: 1;
}
`;
    document.head.appendChild(style);

	// add link
	var csvlink = document.createElement('a');
	csvlink.style.display = 'none';
	csvlink.setAttribute('target', '_blank');
	csvlink.setAttribute('download', 'data.csv');
	document.body.append(csvlink);

	// add buttons - moved to the tampermonkey menu
	// document.querySelectorAll('table').forEach(function(tbl){add_btn(tbl)});
}());
