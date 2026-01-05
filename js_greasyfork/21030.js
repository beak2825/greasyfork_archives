// ==UserScript==
// @name        Howrse | Veulenen van * v1.1
// @namespace   howrse
// @include     http*://nl.howrse.com/elevage/chevaux/choisirNoms?jument=*
// @version     1.1
// @grant       none
// @description automatisch veulenen van alles / standaard naam geven
// @downloadURL https://update.greasyfork.org/scripts/21030/Howrse%20%7C%20Veulenen%20van%20%2A%20v11.user.js
// @updateURL https://update.greasyfork.org/scripts/21030/Howrse%20%7C%20Veulenen%20van%20%2A%20v11.meta.js
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

  document.getElementById("poulain-1").value="veulen";
  document.getElementById("boutonChoisirNom").click();
}, randomBetween(1500,2500));
