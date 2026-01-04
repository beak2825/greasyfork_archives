// ==UserScript==
// @name         All tables sortable
// @namespace	 https://greasyfork.org/ru/users/303426
// @version      1.4
// @description  Make all tables on any page sortable by converting them to dataTables
// @author       Титан
// @match        *://*/*
// @icon         data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgZmlsbD0iI2ZmZiIgY2xhc3M9ImJpIGJpLXRhYmxlIiB2aWV3Qm94PSIwIDAgMTYgMTYiPgogIDxwYXRoIGQ9Ik0wIDJhMiAyIDAgMCAxIDItMmgxMmEyIDIgMCAwIDEgMiAydjEyYTIgMiAwIDAgMS0yIDJIMmEyIDIgMCAwIDEtMi0yVjJ6bTE1IDJoLTR2M2g0VjR6bTAgNGgtNHYzaDRWOHptMCA0aC00djNoM2ExIDEgMCAwIDAgMS0xdi0yem0tNSAzdi0zSDZ2M2g0em0tNSAwdi0zSDF2MmExIDEgMCAwIDAgMSAxaDN6bS00LTRoNFY4SDF2M3ptMC00aDRWNEgxdjN6bTUtM3YzaDRWNEg2em00IDRINnYzaDRWOHoiLz4KPC9zdmc+
// @require https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @grant       GM_registerMenuCommand
// @require https://cdn.jsdelivr.net/npm/datatables.net@1.13.6/js/jquery.dataTables.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/473073/All%20tables%20sortable.user.js
// @updateURL https://update.greasyfork.org/scripts/473073/All%20tables%20sortable.meta.js
// ==/UserScript==

(function() {
	'use strict';
	let autolaunch = false;

	function ConvertTables() {
		if (document.querySelector("head > link[href=\"https://cdn.datatables.net/1.13.6/css/jquery.dataTables.min.css\"]") == null)
		$('head').append('<link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/1.13.6/css/jquery.dataTables.min.css">'); // add dataTAbles css


		let tables = $('table')

		for (let i = 0; i < tables.length; i++) {
			try {
				ConvertTable_ToDataTable(tables[i]);
			} catch (e) {
				console.log(`[All tables sortable] table ${i}/${tables.length} error: ${e}`);
				console.log(tables[i]);
			}
		}
	}
    
    function ConvertTableFromSelection() {
        const selection = window.getSelection();
        let node;
        if (selection?.anchorNode?.nodeType === 1) {
            node = selection?.anchorNode;
        } else {
            node = selection?.anchorNode?.parentElement;
        }

        const table = node?.closest("table");
        if (table) {
            addDatatablesCSS();
            try {
                ConvertTable_ToDataTable(table);
            } catch (e) {
                console.error("[All tables sortable] selected table error:", e, table);
            }
        } else {
            alert("No table found near selected text.");
        }
    }



	function ConvertTable_ToDataTable(table) {
		if (!table.querySelector("thead")) {
			ConvertHeadlessTable_ToHeadedTable(table);
		}

		$(table).DataTable({
			"paging": false,
		});
	}

	function ConvertHeadlessTable_ToHeadedTable(table) {
		let tbody = table.querySelector("tbody");
		if (tbody && tbody.rows.length > 0) {
			let thead = document.createElement("thead");
			let firstRow = tbody.rows[0]; // first row = header
			thead.appendChild(firstRow); // move it to <thead>
			table.insertBefore(thead, tbody); // add <thead> before <tbody>
		}
	}

	GM_registerMenuCommand('Convert Tables', () => {
		ConvertTables();
	});
    
    GM_registerMenuCommand("Convert table containing selected text", () => {
        ConvertTableFromSelection();
});


	$(document).ready(function() {
		window.alert = (function() {  // suppress DataTables alert
			let nativeAlert = window.alert;
			return function(message) {
				//window.alert = nativeAlert;
				message.indexOf("DataTables warning") === 0 ?
					console.warn(message) :
					nativeAlert(message);
			}
		})();

		if (autolaunch) {
			ConvertTables();
		}

	});

})();