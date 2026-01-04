// ==UserScript==
// @name         Rafale Clic Droit à Minuit - BLS Algeria
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  3× clics droits à partir de 00:00:00 (heure d'Algérie)
// @match        https://algeria.blsspainglobal.com/DZA/Bls/DoorstepCaptcha*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/541758/Rafale%20Clic%20Droit%20%C3%A0%20Minuit%20-%20BLS%20Algeria.user.js
// @updateURL https://update.greasyfork.org/scripts/541758/Rafale%20Clic%20Droit%20%C3%A0%20Minuit%20-%20BLS%20Algeria.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ⚙️ Paramètres
    const heureCible = 0;
    const minuteCible = 0;
    const secondeCible = 0;
    let aDéjàExécuté = false;

    // 🖱️ Simule un clic droit
    function simulateRightClick(element) {
        const rect = element.getBoundingClientRect();
        const event = new MouseEvent('contextmenu', {
            bubbles: true,
            cancelable: true,
            view: window,
            button: 2,
            buttons: 2,
            clientX: rect.left + 10,
            clientY: rect.top + 10
        });
        element.dispatchEvent(event);
        console.log("🖱️ Clic droit simulé");
    }

    // 🚀 Rafale de 3 clics × 3 fois, espacés
    function lancerRafale(element) {
        for (let j = 0; j < 3; j++) {
            setTimeout(() => {
                for (let i = 0; i < 3; i++) {
                    setTimeout(() => simulateRightClick(element), i * 1); // 1ms entre clics
                }
            }, j * 100); // 100ms entre rafales
        }
    }

    // 🕛 Vérifie l'heure locale (Algérie = UTC+1)
    function estMinuitAlgerie() {
        const now = new Date();
        // Convertir à UTC+1 manuellement (heure d’Alger)
        const heureAlger = new Date(now.toLocaleString("en-US", { timeZone: "Africa/Algiers" }));
        return (
            heureAlger.getHours() === heureCible &&
            heureAlger.getMinutes() === minuteCible &&
            heureAlger.getSeconds() === secondeCible
        );
    }

    // ⏱️ Vérification principale
    const interval = setInterval(() => {
        if (aDéjàExécuté) return;

        if (estMinuitAlgerie()) {
            const h5s = document.querySelectorAll("h5");
            for (let h5 of h5s) {
                if (h5.textContent.includes("waiting midnight to run!")) {
                    lancerRafale(h5);
                    aDéjàExécuté = true;
                    clearInterval(interval);
                    break;
                }
            }
        }
    }, 500); // vérifie toutes les 0.5 sec
})();