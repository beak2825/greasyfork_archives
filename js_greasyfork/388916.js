// ==UserScript==
// @name         oomier
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  auto save cpucap.com terminal production machine
// @author       Harry
// @match        https://www.oominer.com/cpuwin/ethereum-mining/terminal*
// @match        http://www.oominer.com/cpuwin/ethereum-mining/terminal*
// @grant        none
//
// @downloadURL https://update.greasyfork.org/scripts/388916/oomier.user.js
// @updateURL https://update.greasyfork.org/scripts/388916/oomier.meta.js
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