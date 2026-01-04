// ==UserScript==
// @name         [twitch.tv] Picture in Picture Button
// @version      0.123
// @description  Add a Picture-in-Picture button to the twitch player controls.
// @namespace    itsmeyourfish
// @author       itsmeyourfish
// @match        https://www.twitch.tv/*
// @downloadURL https://update.greasyfork.org/scripts/392961/%5Btwitchtv%5D%20Picture%20in%20Picture%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/392961/%5Btwitchtv%5D%20Picture%20in%20Picture%20Button.meta.js
// ==/UserScript==

( function() {
    'use strict'

    const selector = {
        controls: '.player-controls__right-control-group',
        fs_btn: 'button[data-a-target=player-fullscreen-button]',
        tooltip: '.tw-tooltip',
        icon: '.tw-icon__svg',
        pip_tt: '#player-pip-tooltip-123',
    };

    function add_picture_in_picture_btn() {
        const controls = document.querySelector( selector.controls );
        if ( !controls ) return false;

        if ( !controls.querySelector( selector.pip_tt ) ) {
            const fs_control = controls.querySelector( selector.fs_btn ).parentElement;
            fs_control.setAttribute( 'style', 'order: 2' );

            const pip_control = fs_control.cloneNode( true );
            pip_control.setAttribute( 'style', 'order: 1' );

            const pip_btn = pip_control.querySelector( 'button' );
            pip_btn.setAttribute( 'data-a-target', 'player-pip-button' );
            pip_btn.setAttribute( 'aria-label', 'Picture in Picture' );

            const pip_tooltip = pip_control.querySelector( selector.tooltip );
            pip_tooltip.setAttribute( 'id', selector.pip_tt.slice( 1 ) );
            pip_tooltip.textContent = 'Picture in Picture';

            const pip_icon = pip_btn.querySelector( selector.icon );
            pip_icon.outerHTML = '<svg class="tw-icon__svg" width="100%" height="100%" version="1.1" viewBox="0 0 98 82" x="0px" y="0px"><rect x="9" y="9" width="80" height="64" fill="transparent" stroke="currentColor" stroke-width="8" rx="4" /><rect x="45" y="37" width="32" height="24" fill="currentColor" /></svg>';

            const [ video ] = document.getElementsByTagName( 'video' );
            document.addEventListener( 'fullscreenchange', async event => {
                if ( document.fullscreenElement && document.pictureInPictureElement === video ) {
                    try {
                        await document.exitPictureInPicture();
                    } catch ( err ) {
                        console.error( err.message );
                    }
                }
            } );

            pip_control.addEventListener( 'click', async event => {
                pip_control.disabled = true;
                try {
                    if ( video !== document.pictureInPictureElement ) {
                        if ( document.fullscreenElement ) await document.exitFullscreen();
                        await video.requestPictureInPicture();
                    } else {
                        await document.exitPictureInPicture();
                    }
                } catch ( err ) {
                    console.error( err.message );
                } finally {
                    pip_control.disabled = false;
                }
            } );

            controls.insertBefore( pip_control, fs_control );
        }
        return true;
    }

    if ( 'pictureInPictureEnabled' in document && document.pictureInPictureEnabled ) {
        if ( !add_picture_in_picture_btn() ) {
            window.addEventListener( 'load', event => add_picture_in_picture_btn() );
        }
    } else {
        console.log( 'The Picture-in-Picture Web API is not available.' );
    }
} )();