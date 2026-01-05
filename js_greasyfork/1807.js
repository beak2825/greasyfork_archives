// ==UserScript==
// @author      ZSMTurker
// @name        ZSMTurker's Auto Reload
// @namespace   https://greasyfork.org/users/2291
// @description Automatically starts reloading page when you've missed a HIT.
//              Reloads every 5 seconds if no HITs are available.
//              Only works on previewandaccept links
// @include     https://www.mturk.com/mturk/previewandaccept*
// @require     http://code.jquery.com/jquery-latest.min.js
// @version     0.2
// @downloadURL https://update.greasyfork.org/scripts/1807/ZSMTurker%27s%20Auto%20Reload.user.js
// @updateURL https://update.greasyfork.org/scripts/1807/ZSMTurker%27s%20Auto%20Reload.meta.js
// ==/UserScript==

/* UPDATE v0.2  Wait until document loads to wait for CAPTCHAs
*               Fix CAPTCHA check */

/* Variables that hold alertbox messages */
var checkForNoMore = $( document ).find( '#alertboxHeader:contains(There are no more available)' ).text(),
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