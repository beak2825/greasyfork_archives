// ==UserScript==
// @name         HWM_PrintBattleLinks
// @namespace    Небылица
// @version      1.1
// @description  Меняет тексты ссылок на бои в протоколе на их адреса
// @author       Небылица
// @include      /^https{0,1}:\/\/((www|qrator)\.heroeswm\.ru|178\.248\.235\.15)\/pl_warlog.php.+/
// @downloadURL https://update.greasyfork.org/scripts/39010/HWM_PrintBattleLinks.user.js
// @updateURL https://update.greasyfork.org/scripts/39010/HWM_PrintBattleLinks.meta.js
// ==/UserScript==

(function() {
    "use strict";

    var links = document.querySelectorAll("a[href^='warlog.php']"),
        hostname = location.protocol + "//" + location.hostname + "/",
        i,
        maxI = links.length;
    for (i=0;i<maxI;i++){
        links[i].innerText = hostname + links[i].getAttribute("href").replace("warlog", "war") + "&lt";
    }
})();