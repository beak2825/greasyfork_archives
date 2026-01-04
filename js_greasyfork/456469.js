// ==UserScript==
// @name         Sortowanie Rossmann.pl + 96 pozycji na stronie
// @namespace    http://www.rossmann.pl
// @version      1.0
// @description  Skrypt automatycznie zmienia sortowanie, według najniższej ceny i wyświetlanie 96 pozycji na stronie.
// @author       ejzi
// @match        https://www.rossmann.pl/*
// @run-at       document-start
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/456469/Sortowanie%20Rossmannpl%20%2B%2096%20pozycji%20na%20stronie.user.js
// @updateURL https://update.greasyfork.org/scripts/456469/Sortowanie%20Rossmannpl%20%2B%2096%20pozycji%20na%20stronie.meta.js
// ==/UserScript==

const category = 'SortOrder=priceAsc',
	  url = window.location.toString();

if((url.includes('szukaj') || url.includes('kategoria')) && !url.includes(category) ) {

	if(!url.includes('PageSize')) {
	   	window.location += `?&${category}`;
		return;
	}

	window.location += `&${category}`;

	if (location.href.match("24")) {
	location.href = location.href.replace("24", "96");
	}

}