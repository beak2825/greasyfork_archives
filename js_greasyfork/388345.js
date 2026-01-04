// ==UserScript==
// @name         AdivinaForero
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  minigame for pacot
// @author       Rayzen
// @match        https://pacot.es/t/pacojuego-dinamico
// @match        https://pacot.es/t/pacojuego-dinamico*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/388345/AdivinaForero.user.js
// @updateURL https://update.greasyfork.org/scripts/388345/AdivinaForero.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var imgPrinc = document.createElement("img");
    var imgLog = document.createElement("img");
    var imgPunt = document.createElement("img");

    var bot = document.createElement("button");

    imgPrinc.src = "https://azarioh.com/images/screenshot.png";
    imgPrinc.style.margin = "auto 500px";
    imgPrinc.style.border = "medium solid #FFFFFF";
    imgPrinc.style.borderRadius = "10px";

    imgLog.src = "https://azarioh.com/images/log.png";
    imgLog.style.margin = "auto 500px";
    imgLog.style.border = "medium solid #FFFFFF";
    imgLog.style.borderRadius = "10px";

    imgPunt.src = "https://azarioh.com/images/punt.png";
    imgPunt.style.margin = "auto 500px";
    imgPunt.style.border = "medium solid #FFFFFF";
    imgPunt.style.borderRadius = "10px";

    bot.innerHTML = "Actualizar";
    bot.style.margin = "20px 500px";
    bot.style.borderRadius = "10px";
    bot.style.background = "#202225";
    bot.style.color = "#FFFFFF";
    function actualizar(){
        imgPrinc.src = "https://azarioh.com/images/screenshot.png?" + new Date().getTime();
        imgLog.src = "https://azarioh.com/images/log.png?" + new Date().getTime();
        imgPunt.src = "https://azarioh.com/images/punt.png?" + new Date().getTime();
    }

    bot.addEventListener("click", actualizar);

    document.addEventListener('DOMContentLoaded', document.body.appendChild(imgPrinc));
    document.addEventListener('DOMContentLoaded', document.body.appendChild(bot));
    document.addEventListener('DOMContentLoaded', document.body.appendChild(imgPunt));
    document.addEventListener('DOMContentLoaded', document.body.appendChild(imgLog));
  //  window.onloadend = document.body.appendChild(img);
  //  window.onloadend = document.body.appendChild(bot);
})();