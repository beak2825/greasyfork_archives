// ==UserScript==
// @name         Fotbal - MLS - stats
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  generate correct stats url
// @author       Jarda Kořínek
// @match        https://www.mlssoccer.com/schedule/scores
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mlssoccer.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/458844/Fotbal%20-%20MLS%20-%20stats.user.js
// @updateURL https://update.greasyfork.org/scripts/458844/Fotbal%20-%20MLS%20-%20stats.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener('load', () => {
        alert("Klikni na OK a vyčkej 3 vteřiny pro vygenerování odkazů na stats");

        setTimeout( () => {
            const link = document.querySelectorAll(".mls-c-match-list__match");

            link.forEach( item => {
            item.children[1].href += "/stats"
            });
        }, 3000)
    })})();