// ==UserScript==
// @name         Sergey Schmidt Submit
// @description  Fix buttons, clean instructions, use other scripts for individual HITs for efficient workflow. Make hide instructions from Kadauchi work for Sergey's (usual) formatting.
// @author       ChrisTurk
// @require      https://code.jquery.com/jquery-3.1.0.min.js
// @include      /^https://(www|s3)\.(mturkcontent|amazonaws)\.com/
// @version 0.0.1.20161018145318
// @namespace https://greasyfork.org/users/53857
// @downloadURL https://update.greasyfork.org/scripts/24114/Sergey%20Schmidt%20Submit.user.js
// @updateURL https://update.greasyfork.org/scripts/24114/Sergey%20Schmidt%20Submit.meta.js
// ==/UserScript==

$(document).ready(function(){
	if ($( 'body:contains(Instructions [-])' ).length) { SergeyPls(); }
});

function SergeyPls() {
	// Fix submit button, enable it just in case
	$( '#submitButton' ).css('display','block');
	$( '#submitButton' ).prop("disabled", false);

	// Creates button and hides instructions.
	$( '#instructions' ).before('<button id="toggle" type="button"><span>Show Instructions</span></button>');
	$( '#instructions' ).hide();
	$( '#sample-task' ).hide();
	$( '#please-note' ).hide();

	// Toggles instructions and changes toggle text.
	$( '#toggle' ).click(function() {
		$( '#instructions' ).toggle();
		$( '#sample-task' ).toggle();
		$( '#please-note' ).toggle();
		$( '#toggle' ).text() == 'Show Instructions' ? str = 'Hide Instructions' : str = 'Show Instructions';
		$( '#toggle span' ).html(str);
	}); //toggle function end

}