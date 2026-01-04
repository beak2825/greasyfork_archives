// ==UserScript==
// @name         Házená Norsko - přesměrování
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Přesměruje detail do správné live url
// @author       Michal Hornok
// @match        https://www.handball.no/system/kamper/kamp/?matchid=*
// @icon         https://www.handball.no/contentassets/27a8096a75e74519b17d3a8ea1adf3b0/logonhf.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/477692/H%C3%A1zen%C3%A1%20Norsko%20-%20p%C5%99esm%C4%9Brov%C3%A1n%C3%AD.user.js
// @updateURL https://update.greasyfork.org/scripts/477692/H%C3%A1zen%C3%A1%20Norsko%20-%20p%C5%99esm%C4%9Brov%C3%A1n%C3%AD.meta.js
// ==/UserScript==

(function() {
    let matchId = window.location.href.match(/matchid=(\d+)/i);

    if (matchId) {
        let newURL = 'https://www.handball.no/system/live-kamp/?matchId=' + matchId[1];

        window.location.href = newURL;
    }
})();