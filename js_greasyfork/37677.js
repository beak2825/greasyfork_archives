// ==UserScript==
// @name         KSAF photo changer
// @namespace    http://albumy.ksaf.pl/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://albumy.ksaf.pl/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/37677/KSAF%20photo%20changer.user.js
// @updateURL https://update.greasyfork.org/scripts/37677/KSAF%20photo%20changer.meta.js
// ==/UserScript==

(function() {
    'use strict';

document.onkeypress = function(e){
	if (e.key === 'j') {
		document.getElementsByClassName("first-and-previous")[0].children[0].click();
	}
	if (e.key === 'k') {
		document.getElementsByClassName("next-and-last")[0].children[0].click();
	}
};

})();
