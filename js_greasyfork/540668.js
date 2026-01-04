// ==UserScript==
// @name         Autoclick bonificación ext Spreen
// @namespace    http://tampermonkey.net/
// @version      2025-06-21
// @license      https://kick.com/de-lujo
// @description  da click en bonificacion automaticamente en la extesion de spreen
// @author       De_lujo
// @match        https://kick.com/spreen
// @icon         https://www.google.com/s2/favicons?sz=64&domain=kick.com
// @grant        none
// @require     https://ajax.googleapis.com/ajax/libs/jquery/3.6.3/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/540668/Autoclick%20bonificaci%C3%B3n%20ext%20Spreen.user.js
// @updateURL https://update.greasyfork.org/scripts/540668/Autoclick%20bonificaci%C3%B3n%20ext%20Spreen.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const sound = new Audio('https://www.myinstants.com/media/sounds/mario-coin.mp3');
    sound.volume = 0.7;

    function clickBonusButton() {
        // Selecciona el segundo botón dentro de un div con clase "box"
        const button = document.querySelector('.box button:nth-child(2)');

        if (button) {
            button.click();
            console.log('[AutoBonus] ✅ Bonificación reclamada');
            sound.play().catch(err => console.warn('[AutoBonus] Error al reproducir sonido:', err));
        }
    }

    // Click inmediato si ya está presente
    const tryClickImmediately = () => {
        clickBonusButton();
    };

    // Observa TODO el DOM
    const observer = new MutationObserver(() => {
        clickBonusButton();
    });

    function startObserver() {
        observer.observe(document.body, { childList: true, subtree: true });
        console.log('[AutoBonus] 👀 Observando la página para detectar bonificaciones...');
    }

    // Inicia después que la página esté lista
    window.addEventListener('load', () => {
        tryClickImmediately(); // intenta hacer click por si ya está
        startObserver(); // observa continuamente cambios
    });
})();