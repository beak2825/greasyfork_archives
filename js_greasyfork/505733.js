// ==UserScript==
// @name         Watch2Gether Improver
// @namespace    NLinconScripts
// @version      2024-08-29
// @description  Adds the possibility to switch to/from bordered fullscreen, use some hotkeys inside YouTube fullscreen mode, and other features
// @author       NLincon
// @license      GPL-3.0-or-later
// @match        https://w2g.tv/*/room/*
// @match        https://www.youtube.com/embed/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=w2g.tv
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addValueChangeListener
// @require      http://code.jquery.com/jquery-1.11.3.min.js
// @downloadURL https://update.greasyfork.org/scripts/505733/Watch2Gether%20Improver.user.js
// @updateURL https://update.greasyfork.org/scripts/505733/Watch2Gether%20Improver.meta.js
// ==/UserScript==

var $ = window.jQuery;
var isInterfaceChanged = false;

$(document).ready(function () {
    if (location.hostname === 'w2g.tv') {
        // COMMENTED DUE TO PLAYBACK FREEZE DEFECT
        // ---------------------------------------
        // Automatically join the room with an auto-generated nickname
        // TODO: Comment this section if you want to set different custom nicknames for each session
        // $('#intro-modal').ready(function() {
        //     setTimeout(function() {
        //         // TODO: Uncomment and change your permanent nickname if necessary
        //         // document.getElementById('intro-nickname').value = 'Cool Nickname';
        //         const event = new Event('change');
        //         document.getElementById('intro-nickname').dispatchEvent(event);
        //         $('#w2g-join-button').trigger("click");
        //     }, 300);
        // });
        // ---------------------------------------

        // remove 'Popular Videos' section
        $('.w2g-editorial').remove();

        // create custom events to fire w2g hotkeys events
        createCustomEvents();

        window.addEventListener('keydown', function (e) {
            // TODO: Change key code to switch bordered fullscreen if necessary
            if (e.code === 'NumpadAdd') {
                e.preventDefault();

                isInterfaceChanged = !isInterfaceChanged;
                var displayValue = isInterfaceChanged ? 'none' : '';
                var height = isInterfaceChanged ? '100vh' : 'auto';
                var minWidth = isInterfaceChanged ? 'auto' : '800px';
                var maxWidth = isInterfaceChanged ? 'auto' : 'calc(177.777vh - 40.8871px - 6.2222rem)';
                var marginLeft = isInterfaceChanged ? '1rem' : '0';

                // hide/show elements
                $('.h-screen.shrink-0').css('display', displayValue);        // left side panel with logo and settings
                $('.bg-w2g-very-dark-var').css('display', displayValue);     // top side panel with search
                $('#w2g-right').css('display', displayValue);                // right side panel with history, playlists, chat
                $('.bg-w2g-dark-userlist').css('display', displayValue);     // down side panel with users

                // change elements style to activate/deactivate bordered fullscreen mode
                $('#player_container').css('height', height);
                $('.w2g-player-width').css('min-width', minWidth);
                $('.w2g-player-width').css('max-width', maxWidth);
                $('.w2g-player-width').css('marin-left', marginLeft);
            }
        });
    }

    if (location.hostname === 'www.youtube.com') {
        // activate only when location contains player.w2g.tv
        if (!location.search.includes("player.w2g.tv")) {
            return;
        }

        // for some reason YouTube Embed can hide the info bar in Firefox
        // show the info bar if it disappeared
        var moviePlayer = document.getElementById('movie_player');
        var className = 'ytp-hide-info-bar';
        if (moviePlayer.classList.contains(className)) {
            moviePlayer.classList.remove(className);
        }

        // disable pause/unpause click on YouTube player
        var playerOverlayElement = document.createElement('div');
        playerOverlayElement.style.cssText = 'width: 100%; height: 100%; position: absolute; z-index: 10;';
        playerOverlayElement.addEventListener('dblclick', function (e) {
            var dblClickEvent = new MouseEvent('dblclick', {
                'bubbles': true,
                'cancelable': true
            });
            moviePlayer.dispatchEvent(dblClickEvent);
        })
        moviePlayer.appendChild(playerOverlayElement);

        window.addEventListener('keydown', function (e) {
            switch (e.code) {
                case ('Space'):
                    GM_setValue('pauseFired', Math.random());
                    break;
                case ('ArrowLeft'):
                    GM_setValue('moveBackFired', Math.random());
                    break;
                case ('ArrowRight'):
                    GM_setValue('moveForwardFired', Math.random());
                    break;
            }
        });
    }
})

function createCustomEvents() {
    GM_addValueChangeListener('pauseFired', function () {
        const pauseEvent = new KeyboardEvent('keydown', {
            key: 'k',
            bubbles: true
        });

        document.documentElement.dispatchEvent(pauseEvent);
    });

    GM_addValueChangeListener('moveBackFired', function () {
        const keyLeftEvent = new KeyboardEvent('keydown', {
            key: 'ArrowLeft',
            bubbles: true
        });

        document.documentElement.dispatchEvent(keyLeftEvent);
    });

    GM_addValueChangeListener('moveForwardFired', function () {
        const keyRightEvent = new KeyboardEvent('keydown', {
            key: 'ArrowRight',
            bubbles: true
        });

        document.documentElement.dispatchEvent(keyRightEvent);
    });
}
