// ==UserScript==
// @name        Howrse | Dek mijn merrie v1.1
// @namespace   howrse
// @include     http*://nl.howrse.com/elevage/chevaux/saillie?*
// @version     1.1
// @description automatisch dekken in "Dek mijn merrie"-scherm
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/21031/Howrse%20%7C%20Dek%20mijn%20merrie%20v11.user.js
// @updateURL https://update.greasyfork.org/scripts/21031/Howrse%20%7C%20Dek%20mijn%20merrie%20v11.meta.js
// ==/UserScript==

function randomBetween(min, max) {
    if (min < 0) {
        return Math.floor(min + Math.random() * (Math.abs(min)+max));
    }else {
        return Math.floor(min + Math.random() * max);
    }
}

setTimeout(function(){
//    if ( document.getElementById("table-0").getElementsByClassName("row-1")[0].getElementsByTagName("a")[0].innerHTML == "Prijs") { document.getElementById("table-0").getElementsByClassName("row-1")[0].getElementsByTagName("a")[0].click() }
//    if ( document.getElementById("table-0").getElementsByClassName("row-1")[0].getElementsByTagName("a")[1].innerHTML == "Prijs") { document.getElementById("table-0").getElementsByClassName("row-1")[0].getElementsByTagName("a")[1].click() }
//    if ( document.getElementById("table-0").getElementsByClassName("row-1")[0].getElementsByTagName("a")[2].innerHTML == "Prijs") { document.getElementById("table-0").getElementsByClassName("row-1")[0].getElementsByTagName("a")[2].click() }
//  id table-0 | class highlight | class button button-style-0 | attribute href
  document.getElementById("boutonDoReproduction").click();
}, randomBetween(1500,2500));
