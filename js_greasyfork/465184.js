// ==UserScript==
// @name        hide-images-2
// @namespace   https://en.wikipedia.org/wiki/User:Twotwos
// @author      twotwos
// @description Replaces images on Wikipedia with a placeholder until you click them. Adapted from https://en.wikipedia.org/wiki/User:Anomie/hide-images
// @match       *.wikipedia.org/*
// @match       *.wikimedia.org/*
// @grant       GM_addStyle
// @run-at      document-start
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @version     2
// @license     CC BY-SA 3.0
// @downloadURL https://update.greasyfork.org/scripts/465184/hide-images-2.user.js
// @updateURL https://update.greasyfork.org/scripts/465184/hide-images-2.meta.js
// ==/UserScript==

GM_addStyle('img {visibility:hidden;} img.hide-images-handled {visibility:visible;} span.hide-images-wrapper {background:url(//upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Battenburg-white-blue.svg/300px-Battenburg-white-blue.svg.png) repeat;background-size:contain;outline:2px solid red;cursor:pointer;display:inline-block;} span.hide-images-wrapper img.hide-images-handled {visibility:hidden;}')

( function ( $ ){
    var hide_regex = /^(?:https?:)?\/\/upload.wikimedia.org\/wikipedia\/(?:en|commons)\//;

    function clickHandler ( e ) {
        e.stopPropagation();
        e.preventDefault();
        $( this.firstChild ).unwrap();
    };

    function makeWrapper () {
        return $( '<span>', {
            'class': 'hide-images-wrapper',
            'click': clickHandler
        } );
    };

    $( 'img' ).each( function () {
        if ( hide_regex.test( this.src ) ) {
            $( this ).wrap( makeWrapper );
        }
        $( this ).addClass( 'hide-images-handled' );
    } );
}(jQuery ) );

