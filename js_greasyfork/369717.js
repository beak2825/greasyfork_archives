// ==UserScript==
// @name         Marktkalendarium Karte Automatische Standardwerte
// @namespace    lukie80
// @version      1.01
// @description  Füllt die Eiganbefelder der Karte mit euren gewünschten Daten (Land, PLZ, km)
// @author       lukie80
// @match        http://www.marktkalendarium.de/karte/index.php
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/369717/Marktkalendarium%20Karte%20Automatische%20Standardwerte.user.js
// @updateURL https://update.greasyfork.org/scripts/369717/Marktkalendarium%20Karte%20Automatische%20Standardwerte.meta.js
// ==/UserScript==

document.getElementsByName("land")[0].value = "D"; // <== Bitte hier anpassen
document.getElementsByName("plz")[0].value = 64289; // <== Bitte hier anpassen
document.getElementsByName("km")[0].value = 75; // <== Bitte hier anpassen

const dayOfWeek=0; //Sunday
function getNextDayOfWeek(dayOfWeek) { //current date, 0-6, Su = 0
    var date = new Date();
    var resultDate = new Date(date.getTime());
    resultDate.setDate(date.getDate() + (7 + dayOfWeek - date.getDay()) % 7);
    return resultDate;
}

document.getElementsByName("time_d0")[0].value = getNextDayOfWeek(dayOfWeek).getUTCDate()-1;
document.getElementsByName("time_m0")[0].value = getNextDayOfWeek(dayOfWeek).getUTCMonth() + 1;
document.getElementsByName("time_y0")[0].value = getNextDayOfWeek(dayOfWeek).getUTCFullYear();

document.getElementsByName("time_d1")[0].value = getNextDayOfWeek(dayOfWeek).getUTCDate();
document.getElementsByName("time_m1")[0].value = getNextDayOfWeek(dayOfWeek).getUTCMonth() + 1;
document.getElementsByName("time_y1")[0].value = getNextDayOfWeek(dayOfWeek).getUTCFullYear();