// ==UserScript==
// @name         SURA bot buscar citas
// @namespace    http://tampermonkey.net/
// @version      2025-07-22
// @description  Sura citas
// @author       You
// @match        https://agendaweb.suramericana.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_addStyle
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/543375/SURA%20bot%20buscar%20citas.user.js
// @updateURL https://update.greasyfork.org/scripts/543375/SURA%20bot%20buscar%20citas.meta.js
// ==/UserScript==

(function() {
    'use strict';
console.log ('BOT cargado');
   function beep(times = 1) {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const duration = 200;
        const gap = 200;
        for (let i = 0; i < times; i++) {
            const oscillator = ctx.createOscillator();
            const gainNode = ctx.createGain();
            oscillator.type = "sine";
            oscillator.frequency.setValueAtTime(600, ctx.currentTime);
            oscillator.connect(gainNode);
            gainNode.connect(ctx.destination);
            const startTime = ctx.currentTime + i * (duration + gap) / 1000;
            oscillator.start(startTime);
            oscillator.stop(startTime + duration / 1000);
        }
    }

   function runOnce() {
        const modalExists = document.querySelector(".modal.fade.show");

        if (typeof consultarDisponibilidadCitas !== 'function') {
            console.warn("consultarDisponibilidadCitas() no existe en esta página.");
            return;
        }

        if (modalExists) {
            console.log("Modal presente: beep 1 y ejecutar consultarDisponibilidadCitas()");
            beep(1);
            consultarDisponibilidadCitas();
        } else {
            console.log("Modal no encontrado: ejecutar consultarDisponibilidadCitas() y beep 2");
            consultarDisponibilidadCitas();
            beep(2);
        }
    }

    // Delay execution by 5 seconds
    setTimeout(runOnce, 30000);
})();