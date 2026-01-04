// ==UserScript==
// @name         1xbit
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Přegeneruje odkaz z 1xbit na 1xstavka a doplní do url a nad prog. tabulku názvy týmů
// @author       KvidoTeam
// @match        https://1xbit1.com/cs/li*e/*/*/*
// @match        https://1xstavka.ru/LiveFeed/GetGameZip?id=*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/488110/1xbit.user.js
// @updateURL https://update.greasyfork.org/scripts/488110/1xbit.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if (location.origin == "https://1xbit1.com") {
        let currentUrl = window.location.href;
        let link = currentUrl.split('/')[7];
        let matchId = link.match(/[0-9]+/);
        let matchPart = link.match(/[0-9]+\-(.*)$/)[1];

        window.location.replace('https://1xstavka.ru/LiveFeed/GetGameZip?id=' + matchId + '&lng=en&cfview=0&isSubGames=true&GroupEvents=true&countevents=50&grMode=2&' + matchPart)
    }
    else if (location.origin == "https://1xstavka.ru") {
        let modifiedUrl = location.href;
        let teamNames = location.href.match(/Mode=2&(.*)/)[1]

        const h1 = document.createElement("h1");
        document.body.appendChild(h1);
        h1.textContent = teamNames;
        h1.style.left = "100px";
        h1.style.position = "absolute"
    }
})();