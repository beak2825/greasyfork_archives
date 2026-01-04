// ==UserScript==
// @name         Compensar bot reprogramar citas
// @namespace    http://tampermonkey.net/
// @version      2025-08-14
// @description  Compensar citas
// @author       You
// @match        https://corporativo.compensar.com/salud/transacciones/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_addStyle
// @run-at       document-start
// @license MIT
// @run-in incognito-tabs
// @downloadURL https://update.greasyfork.org/scripts/545843/Compensar%20bot%20reprogramar%20citas.user.js
// @updateURL https://update.greasyfork.org/scripts/545843/Compensar%20bot%20reprogramar%20citas.meta.js
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

       const monthExists = document.querySelector('.date-month');

        if (typeof monthExists !== 'object') {
            alert('no existe MES en esta página.');
            beep(3);
            return;
        }

       const month = document.querySelector('.date-month').text;

        if (month ==='septiembre') {
            console.log(`Mes[${month}] beep 1 y refrescar`);
            //beep(1);
            //alert (month);
            document.querySelector('#filtroCitaMedica .btn-primary').click()
        }
       else {
            console.log(`Mes[${month}] beep 2. confirmar disponibilidad`);
           
            beep(50);
           alert (month);
        }
    }

    // Delay execution by 5 seconds
    setTimeout(runOnce, 20000);
})();