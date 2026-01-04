// ==UserScript==
// @name         Transum
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  transum fa
// @author       You
// @match        *://*.transum.org/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/536025/Transum.user.js
// @updateURL https://update.greasyfork.org/scripts/536025/Transum.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const correctAnswers = 999;
    const trophyText = 'Completed';

    function fakeCorrectAnswers(count, trophyMessage) {
        window.score = count;

        for (let i = 1; i <= count; i++) {
            const tick = document.getElementById(`tick${i}`);
            const cross = document.getElementById(`cross${i}`);
            if (tick && cross) {
                tick.style.display = 'inline';
                cross.style.display = 'none';
            }

            const guessInput = document.querySelector(`input[name="Guess${i}"]`);
            if (guessInput) {
                guessInput.value = `1F1`;
            }
        }

        const checkButton = document.getElementById('Checkbutton');
        if (checkButton) {
            checkButton.innerText = trophyMessage.includes('again') ? 'Check again' : 'Check';
            checkButton.style.width = '150px';
        }

        const trophyButton = document.getElementById('Trophybutton');
        if (trophyButton) {
            trophyButton.style.display = 'inline-block';
            trophyButton.value = trophyMessage;
        }
    }

    function submitForm(trophyMessage) {
        const form = document.forms['TrophyForm'];
        if (form) {
            form.Other_Text.value = trophyMessage;
            form.submit();
        }
    }

    fakeCorrectAnswers(correctAnswers, trophyText);

    if (typeof PreCheck === 'function') {
        PreCheck(document.MainForm);
    }

    submitForm(trophyText);
})();