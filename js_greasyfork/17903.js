// ==UserScript==
// @name         Gleam.io Winning Chance
// @namespace    GLEAM
// @version      1.1
// @description  lets show the odds of winning
// @author       Royalgamer06
// @icon         http://i.imgur.com/6PuVE2l.png
// @match        *gleam.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/17903/Gleamio%20Winning%20Chance.user.js
// @updateURL https://update.greasyfork.org/scripts/17903/Gleamio%20Winning%20Chance.meta.js
// ==/UserScript==

$(document).ready(function() {
    if (document.getElementById("current-entries") !== null) {
        $('.span4.blue-square.ng-scope').after('<div class="span4 green-square ng-scope"> <span class="square-describe mont"> <span class="status small"> <span class="current ng-binding" id="winning_chance">NaN</span> </span> <span class="description ng-binding">Winning Chance</span> </span> </div>');
        var elems = document.querySelectorAll("div.square-row.row-fluid.center.ng-scope > .span4");

        for (var i = 0; i < elems.length; i++) {
            elems[i].setAttribute("style", "width:25%;");
        }

        var gleam = setInterval(function() {
            if (document.querySelector(".status.ng-binding") !== null) {
                var own = parseInt(document.querySelector(".status.ng-binding").innerHTML);
                var total = parseInt(document.querySelector(".current.ng-binding").innerHTML);
                var chance = Math.round(100000 * own / total ) / 1000;
                document.getElementById("winning_chance").innerHTML = chance + "%";
                
                console.log("[GLEAM] Your winning chance is " + chance + "%!");
                clearInterval(gleam);
            }
        }, 500);
    }
});