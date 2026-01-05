// ==UserScript==
// @name         B - Joe Lo (safe)
// @version      1.0
// @description  + for up, - for down (keypad or regular should work)
// @author       ChrisTurk
// @include      /^https://(www|s3)\.(mturkcontent|amazonaws)\.com/
// @grant        GM_log
// @require      https://code.jquery.com/jquery-3.1.0.min.js
// @hitname      Identifying Homes with Solar Panels and Shading
// @hitsave      https://s3.amazonaws.com/mturk_bulk/hits/217094357/dUK9Iqxxz_UN17enFcPdqg.html?assignmentId=ASSIGNMENT_ID_NOT_AVAILABLE&hitId=3W5PY7V3UPVEX16D1MS48KUIB4LYJC
// @namespace https://greasyfork.org/users/53857
// @downloadURL https://update.greasyfork.org/scripts/24531/B%20-%20Joe%20Lo%20%28safe%29.user.js
// @updateURL https://update.greasyfork.org/scripts/24531/B%20-%20Joe%20Lo%20%28safe%29.meta.js
// ==/UserScript==

if ($( 'body:contains(stocks will go up or down)' ).length) { _sanity(); }

function _sanity() {

	var anum = 0;
	$( 'fieldset' ).css('display', 'none');
	$( 'fieldset' ).eq(anum).css('display', 'block');
	$(document).keydown(function(e){
        switch(e.which){

			case 109:
            case 189: //down
				$( 'input[value=0]:visible' ).click();
				$( 'fieldset' ).eq(anum).css('display', 'none');
				anum++;
				$( 'fieldset' ).eq(anum).css('display', 'block');
            break;

			case 107:
			case 187: //up
				$( 'input[value=1]:visible' ).click();
				$( 'fieldset' ).eq(anum).css('display', 'none');
				anum++;
				$( 'fieldset' ).eq(anum).css('display', 'block');
				break;


            default: return;
        }
    });
}

