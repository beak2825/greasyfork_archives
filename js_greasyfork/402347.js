// ==UserScript==
// @name         Glossika: replay button in trial mode
// @namespace    https://ai.glossika.com/*
// @version      0.1
// @description  Learn languages for free
// @match        https://ai.glossika.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/402347/Glossika%3A%20replay%20button%20in%20trial%20mode.user.js
// @updateURL https://update.greasyfork.org/scripts/402347/Glossika%3A%20replay%20button%20in%20trial%20mode.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setInterval( function() {
        if ( document.location.href.indexOf( '/session' ) > -1 ) {
            if ( !!document.querySelector( '.fa-play' ) ) {
                let container = document.querySelector( '.fa-play' ).closest( 'div' );
                container.appendChild(
                    draw_button( document.querySelectorAll( 'button.play' ) )
                );
                container.style.width = '100px';
            };
        };
    }, 500 );
})();

let audio = document.createElement( 'audio' );
function draw_button( button_list ) {
    if ( button_list.length == 1 )
        return button_list[ 0 ];

    let button = document.createElement( 'button' );
    button.className = '_2mPFw _3VPWu _1ocaZ FBHtj play';
    button.style.backgroundColor = '#00DD00';
    button.innerHTML = '<i class="fa fa-lg fa-play" aria-hidden="true"></i>';
    button.addEventListener( 'click', function() {
        // replay target language
        audio.src = document.querySelector( 'audio#tarAudio' ).src;
        audio.playbackRate = document.querySelector( 'audio#tarAudio' ).playbackRate;
        audio.play();
    }, false );
    return button;
};