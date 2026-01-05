// ==UserScript==
// @name        Hide ChessTempo Ratings Box
// @namespace   http://xyxyx.org/
// @description Hide ratings box on ChessTempo pages.
// @include     http://chesstempo.com/*
// @version     0.2
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/2203/Hide%20ChessTempo%20Ratings%20Box.user.js
// @updateURL https://update.greasyfork.org/scripts/2203/Hide%20ChessTempo%20Ratings%20Box.meta.js
// ==/UserScript==

try {
    // This is the ratings box permanently in the top right corner
    var table = document.getElementById("user-ratings-div");
    if (table) {
        console.log("Hiding ratings table");
        table.style.visibility="hidden";
    } else {
        console.log("Ratings table not found");
    }

    // THis is the box which the users changed rating is placed in, after the tactic is completed
    var result = document.getElementsByClassName("ct-tactic-result-rating");
    if (result && result.length > 0) {
        console.log("Hiding tactic result table");
        result.item(0).style.visibility = "hidden";    
    }
    
} catch (e) {
    console.log("Hide ChessTemp ratings failed: " + e);
}
