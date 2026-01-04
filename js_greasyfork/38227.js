// ==UserScript==
// @name     [deprecated] Send C and then change village
// @description Farms automatically with loot assistant
// @version 1.1
// @include https://*screen=am_farm
// @namespace https://greasyfork.org/users/151096
// @downloadURL https://update.greasyfork.org/scripts/38227/%5Bdeprecated%5D%20Send%20C%20and%20then%20change%20village.user.js
// @updateURL https://update.greasyfork.org/scripts/38227/%5Bdeprecated%5D%20Send%20C%20and%20then%20change%20village.meta.js
// ==/UserScript==
// Set maximum farm distance
window.maxDistance = 25; // Change this value to set maximum farm distance for A
window.maxDistanceBC = 15; // Change this value to set maximum farm distance for B and C

var speed = 300; // No idea what this is
var x = 0; // No idea what this is
var menu = $('#am_widget_Farm a.farm_icon_c'); // Use farm button A to farm

function random(maximum, minimum) {
    "use strict";
    var numPossibilities = maximum - minimum;
    var aleat = Math.random() * numPossibilities;
    return Math.round(parseInt(minimum) + aleat);
}

// The actual script to launch the attacks.
var counter = 0;
var entries = document.getElementById("farm_pagesize").value;
var error = document.getElementsByClassName("error");
var speedNow = 0;
for (var i = 0; i < entries; i++) {
    error = document.getElementsByClassName("error");
    $(menu).eq(i).each(function() {
        "use strict";
        if (!($(this).parent().parent().find('img.tooltip').length)) {
            speedNow = (speed * ++x) - random(250, 400);
            setTimeout(function(myVar) {
                $(myVar).click();
                counter++;
                if (counter === entries - 1) {
                    $('.arrowRight').click();
                    $('.groupRight').click();
                }
                if (error !== null) {
                    i = entries;
                    $('.arrowRight').click();
                    $('.groupRight').click();
                }
            }, speedNow, this);
        }
    });
}