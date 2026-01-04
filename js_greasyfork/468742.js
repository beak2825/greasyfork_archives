// ==UserScript==
// @name         Marathonbet Live Statistics
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Vytváří řádek s odkazem na live url se statistikami.
// @author       MK
// @match        https://www.marathonbet.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=marathonbet.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/468742/Marathonbet%20Live%20Statistics.user.js
// @updateURL https://update.greasyfork.org/scripts/468742/Marathonbet%20Live%20Statistics.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setInterval(function() {
        let a = document.querySelector('#scoreboardContainer');
        if (!a || document.querySelector('#live-statistics')) return;

        let loc = location.href;
        let id = loc.match(/[0-9]+/);
        if (!id) return;

        let an = document.createElement('a');
        an.href = "animation/statistic.htm?treeId=" + id[0];
        an.innerHTML = "LIVE STATISTICS";
        an.style.backgroundColor = "#013d79";
        an.style.fontSize = "x-large";
        an.style.display = "block";
        an.style.color = "#edc700";
        an.style.textAlign = "center";
        an.id = "live-statistics";

        a.appendChild(an);
    }, 1000);
})();
