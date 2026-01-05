// ==UserScript==
// @name         GT - Community Boosts Notifier
// @version      3.0
// @description  If hunters need you to boost them, a notification shows up above your trap setup (once per 15 minutes)
// @author       Rani Kheir
// @include      *www.ghost-trappers.com/fb/hunt.php*
// @include      *www.ghost-trappers.com/fb/camp.php*
// @include      *www.ghost-trappers.com/fb/live_feed_boost.php?action=boostAll
// @namespace    https://greasyfork.org/users/4271
// @downloadURL https://update.greasyfork.org/scripts/19216/GT%20-%20Community%20Boosts%20Notifier.user.js
// @updateURL https://update.greasyfork.org/scripts/19216/GT%20-%20Community%20Boosts%20Notifier.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var timeLastBoosted;

    // check if storage is supported
    if (typeof(Storage) !== "undefined") {

        // if it is, check if it doesnt exist
        if (!localStorage.gtCommunityBoostsNotifierTime) {

            // if it doesnt exist, set it at current time in seconds - 900
            localStorage.gtCommunityBoostsNotifierTime = (new Date().getTime() / 1000 - 900);
        }

        // get current time last boosted and store in variale
        timeLastBoosted = parseInt(localStorage.gtCommunityBoostsNotifierTime);
    }

    // boost noticed, store time in seconds
    if (document.location.href.search("boostAll") > 0) {
        localStorage.gtCommunityBoostsNotifierTime = (new Date().getTime() / 1000);
    }

    // do the following only if 15 minutes has passed (15 mins = 15 * 60 [900] seconds)
    if ((timeLastBoosted + 900) < (new Date().getTime() / 1000)) {

        var x_x = $.get("/fb/live_feed_boost.php", function( response ) {
            var y_y = x_x.responseText;
            if (y_y.search("No team member needs help at the moment.") < 0) {
                var divElement = document.createElement("div");
                divElement.id = "community_boost_notif";
                var paragraphElement = document.createElement("a");
                divElement.appendChild(paragraphElement);
                paragraphElement.appendChild(document.createTextNode("Hunters need you to Boost 'em!")); // "You've got hunters to Boost!"
                paragraphElement.title = "Go to Boosts page..";
                paragraphElement.href = "/fb/live_feed_boost.php";
                paragraphElement.style.color = "white";
                paragraphElement.style.fontWeight = "bold";
                paragraphElement.style.textShadow = "3px 2px 1px #000000";
                paragraphElement.style.fontSize = "medium";
                paragraphElement.style.margin = "30px 0 0 0";
                paragraphElement.style.padding = "5px 0 5px 0";
                paragraphElement.style.display = "block";
                document.getElementsByClassName("slotMore")[0].parentElement.parentElement.parentElement.appendChild(divElement);
            }
        });
    }
})();