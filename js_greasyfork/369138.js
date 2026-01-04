// ==UserScript==
// @name         Micky Maus & Wendy - Gewinnspiel
// @version      0.1
// @description  Kleine Hilfe für das Gewinnspiel
// @author       rabe85
// @match        https://www.micky-maus.de/gewinnen/*
// @match        https://www.wendy.de/spielen-gewinnen/gewinnspiele/*
// @grant        none
// @namespace    https://greasyfork.org/users/156194
// @downloadURL https://update.greasyfork.org/scripts/369138/Micky%20Maus%20%20Wendy%20-%20Gewinnspiel.user.js
// @updateURL https://update.greasyfork.org/scripts/369138/Micky%20Maus%20%20Wendy%20-%20Gewinnspiel.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function mickymaus_wendy() {

        var quizbox = document.getElementsByClassName("quizbox-question")[0];

        if(quizbox) {
            // Falsche Antworten rot markieren
            var falsche_antwort0 = document.querySelectorAll("input[type=radio][value$='alse']");
            for(var fa = 0, falsche_antwort; !!(falsche_antwort=falsche_antwort0[fa]); fa++) {
                falsche_antwort.nextElementSibling.setAttribute('style','background-color: red; text-decoration: line-through;');
            }

            // Richtige Antwort grün markieren
            var richtige_antwort0 = document.querySelectorAll("input[type=radio][value$='rue']");
            for(var ra = 0, richtige_antwort; !!(richtige_antwort=richtige_antwort0[ra]); ra++) {
                richtige_antwort.nextElementSibling.setAttribute('style','background-color: green;');
            }
        }

    }

    // DOM vollständig aufgebaut?
    if (/complete|interactive|loaded/.test(document.readyState)) {
        mickymaus_wendy();
    } else {
        document.addEventListener("DOMContentLoaded", mickymaus_wendy, false);
    }

})();