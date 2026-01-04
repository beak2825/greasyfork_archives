// ==UserScript==
// @name         Runescape Oldschool - Correct Poll Results
// @description  Ignores the "Skip question" votes and re-calculates percentages.
// @namespace    Shaun Dreclin
// @version      1.0
// @match        http://services.runescape.com/m=poll/*oldschool/results.ws?id=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/38357/Runescape%20Oldschool%20-%20Correct%20Poll%20Results.user.js
// @updateURL https://update.greasyfork.org/scripts/38357/Runescape%20Oldschool%20-%20Correct%20Poll%20Results.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.querySelectorAll("fieldset.question").forEach(function(fieldset) {
        var totalVotes = 0;

        fieldset.querySelectorAll("tr").forEach(function(tr) {
            var option = tr.querySelector("td:nth-of-type(1)").innerHTML;
            var votes = parseInt(tr.querySelector("td:nth-of-type(3)").innerHTML.split("(")[1].split(" ")[0], 10);

            if(option != "Skip question") {
                totalVotes += votes;
            }
        });

        fieldset.querySelectorAll("tr").forEach(function(tr) {
            var option = tr.querySelector("td:nth-of-type(1)").innerHTML;
            var votes = parseInt(tr.querySelector("td:nth-of-type(3)").innerHTML.split("(")[1].split(" ")[0], 10);
            var percent = Math.round(votes / totalVotes * 1000) / 10;

            if(option != "Skip question") {
                tr.querySelector("td:nth-of-type(2) img:nth-of-type(2)").width = Math.round(percent) * 2;
                tr.querySelector("td:nth-of-type(3)").innerHTML = percent + "% (" + votes.toLocaleString() + ")";

                if(option == "Yes" && percent >= 75) {
                    fieldset.style.background = "rgba(0, 100, 0, 0.2)";
                }
            } else {
                tr.style.opacity = 0.25;
                tr.querySelector("td:nth-of-type(2)").innerHTML = "";
                tr.querySelector("td:nth-of-type(3)").innerHTML = "(" + votes.toLocaleString() + ")";
            }
        });
    });
})();