// ==UserScript==
// @name         RetroAchievements Link Fixer
// @namespace    https://greasyfork.org/de/users/580795
// @version      0.2
// @description  Adds "s=12" to all links on retroachievements.org that go to retroachievements.org/game/<number>
// @author       b1100101
// @match        *://retroachievements.org/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/459649/RetroAchievements%20Link%20Fixer.user.js
// @updateURL https://update.greasyfork.org/scripts/459649/RetroAchievements%20Link%20Fixer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const links = document.querySelectorAll("a[href^='https://retroachievements.org/game/']");
    links.forEach(link => {
        link.href += "?s=12";
    });

    const links2 = document.querySelectorAll("a[href^='/game/']");
    links2.forEach(link => {
        link.href += "?s=12";
    });
})();
