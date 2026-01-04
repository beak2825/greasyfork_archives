// ==UserScript==
// @name         Golfbokning HCP-summering
// @namespace    mingolfhcpsummering
// @version      1.0
// @description  try to take over the world!
// @author       Eric Herlitz
// @match        https://mingolf.golf.se/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/402773/Golfbokning%20HCP-summering.user.js
// @updateURL https://update.greasyfork.org/scripts/402773/Golfbokning%20HCP-summering.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var booking = function () {
        var timeslots = $(".mg-grid-cell")

        // Additional styling
        //$(".mg-grid-cell").css('height', '7.5rem');

        timeslots.each(function (index) {

            var timeslot = $(this);

            var players = timeslot.find(".mg-grid-cell-players").children();
            var timeslotTotalHcp = 0;

            players.each(function() {
                var player = $(this);
                var hcp = player.attr('data-hcp');
                var gender = player.attr('data-gender');
                timeslotTotalHcp = timeslotTotalHcp+parseFloat(hcp.replace(',', '.'));

                // set gender color
                if(gender === "0") {
                    player.css('background', '#dc3545');
                }
            });

            // replace pricing
            var textCell = timeslot.children('.mg-grid-cell-text');
            textCell.html("H " + timeslotTotalHcp.toFixed(1));

            // adaptive coloring for different totals
            if(timeslotTotalHcp < 50) {
                textCell.css('background-color', '#bed5c1');
            }
            if(timeslotTotalHcp > 50 && timeslotTotalHcp < 100) {
                textCell.css('background-color', '#f6f8c6');
            }
            if(timeslotTotalHcp > 100) {
                textCell.css('background-color', '#f8cbc6');
            }
        })
    };

    // detect DOM-changes and fire the script
    var mutationObserver = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            var timeslots = $(".mg-grid-cell");
            if(timeslots.length > 0 && !timeslots.attr('data-processed')){
                timeslots.attr('data-processed', 'true')
                booking();
            }
        });
    });

    mutationObserver.observe(document.documentElement, {
        characterData: true,
        childList: true,
        subtree: true
    });

})();