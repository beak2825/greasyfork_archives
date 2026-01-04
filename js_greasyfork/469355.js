    // ==UserScript==
    // @name         OLD GAME Duel
    // @namespace    http://tampermonkey.net/
    // @version      1.2
    // @description  OLD GAME SCRIPT
    // @author       Ro1 xD3MEnTu
    // @include https://*.the-west.*/game.php*
    // @grant        none
// @downloadURL https://update.greasyfork.org/scripts/469355/OLD%20GAME%20Duel.user.js
// @updateURL https://update.greasyfork.org/scripts/469355/OLD%20GAME%20Duel.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Creează butonul de eveniment
    var eventButton = document.createElement('button');
    eventButton.className = 'dln_eventbutton';
    eventButton.innerText = '120';

    // Adaugă stilurile personalizate pentru butonul de eveniment
    var styles = `
        .dln_eventbutton {
            position: fixed;
            top: 130px;
            right: 50px;
            z-index: 9999;
            cursor: not-allowed;
padding: 12px 10px 12px 10px;
            color: #fff;
            display: inline-block;
            margin: 0;
            border-radius: 50%;
            background: radial-gradient(circle at 50% 120%,  #323232, #0a0a0a 80%, #000000 100%);
        }
        .dln_eventbutton:hover {
            background-color: #222;
        }
    `;
    var styleElement = document.createElement('style');
    styleElement.innerHTML = styles;
    document.head.appendChild(styleElement);

    // Adaugă butonul de eveniment în corpul paginii
    document.body.appendChild(eventButton);

    // Variabilă pentru starea evenimentului de timing
    var timingEventActive = false;

    // Funcție pentru gestionarea evenimentului de click al butonului de eveniment
    function handleEventButtonClick() {
        // Găsește toate butoanele eveniment cu textul "Gata" și apelează evenimentul de click pentru ele
        var eventButtons = document.querySelectorAll('.dl_fightbutton span.dln_fightstatus');
        eventButtons.forEach(function(button) {
            if (button.textContent === 'Gata') {
                var eventButton = button.parentNode;
                if (eventButton) {
                    eventButton.click();
                    if (!timingEventActive) {
                        startTimingEvent();
                    }
                }
            }
        });
    }

    // Adaugă evenimentul de click pentru butonul de eveniment
    eventButton.addEventListener('click', handleEventButtonClick);

    // Funcție pentru gestionarea evenimentului de timing
    function handleTimingEvent() {
        // Codul aici va fi rulat după 120 de secunde
        console.log('Timing event activat!');
    }

    // Funcție pentru pornirea evenimentului de timing
    function startTimingEvent() {
        timingEventActive = true;
        var timeRemaining = 120;
        eventButton.innerText = timeRemaining;

        var countdownInterval = setInterval(function() {
            timeRemaining--;
            eventButton.innerText = timeRemaining;

            if (timeRemaining === 0) {
                clearInterval(countdownInterval);
                timingEventActive = false;
                handleTimingEvent();
                handleEventButtonClick(); // Apasă automat butonul de eveniment
            }
        }, 1000);
    }
})();

