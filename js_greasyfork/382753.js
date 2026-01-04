// ==UserScript==
// @name         ReprintZee
// @namespace    none
// @version      2019.05.07.1236
// @description  Reprint Munzee with number and type
// @author       technical13
// @match        https://www.munzee.com/m/*/*/admin/print/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/382753/ReprintZee.user.js
// @updateURL https://update.greasyfork.org/scripts/382753/ReprintZee.meta.js
// ==/UserScript==

( function() {
    'use strict';

    $( '#print_numbers' ).click();
    $( '#txt' ).val( $( 'img.pin' ).attr( 'src' ).split( '/' ).slice( -1 ).toString().split( '.' )[ 0 ] );
} )();