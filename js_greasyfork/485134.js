// ==UserScript==
// @name         Dendreo Prod Avertisseur
// @namespace    http://tampermonkey.net/
// @version      2024-01-19_09:45
// @license      MIT
// @description  Modifie la couleur du bandeau sur le site pro.dendreo.com
// @author       You
// @match        https://pro.dendreo.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/485134/Dendreo%20Prod%20Avertisseur.user.js
// @updateURL https://update.greasyfork.org/scripts/485134/Dendreo%20Prod%20Avertisseur.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener('load', function () {
        changeHeaderColor();
    })

    function changeHeaderColor () {
        let bandeau = document.querySelector(".bandeau");
        if(bandeau){
            bandeau.classList.add("bg-red-600");
        }
    }
})();