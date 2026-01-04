// ==UserScript==
// @name         Mathspace Auto Solver
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Automatically solves Mathspace questions and displays answers for user selection.
// @author       You
// @match        *://*.mathspace.co/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/526758/Mathspace%20Auto%20Solver.user.js
// @updateURL https://update.greasyfork.org/scripts/526758/Mathspace%20Auto%20Solver.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var MathspaceSolver = {};

    // Function to observe and extract the question
    MathspaceSolver.extractQuestion = function() {
        let questionElement = Sahin.waitForElement(".question-text", (element) => {
            let questionText = element.innerText.trim();
            console.log("Detected Question:", questionText);
            MathspaceSolver.repeatQuestion(questionText);
        });
    };

    // Function to repeat the question in the answer box
    MathspaceSolver.repeatQuestion = function(question) {
        let answerBox = Sahin.waitForElement(".answer-input", (element) => {
            element.value = question;
            console.log("Repeated Question in Answer Box.");
            MathspaceSolver.solveQuestion(question);
        });
    };

    // Function to solve the question (basic arithmetic operations)
    MathspaceSolver.solveQuestion = function(question) {
        try {
            let sanitizedQuestion = question.replace(/[^0-9+\-*/().]/g, ""); // Remove unwanted characters
            let answer = eval(sanitizedQuestion); // Solve the expression
            console.log("Solved Answer:", answer);
            MathspaceSolver.displayAnswer(answer);
        } catch (error) {
            console.log("Error solving the question:", error);
        }
    };

    // Function to display the answer for user selection
    MathspaceSolver.displayAnswer = function(answer) {
        let answerContainer = Sahin.waitForElement(".answer-options", (element) => {
            let options = element.querySelectorAll(".option");
            options.forEach(option => {
                if (option.innerText.trim() == answer.toString()) {
                    option.style.backgroundColor = "lightgreen"; // Highlight the correct answer
                }
            });
            console.log("Highlighted Correct Answer.");
        });
    };

    // Start the script
    MathspaceSolver.init = function() {
        console.log("Mathspace Auto Solver Started...");
        MathspaceSolver.extractQuestion();
    };

    Sahin.injectFunctionsToPage(MathspaceSolver);
})();


