// ==UserScript==
// @author      ZSMTurker
// @name        ZSMTurker's Queue Filler
// @namespace   https://greasyfork.org/users/2291
// @description Reloads a previewandaccept page every 0.5 seconds.
//              Turn this off if you aren't using it!
// @include     https://www.mturk.com/mturk/previewandaccept*
// @require     http://code.jquery.com/jquery-latest.min.js
// @version     0.2
// @downloadURL https://update.greasyfork.org/scripts/1808/ZSMTurker%27s%20Queue%20Filler.user.js
// @updateURL https://update.greasyfork.org/scripts/1808/ZSMTurker%27s%20Queue%20Filler.meta.js
// ==/UserScript==

/* UPDATE v0.2  Wait until document loads to wait for CAPTCHAs
*               Fix CAPTCHA check */

var checkForNoMoreDeux = $( document ).find( '#alertboxMessage:contains(There are no more available)' ).text(),
    checkForNoMore = $( document ).find( '#alertboxHeader:contains(There are no more available)' ).text(),
    checkForCAPTCHA = $( document ).find( 'td:contains(In order to accept your next HIT)').text();

$( document ).ready( function() {
    if ( checkForCAPTCHA ) {
    } else if ( checkForNoMore ) {
    } else if ( checkForNoMoreDeux ) {
    } else {
        var requesterName = $( 'tr:contains(Requester)' ).last().children().first().next().text().trim();
        var hitName = $( document ).find( 'div div tbody tr td tbody tr td div' ).text().trim();
        document.title = 'Got it!!! ' + requesterName + ' ' + hitName;
        setTimeout( function() {
            location.reload( true );
        }, 500 );
    }
} );
