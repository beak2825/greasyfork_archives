// ==UserScript==
// @name        OptionStrat summary display
// @namespace    http://tampermonkey.net/
// @version      2025-01-23
// @description  Shows the cumulative change of the overall and daily totals of trades on the "Saved Trades" screen. Triggered with the "C" key
// @author       hockeyrink
// @license MIT
// @match        https://optionstrat.com/saved
// @icon         https://www.google.com/s2/favicons?sz=64&domain=optionstrat.com
// @require      https://craig.global.ssl.fastly.net/js/mousetrap/mousetrap.min.js?a4098
// @grant        none
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/524647/OptionStrat%20summary%20display.user.js
// @updateURL https://update.greasyfork.org/scripts/524647/OptionStrat%20summary%20display.meta.js
// ==/UserScript==
/* global artoo, Mousetrap */

(function() {
    'use strict';
    // Main function to bind hotkey
    function mainndb() {
        Mousetrap.bind("c", function () {
            console.log("[optionDisplay] - Calc them options...");
            optionDisplay();
        });
    }
    function optionDisplay(){
        let data = artoo.scrapeTable('.table--decorative');
        let nameValuesSet = new Set();
        let firstValuesSet = new Set();
        let secondValuesSet = new Set();
        let tableArray = data;

        for (let i = 1; i < tableArray.length; i++) {
            let instrument = tableArray[i][0]
            let totalset = tableArray[i][1];
            let todayset = tableArray[i][2];
            let totaldata = totalset.split(" ");
            let outputtotal = parseFloat(totaldata[0].replace(/[+$]/g, '').trim());
            let todaydata = todayset.split(" ");
            let outputtoday = parseFloat(todaydata[0].replace(/[+$]/g, '').trim());
            nameValuesSet.add(instrument);
            firstValuesSet.add(outputtotal);
            secondValuesSet.add(outputtoday);
        }
        let totalarr = [...firstValuesSet];
        let totalsum = totalarr.reduce((partialSum, a) => partialSum + a, 0);
        let todayarr = [...secondValuesSet];
        let todaysum = todayarr.reduce((partialSum, a) => partialSum + a, 0);
        console.log("Total Return Sum: $"+totalsum + " :: Today's Return Sum: $" + todaysum)
        alert("TOTAL Change: $"+totalsum + "   TODAY Change: $" + todaysum)
    }

    // Load artoo.js dynamically and initialize main logic
    function loadArtooAndInit() {
        if (typeof artoo !== "undefined") {
            console.log("artoo.js is already loaded.");
            mainndb();
        } else {
            console.log("Loading artoo.js...");
            const script = document.createElement("script");
            script.src = "//medialab.github.io/artoo/public/dist/artoo-latest.min.js";
            script.onload = mainndb; // Execute mainndb once artoo.js is loaded
            document.body.appendChild(script);
        }
    }

    // Start the script
    loadArtooAndInit();
})();