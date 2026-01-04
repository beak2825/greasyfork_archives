// ==UserScript==
// @name         Mathspace Auto Solver
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Extracts Mathspace questions and calculates answers
// @author       You
// @match        *://*.mathspace.co/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/526754/Mathspace%20Auto%20Solver.user.js
// @updateURL https://update.greasyfork.org/scripts/526754/Mathspace%20Auto%20Solver.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function getQuestionText() {
        // Try to find the question text inside the page
        let questionElement = document.querySelector('.css-1cs14ul'); // Change this if the selector is different
        if (questionElement) {
            return questionElement.innerText.trim();
        }
        return null;
    }

    function solveMathQuestion(question) {
        try {
            // Replace symbols (if necessary) to ensure JavaScript can evaluate it
            let formattedQuestion = question.replace(/×/g, '*').replace(/÷/g, '/');

            // Use JavaScript's eval() function to calculate the answer
            let answer = eval(formattedQuestion);
            return answer;
        } catch (error) {
            console.error("Error calculating the answer:", error);
            return "Error";
        }
    }

    function displayAnswer() {
        let questionText = getQuestionText();

        if (questionText) {
            let answer = solveMathQuestion(questionText);
            alert("Correct Answer: " + answer);
            console.log("Correct Answer:", answer);
        } else {
            console.log("Could not find the question.");
        }
    }

    // Run the script after a delay to ensure content is loaded
    setTimeout(displayAnswer, 3000);
})();


