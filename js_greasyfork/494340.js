// ==UserScript==
// @name         Auto Scroll Down
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Scroll down automatically on a webpage
// @author       YOUR SISTERRRRRR
// @match        https://www.tiktok.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/494340/Auto%20Scroll%20Down.user.js
// @updateURL https://update.greasyfork.org/scripts/494340/Auto%20Scroll%20Down.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Fonction pour faire défiler la page vers le bas
    function autoScroll() {
        window.scrollBy(0, window.innerHeight); // Défilement de la hauteur de la fenêtre
    }

    // Déclencher le défilement toutes les 2 secondes (2000 millisecondes)
    setInterval(autoScroll, 100000);
})();
