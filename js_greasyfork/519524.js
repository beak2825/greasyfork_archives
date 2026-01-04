// ==UserScript==
// @name         Platonus Keyboard Shortcuts
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Add keyboard shortcuts to Platonus site
// @author       Eclassic32
// @license      MIT
// @match        *://platonus.iitu.edu.kz/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=platonus.iitu.edu.kz
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/519524/Platonus%20Keyboard%20Shortcuts.user.js
// @updateURL https://update.greasyfork.org/scripts/519524/Platonus%20Keyboard%20Shortcuts.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log("Platonus Keyboard Shortcuts running");

    document.onkeypress = function(evt) {
        evt = evt || window.event;
        var charCode = evt.keyCode || evt.which;
        var charStr = String.fromCharCode(charCode);
        console.log(charStr);

        // Keys 1 to 9 and 0, -, =
        if (charStr >= '1' && charStr <= '9') {
            selectOption(parseInt(charStr));
        } else if (charStr === '0') {
            selectOption(10);
        } else if (charStr === '-') {
            selectOption(11);
        } else if (charStr === '=') {
            selectOption(12);
        } else if (charStr === '[') { // Left arrow key
            goToPreviousQuestion();
        } else if (charStr === ']') { // Right arrow key
            goToNextQuestion();
        }
    };

    function selectOption(optionNumber) {
        // Select the option based on the optionNumber
        const optionIndex = optionNumber - 1;
        const options = document.querySelectorAll('.table-question .radio input[type="radio"]');
        console.log(optionIndex, options);

        if (options[optionIndex]) {
            options[optionIndex].click();
        }
    }

    function goToPreviousQuestion() {
        console.log("Go to Prev");

        // Click the previous question button
        const prevButton = document.querySelector('#navigation button[title="Предыдущий вопрос"]');
        if (prevButton && !prevButton.disabled) {
            prevButton.click();
        }
    }

    function goToNextQuestion() {
        console.log("Go to Next");

        // Click the next question button
        const nextButton = document.querySelector('#navigation button[title="Следующий вопрос"]');
        if (nextButton && !nextButton.disabled) {
            nextButton.click();
        }
    }
})();