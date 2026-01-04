// ==UserScript==
// @name         soundcloud disable autoplay station
// @version      1.4.0
// @description  Opens the Soundcloud Next Up menu on load and turns off the Autoplay Station, then continually disables it
// @author       bhackel
// @match        https://soundcloud.com/*
// @grant        none
// @run-at       document-idle
// @noframes
// @namespace    https://greasyfork.org/en/users/324178-bhackel
// @downloadURL https://update.greasyfork.org/scripts/388427/soundcloud%20disable%20autoplay%20station.user.js
// @updateURL https://update.greasyfork.org/scripts/388427/soundcloud%20disable%20autoplay%20station.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let firstrun = true;

    /* First, the script needs to open the Next Up Queue. This is to
    load the Autoplay Station button in the page. Once it is loaded, the script
    can then disable it. If the Next Up menu is never loaded, then the Autoplay Station
    cannot be disabled.
    */
    function openQueue() {
        // get the element that opens the Next Up menu
        var queueTrigger = document.getElementsByClassName('playbackSoundBadge__queueCircle')[0];
        // check if next up button is loaded
        if (queueTrigger) {
            queueTrigger.click(); // click to open the Next Up menu
            closeQueue();
        } else {
            // perform another check after delay
            setTimeout(openQueue, 500);
        }
    }

    // closes the Next Up queue once the Autoplay button has loaded
    function closeQueue() {
        var autoplayButtonDiv = document.getElementsByClassName('queueFallback__toggle')[0];
        var playButton = document.getElementsByClassName('playControl')[0];

        // check if they exist to avoid errors
        if (autoplayButtonDiv && playButton) {
            document.querySelector('.queue__hide').click(); // click to close the Next Up menu
            playButton.focus(); // Add focus back to the play/pause button
            disableButtonLoop();
        } else {
            // perform another check after delay
            setTimeout(function() { closeQueue(); }, 500);
        }
    }

    /* In order to keep the Autoplay Station off, it needs to be continually disabled.
    In SoundCloud, if a user clicks on a song outside of the currently playing playlist, it
    re-enables autoplay. This function checks whether the autoplay station is enabled,
    and if it is, then it disables it. Then, it calls itself again after two seconds.
    */
    function disableButtonLoop() {
        var autoplayButtonDiv = document.getElementsByClassName('queueFallback__toggle')[0];
        if (autoplayButtonDiv) {
            var button = autoplayButtonDiv.children[0];
            // it has this classname when Autoplay is enabled
            if (button.className === 'toggle sc-toggle sc-toggle-active sc-toggle-on') {
                button.click(); // click to disable

                // Clear the queue, except on the initial page load
                /*
                if (!firstrun) {
                    document.querySelector('.queue__clear').click();
                } else {
                    firstrun = false;
                }
                */

                // Put focus on the play/pause button
                document.getElementsByClassName('playControl')[0].focus();
            }
        }
        setTimeout(disableButtonLoop, 2000);
    }

    // Start the script
    openQueue();
})();