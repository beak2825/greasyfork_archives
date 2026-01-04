// ==UserScript==
// @name         ReloadAtTime
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Execute your program at a specific time
// @author       MeGaBOuSsOl
// @match        *://*
// @downloadURL https://update.greasyfork.org/scripts/429967/ReloadAtTime.user.js
// @updateURL https://update.greasyfork.org/scripts/429967/ReloadAtTime.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Définir l'heure cible (15:47:04)
    const targetHour = 15;
    const targetMinute = 47;
    const targetSecond = 4;

    // Fonction pour vérifier si l'heure actuelle correspond à l'heure cible
    function checkTime() {
        const now = new Date();
        const targetTime = new Date(
            Date.UTC(
                now.getUTCFullYear(),
                now.getUTCMonth(),
                now.getUTCDate(),
                targetHour,
                targetMinute,
                targetSecond
            )
        );

        // Si l'heure actuelle est égale ou dépasse l'heure cible, recharger la page
        if (now >= targetTime) {
            window.location.reload();
        }
    }

    // Vérifier l'heure toutes les secondes
    const interval = setInterval(checkTime, 1000);

    // Arrêter l'intervalle une fois que l'heure cible est atteinte
    setTimeout(() => {
        clearInterval(interval);
    }, (targetHour * 3600 + targetMinute * 60 + targetSecond) * 1000);
})();