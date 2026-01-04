// ==UserScript==
// @name         Instagram like deleter
// @namespace    greaseyfork_insta_like_del
// @version      2024-01-07.2
// @description  Deletes ALL of your likes
// @author       Dr. Ligma
// @include      /^https://www\.instagram\.com/your_activity/interactions/likes/?/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=instagram.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/484136/Instagram%20like%20deleter.user.js
// @updateURL https://update.greasyfork.org/scripts/484136/Instagram%20like%20deleter.meta.js
// ==/UserScript==

// Limitations:
// Instagram limits the amount of unlikes you can do to per time interval (12h to 2d)
// When you start getting error messages, try again later.

// WARNING:
// THIS WILL IMMEDIATELY START DELETING YOUR LIKES ON INSTAGRAM
// THE SCRIPT WILL RUN AS SOON AS YOU VISIT THE FOLLOWING PAGE:
// https://www.instagram.com/your_activity/interactions/likes
// BE ABSOLUTELY SURE YOU WANT THIS!!!

// Troubleshooting:
// The script relies heavily on setTimeouts for the scripts flow, it is dumb and doesn't check if elements exist.
// If you have issues or a slow connection, play around with the timeout values
// (big number good)
//
// By default does 10 unlikes per refresh of the page, you can change that yourself, but know that if you too many,
// Instagram will rate limit you and you have to wait before trying again.

(function() {
    'use strict';

    // Click on the "Select" button to reveal the comment selection box
    setTimeout(function() {

        var select = document.querySelectorAll("div[data-testid=liked_container_non_empty_state] span")[2]
        select.click()

        // Randomly click comments to select them, this is needed for it to work, selecting them all in one go doesn't work for unknown reasons
        setTimeout(function() {

            var divs = document.querySelectorAll("div[data-testid=bulk_action_checkbox]")

            function getRandomInt(max) {
                return Math.floor(Math.random() * max);
            }

            function getRandomSample(array, size) {
                var length = array.length;

                for(var i = size; i--;) {
                    var index = getRandomInt(length);
                    var temp = array[index];
                    array[index] = array[i];
                    array[i] = temp;
                }

                return array.slice(0, size);
            }

            getRandomSample(Array.from(divs), 10).forEach(function(e) { // Limit to 10 at a time
                setTimeout(function() {
                    e.click()
                }, getRandomInt(3000))
            })

            // Click the Delete button on the bottom of the page
            setTimeout(function() {
                var delbutton = document.querySelectorAll("div[aria-label=Unlike]")[0]
                delbutton.click()

                // Click the Delete button on the popup dialog
                setTimeout(function () {
                    var deldialog = document.querySelectorAll("div[role=dialog] button")[0]
                    deldialog.click()

                    // Reload the page when done to process the next batch
                    setTimeout(function () {
                        location.reload()
                    }, 2000)

                }, 1000)

            }, 5000)

        }, 250)

    }, 6000)

})();

