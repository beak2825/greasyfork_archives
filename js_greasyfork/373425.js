// ==UserScript==
// @name         Install This
// @namespace    http://tampermonkey.net/
// @version      big.penis
// @description  IS a cookie clicker, but i mainly just want the most installs, just instll this please.
// @author       Major Diabetes
// @match        http://orteil.dashnet.org/cookieclicker/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/373425/Install%20This.user.js
// @updateURL https://update.greasyfork.org/scripts/373425/Install%20This.meta.js
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