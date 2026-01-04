// ==UserScript==
// @name Mozzart slot igra
// @namespace Violentmonkey Scripts
// @match https://www.mozzartbet.com/sr/*
// @description Skripta koja zaustavlja slot igru kada se dobije dobitna kombinacija.
// @version 0.0.1.20230416215853
// @downloadURL https://update.greasyfork.org/scripts/464182/Mozzart%20slot%20igra.user.js
// @updateURL https://update.greasyfork.org/scripts/464182/Mozzart%20slot%20igra.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const stopColumn = 2; // kolona u kojoj se bonus mora pojaviti da bi se zaustavila igra

    function stopGame() {
        const bonusSymbol = 10; // ovo je simbol za bonus
        const gameContainer = document.querySelector('.game-container');
        const column = gameContainer.querySelectorAll('.column')[stopColumn];
        const symbols = column.querySelectorAll('.symbol');

        // proveravamo da li se bonus simbol pojavio u srednjoj koloni
        if (symbols[1].querySelector(`.symbol-${bonusSymbol}`)) {
            // ako se pojavio, zaustavljamo igru nakon 1 sekunde
            setTimeout(() => {
                const stopButton = gameContainer.querySelector('.button-stop');
                stopButton.click();
            }, 1000);
        }
    }

    // hvatamo događaj kada se klikne na dugme "play"
    document.addEventListener('click', (event) => {
        const target = event.target;
        if (target.classList.contains('button-play')) {
            // kada se klikne na dugme play, pokreće se igra i poziva funkcija koja će proveravati da li je došlo do dobitka
            setInterval(stopGame, 500);
        }
    });
})();
