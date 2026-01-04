// ==UserScript==
// @name         Eishockey.at
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Vygeneruje live urls k zápasům.
// @author       MK
// @match        https://www.eishockey.at/gamecenter/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=eishockey.at
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/475430/Eishockeyat.user.js
// @updateURL https://update.greasyfork.org/scripts/475430/Eishockeyat.meta.js
// ==/UserScript==

(function() {
    setTimeout(() => {
        const header = document.querySelector('#tab_menu');
        const generate = document.createElement("button");
        header.append(generate);
        generate.append("VYGENERUJ LIVE URL K ZÁPASŮM");
        generate.onclick = function(){generateLiveUrl()};
        generate.style.fontSize = "16px";
    } , 5000)
})();
function generateLiveUrl() {
        const matchesNL = document.querySelectorAll("tr:not(.-hd-label-FINISHED)[class*='-hd-los-schedule-row']");
        const matchesArr = [...matchesNL];
    const leaguename = document.querySelector('div.innav > ul.gamenavi2 > li.active > a').href;
    const diviId = document.querySelector('#tab_content > div > div > div > div.tab.selected > a').getAttribute('data-divid');

        matchesArr.map((match) => {
            const odkaz = document.createElement("a");
            const matchId = match.id;
            const misto = match.querySelectorAll(".-hd-los-schedule-col-scoreDivider");

            odkaz.append("LIVE URL");
            odkaz.href = leaguename + "?gameID=" + matchId + "&diviID=" + diviId;
            misto[0].appendChild(odkaz);
        })}