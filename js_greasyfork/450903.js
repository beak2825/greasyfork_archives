// ==UserScript==
// @name         Fandom Ad Remover
// @namespace    -
// @version      1
// @description  Removes top ads from Fandom that block your screen.
// @author       Plantt
// @match        https://*.fandom.com/*
// @icon         https://www.fandom.com/f2/assets/favicons/favicon-32x32.png?v=911c5c5b1b4cb66b20d97200726c1f13e56661f5
// @grant        none
// @license      Unlicense
// @downloadURL https://update.greasyfork.org/scripts/450903/Fandom%20Ad%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/450903/Fandom%20Ad%20Remover.meta.js
// ==/UserScript==

addEventListener("load", () => {
    var int = setInterval(() => {
        try {
            document.getElementById("top_leaderboard").remove();
            document.querySelector(".top-ads-container").remove();
            document.querySelector(".bottom-ads-container").remove();
            clearInterval(int);
        }
        catch (_) {}
    });
});