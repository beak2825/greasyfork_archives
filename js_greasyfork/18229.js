// ==UserScript==
// @name 			GPRO Fake Valid
// @namespace		http://hajnrych.pl/
// @description		GPRO Validation testing
// @author          Marek 'hajnr' Hajnrych
// @include			*gpro.net/*/Qualify.asp*
// @require 		http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @version			0.2
// @grant 			GM_setValue
// @grant 			GM_getValue
// @grant           GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/18229/GPRO%20Fake%20Valid.user.js
// @updateURL https://update.greasyfork.org/scripts/18229/GPRO%20Fake%20Valid.meta.js
// ==/UserScript==

var jq = jQuery.noConflict();

jq(document).ready(function(){

	jq("#formQual").attr("onsubmit", null);
	console.log("Usuwam return Submitform()");

	jq("input[name='DriveLap']").click(function(event){
		event.preventDefault();
		console.log("Blokuje dzialanie submit i wykonuje własne.");
		jq("#formQual").submit();
	});

});
