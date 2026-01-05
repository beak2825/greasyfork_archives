// ==UserScript==
// @name          e-Pracownik
// @description	  Usuwanie ikon z e-Pracownika
// @author        Marek 'hajnr' Hajnrych
// @include		  *192.168.1.202:4321/ocena-pracownika/moje-arkusze
// @include		  *192.168.1.202:4321/ocena-pracownika/arkusze-ocen
// @include		  *212.87.249.37:4321/ocena-pracownika/moje-arkusze
// @require 	  http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @version       0.9.2
// @namespace	  https://greasyfork.org/users/33229
// @downloadURL https://update.greasyfork.org/scripts/27724/e-Pracownik.user.js
// @updateURL https://update.greasyfork.org/scripts/27724/e-Pracownik.meta.js
// ==/UserScript==

var jq = jQuery.noConflict();

//console.log("dzialam?");

jq(document).ready(function(){

	var path = window.location.pathname;

	console.log(path);

	jq('.btnDrukujArkusz').css('display', 'none');
	jq('#anulujForm').css('display','none');

	if(path.indexOf('arkusze-ocen') > -1) {
		jq('.btnPokazOcene').css('display', 'none');
		jq('#zatwierdzForm').css('display', 'none');
	}

	if(path.indexOf('moje-arkusze') > -1) {
		jq('#zapiszForm').css('display', 'none');
	}

});



