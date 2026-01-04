// ==UserScript==
// @name         Cookie Clicker Auto Everything
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Automates everything in Cookie Clicker at maximum speed
// @author       ggteras
// @match        *://orteil.dashnet.org/cookieclicker/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/526922/Cookie%20Clicker%20Auto%20Everything.user.js
// @updateURL https://update.greasyfork.org/scripts/526922/Cookie%20Clicker%20Auto%20Everything.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function clickCookie() {
        document.getElementById("bigCookie").click();
        requestAnimationFrame(clickCookie); // Uses the fastest possible browser refresh rate
    }

    function buyUpgrades() {
        if (Game.cookies >= 120000) {
            let upgrades = document.getElementsByClassName("upgrade enabled");
            for (let upgrade of upgrades) {
                upgrade.click();
            }
        }
    }

    function buyBuildings() {
        if (Game.cookies >= 120000) {
            let buildings = document.getElementsByClassName("product unlocked enabled");
            for (let building of buildings) {
                building.click();
            }
        }
    }

    function clickGoldenCookies() {
        let goldenCookies = document.getElementsByClassName("shimmer");
        for (let cookie of goldenCookies) {
            cookie.click();
        }
    }

    requestAnimationFrame(clickCookie); // Starts the high-speed clicking loop
    setInterval(buyUpgrades, 1000);
    setInterval(buyBuildings, 500);
    setInterval(clickGoldenCookies, 100);
})();
