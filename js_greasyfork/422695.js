// ==UserScript==
// @name            Quojob Verbesserungen
// @description     Quojob-Verbesserungen die dringend nötig sind
// @author          navchandar
// @include         https://*quojob.de/*
// @include         *quojob.de/*
// @version         0.1
// @run-at          document-start
// @license         MIT
// @homepage        https://werk3.de Thomas Sperling
// @setupURL        https://quojob.werk3.dev/quojob.user.js
// @icon            https://werk3.quojob.de/favicon.ico
// @grant           GM_addStyle
// @namespace https://greasyfork.org/users/743802
// @downloadURL https://update.greasyfork.org/scripts/422695/Quojob%20Verbesserungen.user.js
// @updateURL https://update.greasyfork.org/scripts/422695/Quojob%20Verbesserungen.meta.js
// ==/UserScript==


(function() {
    'use strict';

    var css = document.createElement('style');
    css.type = "text/css";
    css.innerHTML = "/*Startscreeen hübscher*/body{background-size: cover;}\
    /*Kalenderelemente passen in die Ansicht*/.cockpit-calendar table.grid_controls tr td{padding-top: 8px;}";

    //$("div[id^='cockpit_calendar_cd']").addClass('cockpit-calendar');
    setTimeout(function() {
  // Code, der erst nach 2 Sekunden ausgeführt wird
    var cal =document.querySelectorAll("div[id^='cockpit_calendar_cd']")[0];
if (cal) {
    cal.parentNode.classList.add('cockpit-calendar');
}
    }, 1000);

    document.getElementsByTagName('head')[0].appendChild(css);
})();