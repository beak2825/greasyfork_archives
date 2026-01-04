// ==UserScript==
// @name         TW Blokowanie zaproszeń do przygód
// @author       Nere
// @namespace    kicikici software Inc.
// @version      1.0
// @description  Włącz sobie spokój od idiotów
// @include      https://*.the-west.*/game.php*
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/545222/TW%20Blokowanie%20zaprosze%C5%84%20do%20przyg%C3%B3d.user.js
// @updateURL https://update.greasyfork.org/scripts/545222/TW%20Blokowanie%20zaprosze%C5%84%20do%20przyg%C3%B3d.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function patchEventHandler() {
        if (typeof EventHandler !== 'undefined' && EventHandler.signal) {
            const originalSignal = EventHandler.signal;
            EventHandler.signal = function(...args) {
                const [signal, data] = args;
                if (signal === 'mpi_invitation') {
                    Array.isArray(data) && data[0]
                        ? console.log(`Zablokowano zaproszenie od ${data[0]}`)
                        : console.log('Zablokowano zaproszenie');
                    return;
                }
                return originalSignal.call(this, ...args);
            };
            return true;
        }
        return false;
    }

    const interval = setInterval(() => {
        if (patchEventHandler()) {
            clearInterval(interval);
        }
    }, 500);
})();