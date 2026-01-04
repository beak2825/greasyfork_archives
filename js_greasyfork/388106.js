// ==UserScript==
// @name         Torn Extensions - Faction Activity
// @namespace    TornExtensions
// @version      1.2
// @description  Shows the activity of employees.
// @author       Mathias [XID 1918010]
// @match        https://www.torn.com/factions.php*
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/388106/Torn%20Extensions%20-%20Faction%20Activity.user.js
// @updateURL https://update.greasyfork.org/scripts/388106/Torn%20Extensions%20-%20Faction%20Activity.meta.js
// ==/UserScript==

(function() {
    'use strict';
	let APIKey = "API KEY HERE";
	let API = `https://api.torn.com/faction/?key=${APIKey}`;
	let targetNode = document.querySelector("#faction-info");
	let config = { childList: true };

	if($(".faction-tabs-title").text() == "INFO") {
		run();
	}
	
	let callback = function(mutationsList, observer) {
		run();
	}
	
	function run() {
		GM_xmlhttpRequest({
			method: "GET",
			url: API,
			onreadystatechange: (res) => {
				if(res.readyState > 3 && res.status === 200) {
					let resp = JSON.parse(res.response);
					$.each(resp.members, (id, data) => {
						let div = $(`a[href="/profiles.php?XID=${id}"].user.name`).parent().parent().parent(), days = data.last_action.relative.split(" ");
						if(days[1].includes("day"))
							if(parseInt(days[0]) == 1)
								$(div).css("background-color", "#e6c26a");
							else if(parseInt(days[0]) >= 2)
								$(div).css("background-color", "#e66a6a");
					});
				}
			},
			onerror: (err) => {
				console.log(err);
			}
		});
	}
	
	let observer = new MutationObserver(callback);
	observer.observe(targetNode, config);
})();