// ==UserScript==
// @name           Yarolds Link Opener
// @namespace      Yarolds
// @description    Opens Links from all Exchanges on Yarolds.
// @version        2.2.7
// @copyright      2019+
// @homepage	   http://swle.yarold.eu
// @require        http://code.jquery.com/jquery-1.12.4.min.js
// @include        https://swle.yarold.eu/main.php
// @include        https://swle.yarold.eu/history.php
// @include        https://swle.yarold.eu/dynasty_ex.php
// @downloadURL https://update.greasyfork.org/scripts/384542/Yarolds%20Link%20Opener.user.js
// @updateURL https://update.greasyfork.org/scripts/384542/Yarolds%20Link%20Opener.meta.js
// ==/UserScript==

var table = $( 'table table' ).eq( 1 );
var links = $( table ).find( 'a.gl' );

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
            if( currentURL == "https://swle.yarold.eu/main.php" ) {
                nextURL = "https://swle.yarold.eu/history.php"
            } else if ( currentURL == "https://swle.yarold.eu/history.php" ) {
                nextURL = "https://swle.yarold.eu/dynasty_ex.php"
            } else if ( currentURL == "https://swle.yarold.eu/dynasty_ex.php" ) {
                nextURL = "https://swle.yarold.eu/main.php"
            }
            window.location.replace( nextURL );
        }, 30000 );
    }
}

setTimeout( function() {
    var i = 0;
    timeout( i, links );
}, 1000 );


