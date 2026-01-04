// ==UserScript==
// @name         Goalloooo - přesměrování url
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Replace and redirect
// @author       Jiří Vlček
// @match        https://www.goaloo13.com/football/*
// @match        https://tips.goaloo13.com/football/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/520893/Goalloooo%20-%20p%C5%99esm%C4%9Brov%C3%A1n%C3%AD%20url.user.js
// @updateURL https://update.greasyfork.org/scripts/520893/Goalloooo%20-%20p%C5%99esm%C4%9Brov%C3%A1n%C3%AD%20url.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Získání aktuální URL
    let currentUrl = window.location.href;

    // Pokud URL začíná "https://tips.goaloo13.com/football/", přesměrujeme na "https://goaloo13.com/football/"
    if (currentUrl.startsWith("https://tips.goaloo13.com/football/")) {
        currentUrl = currentUrl.replace("https://tips.goaloo13.com", "https://goaloo13.com");
    }

    // Nahrazení "/h2h-", "/oddscomp-" a "/tips-" za "/live-"
    let newUrl = currentUrl.replace("/h2h-", "/live-").replace("/oddscomp-", "/live-").replace("/tips-", "/live-");

    // Pokud byla URL změněna, přesměrujeme na novou URL
    if (newUrl !== currentUrl) {
        window.location.href = newUrl;
    }
})();