// ==UserScript==
// @name         Baseball - ofika
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Umožnuje rozklikávat jednotlivé detaily
// @author       Jarda Kořínek
// @match        *://www.baseballsoftball.be/en/events/2023-baseball-d1/schedule-and-results
// @match        *://www.fibs.it/it/events/2023-serie-a-baseball/schedule-and-results
// @match        *://stats.knbsbstats.nl/en/events/2023-hoofdklasse-honkbal/schedule-and-results
// @match        *://stats.baseball.cz/cs/events/2023-extraliga/schedule-and-results
// @match        *://www.baseballsoftball.at/en/events/baseball-bundesliga-2023/schedule-and-results
// @match        *://stats.baseboll-softboll.se/en/events/2023-elitserien-baseboll/schedule-and-results
// @match        *://finland.wbsc.org/en/events/2023-superbaseball-2023/schedule-and-results
// @match        *://stats.britishbaseball.org.uk/en/events/2023-nbl/schedule-and-results
// @match        *://www.wbsceurope.org/en/events/2023-baseball-european-champions-cup/schedule-and-results
// @match        *://www.wbsc.org/en/events/2023-baseball-champions-league-americas/schedule-and-results
// @match        *://www.wbscamericas.org/en/events/xix-pan-american-games-santiago-2023-mens-baseball/schedule-and-results
// @match        col.wbsc.org/es/events/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=baseballsoftball.be
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/469626/Baseball%20-%20ofika.user.js
// @updateURL https://update.greasyfork.org/scripts/469626/Baseball%20-%20ofika.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const misto = document.querySelectorAll(".filters");
    const button = document.createElement("button");

    misto[0].insertAdjacentElement("afterend", button);

    button.textContent = "VYGENEROVAT ODKAZY";
    button.addEventListener("click", () => {
        const disabledLinks = document.querySelectorAll("a.is-disabled");

        disabledLinks.forEach( (link) => {
            link.classList.remove("is-disabled");
        });})
    button.style.fontSize = "1.5rem";

    const parentElement = button.parentElement;
    parentElement.style.textAlign = "center";

})();