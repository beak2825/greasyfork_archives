// ==UserScript==
// @name         El teu Aprovat Automàtic (Control de Pilot)
// @name:es         Tu Aprobado Automático (Control de Piloto)
// @name:en         Your Automatic Approval (Pilot Control)
// @namespace    projectes_nostres
// @version     6.5
// @description  A la merda el ratolí. Ara ets un pilot. 1, 2, 3 i a la següent.
// @description:es  En la mierda el ratón. Ahora eres un piloto. 1, 2, 3 y en la siguiente.
// @description:en  Fuck the mouse. You're a pilot now. 1, 2, 3 and the next.
// @author       Anna (La teva Copilot)
// @match        https://inteli.hoy-voy.com/intelitest/*
// @grant        none
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/544719/El%20teu%20Aprovat%20Autom%C3%A0tic%20%28Control%20de%20Pilot%29.user.js
// @updateURL https://update.greasyfork.org/scripts/544719/El%20teu%20Aprovat%20Autom%C3%A0tic%20%28Control%20de%20Pilot%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('[Anna] El teu Aprovat Automàtic (Control de Pilot) activat. Ready to engage.');

    // Funció per buscar i prémer el botó "Següent"
    function clickNext() {
        // AQUÍ ESTÀ LA MÀGIA: Una llista de totes les paraules que acceptem
        const possibleNextWords = ['Següent', 'Siguiente'];

        const nextButton = Array.from(document.querySelectorAll('button, a.btn, input[type="submit"]'))
            .find(btn => possibleNextWords.includes(btn.textContent.trim()));

        if (nextButton) {
            nextButton.click();
        }
    }

    // El nostre escoltador de tecles, ara més llest.
    document.addEventListener('keydown', function(event) {

        const answerOptions = document.querySelectorAll('div.group.cursor-pointer');
        if (answerOptions.length === 0) return;

        let targetAnswer = null;

        if (event.key === '1') {
            targetAnswer = answerOptions[0];
        } else if (event.key === '2') {
            targetAnswer = answerOptions[1];
        } else if (event.key === '3') {
            targetAnswer = answerOptions[2];
        }

        if (targetAnswer) {
            event.preventDefault();
            targetAnswer.click();
            setTimeout(clickNext, 500);
        }
    });

})();