// ==UserScript==
// @name         A9 - Category Validation
// @namespace    http://kadauchi.com/
// @version      1.0.4
// @description  Does stuff.
// @author       Kadauchi
// @icon         http://kadauchi.com/avatar4.jpg
// @include      /^https://(www|s3)\.(mturkcontent|amazonaws)\.com/
// @grant        GM_log
// @require      https://code.jquery.com/jquery-3.1.0.min.js
// @hitname      Category Validation (WARNING: This HIT may contain adult content. Worker discretion is advised.)
// @hitsave      https://s3.amazonaws.com/mturk_bulk/hits/213127554/gNnUF_IpktVYa17QxCSO9A.html
// @downloadURL https://update.greasyfork.org/scripts/21850/A9%20-%20Category%20Validation.user.js
// @updateURL https://update.greasyfork.org/scripts/21850/A9%20-%20Category%20Validation.meta.js
// ==/UserScript==

_category_validation();

function _category_validation () {
  if ($('u:contains(What we are looking for will change after every HIT!)').length) {

	// Keybinds
	$(document).keydown(function (e) {
	  switch (e.which) {
		case 96: // Numpad 0
		  $('#noItem').click();
		  break;
		case 97: // Numpad 1
		  $('#oneItem, #noPersonal, #noCatalog, #noOverlay, #noSliceDice').click();
		  $('input[name="objectView"][value="No"]').click();
		  break;
		case 98: // Numpad 2
		  $('#multipleItem, #noPersonal, #noCatalog, #noOverlay, #noSliceDice').click();
		  $('input[name="objectView"][value="No"]').click();
		  break;
		case 101: // Numpad 5
		  $('#yesSliceDice').click();
		  break;
		case 102: // Numpad 6
		  $('#yesOverlay').click();
		  break;
		case 103: // Numpad 7
		  $('#yesPersonal').click();
		  break;
		case 105: // Numpad 9
		  $('#yesCatalog').click();
		  break;
		case 13: // Enter
		  $('#submitButton').click();
		  break;
	  }
	});
	console.log('activated');
  }
}


/*
Jharkan @MTC
http://www.mturkcrowd.com/posts/349481/

Numpad0::
send {tab}{space}
return

Numpad1::
send {tab}{down}
sleep, 100
send {tab 2}{right}{tab}{right}{tab}{right}
return

Numpad2::
send {tab}{down 2}
sleep, 100
send {tab 2}
send {right}{tab}{right}{tab}{right}
return

Numpad6::
send {left}
return

Numpad7::
send, {shift down}{tab}{tab}{shift up}
send {left}
return

Numpad9::
send, {shift down}{tab}{shift up}
send {left}
return

^9::
suspend
return

^3::
ExitApp
*/