// ==UserScript==
// @name         MeteoFrance information avancées automatiques
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Coche automatiquement la case qui affiche les détails des prévisions
// @author       You
// @match        https://greasyfork.org/fr/script_versions/new
// @include      http://www.meteofrance.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/18529/MeteoFrance%20information%20avanc%C3%A9es%20automatiques.user.js
// @updateURL https://update.greasyfork.org/scripts/18529/MeteoFrance%20information%20avanc%C3%A9es%20automatiques.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';


var d = document.getElementById("show-hide-weather-details"); 
d.setAttribute("checked", "checked"); 

var ele = document.getElementsByClassName("dayDetails");
var nb= 0;
while(ele[nb] != "")
    {
        var el = ele[nb];
        d.setAttribute("style", "table-row"); 
nb = ++nb;
        
    }