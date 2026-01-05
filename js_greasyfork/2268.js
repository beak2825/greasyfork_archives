// ==UserScript==
// @author      ZSMTurker
// @name        ZSMTurker's Larger MTG Post Area
// @namespace   https://greasyfork.org/users/2291
// @description Make the post box larger
// @require     http://code.jquery.com/jquery-latest.min.js
// @match       http://www.mturkgrind.com/*
// @match       https://www.mturkgrind.com/*
// @version     0.1
// @downloadURL https://update.greasyfork.org/scripts/2268/ZSMTurker%27s%20Larger%20MTG%20Post%20Area.user.js
// @updateURL https://update.greasyfork.org/scripts/2268/ZSMTurker%27s%20Larger%20MTG%20Post%20Area.meta.js
// ==/UserScript==
var smilieDiv, sizeInput, quickReplyDiv, currentPT2, currentPT1, currentPage,
    heightVar = 300;

currentPT2 = ( window.location.href ).split( '/' );
currentPT1 = currentPT2[ 3 ].slice( 0, 3 );
currentPage = currentPT1[ 0 ];

$( document ).load( function() {
    setTimeout( function() {
        changeHeight( heightVar );
    }, 3000 );
    $( '#sizeId' ).change( function() {
        heightVar = sizeInput.value;
        changeHeight( heightVar );
    } );
} );

if ( currentPT1 == 'thr' ) {
    quickReplyDiv = document.getElementById( 'quickreply_title' );
    sizeInput = document.createElement( 'INPUT' );
    sizeInput.value = heightVar;
    sizeInput.size = 5;
    sizeInput.id = 'sizeId';
    quickReplyDiv.appendChild( sizeInput );
} else if ( currentPT1 == 'edi' ) {
    smilieDiv = document.getElementsByClassName( 'blockhead' )[ 0 ];
    sizeInput = document.createElement( 'INPUT' );
    sizeInput.value = heightVar;
    sizeInput.size = 5;
    sizeInput.id = 'sizeId';
    smilieDiv.appendChild( sizeInput );
}

function changeHeight() {
    $( '.cke_contents' ).css( 'height', heightVar + 'px' );
}