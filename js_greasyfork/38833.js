// ==UserScript==
// @name         La presse without sports
// @name:fr      La presse sans les sports
// @namespace    http://tampermonkey.net/
// @version      0.9
// @description  Remove sports from lapresse.ca 
// @description:fr Enlève tout le contenu sport de site lapresse.ca
// @author       You
// @include      http://www.lapresse.ca/*
// @include      https://www.lapresse.ca/*
// @match        http://www.lapresse.ca
// @match        https://www.lapresse.ca
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/38833/La%20presse%20without%20sports.user.js
// @updateURL https://update.greasyfork.org/scripts/38833/La%20presse%20without%20sports.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var elt = document.getElementById("sectionsports");
    if(elt != null){
        elt.style.visibility = "hidden";
        elt.parentNode.removeChild(elt);
    }

    elt = document.querySelector("a.SPO");
    if(elt != null) elt.parentNode.removeChild(elt);


    [].forEach.call(
        document.querySelectorAll("section.SPO"),
        function (el) {
            el.style.visibility = "hidden";
        }
    );

    [].forEach.call(
        document.querySelectorAll("a.SPO"),
        function (el) {
            el.style.visibility = "hidden";
        }
    );

    [].forEach.call(
        document.querySelectorAll('a[href*="/sports/"]'),
        function (el) {
            el.style.visibility = "hidden";
        }
    );

})();