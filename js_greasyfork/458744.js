// ==UserScript==
// @name         Házená - Chorvatsko, Srbsko + Makedonie
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Vygeneruje live url ke všem zápasům
// @author       Jarda Kořínek
// @match        https://www.sportinfocentar.com/livescore/unistat/indexhrs.html
// @match        https://srl.rs/index.php
// @match        https://arkus-liga.rs/vestilist.php
// @match        https://macedoniahandball.com.mk/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sportinfocentar.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/458744/H%C3%A1zen%C3%A1%20-%20Chorvatsko%2C%20Srbsko%20%2B%20Makedonie.user.js
// @updateURL https://update.greasyfork.org/scripts/458744/H%C3%A1zen%C3%A1%20-%20Chorvatsko%2C%20Srbsko%20%2B%20Makedonie.meta.js
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