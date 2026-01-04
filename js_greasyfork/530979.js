// ==UserScript==
// @name         Alerte accrétion
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Joue un son quand le buisson est terminé
// @author       Laïn
// @match        https://www.dreadcast.eu/Main
// @match        https://www.dreadcast.net/Main
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/530979/Alerte%20accr%C3%A9tion.user.js
// @updateURL https://update.greasyfork.org/scripts/530979/Alerte%20accr%C3%A9tion.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Nouveau son court (petit "ding")
    const soundUrl = 'https://www.myinstants.com/media/sounds/ding-sound-effect_2.mp3';
    let lastCombatTime = 0;
    const combatCooldown = 10000; // 10 secondes minimum entre deux alertes

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
                    if (document.body.innerHTML.includes('Cette accrétion a été complètement récoltée')) {
                        if (lastCombatTime === 0) {
                            playSound();
                        }
                    } else {
                        lastCombatTime = 0; // Réinitialisation si le texte disparaît
                    }
                }
            }
        });
        observer.observe(document.body, { childList: true, subtree: true, characterData: true });
    }

    // Lancer l'observation
    observeDOM();
})();
