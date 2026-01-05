// ==UserScript==
// @name         Fallen London straightjacket
// @namespace    http://nekoinemo.net/
// @version      1.07
// @description  Makes so you can't harm yourself by accident
// @author       NekoiNemo
// @match        http://fallenlondon.storynexus.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/11777/Fallen%20London%20straightjacket.user.js
// @updateURL https://update.greasyfork.org/scripts/11777/Fallen%20London%20straightjacket.meta.js
// ==/UserScript==

var branchBlacklist = [
    "120916", "120919", "121205", "121210", "121248", "121250", "121261", // Remove "Closest to" (Devils, Docks, Criminals, Revolutionaries, Bohemians, The Great Game, Urchins)
    "63707", "63708", "63709", "63710", // Sell Cave of Nadir location (Revolutionaries, Devils, The Great Game, Urchins)
    "7687", "7690", "7693", "7696", "7699", "7702", // Attending to the Needs of a Singular Plant: "Get rid of it"
    "4939" // A Visit: "End your acquaintance" (Repentant Forger)
];

function makeChoicesSafe() {

    for (var i = 0; i < branchBlacklist.length; i++){
        var branch = document.getElementById("branch" + branchBlacklist[i]);
        if (branch == null) continue;

        branch.getElementsByClassName("go")[0].style.display = "none";
    }
}

setInterval(makeChoicesSafe, 100);