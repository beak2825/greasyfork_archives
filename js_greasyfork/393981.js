// ==UserScript==
// @name         SRC Community IL Time Total
// @namespace    http://tampermonkey.net/
// @version      1.1.1
// @description  Calculates the best current full game time that can be assembled with the best IL times. Quick fix for Boneworks ILs.
// @author       MisterMan
// @match        https://www.speedrun.com/boneworks/individual_levels
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/393981/SRC%20Community%20IL%20Time%20Total.user.js
// @updateURL https://update.greasyfork.org/scripts/393981/SRC%20Community%20IL%20Time%20Total.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var categoryTimes = [];
    var categoryTotalsInMilliseconds = [];
    var categoryTotalsFinal = [];

    //Get DOM element containing table of times
    var ILtable = document.getElementById('centerbar').children[0].children[0].children[0];

    //Get category names from first row of table
    var categoryNames = ILtable.rows[0].children;
    for(var i = 1; i < categoryNames.length; i++) {
        categoryTimes.push([]); //Add an empty array for each category to add up times
    }

    //Iterate through each row of the table
    for(i = 1; i < ILtable.rows.length; i++) {
        var row = ILtable.rows[i];
        for(var j = 1; j < row.children.length; j++) { //Iterate through each cell of the current row
            var time = row.children[j].children[0]; //Get the DOM element holding time information
            try {
                var minutes = Number(time.childNodes[0].data);
                var seconds = Number(time.childNodes[2].data);
                if (time.childNodes.length > 4) {
                    var milliseconds = Number(time.childNodes[4].data);
                } else {
                    milliseconds = 0;
                }
            } catch(e) {
                continue; //Skips any block that is empty
            }
            categoryTimes[j-1].push((((minutes*60)+seconds)*1000)+milliseconds); //Adds the total time in milliseconds for current level to the corresponding array in categoryTimes
        }
    }

    //Calculate total times for each category
    for(i = 0; i < categoryTimes.length; i++) {
        var sum = 0;
        /*if(categoryTimes[i].length < ILtable.rows.length-1) { //Handle any category that does not have a time in every level
            categoryTotalsInMilliseconds.push(-1);
            continue;
        } else {*/
            for(j = 0; j < 12; j++) { //Add up all times
                sum += categoryTimes[i][j];
            //}
        }
        categoryTotalsInMilliseconds.push(sum);
    }

    //Convert total times back into minutes/seconds
    for(i = 0; i < categoryTotalsInMilliseconds.length; i++) {
        if(categoryTotalsInMilliseconds[i] == -1) {
            categoryTotalsFinal.push("This category does not have an entry for every level!");
            continue;
        } else {
            var totalMinutes = Math.floor(categoryTotalsInMilliseconds[i] / 60000);
            var totalSeconds = Math.floor(Math.floor(categoryTotalsInMilliseconds[i] % 60000) / 1000);
            var totalMilliseconds = categoryTotalsInMilliseconds[i] % 1000
            categoryTotalsFinal.push(totalMinutes + "m " + totalSeconds + "s " + totalMilliseconds + "ms");
        }
    }

    //Construct new row for table
    var totalsRow = document.createElement("tr");
    totalsRow.className = "border-top";

    //Create leftmost cell in table row and append it to row
    var totalsCellLabel = document.createElement("td");
    totalsCellLabel.innerHTML = "Total";
    totalsCellLabel.className = "linked center border-left"
    totalsRow.appendChild(totalsCellLabel);

    //Create totals for each category and append them to row
    for(i = 0; i < categoryTotalsFinal.length; i++) {
        var totalsCell = document.createElement("td");
        totalsCell.innerHTML = categoryTotalsFinal[i];
        totalsCell.className = "linked center border-left"
        totalsRow.appendChild(totalsCell);
    }

    //Append totals row to table
    ILtable.children[0].appendChild(totalsRow);
})();