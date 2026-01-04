// ==UserScript==
// @name         Zeit.de: automatische Komplettansicht
// @namespace    https://davidgruenewald.de/
// @version      2021-04-09 17:55
// @description  Leitet bei mehrseitigen Zeit.de- und Zeit-Magazin.de-Artikeln auf die Komplettansicht weiter
// @author       David Grünewald, Noah Grünewald
// @match        https://www.zeit.de/*
// @exclude https://www.zeit.de/*cid=*#cid-*
// @exclude https://www.zeit.de/*page=*#comments

// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/431911/Zeitde%3A%20automatische%20Komplettansicht.user.js
// @updateURL https://update.greasyfork.org/scripts/431911/Zeitde%3A%20automatische%20Komplettansicht.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var oneside = document.querySelectorAll("[data-ct-label='all']");
    if(typeof oneside[0] !== 'undefined' && typeof oneside[0].href !== 'undefined' && window.location.href.match(/\?page=[0-9]*#comments/) != null) {
        window.location.replace(oneside[0].href);
    }
})();