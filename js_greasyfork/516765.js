// ==UserScript==
// @name         Only the Big Three
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Removes Tears of Themis, Honkai Impact 3rd, Honkai: Nexus Anima, and Petit Planet from HoYoLAB search and home menu.
// @match        https://www.hoyolab.com/*
// @grant        none
// @icon         https://webstatic.hoyoverse.com/upload/op-public/2021/04/12/bbeb16029152ef690abb1d41dd1a8f78_7756606814264622244.png
// @downloadURL https://update.greasyfork.org/scripts/516765/Only%20the%20Big%20Three.user.js
// @updateURL https://update.greasyfork.org/scripts/516765/Only%20the%20Big%20Three.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const blockedGames = [
        "Tears of Themis", "TearsofThemis",
        "Honkai Impact 3rd", "HonkaiImpact3rd",
        "Honkai: Nexus Anima", "HonkaiNexusAnima",
        "Petit Planet", "PetitPlanet"
    ];

    function hideBlockedGames() {

        document.querySelectorAll("li.game-item").forEach(item => {
            if (blockedGames.some(game => item.textContent.includes(game))) {
                item.style.display = "none";
            }
        });

        document.querySelectorAll("li.mhy-selectmenu__item").forEach(item => {
            const label = item.querySelector(".mhy-selectmenu__label")?.textContent.trim();
            if (blockedGames.includes(label)) {
                item.style.display = "none";
            }
        });
    }

    let tries = 0;
    const interval = setInterval(() => {
        hideBlockedGames();
        tries++;
        if (tries > 20) clearInterval(interval);
    }, 200);

    const observer = new MutationObserver(hideBlockedGames);
    observer.observe(document.body, { childList: true, subtree: true });
})();