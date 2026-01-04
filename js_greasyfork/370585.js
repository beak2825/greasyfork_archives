// ==UserScript==
// @name 			e-Pracownik - autosave
// @namespace		http://hajnrych.pl/
// @description		Automatyczny zapis szablonu e-Pracownika
// @author          Marek Hajnrych
// @include			*192.168.1.202:4321/pl/ocena-pracownika/szablony
// @match			*192.168.1.202:4321/pl/ocena-pracownika/szablony
// @require 		http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @version			0.1
// @grant 			GM_setValue
// @grant 			GM_getValue
// @grant           GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/370585/e-Pracownik%20-%20autosave.user.js
// @updateURL https://update.greasyfork.org/scripts/370585/e-Pracownik%20-%20autosave.meta.js
// ==/UserScript==

var jq = jQuery.noConflict();

jq(document).ready(function(){

	console.log('skrypt działa');

	jq('#zapiszForm').children().click(function(){
		console.log('nacisniety save');
	});

});