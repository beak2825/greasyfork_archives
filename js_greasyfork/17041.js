// ==UserScript==
// @name         SB/SV/QQ Expand Spoiler Tags
// @namespace    https://greasyfork.org/users/13408-mistakenot
// @version      1.1.20190713
// @description  Expand spoiler tags on SpaceBattles, Sufficient Velocity, and Questionable Questing.
// @author       mistakenot
// @license      Mozilla Public License, v. 2.0
// @match        *://forums.spacebattles.com/*
// @match        *://forums.sufficientvelocity.com/*
// @match        *://forum.questionablequesting.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/17041/SBSVQQ%20Expand%20Spoiler%20Tags.user.js
// @updateURL https://update.greasyfork.org/scripts/17041/SBSVQQ%20Expand%20Spoiler%20Tags.meta.js
// ==/UserScript==

// reveal all spoilers
function revealSpoilers() {
    var buttonList = document.querySelectorAll(".bbCodeSpoilerButton, .bbCodeSpoiler-button");
    for (var i = 0; i < buttonList.length; i++) {
        var button = buttonList[i];
        button.click();
    }
}

// trigger function on page load
window.addEventListener("load", revealSpoilers, false);
