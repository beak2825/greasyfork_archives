// ==UserScript==
// @name         Fotbal - Španělsko
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Vygeneruje odkazy pro live url na hlavní stránce
// @author       Jarda
// @match        https://widgets.besoccerapps.com/scripts/widgets?type=matchs&competition*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=besoccerapps.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/483857/Fotbal%20-%20%C5%A0pan%C4%9Blsko.user.js
// @updateURL https://update.greasyfork.org/scripts/483857/Fotbal%20-%20%C5%A0pan%C4%9Blsko.meta.js
// ==/UserScript==

(function() {
    let currentJornado = null;
    let scriptExecuted = false;

    function extractJornado() {
        const jornadoElement = document.querySelector(".j_cur");
        if (jornadoElement) {
            return jornadoElement.textContent.trim();
        }
        return null;
    }

    function checkForJornadoChange() {
        const newJornado = extractJornado();
        if (newJornado && newJornado !== currentJornado) {
            currentJornado = newJornado;
            runScript();
        }
    }

    function runScript() {
        const today = new Date();
        const month = today.getMonth() + 1;
        let year = today.getFullYear();

        if (month > 0 && month <= 6) {
            year = today.getFullYear();
        } else {
            year = today.getFullYear() + 1;
        }

        const matches = document.querySelectorAll(".result");
        const matchesArr = [...matches];

        matchesArr.forEach(match => {
            const existingButtons = match.querySelectorAll('.live-url-button');
            existingButtons.forEach(button => {
                button.remove();
            });
        });

        matchesArr.map((match) => {
            const odkaz = document.createElement("a");
            odkaz.classList.add("live-url-button");
            const matchId = match.dataset.matchid;
            const misto = match;

            odkaz.append("  Live url");
            odkaz.href = "https://widgets.besoccerapps.com/scripts/widgets?type=match_marker&match=" + matchId + "&season=" + year + "&style=cope";
            misto.appendChild(odkaz);
        });

        scriptExecuted = true;
    }

    runScript();

    
    setInterval(checkForJornadoChange, 2000); 
})();