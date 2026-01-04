// ==UserScript==
// @name         Bath University Moodle
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       You
// @match        https://moodle.bath.ac.uk/
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/396900/Bath%20University%20Moodle.user.js
// @updateURL https://update.greasyfork.org/scripts/396900/Bath%20University%20Moodle.meta.js
// ==/UserScript==

$(document).ready(function() {
    setTimeout(function() {
        var A = jQuery('.coursebox .info .coursename');
        var nUnits = A.length;
        var unitNames = [];
        var myUnits = ['Algebra 2B', 'ES20069', 'Statistics 2B', 'Modelling and', 'Functional'];
        var myColors = ['#A3F9A8', '#D7D7D7', '#84ADFF', '#FFC96B', '#EEB5ED'];
        var counter = 0;
        var unitName;
        var unitIndices = [];
        var i; var j;
        //get unit names and indices
        for (i = 0; i < nUnits; i++)
        {
            unitName = A[i].textContent;
            unitNames[i] = A[i].textContent;
            for (j = 0; j < myUnits.length; j++)
            {
                if (unitName.includes(myUnits[j]))
                {
                    unitIndices[counter] = i;
                    counter++;
                }
            }
        }
        var color;
        for (i = 0; i < myUnits.length; i++)
        {
            unitName = jQuery('.coursebox .info .coursename')[unitIndices[i]].textContent;
            for (j = 0; j < myUnits.length; j++)
            {
                if (unitName.includes(myUnits[j]))
                {
                    color = myColors[j];
                    jQuery('.coursebox')[unitIndices[i]].style.backgroundColor = color;
                }
            }
        }

        for (i = myUnits.length; i >=0; i--)
        {
            jQuery('.courses').prepend(jQuery('.courses').children()[unitIndices[i]+(myUnits.length-i-1)])
        }


        /*
                if (listOfUnits[i] == "MA20216") { colour = "#A3F9A8"; } //standard colours, personal choice
                if (listOfUnits[i] == "MA20217") { colour = "#A3F9A8"; }
                if (listOfUnits[i] == "MA20218") { colour = "#FF8C7C"; }
                if (listOfUnits[i] == "MA20220") { colour = "#D3A5FF"; }
                if (listOfUnits[i] == "MA20221") { colour = "#FFC96B"; }
                if (listOfUnits[i] == "MA20223") { colour = "#B5EDEE"; }
                if (listOfUnits[i] == "MA20226") { colour = "#84ADFF"; }
                if (listOfUnits[i] == "MA20227") { colour = "#84ADFF"; }
                if (listOfUnits[i] == "ES20069") { colour = "#D7D7D7"; }
                if (listOfUnits[i] == "CM20256") { colour = "#EEB5ED"; }
        */

    }, 300); //0.3 seconds will elapse and Code will execute.
});