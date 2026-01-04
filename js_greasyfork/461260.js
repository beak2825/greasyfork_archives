// ==UserScript==
// @name         Cantrill Video Control
// @namespace    https://github.com/techiemac/cantrillscripts
// @version      0.1
// @description  Customize the video player on cantrill.io and adds additional keyboard shortcuts
// @author       techiemac
// @license      MIT
// @match        https://*.cantrill.io/*
// @match        https://player.hotmart.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cantrill.io
// @grant        none
// @require      https://code.jquery.com/jquery-latest.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/video.js/8.1.1/video.min.js
// @downloadURL https://update.greasyfork.org/scripts/461260/Cantrill%20Video%20Control.user.js
// @updateURL https://update.greasyfork.org/scripts/461260/Cantrill%20Video%20Control.meta.js
// ==/UserScript==

// Disable gradient overlay
const disableGradientOverlay = true;
// Uses minimal video controls
const useMinimalControls = true;
// Enable additional keyboard controls
const useAdditionalKeyboardControls = true;

(function() {
    'use strict';

    console.log("Using Cantril Video Control TamperMonkey Script");

    //
    // Utilities
    //

    function waitForElement(selector, findSelector, retries, callback) {
        var foundElem = $(selector).find(findSelector);
        if (foundElem.length !== 0) {
            callback(foundElem);
        } else {
            if (retries > 0) {
                retries--;
                setTimeout(function() {
                    waitForElement(selector, findSelector, retries, callback);
                }, 100);
            }
        }
    };

    //
    // Wait for the iFrame. This will also run in the iframe but I took a hackish approach of only
    // doing 10 retries
    //

    waitForElement('.revamped_lecture_player', 'iframe[data-testid="embed-player"]', 10, function(iframe) {
        // Configure post message to the iframe so key command from the parent window can make it
        // to the video.js player
        function playerKeyUp(e) {
            var postMsg = {
                key: e.key,
                ctrlKey: e.ctrlKey,
                metaKey: e.metaKey,
                shiftKey: e.shiftKey,
                altKey: e.altKey
            }
            iframe[0].contentWindow.postMessage(postMsg, 'https://player.hotmart.com');
        }
        document.addEventListener('keyup', playerKeyUp, false); // Only works in iframe. Will need to postMessage across frames
    });

    //
    // Wait for the player in the iFrame
    //

    waitForElement('.video-js', 'div[data-testid="active-overlay"]', 10, function(vidOverlay) {

        // Update overlay gradient
        vidOverlay.find('div[data-testid="overlay-background"]').css('background-image', 'none');
        var bottomBar = vidOverlay.find('div[data-testid="bottom-bar"]');
        if (disableGradientOverlay === true) {
            bottomBar.css('background', '#000000');
            bottomBar.css('opacity', '0.35');
        }

        // Compact controls
        if (useMinimalControls === true) {
            bottomBar.css('padding-bottom', '0px');
            var videoBtns = bottomBar.find('button');
            videoBtns.each(function() {
                $(this).css('padding-bottom', '4px');
                $(this).css('width', '1.5rem');
                $(this).css('height', '1.5rem');
            });
        }

        var player = videojs.getPlayer('vjs_video_3');

        // Handle key events
        function handleKeyEvent(e, localPlayer) {
            if (useAdditionalKeyboardControls === false) {
                return;
            }

            switch(e.key) {
                case 'p':
                    if (player.paused()) {
                        player.play();
                    } else {
                        player.pause();
                    }
                    break;
                case '1':
                    player.playbackRate(0.5);
                    break;
                case '2':
                    player.playbackRate(0.75);
                    break;
                case '3':
                    player.playbackRate(1.0);
                    break;
                case '4':
                    player.playbackRate(1.25);
                    break;
                case '5':
                    player.playbackRate(1.5);
                    break;
                case '6':
                    player.playbackRate(2.0);
                    break;
                default:
                    break;
            }

            if (localPlayer === false) {
                // The local iframe already properly handles these events.
                // Outside of the iframe however, they still need to be forwarded.
                switch(e.key) {
                    case 'ArrowLeft':
                        player.currentTime(player.currentTime() - 10);
                        break;
                    case 'ArrowRight':
                        player.currentTime(player.currentTime() + 10);
                        break;
                    case 'f':
                        if (player.supportsFullScreen() === true) {
                            player.requestFullscreen();
                        }
                        break;
                    default:
                        break;
                }
            }
        }

        // Event handler for key events that occur in the iframe
        function playerKeyUp(evt) {
            handleKeyEvent(evt, true);
        }

        // Event handler for key events that are posted from the page hosting the iframe
        function handlePostMessage(evt) {
            if (evt.origin === 'https://learn.cantrill.io') {
                handleKeyEvent(evt.data, false);
            }
        }

        // Attach event handlers
        document.addEventListener('keyup', playerKeyUp, false); // Only works in iframe. Will need to postMessage across frames
        window.addEventListener("message", handlePostMessage, false);
    });
})();