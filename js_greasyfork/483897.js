// ==UserScript==
// @name         Instagram comment deleter
// @namespace    greaseyfork_insta_com_del
// @version      2024-01-06.2
// @description  Deletes ALL of your comments
// @author       Dr. Ligma
// @include      /^https://www\.instagram\.com/your_activity/interactions/comments/?/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=instagram.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/483897/Instagram%20comment%20deleter.user.js
// @updateURL https://update.greasyfork.org/scripts/483897/Instagram%20comment%20deleter.meta.js
// ==/UserScript==

// WARNING:
// THIS WILL IMMEDIATELY START DELETING ***ALL*** OF YOUR COMMENTS ON INSTAGRAM
// THE SCRIPT WILL RUN AS SOON AS YOU VISIT THE FOLLOWING PAGE:
// https://www.instagram.com/your_activity/interactions/comments
// BE ABSOLUTELY SURE YOU WANT THIS!!!

// Troubleshooting:
// The script relies heavily on setTimeouts for the scripts flow, it is dumb and doesn't check if elements exist.
// If you have issues or a slow connection, play around with the timeout values
// (big number good)


(function() {
    'use strict';

    // Click on the "Select" button to reveal the comment selection box
    setTimeout(function() {

        var select = document.querySelectorAll("div[data-testid=comments_container_non_empty_state] span")[2]
        select.click()

        // Randomly click comments to select them, this is needed for it to work, selecting them all in one go doesn't work for unknown reasons
        setTimeout(function() {

            var divs = document.querySelectorAll("div[data-testid=bulk_action_checkbox]")

            function getRandomInt(max) {
                return Math.floor(Math.random() * max);
            }

            divs.forEach(function(e) {
                setTimeout(function() {
                    e.click()
                }, getRandomInt(1000))
            })

            // Click the Delete button on the bottom of the page
            setTimeout(function() {
                var delbutton = document.querySelectorAll("div[aria-label=Delete]")[0]
                delbutton.click()

                // Click the Delete button on the popup dialog
                setTimeout(function () {
                    var deldialog = document.querySelectorAll("div[role=dialog] button")[0]
                    deldialog.click()

                    // Reload the page when done to process the next batch
                    setTimeout(function () {
                        location.reload()
                    }, 1000)

                }, 1000)

            }, 5000)

        }, 250)

    }, 4000)

})();

