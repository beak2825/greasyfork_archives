// ==UserScript==
// @name        Howrse | Competities: Showspringen v2.0
// @namespace   NL howrse
// @include     http*://nl.howrse.com/elevage/competition/inscription?cheval=*&competition=cso
// @version     2.0
// @grant       none
// @description Automatische inschrijving op vrije competitie Showspringen | Automatische inschrijving op willekeurige competitie Showspringen als er geen vrije competities beschikbaar zijn | Automatische inschrijving op paarden van het team Ｖｉｖｅ Ｌａ Ｖｉｅ
// @downloadURL https://update.greasyfork.org/scripts/21023/Howrse%20%7C%20Competities%3A%20Showspringen%20v20.user.js
// @updateURL https://update.greasyfork.org/scripts/21023/Howrse%20%7C%20Competities%3A%20Showspringen%20v20.meta.js
// ==/UserScript==

account = document.getElementsByClassName("header-account-avatar")[0].getElementsByTagName("img")[0].getAttribute("alt");

function randomBetween(min, max) {
    if (min < 0) {
        return Math.floor(min + Math.random() * (Math.abs(min)+max));
    }else {
        return Math.floor(min + Math.random() * max);
    }
}

if ( sessionStorage.getItem("doBlupRapide") == 1) {
document.title = account + ": [ doBlupRapide ]"     
setTimeout(function(){
    countPublicCompetitions = document.getElementById("public").getElementsByClassName("highlight").length;
    console.log("Aantal competities die toegankelijk zijn voor alle paarden: " + countPublicCompetitions);
    for (i = 0; i < countPublicCompetitions; i++) {
        if ( document.getElementById("public").getElementsByClassName("highlight")[i].innerHTML.indexOf("wees de eerste!") > 1 ) {
            selectPublicCompetition = i;
            i = 999;
            console.log("Gekozen competitie: " + selectPublicCompetition);
            document.getElementById("public").getElementsByClassName("highlight")[selectPublicCompetition].getElementsByClassName("button-align-0")[0].click();
        }
        if ( i == countPublicCompetitions-1 && document.getElementById("public").getElementsByClassName("highlight")[i].innerHTML.indexOf("wees de eerste!") < 1) {
            selectPublicCompetition = 0;
            i = 999;
            console.log("Geen vrije competities beschikbaar! Gekozen competitie: " + selectPublicCompetition);            
            document.getElementById("public").getElementsByClassName("highlight")[selectPublicCompetition].getElementsByClassName("button-align-0")[0].click();
        }
    }
}, 2000+randomBetween(50,450));
}

if ( sessionStorage.getItem("doPushCSO") == 1) {
document.title = account + ": [ doPushCSO ]"      
setTimeout(function(){
    countPublicCompetitions = document.getElementById("public").getElementsByClassName("highlight").length;
    console.log("Aantal competities die toegankelijk zijn voor alle paarden: " + countPublicCompetitions);
    for (i = 0; i < countPublicCompetitions; i++) {
        if ( document.getElementById("public").getElementsByClassName("highlight")[i].innerHTML.indexOf("Ｖｉｖｅ Ｌａ Ｖｉｅ") > 1 ) {
            selectPublicCompetition = i;
            i = 999;
            console.log("Gekozen competitie: " + selectPublicCompetition);
            document.getElementById("public").getElementsByClassName("highlight")[selectPublicCompetition].getElementsByClassName("button-align-0")[0].click();
        }
        if ( i == countPublicCompetitions-1 && document.getElementById("public").getElementsByClassName("highlight")[i].innerHTML.indexOf("Ｖｉｖｅ Ｌａ Ｖｉｅ") < 1) {
            selectPublicCompetition = 0;
            i = 999;
            console.log("Geen paarden van het team Ｖｉｖｅ Ｌａ Ｖｉｅ te vinden! Wacht op nieuwe paarden...");            
        }
    }
}, 2000+randomBetween(50,450));
}

setTimeout(function(){ location.reload(); }, randomBetween(90000,180000));




