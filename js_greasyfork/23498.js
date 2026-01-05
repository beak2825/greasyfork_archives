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
// @hitsave      https://s3.amazonaws.com/mturk_bulk/hits/213127554/gNnUF_IpktVYa17QxCSO9A.html?assignmentId=3X4JMASXCNVZ9TN9O0BG0AVJHJXB0L&hitId=3XBYQ44Z6PQPQLKHRRQLIFEOLZWTW7
// @downloadURL https://update.greasyfork.org/scripts/23498/A9%20-%20Category%20Validation.user.js
// @updateURL https://update.greasyfork.org/scripts/23498/A9%20-%20Category%20Validation.meta.js
// ==/UserScript==

_category_validation();

function _category_validation () {
  if ($('u:contains(What we are looking for will change after every HIT!)').length) {

	// Keybinds
	$(document).keydown(function (e) {
	  switch (e.which) {
          case 96: case 81: // Numpad 0 or q
		  $('#noItem').click();
		  break;
          case 97: case 87: // Numpad 1 or w
		  $('#oneItem, #noPersonal, #noCatalog, #noOverlay, #noSliceDice, #completeObject').click();
		  break;
          case 98: case 69: // Numpad 2 or e
		  $('#multipleItem, #noPersonal, #noCatalog, #noOverlay, #noSliceDice, #completeObject').click();
		  break;
          case 99: case 82: // Numpad 3 or r
		  $('#deadLink').click();
		  break;
          case 100: case 49: // Numpad 4 or 1
		  $('#yesPersonal').click();
		  break;
          case 101: case 50: // Numpad 5 or 2
		  $('#yesCatalog').click();
		  break;
          case 102: case 51: // Numpad 6 or 3
		  $('#yesOverlay').click();
		  break;
          case 103: case 52: // Numpad 7 or 4
		  $('#partialObject').click();
		  break;
          case 13: case 70: // Enter or f
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