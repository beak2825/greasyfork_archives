// ==UserScript==
// @name         Dataproject
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Generate live url for all matches
// @author       Jarda Kořínek
// @match        https://*.dataproject.com/Live*core.aspx?ID=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=dataproject.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/455346/Dataproject.user.js
// @updateURL https://update.greasyfork.org/scripts/455346/Dataproject.meta.js
// ==/UserScript==

(function() {
    'use strict';
    alert("Klikni na OK pro vygenerování odkazů na LIVE URL");

    const matches = document.querySelectorAll(".DIV_Match_MatchesList_Live");

    const matchArr = Array.from(matches)

    matchArr.map( (match) => {
        const id = match.querySelectorAll("[id^='Content_Main_RLV_MatchList_DIV_Match']")[0].outerHTML.match(/\d+/)[0];
        const header = match.querySelectorAll(".Home_TodayMatches_Header");
        const odkaz = document.createElement("a");

        header[0].append(odkaz);
        odkaz.href = location.origin + "/LiveScore_adv.aspx?ID=" + id;
        odkaz.append("LIVE URL");
    })
})();