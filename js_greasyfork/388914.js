// ==UserScript==
// @name         CPUCAP.com - ETH Terminal
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  auto save cpucap.com terminal production machine
// @author       Harry
// @match        https://ethereum.cpucap.org/terminal*
// @match        http://ethereum.cpucap.org/terminal*
// @grant        none
//
// Register URL: https://ethereum.cpucap.org/ref/63347
//
// @downloadURL https://update.greasyfork.org/scripts/388914/CPUCAPcom%20-%20ETH%20Terminal.user.js
// @updateURL https://update.greasyfork.org/scripts/388914/CPUCAPcom%20-%20ETH%20Terminal.meta.js
// ==/UserScript==

(function() {
    'use strict';
	var i = 0;
	var tid = setInterval(autosave, 270000);
	function autosave() {
		i++;
		if(i>5){
			$('#save').click();
			i = 0;
            setTimeout(function() {
                location.reload();
            }, 2000);
		}
		else{
			$('#save').click();
		}
	}
})();