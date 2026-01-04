// ==UserScript==
// @name         Finské hokeje
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Generate live url for all matches
// @author       Jarda Kořínek
// @match        http://tulospalvelu.leijonat.fi/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=leijonat.fi
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/455785/Finsk%C3%A9%20hokeje.user.js
// @updateURL https://update.greasyfork.org/scripts/455785/Finsk%C3%A9%20hokeje.meta.js
// ==/UserScript==

(function() {
    setTimeout(() => {
        const header = document.querySelectorAll(".page-title.district-title");
        const generate = document.createElement("button");

        header[0].append(generate);
        generate.append("VYGENERUJ LIVE URL K ZÁPASŮM");
        generate.onclick = function(){generateLiveUrl()};
        generate.style.fontSize = "16px";
    } , 1000)
})();

function generateLiveUrl() {
    alert("Klikni na OK pro vygenerování odkazů na LIVE URL");

    const rozklik = document.querySelectorAll(".fa-angle-down");
    const rozklikArr = Array.from(rozklik);
    rozklikArr.map( item => {
        return item.click();
    })

    const zapasy = document.querySelectorAll(".game-score-board");
    const zapasyArr = [...zapasy];
    zapasyArr.map( (item) => {
        const matchId = item.dataset.value;
        const odkaz = document.createElement("a");
        const live = "http://www.tilastopalvelu.fi/ih/gameshootingmap/?gid=" + matchId;
        const misto = item.querySelectorAll(".game-time");

        misto[0].append(odkaz);
        odkaz.href = live;
        odkaz.append("    LIVE URL")
    })
}