// ==UserScript==
// @name         FPLGameweek Rank Hider
// @match        *://www.fplgameweek.com/*
// @namespace    fplgameweek
// @license      MIT
// @description  A script to hide all live ranks on fplgameweek
// @version 0.0.1.20250202211812
// @downloadURL https://update.greasyfork.org/scripts/525683/FPLGameweek%20Rank%20Hider.user.js
// @updateURL https://update.greasyfork.org/scripts/525683/FPLGameweek%20Rank%20Hider.meta.js
// ==/UserScript==

function removeRanks() {
    var cards = document.querySelectorAll("#IdMyTeamCardDesktop, #compareTeam")
    cards.forEach((card) => {
        var rows = card.querySelectorAll("tr")
        rows.forEach((row) => {
            if (row.textContent.includes("Live Rank")) { row.remove() }
        })
    })
}

$(document).ready(function () {
    // remove the ranks on page load
    removeRanks()

    // then create an observer that will clear ranks again whenever the compareTeam node updates
    const targetNode = document.getElementById("compareTeam");
    const config = { attributes: true, childList: true, subtree: true };
    const callback = () => { removeRanks() };
    const observer = new MutationObserver(callback);
    observer.observe(targetNode, config);
})