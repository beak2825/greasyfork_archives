// ==UserScript==
// @name         Real Loc Count
// @namespace    https://www.geoguessr.com/
// @version      0.5
// @description  Gives the precise number of locations a GeoGuessr map has on its map page.
// @author       Wmtmky
// @match        http*://www.geoguessr.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=geoguessr.com
// @downloadURL https://update.greasyfork.org/scripts/472388/Real%20Loc%20Count.user.js
// @updateURL https://update.greasyfork.org/scripts/472388/Real%20Loc%20Count.meta.js
// ==/UserScript==

// ===== SETTINGS ===== //
// feel free to change these and Ctrl+S to save

const number_display_format = "en-CA"
/* try "en-US" for 1,234,567
** try "de-DE" for 1.234.567
** try "fr-FR" for 1 234 567
** try "de-CH" for 1'234'567
** try "en-IN" for 12,34,567
** leave as "" for 1234567 (no formatting)
or use the ISO 639-1 code for your own language!
*/

const do_rounding = false
/* rounds numbers above 10000
** to the nearest hundred or thousand
** when set to true
*/

const try_collect_coins_on_page_load = false
/* tries to collect shop coins when
** page is initially opened or reloaded
*/

const locClassName = "map-stats_mapStatMetricValue___sEAC"
/* the name of the class of the HTML div
** that contains the text for a map's location count
** -- this needs to be updated when geoguessr redoes their UI
*/

// ======= MAIN ======= //

const API_SEARCH = "https://www.geoguessr.com/api/v3/search/map?q=";
const delay_ms = 1000;

// this stupid but so is the inability to detect URL changes
let i_URL = undefined;
setInterval(function () {
    let f_URL = window.location.href;
    if (f_URL != i_URL) {
        i_URL = f_URL;
        let a_URL = f_URL.split("/")
        if (a_URL[a_URL.length - 2] == "maps") {
            getLocCount(a_URL[a_URL.length - 1]);
        }
    }
}, delay_ms);

// why does geoguessr only show loc counts in the search api
async function getLocCount(mapID) {
    const response = await fetch(API_SEARCH + mapID);
    const responseArray = await response.json();
    for (let result of responseArray) {
        if (result.id == mapID) {
            updateDisplay(result.coordinateCount);
            return;
        }
    }
}

// formatting pain
function updateDisplay(realLocCount) {
    const locCountDisplay = document.getElementsByClassName(locClassName)[2];
    if (do_rounding && realLocCount > 10000) {
        let places = realLocCount.toString().length - 4;
        if (places == 1) places++;
        if (places % 3 == 1) places--;
        realLocCount = Math.round(realLocCount / (10 ** places)) * (10 ** places);
    }
    if (/[a-z]/gi.test(number_display_format)) {
        realLocCount = realLocCount.toLocaleString(number_display_format)
    }
    locCountDisplay.innerText = realLocCount;
}

// does anyone use these
if (try_collect_coins_on_page_load) {
    fetch("https://www.geoguessr.com/api/v4/webshop/daily-shop-claim", {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({})
    });
}
