// ==UserScript==
// @author      ZSMTurker
// @name        ZSMTurker's Piotr Script
// @namespace   https://greasyfork.org/users/2291
// @description Automatically selects the first two options and adds hotkey shortcuts.
// @require     http://code.jquery.com/jquery-latest.min.js
// @match       https://www.deyde.com/*
// @version     0.1
// @downloadURL https://update.greasyfork.org/scripts/2736/ZSMTurker%27s%20Piotr%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/2736/ZSMTurker%27s%20Piotr%20Script.meta.js
// ==/UserScript==

$( document ).ready( function() {
    $( 'button[name="cancel"]' ).eq( 0 ).css('float','right');
    $( 'button[name="check"]' ).eq( 0 ).css('float', 'left');
    $('#priceCluster-1').click();
    $('#offerCluster-1').click();
    document.addEventListener( "keydown", elPiotr, false );
} );

function elPiotr( i ) {
    if ( i.keyCode == 49 ) { //1
        $( 'button[name="check"]' ).eq( 0 ).css('background-color', '#ffffff');
        $( 'button[name="check"]' ).eq( 0 ).click();
    }
    if ( i.keyCode == 50 ) { //2
        $( 'button[name="cancel"]' ).eq( 0 ).css('background-color', '#ffffff');
        $( 'button[name="cancel"]' ).eq( 0 ).click();
    }
    if ( i.keyCode == 191 && i.shiftKey ) { //? Key - Shows Keys
        piotrCount++;
        alert(' 1 - Approve \n 2 - Reject');
    }
}