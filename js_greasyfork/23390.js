// ==UserScript==
// @name         MedEx
// @version      1.1
// @description  Formats HIT. Designed for PCP only, will probably break other formats but I'll update those as they post.
// @author       ChrisTurk
// @include      /^https://(www|s3)\.(mturkcontent|amazonaws)\.com/
// @grant        GM_setClipboard
// @require      https://code.jquery.com/jquery-3.1.0.min.js
// @hitsave      https://www.mturkcontent.com/dynamic/hit?assignmentId=37WLF8U1WQ9YMEIKXL9C471I1596KN&hitId=3O2Y2UIUCQDRIND18B7E9TJBSW5KF1
// @namespace https://greasyfork.org/users/53857
// @downloadURL https://update.greasyfork.org/scripts/23390/MedEx.user.js
// @updateURL https://update.greasyfork.org/scripts/23390/MedEx.meta.js
// ==/UserScript==

var hideP = true;
$( document ).ready(function(){
	if ($( 'body:contains(currently practice at this location)' ).length) { _sanity(); }
});


function _sanity() {

	if (hideP === true){
		$( 'p' ).hide(); //this will remove the "call script" paragraphs before the HIT itself, just more instructions and who reads those anyway?
		$( 'p:contains(4a)' ).show();
		$( 'p:contains(4b)' ).show();
                $( '.text-center' ).show();
	}

	var docName = $( 'td' ).eq(1).text();
	var phone = $( 'td' ).eq(9).text();
	GM_setClipboard(docName + ' ' + phone);

	$( 'fieldset' ).eq(1).hide(); // hides the updated phone # fieldset, need to unhide for no/idiot receptionist/voicemail/disconnected
	$( 'fieldset' ).eq(2).prepend('<label>Is this doctor a:</label>'); //this is the pcp/specialist ?
	$( 'fieldset' ).eq(3).hide(); // 3a -> pcp only Dr's "focus"
	$( 'fieldset' ).eq(4).hide(); // 3b -> specialist type
	$( 'fieldset' ).eq(5).hide(); // 4a -> pcp only mental health pros embedded in primary care practice
	$( 'fieldset' ).eq(6).hide(); // 4b -> pcp only does dr have preferred mental health pro to refer patients to?

	$( 'input' ).click(function(){
		var name = $(this).attr('name');
		var val = $(this).attr('value');
		if (name == 'confirm_prac' && (val == 'no' || val == 'do_not_know' || val == 'voicemail_prerecorded' || val == 'phone_rang_but_nothing_else' || val == 'disconnected')){
			$( 'fieldset' ).eq(1).show(); // need to fill this out to finish the HIT, even if its n/a
		}
		else if (name == 'confirm_prac' ){
			$( 'fieldset' ).eq(1).hide(); // can hide the extra field if none of the above ticks
		}

		if (name == 'confirm_pcp' && val == 'is_pcp'){
			//
			$( 'fieldset' ).eq(3).show();
			$( 'fieldset' ).eq(4).hide();
			$( 'fieldset' ).eq(5).show();
			$( 'fieldset' ).eq(6).show();
		}
		else if (name == 'confirm_pcp' && val == 'is_specialist'){
			//
			$( 'fieldset' ).eq(3).hide();
			$( 'fieldset' ).eq(4).show();
			$( 'fieldset' ).eq(5).hide();
			$( 'fieldset' ).eq(6).hide();
		}
		else if (name == 'confirm_pcp' && val == 'is_both'){
			//
			$( 'fieldset' ).eq(3).show();
			$( 'fieldset' ).eq(4).show();
			$( 'fieldset' ).eq(5).show();
			$( 'fieldset' ).eq(6).show();
		}
		else if (name == 'confirm_pcp' && val == 'do_not_know'){
			//
			$( 'fieldset' ).eq(3).show();
			$( 'fieldset' ).eq(4).show();
			$( 'fieldset' ).eq(5).show();
			$( 'fieldset' ).eq(6).show();
		}
	});
}

