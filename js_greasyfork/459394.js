// ==UserScript==
// @name         Házená - Rumunsko ofiko
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Vygeneruje live url ke všem budoucím zápasům
// @author       Jarda Kořínek
// @match        http://frhlive.com/
// @match        http://frhlive2.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=frhlive.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/459394/H%C3%A1zen%C3%A1%20-%20Rumunsko%20ofiko.user.js
// @updateURL https://update.greasyfork.org/scripts/459394/H%C3%A1zen%C3%A1%20-%20Rumunsko%20ofiko.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setTimeout( () => {
        alert("Klikni na OK pro vygenerování odkazů na LIVE URL");
        const matches = document.querySelectorAll(".ts-w-latest-game--future");
        const matchesArr = [...matches]

        matchesArr.map( (match) => {
            const odkaz = document.createElement("a");
            const div = document.createElement("div");
            const liveUrl = match.getAttribute("href");
            const misto = match.querySelectorAll("time");

            div.appendChild(odkaz);
            odkaz.append("live url");
            odkaz.href = liveUrl;
            misto[0].append(div);

            return liveUrl;
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

            div.appendChild(odkaz);
            odkaz.append("live url");
            odkaz.href = liveUrl;
            misto[0].append(div);

            return liveUrl;
        })
    }, 16000)
})();