// ==UserScript==
// @name         Sortowanie Allegro
// @namespace    http://allegro.pl
// @version      1.4
// @description  Skrypt automatycznie zmienia sortowanie na: cena od najniższej
// @author       Morfer
// @match        *://allegro.pl/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/396356/Sortowanie%20Allegro.user.js
// @updateURL https://update.greasyfork.org/scripts/396356/Sortowanie%20Allegro.meta.js
// ==/UserScript==

/* możliwe kategorie
* 'order=p'  (cena: od najniższej)
* 'order=pd' (cena: od najwyższej)
* 'order=d'  (cena z dostawą: od najniższej)
* 'order=dd' (cena z dostawą: od najwyższej)
* 'order=qd' (popularność: największa)
* 'order=t'  (czas do końca: najmniej)
* 'order=n'  (czas dodania: najnowsze)
*/

const category = 'order=p',
	  url = window.location.toString();

if((url.includes('listing') || url.includes('kategoria') || url.includes('uzytkownik')) && !url.includes(category) ) {
	if(url.includes('order=')) return;

	if(!url.includes('?')) {
	   	window.location += `?&${category}`;
		return;
	}

	window.location += `&${category}`;
}