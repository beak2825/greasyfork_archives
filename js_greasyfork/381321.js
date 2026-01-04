// ==UserScript==
// @name         WK Post-Review Fanfare
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Play a short sound after finishing a number of review!
// @author       Cezille07
// @match        https://www.wanikani.com/review/?empty_queue=true
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/381321/WK%20Post-Review%20Fanfare.user.js
// @updateURL https://update.greasyfork.org/scripts/381321/WK%20Post-Review%20Fanfare.meta.js
// ==/UserScript==

/**
 * ---------------------------------------- DISCLAIMER! ----------------------------------------
 * Since this plays a sound automatically on loading the review summar page,
 * this script likely won't work unless you enable autoplay without user interaction.
 * See https://developers.google.com/web/updates/2017/09/autoplay-policy-changes for more info.
 * This setting is global and not only for wanikani.com! If you're sure you want this,
 * go to chrome://flags/#autoplay-policy and select "No user gesture required" from the dropdown.
 *
 * This script also uses the Open Framework jStorage value to check the number of completed reviews.
 */

(function() {
    'use strict';

    // --------------- SETTINGS ---------------
    // Default sound: Final Fantasy IX victory fanfare
    // You can change this url to any mp3, ogg, or wav file.
    var soundUrl = 'https://www.dropbox.com/s/laqmbk8cp6lvzhs/Final%20Fantasy%20IX%20-%20Victory%20Fanfare.mp3?dl=1'

    // If you only want to play the first X seconds, change this number.
    // The default value works for the default sound above, you may need to tweak if you change the sound file.
    var snippetLength = 5; // In seconds

    // How many items should you review before celebrating? Set it to positive number or 0 to always celebrate.
    var CELEBRATION_THRESHOLD = 20;
    // ------------- END SETTINGS -------------

    document.body.onload = function () {
        // Checking last session
        // TODO - I think this also checks lessons?
        var info = localStorage.getItem('jStorage')
        info = JSON.parse(info);
        if (info.completedCount) {
            // Check for sufficient celebration threshold
            if (info.completedCount >= CELEBRATION_THRESHOLD) {
                celebrate();
            } else {
                console.log('[PRF] Sorry, not enough review items to celebrate!');
            }
        } else {
            // No data on last review, just celebrate!
            celebrate();
        }

        function celebrate () {
            var el = document.createElement('audio');
            el.src = soundUrl;
            document.body.append(el);

            console.log('[PRF] Celebrating!');
            el.play().then(function () {
                console.log('[PRF] Successfully played sound!');
                setTimeout(function () {
                    console.log('[PRF] Stopping success sound!');
                    el.pause();
                    el.parentNode.removeChild(el);
                }, snippetLength * 1000);
            }).catch(function (err) {
                console.warn('[PRF] Sound failed to play', err.code, err.message);
                el.parentNode.removeChild(el);
                throw err;
            });
        }
    }
})();