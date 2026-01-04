// ==UserScript==
// @name           Yarold's Care Completer
// @namespace      Yarolds
// @description    Completes care for Yarolds
// @version        1.0.2
// @copyright      2019+
// @homepage       http://swle.yarold.eu
// @require        http://code.jquery.com/jquery-1.12.4.min.js
// @include        https://swle.yarold.eu/care.php*
// @downloadURL https://update.greasyfork.org/scripts/384592/Yarold%27s%20Care%20Completer.user.js
// @updateURL https://update.greasyfork.org/scripts/384592/Yarold%27s%20Care%20Completer.meta.js
// ==/UserScript==

function randomNumber( min, max ) {
  return ( Math.random() * ( max - min ) + min );
}

var url = window.location.href;
var min = 250;
var max = 550;

var input = $( 'input[name="anything"]' ).val( 'test' ); //change test to whatever you usually use
var submit = $('input[type="submit"]');

setTimeout( function() {
    $( input ).val( 'test' ); //change test to whatever you usually use
    setTimeout( function() {
        $( submit ).click();
        setTimeout( function() {
            window.close();
        }, 500);
    }, 500);
}, 500);