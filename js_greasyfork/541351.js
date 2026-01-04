// ==UserScript==
// @name         satcls Auto-Retriever
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Displays the correct answer in the bottom-left corner.
// @author       KHROTU
// @match        https://satcls.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=satcls.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/541351/satcls%20Auto-Retriever.user.js
// @updateURL https://update.greasyfork.org/scripts/541351/satcls%20Auto-Retriever.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const displayElementId = 'satcls-answer-display-v6';
    function createAnswerDisplay() {
        let displayDiv = document.createElement('div');
        displayDiv.id = displayElementId;
        displayDiv.style.position = 'fixed';
        displayDiv.style.bottom = '10px';
        displayDiv.style.left = '10px';
        displayDiv.style.zIndex = '99999';
        displayDiv.style.backgroundColor = 'transparent';
        displayDiv.style.border = 'none';
        displayDiv.style.padding = '2px 8px';
        displayDiv.style.color = '#e9e9e9';
        displayDiv.style.fontSize = '14px';
        displayDiv.style.fontFamily = 'monospace';
        displayDiv.style.pointerEvents = 'none';
        document.body.appendChild(displayDiv);
        return displayDiv;
    }

    function retrieveAndShowAnswer() {
        try {
            const dataString = localStorage.getItem('step');
            if (!dataString) return;
            const data = JSON.parse(dataString);
            const moduleKey = data.step;
            const questionIndex = data.questionIndex;
            if (!moduleKey || typeof questionIndex === 'undefined' || !data[moduleKey]) return;
            const currentQuestion = data[moduleKey][questionIndex];
            if (!currentQuestion || !currentQuestion.validity) return;
            const correctAnswer = currentQuestion.validity;
            let displayDiv = document.getElementById(displayElementId);
            if (!displayDiv) {
                displayDiv = createAnswerDisplay();
            }
            if (displayDiv.textContent !== correctAnswer) {
                displayDiv.textContent = correctAnswer;
            }
            displayDiv.style.display = 'block';
        } catch (error) {
            let displayDiv = document.getElementById(displayElementId);
            if (displayDiv) displayDiv.style.display = 'none';
        }
    }
    setInterval(retrieveAndShowAnswer, 500);
    retrieveAndShowAnswer();
})();