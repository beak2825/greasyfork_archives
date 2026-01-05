// ==UserScript==
// @author      ZSMTurker
// @name        ZSMTurker's Webs Image Filter
// @namespace   https://greasyfork.org/users/2291
// @description Automatically clicks safe option for every image.
//              Click 'f' to submit.
// @match       https://imagefilter.heroku.com/*
// @require     http://code.jquery.com/jquery-latest.min.js
// @version     0.1
// @downloadURL https://update.greasyfork.org/scripts/1802/ZSMTurker%27s%20Webs%20Image%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/1802/ZSMTurker%27s%20Webs%20Image%20Filter.meta.js
// ==/UserScript==

$( document ).ready( function() {
    /* How large you want the frame to be */
    var hitHeight = 600;

    /* Set the frame height to hitHeight variable */
    $( 'iframe' ).attr( 'style', 'height: ' + hitHeight + 'px;' );

    /* Automatically click(not just check) every button for 'ok' */
    $( 'input[value="clean"]' ).click();
} );

document.addEventListener( "keydown", keyDownListener, false );

function keyDownListener( e ) {
    /* F key to submit results */
    if ( e.keyCode == 70 ) {
        $( 'input[value="Complete"]' ).click();
    }
}