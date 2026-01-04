// ==UserScript==
// @name         LSS Auto-Reload
// @namespace    www.missionchief.co.uk/
// @version      1.2
// @description  Automatically reload vehicle lists in missions to get the most amount of units
// @author       Conroy
// @match        https://www.missionchief.co.uk/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/506939/LSS%20Auto-Reload.user.js
// @updateURL https://update.greasyfork.org/scripts/506939/LSS%20Auto-Reload.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Variablendeklaration für den Sperrtimer
    let sperrTimer;

    // Ereignislistener für das Mouseover-Ereignis auf dem Element mit der ID 'mission-aao-group'
    document.getElementById('mission-aao-group')?.addEventListener('mouseover', function (e) {
        const target = e.target;
        if (!(target instanceof HTMLElement)) return; // Überprüfen, ob das Ziel ein HTMLElement ist

        // Das nächstgelegene Elternelement vom Typ 'a' mit der Klasse 'btn-warning' finden
        const aaoEntry = target.closest('a.aao');
        if (!aaoEntry) return;

        // Überprüfen, ob das AAO-Element das "danger"-Label hat
        const dangerLabel = aaoEntry.querySelector('.label.label-danger');
        if (!dangerLabel) return;

        // Timeout: Wir müssen 500 ms warten, bevor wir etwas tun
        const timer = setTimeout(function() {
            if (sperrTimer) return;
            sperrTimer = true;
            const reloadButton = document.querySelector('.missing_vehicles_load.btn-warning');
            if (reloadButton) {
                reloadButton.click();
            }
            setTimeout(function() {
                sperrTimer = false;
            }, 30);
        }, 5);

        // Ereignislistener für das Mouseleave-Ereignis auf dem gefundenen Elternelement
        aaoEntry.addEventListener('mouseleave', () => {
            clearTimeout(timer);
        }, { once: true });
    });
})();
