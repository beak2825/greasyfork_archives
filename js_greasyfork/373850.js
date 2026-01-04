// ==UserScript==
// @name         Zeit.de: automatische Komplettansicht
// @namespace    https://davidgruenewald.de/
// @version      2018-11-01 15:56
// @description  Leitet bei mehrseitigen Zeit.de- und Zeit-Magazin.de-Artikeln auf die Komplettansicht weiter
// @author       David Grünewald
// @match        https://www.zeit.de/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/373850/Zeitde%3A%20automatische%20Komplettansicht.user.js
// @updateURL https://update.greasyfork.org/scripts/373850/Zeitde%3A%20automatische%20Komplettansicht.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var oneside = document.querySelectorAll("[data-ct-label='all']");
    if(typeof oneside[0] !== 'undefined' && typeof oneside[0].href !== 'undefined'){
        window.location.replace(oneside[0].href);
    }
})();