// ==UserScript==
// @name         TEST - Waze Discuss Script Execution Test
// @namespace    http://tampermonkey.net/
// @version      0.8.7
// @description  Prueba básica para ver si el script se ejecuta en Waze Discuss.
// @author       Annthizze
// @match        *://www.waze.com/discuss/*
// @grant        GM_log
// @downloadURL https://update.greasyfork.org/scripts/536888/TEST%20-%20Waze%20Discuss%20Script%20Execution%20Test.user.js
// @updateURL https://update.greasyfork.org/scripts/536888/TEST%20-%20Waze%20Discuss%20Script%20Execution%20Test.meta.js
// ==/UserScript==

// Log ANTES de la IIFE para ver si el archivo es parseado por Tampermonkey
console.log('[WAZE TEST 0.8.7] Script file parsed by Tampermonkey.');
GM_log('[WAZE TEST 0.8.7] GM_log: Script file parsed by Tampermonkey.');

(function() {
    'use strict';

    // Log DENTRO de la IIFE para ver si la función principal se ejecuta
    console.log('[WAZE TEST 0.8.7] IIFE (main function) EXECUTING NOW.');
    GM_log('[WAZE TEST 0.8.7] GM_log: IIFE (main function) EXECUTING NOW.');

    alert('[WAZE TEST 0.8.7] El script de prueba se está ejecutando.');

    // Intentar añadir un elemento muy simple para ver si el DOM es accesible
    try {
        if (document.body) {
            const testDiv = document.createElement('div');
            testDiv.textContent = 'WAZE TEST SCRIPT RUNNING - 0.8.7';
            testDiv.style.position = 'fixed';
            testDiv.style.top = '0';
            testDiv.style.left = '0';
            testDiv.style.padding = '10px';
            testDiv.style.background = 'yellow';
            testDiv.style.color = 'black';
            testDiv.style.zIndex = '20000';
            testDiv.style.border = '2px solid red';
            document.body.appendChild(testDiv);
            console.log('[WAZE TEST 0.8.7] Test DIV appended to body.');
            GM_log('[WAZE TEST 0.8.7] GM_log: Test DIV appended to body.');
        } else {
            console.error('[WAZE TEST 0.8.7] document.body NO encontrado al intentar añadir DIV.');
            GM_log('[WAZE TEST 0.8.7] GM_log: document.body NO encontrado.');
        }
    } catch (e) {
        console.error('[WAZE TEST 0.8.7] Error al intentar añadir Test DIV:', e);
        GM_log(`[WAZE TEST 0.8.7] GM_log: Error al añadir Test DIV: ${e.toString()}`);
    }

})();
