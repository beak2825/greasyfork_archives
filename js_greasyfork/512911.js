// ==UserScript==
// @name         PoGO Alerts Network - Hide Showcases
// @namespace    https://github.com/SlyAceZeta/UserScripts
// @version      1.0.0
// @description  Hide showcases from the PoGO Alerts Network map so that only Kecleon stops will appear. Does not work from 7pm to 8pm.
// @author       SlyAceZeta
// @match        https://www.pogoalerts.net/map/
// @icon         https://icons.duckduckgo.com/ip2/pogoalerts.net.ico
// @grant        none
// @license      GNU General Public License v3.0
// @downloadURL https://update.greasyfork.org/scripts/512911/PoGO%20Alerts%20Network%20-%20Hide%20Showcases.user.js
// @updateURL https://update.greasyfork.org/scripts/512911/PoGO%20Alerts%20Network%20-%20Hide%20Showcases.meta.js
// ==/UserScript==

(function() {
	'use strict';

	function hideShowcases(){
		var d = new Date();
		var hour = d.getHours();
		if(hour !== 19){
			document.getElementByClassName("stop-rocket-marker").each(function(){
				if(this.innerText.includes("h") || this.innerText.includes("expired")) this.style.display = "none";
			});
		}
		setTimeout(hideShowcases, 5000);
	}
	hideShowcases();
})();
