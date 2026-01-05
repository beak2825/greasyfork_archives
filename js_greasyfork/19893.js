// ==UserScript==
// @name         GT - Summoning Room Time Checker
// @version      2.2
// @description  To notify hunters if time is up for a glyph
// @author       Rani Kheir
// @include      *www.ghost-trappers.com/fb/hunt.php*
// @include      *www.ghost-trappers.com/fb/camp.php*
// @namespace https://greasyfork.org/users/4271
// @downloadURL https://update.greasyfork.org/scripts/19893/GT%20-%20Summoning%20Room%20Time%20Checker.user.js
// @updateURL https://update.greasyfork.org/scripts/19893/GT%20-%20Summoning%20Room%20Time%20Checker.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var x_x = $.get("/fb/eleventh_floor.php", function( response ) {
        var y_y = x_x.responseText;

        try {
            var arrayTimes = $(response).find('.timerText');
            if (arrayTimes.length === 0) { throw "No items!"; }
            var time = "";
            var glyphName = "";

            // div creation
            var divForSummoner = document.createElement("DIV");
            divForSummoner.id = "summonerDetails";
            document.getElementById("rightContainer").appendChild(divForSummoner);

            // adding div header and spacing
            var spanE = document.createElement("span");
            var te = document.createTextNode("Active Glyphs");
            spanE.appendChild(te);

            divForSummoner.appendChild(document.createElement("BR"));
            divForSummoner.appendChild(spanE);
            divForSummoner.appendChild(document.createElement("BR"));
            divForSummoner.appendChild(document.createElement("BR"));

            // Adding all running glyphs to div
            for (var i = 0; i < arrayTimes.length; i++) {
                glyphName = $(arrayTimes[i]).parent().find('.glyphName')[0].innerHTML;
                divForSummoner.appendChild(document.createTextNode(glyphName + ": " + arrayTimes[i].innerHTML));
                divForSummoner.appendChild(document.createElement("BR"));
            }

            // Styling div through jQuery, and title through span vanilla js
            $(divForSummoner).css({ 'color': 'white', 'font-size': '100%', 'text-align': 'center' });
            spanE.style.fontWeight = 'bold';
            spanE.style.fontSize = 'larger';

        } catch (e) {}

        if (y_y.search("time is over") > 0) {

            // Confirm dialogue box
            var result = confirm("Glyph time has run out!\n\nGo to 11th Floor now?");
            if (result === true) {
                window.location.href = "/fb/eleventh_floor.php";
            }

            // for testing
            //document.getElementById("profile_gbp").innerHTML = "";
        }

        // for testing
        //document.getElementById("profile_gbp").innerHTML = "";
    });
})();