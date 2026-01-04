// ==UserScript==
// @name         Battleship
// @namespace    Battleship
// @version      1.0
// @description  Cambiar color fondo jueguito
// @author       @lavolavo
// @match       *://*.battleship-game.org/*
// @require     https://code.jquery.com/jquery-3.3.1.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/376894/Battleship.user.js
// @updateURL https://update.greasyfork.org/scripts/376894/Battleship.meta.js
// ==/UserScript==


this.$ = this.jQuery = jQuery.noConflict(true);

$(function()
 {
    document.body.style.backgroundColor = "#757575";
    document.getElementsByClassName("body-wrap")[0].style.backgroundColor = "#757575";

 }
);