// ==UserScript==
// @name         Affichage de l'environnement Kanonik
// @namespace    https://kanonik.dev/
// @version      0.1
// @description  Affiche explicitement l'environnement sur toutes les pages Kanonik
// @author       Alban Duval <aduval@kanonik.fr>
// @grant        none
// @include      https://*.kanonik.fr/*
// @include      https://*.kanonik.dev/*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/525318/Affichage%20de%20l%27environnement%20Kanonik.user.js
// @updateURL https://update.greasyfork.org/scripts/525318/Affichage%20de%20l%27environnement%20Kanonik.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var hostname = URL.parse(window.location).hostname;
    var content = 'PROD';
    var style = 'background: red; opacity: 0.35;';
    var prodRegex = /.*\.kanonik\.fr.*/;
    var preprodRegex = /(auth|.*\.preprod)\.kanonik\.dev.*/;
    var inteRegex = /.*\.integration\.kanonik\.dev.*/;

    if (hostname.match(preprodRegex)) {
       content = 'preprod';
       style = 'background: orange; opacity: 0.5;';
    } else if (hostname.match(inteRegex)) {
       content = 'intégration';
       style = 'background: green; opacity: 0.35;';
    }

    var divLeft = document.createElement("div");
    var divTop = document.createElement("div");
    var span = document.createElement("span");
    divLeft.appendChild(span);
    span.innerHTML = content;
    var divStyle = "position: fixed; pointer-events: none; padding: 0.1em; z-index: 1000000; overflow: hidden;" + style;
    divLeft.style = divStyle + "bottom: 0; left: 0; top: 0;";
    divTop.style = divStyle + "top: 0; left: 0; right: 0; height: 5px;";
    span.style = "color: white; font-size: 35px; line-height: 0.9em; writing-mode:sideways-lr; padding-top: 25px;";
    document.body.appendChild(divLeft);
    document.body.appendChild(divTop);
})();