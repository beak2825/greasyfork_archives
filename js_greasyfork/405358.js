// ==UserScript==
// @name         Tournament BM Live Leaderboard
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  simple viewing of the leaderboard for only tournament entrants
// @author       You
// @match        https://dominion.games/
// @require      http://ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min.js
// @require      https://greasyfork.org/scripts/2199-waitforkeyelements/code/waitForKeyElements.js?version=6349
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/405358/Tournament%20BM%20Live%20Leaderboard.user.js
// @updateURL https://update.greasyfork.org/scripts/405358/Tournament%20BM%20Live%20Leaderboard.meta.js
// ==/UserScript==

/* globals jQuery, $, waitForKeyElements */
var keywords = [
    "bluey_the_bear",
    "nasmith99",
    "personman",
    "drsteelhammer",
    "Fircoal",
    "rsilverstein12",
    "joshnicholas",
    "SamE",
    "Apostolosoruler",
    "Sicomatic",
    "Titandrake",
    "markus",
    "hakha3",
    "kaplane",
    "RTT",
    "JNails",
    "E.Honda",
    "kaminarizumu",
    "cider01",
    "bobbydj18",
    "Quickrick",
    "swordfishtrombone",
    "aku chi",
    "Dan Brooks",
    "topher1588",
    "heron",
    "Freaky",
    "Bryan",
    "yurikamome",
    "Verjok",
    "Dingan"
];
var keyW_Regex = new RegExp (keywords.join('|'), "i"); //-- The "i" makes it case insensitive.

waitForKeyElements (
    ".leaderboard-table td:nth-of-type(2)", hideTargetedRowAsNeeded
);

var idx = 1;
function hideTargetedRowAsNeeded (jNode) {
    if (!(keyW_Regex.test (jNode.text()))) {
        jNode.parent().hide ();
    }
    else {
        console.log(idx);
        jNode.parent().children().first().text(idx.toString());
        idx++;
        if (idx > keywords.length) {
            idx = 1;
        }
    }
}
