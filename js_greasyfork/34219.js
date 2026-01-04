// ==UserScript==
// @name         Cookie Clicker
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       You
// @match        http://orteil.dashnet.org/cookieclicker/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/34219/Cookie%20Clicker.user.js
// @updateURL https://update.greasyfork.org/scripts/34219/Cookie%20Clicker.meta.js
// ==/UserScript==

(function() {
    'use strict';

	function sleep(ms) {
  		return new Promise(resolve => setTimeout(resolve, ms));
	}

	function startup() {
		document.getElementById('topBar').style.display = "none";
		main();
	}


	async function main() {
  		for (i = 0; i < 100000000; i++) {
  			document.getElementById('versionNumber').innerHTML = "Hacked By Nick Lemke";
  			document.getElementById('storeTitle').innerHTML = "Shop";
    		document.getElementById('bigCookie').click();
    		document.getElementById('goldenCookie').click();
    		await sleep(0);
  		}
	}
	startup();
})();