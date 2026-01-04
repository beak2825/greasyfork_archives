// ==UserScript==
// @name      		Przywrócenie logo Allegro
// @name:en        	Restore Allegro logo
// @namespace    	http://tampermonkey.net/
// @version      	0.1
// @description		Przywraca logo Allegro.pl do oryginału (pomarańczowego)
// @description:en	Restore Allegro.pl logo to original (orange)
// @author       	adamaru
// @match        	*://allegro.pl/*
// @icon         	https://www.google.com/s2/favicons?sz=64&domain=allegro.pl
// @grant        	none
// @run-at       	document-end
// @license			MIT
// @downloadURL https://update.greasyfork.org/scripts/450988/Przywr%C3%B3cenie%20logo%20Allegro.user.js
// @updateURL https://update.greasyfork.org/scripts/450988/Przywr%C3%B3cenie%20logo%20Allegro.meta.js
// ==/UserScript==

(function() {
	'use strict';

	var ukraineLogos = document.querySelectorAll('img[src="https://a.allegroimg.com/original/1201da/b8806483460d99ec3739941289ab"]');
	for(var i = 0; i < ukraineLogos.length; ++i){
		ukraineLogos[i].src = "https://assets.allegrostatic.com/metrum/brand/allegro-347440b030.svg";
	}
})();