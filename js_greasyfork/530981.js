// ==UserScript==
// @name         Alerte Défenseurs
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Joue un son quand "Défenseurs" apparaît au début du combat
// @author       Laïn
// @match        https://www.dreadcast.eu/Main
// @match        https://www.dreadcast.net/Main
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/530981/Alerte%20D%C3%A9fenseurs.user.js
// @updateURL https://update.greasyfork.org/scripts/530981/Alerte%20D%C3%A9fenseurs.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // URL du son à jouer (remplace par ton propre fichier si besoin)
    const soundUrl = 'https://www.myinstants.com/media/sounds/tindeck_1.mp3';
    let lastCombatTime = 0;
    const combatCooldown = 10000; // 10 secondes minimum entre deux combats détectés

    function playSound() {
        let now = Date.now();
        if (now - lastCombatTime > combatCooldown) {
            let audio = new Audio(soundUrl);
            audio.play();
            lastCombatTime = now;
        }
    }

    // Fonction d'observation des changements dans le DOM
    function observeDOM() {
        const observer = new MutationObserver(mutations => {
            for (let mutation of mutations) {
                if (mutation.type === 'childList' || mutation.type === 'characterData') {
                    if (document.body.innerHTML.includes('Attaquants')) {
                        if (lastCombatTime === 0) {
                            playSound();
                        }
                    } else {
                        lastCombatTime = 0; // Réinitialisation si "Défenseurs" disparaît
                    }
                }
            }
        });
        observer.observe(document.body, { childList: true, subtree: true, characterData: true });
    }

    // Lancer l'observation
    observeDOM();
})();
