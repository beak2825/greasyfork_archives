// ==UserScript==
// @name         Hokej - ČR extraliga statistiky
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Vygeneruje odkazy na live url pro statistiky
// @author       Jarda Kořínek
// @match        https://www.onlajny.com/league/index/id/16*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=onlajny.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/458738/Hokej%20-%20%C4%8CR%20extraliga%20statistiky.user.js
// @updateURL https://update.greasyfork.org/scripts/458738/Hokej%20-%20%C4%8CR%20extraliga%20statistiky.meta.js
// ==/UserScript==

(function() {
        const matches = document.querySelectorAll(".zapasyPolozka");
        const matchesArr = [...matches];

        matchesArr.map( (match) => {
            const odkaz = document.createElement("a");
            const misto = match.querySelectorAll(".zacatekSubpage");

            odkaz.append(" STATS live url");
            odkaz.href = match.querySelectorAll(".tymy")[0].href + "#m:menuMatchStatistics;p:summary";
            misto[0].appendChild(odkaz);
        })
})();