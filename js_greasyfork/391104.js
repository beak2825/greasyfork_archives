// ==UserScript==
// @name         Forocoches icono
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Icono forocoches
// @author       Leg-ion
// @match        https://www.forocoches.com/foro*
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/391104/Forocoches%20icono.user.js
// @updateURL https://update.greasyfork.org/scripts/391104/Forocoches%20icono.meta.js
// ==/UserScript==

$(document).ready(function() {
    var table = document.getElementById("AutoNumber1");
    var tbodys = table.getElementsByTagName("tbody");
    var trs = tbodys[0].getElementsByTagName("tr");
    var tds = trs[0].getElementsByTagName("td");
    var as = tds[2].getElementsByTagName("a");
    $(as[0]).attr("href", "https://www.forocoches.com/foro/forumdisplay.php?f=2");
});