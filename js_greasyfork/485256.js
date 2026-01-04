// ==UserScript==
// @name         LeBonCoin - clique sur "Voir plus"
// @namespace    http://tampermonkey.net/
// @version      2024-01-21
// @description  Cliques automatiquement sur le bouton "Voir plus" sur leboncoin.fr
// @author       Tom
// @match        https://www.leboncoin.fr/*
// @icon         https://www.leboncoin.fr/favicon.ico
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/485256/LeBonCoin%20-%20clique%20sur%20%22Voir%20plus%22.user.js
// @updateURL https://update.greasyfork.org/scripts/485256/LeBonCoin%20-%20clique%20sur%20%22Voir%20plus%22.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const seeMoreButtons = [...document.querySelectorAll('button')].filter(e => e.innerText === "Voir plus")
    if( seeMoreButtons && seeMoreButtons.length) {
        seeMoreButtons.forEach(b => b.click())
    }
})();