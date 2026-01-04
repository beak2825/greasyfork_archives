// ==UserScript==
// @name         Mathletics Answer Typing Script
// @namespace    https://tampermonkey.com
// @version      1.02
// @description  Mathletics Live Cheats that actually give points! Hold 'A' to generate points, Press 'A' to type in the answer, or if your answer is already typed press 'A' to submit
// @author       not you
// @match        *://live.mathletics.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/474404/Mathletics%20Answer%20Typing%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/474404/Mathletics%20Answer%20Typing%20Script.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function typeAnswer(answer) {
        var inputElement = document.querySelector(".questions-input-adjustment.questions-input-width-v3");
        var currentIndex = 0;

        function typeCharacter() {
            if (currentIndex < answer.length) {
                var char = answer.charAt(currentIndex);
                inputElement.value += char;
                currentIndex++;
                typeCharacter();
            } else {
                var formElement = document.querySelector('.question-input-form');
                var submitEvent = new Event('submit', {
                    bubbles: true,
                    cancelable: true
                });
                formElement.dispatchEvent(submitEvent);
                setTimeout(performAction, 500);
            }
        }

        typeCharacter();
    }

    function ShowAnswer() {
        var questionText = document.querySelector('.questions-text-alignment.whiteTextWithShadow.question-size-v4').textContent;
        var equation = questionText.split('=')[0];

        function calculateAnswer(equation) {
            return eval(equation);
        }

        var answer = calculateAnswer(equation);

        typeAnswer(answer.toString());
    }

    window.addEventListener("keydown", checkKeyPressed, false);

    function checkKeyPressed(e) {
        if (e.keyCode == 65) { // 'A' key
            ShowAnswer();
        }
    }
})();
