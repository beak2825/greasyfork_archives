// ==UserScript==
// @name         Volleyballworld Ofiko - (beach and voll)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Vytvoří live url pro každý zápas na hlavní stránce
// @author       Jarda Kořínek
// @match        https://en.volleyballworld.com/*/competitions/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=volleyballworld.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/470818/Volleyballworld%20Ofiko%20-%20%28beach%20and%20voll%29.user.js
// @updateURL https://update.greasyfork.org/scripts/470818/Volleyballworld%20Ofiko%20-%20%28beach%20and%20voll%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setTimeout( () => {
        const zapasy = document.querySelectorAll("[matchid]");
        const currentURL = location.href;

        zapasy.forEach( (zapas) => {
            const odkaz = document.createElement("a");
            const matchId = zapas.getAttribute("matchid").match(/\d+/)[0];
            const misto = zapas.querySelectorAll(".vbw-mu__score--container");

            odkaz.textContent = "Live url";
            odkaz.href = /\bbeachvolleyball\b/.test(currentURL)
                ? "https://fivb.12ndr.at/match?match="+ matchId : /\bvolleyball\b/.test(currentURL)
                ? "https://en.volleyballworld.com" + zapas.querySelectorAll('[data-matchurl]')[0].dataset.matchurl : "";
            odkaz.style.position = "absolute";
            odkaz.style.transform = "translateY(22px)";

            misto[0].insertAdjacentElement("afterend", odkaz);
        })
    }, 3000)
})();