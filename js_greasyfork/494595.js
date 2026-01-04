// ==UserScript==
// @name         Alerta de Termo gerado
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  notificar quando o ASI terminar de gerar um relatorio.
// @author       ils94
// @match        https://asiweb.tre-rn.jus.br/asi/report?target=dry.infra.reports.web.UserReportsGateway&action=formUserReports
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/494595/Alerta%20de%20Termo%20gerado.user.js
// @updateURL https://update.greasyfork.org/scripts/494595/Alerta%20de%20Termo%20gerado.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let audioPlayed = false;

    function playSound() {
        // Create an audio element
        let audio = new Audio('https://github.com/ils94/workoutTimer/raw/main/sound/finish_pt.mp3');
        // Play the audio
        audio.play().then(() => {
            // Set audioPlayed to true after the audio is played
            audioPlayed = true;
        }).catch((error) => {
            console.error('Failed to play audio:', error);
        });
    }

    function checkElement() {
        let element = document.querySelector('a[name="linkRelatFinalizado"]');
        if (element && !audioPlayed) {
            console.log('Element found:', element);
            clearInterval(intervalId);
            playSound();
        } else {
            console.log('Element not found, retrying in 3 seconds...');
        }
    }

    let intervalId = setInterval(checkElement, 3000);

    // Add a click event listener to the document to allow audio playback
    document.addEventListener('click', () => {
        if (!audioPlayed) {
            playSound();
        }
    });

})();
