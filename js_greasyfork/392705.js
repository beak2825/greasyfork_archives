// ==UserScript==
// @name         Notenbonusberechnung
// @namespace    http://tim-greller.tk/
// @version      1.0
// @description  berechnet den Anteil der erreichten Punkte und den Status des Notenbonus für die Blätter von Lineare Algebra I
// @author       Tim Greller
// @match        https://moodle.uni-passau.de/grade/report/user/index.php?id=335
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/392705/Notenbonusberechnung.user.js
// @updateURL https://update.greasyfork.org/scripts/392705/Notenbonusberechnung.meta.js
// ==/UserScript==

(function() {
    var arr = [];
    function handleGradeCol( e,i,a ){
        if( i<a.length-1 && e.innerHTML != "-" ){
            arr.push(Number.parseInt(e.innerHTML));
        }
    }
    document.querySelectorAll("tbody .column-grade").forEach(handleGradeCol);
    var maxPoints = arr.length * 20 - (arr.length>4 ? 10 : 0);
    var totalPoints = 0;
    arr.forEach( function(e){ totalPoints += e; });
    var percentage = totalPoints * 100 / maxPoints;
    var output = document.createElement("div");
    var bonus = percentage > 70 ? "" : "k";
    output.innerHTML = `Mit ${totalPoints} von ${maxPoints} Punkten hast du ${percentage}% der Punkte. Damit bekommst du ${bonus}einen Notenbonus.`;
    output.style.fontWeight = "bolder";
    document.querySelector( "div[role=main]" ).appendChild( output );
})();