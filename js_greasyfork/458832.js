// ==UserScript==
// @name         Házená - Dánsko ofiko
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Vygeneruje odkaz na live url pro všechny zápasy
// @author       Jarda Kořínek
// @match        https://tophaandbold.dk/kampprogram/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tophaandbold.dk
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/458832/H%C3%A1zen%C3%A1%20-%20D%C3%A1nsko%20ofiko.user.js
// @updateURL https://update.greasyfork.org/scripts/458832/H%C3%A1zen%C3%A1%20-%20D%C3%A1nsko%20ofiko.meta.js
// ==/UserScript==

(function() {
    'use strict';
    alert("Klikni na OK pro vygenerování live url")

    const matches = document.querySelectorAll(".match-program__row");
    const matchesArr = [...matches];

    matchesArr.map((match) => {
        const odkaz = document.createElement("a");
        const id = match.querySelectorAll(".dropdown-item")[0].href.match(/([0-9]+)(\/p\?)/)[1];
        const misto = match.querySelectorAll("span:only-child");

        misto[0].appendChild(odkaz);

        odkaz.append("   live url")
        odkaz.href = "https://tophaandbold.dk/match/" + id;
    })
})();