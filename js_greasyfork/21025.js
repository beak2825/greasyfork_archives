// ==UserScript==
// @name        Howrse | Competities: Dressuur v1.1
// @namespace   howrse
// @include     http*://nl.howrse.com/elevage/competition/inscription?cheval=*&competition=dressage
// @version     1.1
// @grant       none
// @description Afhandeling Competities Dressuur
// @downloadURL https://update.greasyfork.org/scripts/21025/Howrse%20%7C%20Competities%3A%20Dressuur%20v11.user.js
// @updateURL https://update.greasyfork.org/scripts/21025/Howrse%20%7C%20Competities%3A%20Dressuur%20v11.meta.js
// ==/UserScript==

function randomBetween(min, max) {
    if (min < 0) {
        return Math.floor(min + Math.random() * (Math.abs(min)+max));
    }else {
        return Math.floor(min + Math.random() * max);
    }
}
if ( sessionStorage.getItem("doBlupRapide") == 1) {
    setTimeout(function(){ document.getElementById("public").getElementsByClassName("highlight")[0].getElementsByClassName("button-align-0")[0].click(); }, 2000+randomBetween(50,450));
}