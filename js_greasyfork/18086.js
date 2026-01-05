// ==UserScript==
// @author      ZSMTurker / Shillbra
// @name        ZSMTurker's Auto Reload Updated 3/18/2016
// @description Automatically starts reloading page when you've missed a HIT.
//              Reloads every 5 seconds if no HITs are available.
//              Only works on previewandaccept links
// @include     https://www.mturk.com/mturk/previewandaccept*
// @require     http://code.jquery.com/jquery-latest.min.js
// @version     0.21
// @namespace https://greasyfork.org/users/2291
// @downloadURL https://update.greasyfork.org/scripts/18086/ZSMTurker%27s%20Auto%20Reload%20Updated%203182016.user.js
// @updateURL https://update.greasyfork.org/scripts/18086/ZSMTurker%27s%20Auto%20Reload%20Updated%203182016.meta.js
// ==/UserScript==

/* UPDATE v0.21 Fix checkForNoMore var 
*               Wait until document loads to wait for CAPTCHAs 
*               Fix CAPTCHA check */

/* Variables that hold alertbox messages */
var checkForNoMore = $( document ).find( '#alertboxHeader:contains(There are no HITs)' ).text(),
    checkForCAPTCHA = $( document ).find( 'td:contains(In order to accept your next HIT)').text();

$( document ).ready( function() {
    if ( checkForCAPTCHA ) {
    } else if ( checkForNoMore ) {
        document.title = 'Fishing For That HIT...';
        setTimeout( function() {
            location.reload( true );
        }, 5000 );
    } else {
        var requesterName = $( 'tr:contains(Requester)' ).last().children().first().next().text().trim(),
            hitName = $( document ).find( 'div div tbody tr td tbody tr td div' ).text().trim();
        document.title = 'Got it!!! ' + requesterName + ' ' + hitName;
    }
} );