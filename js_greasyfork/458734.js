// ==UserScript==
// @name         Házená - SEHA liga
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Vygeneruje live url ke všem budoucím zápasům
// @author       Jarda Kořínek
// @match        http://www.seha-liga.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=seha-liga.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/458734/H%C3%A1zen%C3%A1%20-%20SEHA%20liga.user.js
// @updateURL https://update.greasyfork.org/scripts/458734/H%C3%A1zen%C3%A1%20-%20SEHA%20liga.meta.js
// ==/UserScript==

(function() {
    'use strict';

    alert("Klikni na OK pro vygenerování odkazů na LIVE URL");

    setTimeout( () => {
        const matches = document.querySelectorAll(".ts-w-latest-game--future");
        const matchesArr = [...matches]

        matchesArr.map( (match) => {
            const odkaz = document.createElement("a");
            const div = document.createElement("div");
            const liveUrl = match.getAttribute("href");
            const misto = match.querySelectorAll("time");

            const newLiveUrl = liveUrl.replace("nutakmice", "utakmice") + "/livescore";

            div.appendChild(odkaz);
            odkaz.append("LIVE URL");
            odkaz.href = newLiveUrl;
            odkaz.style.color = "red";
            misto[0].append(div);

            return newLiveUrl;
        })
    }, 1000)

    setInterval( () => {
        const matches = document.querySelectorAll(".ts-w-latest-game--future");
        const matchesArr = [...matches]

        matchesArr.map( (match) => {
            const odkaz = document.createElement("a");
            const div = document.createElement("div");
            const liveUrl = match.getAttribute("href");
            const misto = match.querySelectorAll("time");

            const newLiveUrl = liveUrl.replace("nutakmice", "utakmice") + "/livescore";

            div.appendChild(odkaz);
            odkaz.append("LIVE URL");
            odkaz.href = newLiveUrl;
            odkaz.style.color = "red";
            misto[0].append(div);

            return newLiveUrl;
        })
    }, 16000)
})();