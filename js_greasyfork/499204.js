// ==UserScript==
// @name         Auto-click Participate Button
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Auto-click the "participer" button on Instant Gaming giveaway page
// @author       oto
// @match        https://www.instant-gaming.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/499204/Auto-click%20Participate%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/499204/Auto-click%20Participate%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Fonction pour trouver et cliquer sur le bouton
    function clickParticiperButton() {
        // Trouve le bouton par sa classe
        let button = document.querySelector('button.button.validate');
        
        // Vérifie si le bouton a un enfant div avec le texte "Participer"
        if (button && button.querySelector('div') && button.querySelector('div').textContent.trim() === 'Participer') {
            console.log('Button found, clicking...');
            button.click();
        } else {
            console.log('Button not found or does not match.');
        }
    }

    // Attend que le DOM soit complètement chargé
    window.addEventListener('load', clickParticiperButton);

    // En cas de contenu chargé dynamiquement après le chargement initial de la page
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList') {
                clickParticiperButton();
            }
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();
