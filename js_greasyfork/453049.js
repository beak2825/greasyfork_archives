// ==UserScript==
// @name         MLS - stats
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  generate correct stats url
// @author       Jarda Kořínek
// @match        https://www.mlssoccer.com/schedule/scores
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mlssoccer.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/453049/MLS%20-%20stats.user.js
// @updateURL https://update.greasyfork.org/scripts/453049/MLS%20-%20stats.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener('load', () => {
        alert("Klikni na OK a vyčkej 3 vteřiny pro vygenerování odkazů na stats");

        setTimeout( () => {
            const link = document.querySelectorAll(".mls-o-match-strip__matchhub-link");

            link.forEach( item => {
            item.href = item.href + "/stats"
            });
        }, 3000)
    })})();