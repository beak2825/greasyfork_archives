// ==UserScript==
// @name           OCCR Link Opener
// @namespace      OCCR
// @description    Opens Links from all Exchanges on OCCR.
// @version        1.0.2
// @copyright      2019+
// @homepage	   https://geckofort.xyz/ecdev/
// @require        http://code.jquery.com/jquery-1.12.4.min.js
// @include        https://geckofort.xyz/ecdev/new.php
// @include        https://geckofort.xyz/ecdev/all.php?page=*

// @downloadURL https://update.greasyfork.org/scripts/398902/OCCR%20Link%20Opener.user.js
// @updateURL https://update.greasyfork.org/scripts/398902/OCCR%20Link%20Opener.meta.js
// ==/UserScript==

var table = $( 'table table' ).eq( 1 );
var links = $( table ).find( 'href' );

console.log( links );

function timeout( i, links ) {
    if( i < links.length ) {
        //setTimeout(function () {
            window.open( $( links ).eq( i ).attr( 'href' ) );
            console.log( $( links ).eq( i ) );
            i++;
            timeout( i, links );
        //}, 1 );
    } else {
        var currentURL = window.location.href;
        setTimeout( function() {
            var nextURL = "";
            if( currentURL == "https://geckofort.xyz/ecdev/new.php" ) {
                nextURL = "https://geckofort.xyz/ecdev/all.php?page=1"
            } else if ( currentURL == "https://geckofort.xyz/ecdev/all.php?page=1" ) {
                nextURL = "https://geckofort.xyz/ecdev/all.php?page=2"
            } else if ( currentURL == "https://geckofort.xyz/ecdev/all.php?page=2" ) {
                nextURL = "https://geckofort.xyz/ecdev/all.php?page=3"
            } else if ( currentURL == "https://geckofort.xyz/ecdev/all.php?page=3" ) {
                nextURL = "https://geckofort.xyz/ecdev/new.php"
            }
            window.location.replace( nextURL );
        }, 120000 );
    }
}

setTimeout( function() {
    var i = 0;
    timeout( i, links );
}, 1000 );


