// ==UserScript==
// @name Danisch Filter
// @namespace Violentmonkey Scripts
// @description Schaut sich jemand den Hadmut ohne Userscript an? Das muss nicht sein!
// @author Felix von Leitner
// @homepage https://blog.fefe.de
// @match http://www.danisch.de/*
// @match https://www.danisch.de/*
// @version 0.00018
// @run-at  document-end
// @downloadURL https://update.greasyfork.org/scripts/39710/Danisch%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/39710/Danisch%20Filter.meta.js
// ==/UserScript==

var dict = {};
dict['Susanne Baer'] = "Mama";
dict['Geisteswissenschaftler'] = "Elfenwesen";
dict['Geisteswissenschaften'] = "Elfenmagie";
dict['Geisteswissenschafts'] = "Elfenmagie";
dict['Bundesverfassungsgericht'] = "Wladimir Putin";
dict['Humboldt-Uni'] = "Aldi Süd";
dict['eine Korrelation'] = "ein Benis";
dict['Korrelation'] = "Benis";
dict['Kausalität'] = "Bagina";
dict['Gender-Mafia'] = "Reptiloiden";
dict['Amygdala'] = "Prostata";
dict['Ich hab den Beruf verfehlt'] = "Ich lutsche übrigens gerne Schwänze"; 


var postClasses = document.querySelectorAll("p, h1");

for (var i = 0; i < postClasses.length; i++) {

    var text = postClasses[i];

    for (key in dict) {
        while (text.innerHTML.includes(key)) {
            text.innerHTML = text.innerHTML.replace(key, dict[key]);
        }
    }
}