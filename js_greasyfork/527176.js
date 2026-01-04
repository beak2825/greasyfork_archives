// ==UserScript==
// @name         MathSpace TutorMM
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Interactive Math Learning Platform for Kids
// @match        https://yourlearningplatform.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/527176/MathSpace%20TutorMM.user.js
// @updateURL https://update.greasyfork.org/scripts/527176/MathSpace%20TutorMM.meta.js
// ==/UserScript==

(function() {
    'use strict';

    class MathSpaceTutor {
        constructor() {
            this.score = 0;
            this.totalQuestions = 0;
            this.difficulty = 'easy';
        }

        generateProblem() {
            const difficulties = {
                'easy': { min: 1, max: 10 },
                'medium': { min: 1, max: 50 },
                'hard': { min: 1, max: 100 }
            };

            const { min, max } = difficulties[this.difficulty];
            const num1 = Math.floor(Math.random() * (max - min + 1)) + min;
            const num2 = Math.floor(Math.random() * (max - min + 1)) + min;
            const operations = ['+', '-', '*'];
            const operation = operations[Math.floor(Math.random() * operations.length)];

            let problem, correctAnswer;
            switch(operation) {
                case '+':
                    problem = `${num1} + ${num2}`;
                    correctAnswer = num1 + num2;
                    break;
                case '-':
                    problem = `${num1} - ${num2}`;
                    correctAnswer = num1 - num2;
                    break;
                case '*':
                    problem = `${num1} * ${num2}`;
                    correctAnswer = num1 * num2;
                    break;
            }

            return { problem, correctAnswer };
        }

        createUI() {
            // Create main container
            const container = document.createElement('div');
            container.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                width: 300px;
                background-color: #f0f0f0;
                border: 2px solid #333;
                padding: 15px;
                z-index: 1000;
                font-family: Arial, sans-serif;
            `;

            // Problem display
            const problemDisplay = document.createElement('div');
            problemDisplay.id = 'problem-display';
            problemDisplay.style.fontSize = '24px';
            problemDisplay.style.marginBottom = '15px';

            // Answer input
            const answerInput = document.createElement('input');
            answerInput.type = 'number';
            answerInput.id = 'answer-input';
            answerInput.style.width = '100%';
            answerInput.style.padding = '10px';
            answerInput.style.marginBottom = '10px';

            // Submit button
            const submitButton = document.createElement('button');
            submitButton.textContent = 'Check Answer';
            submitButton.style.width = '100%';
            submitButton.style.padding = '10px';

            // Score display
            const scoreDisplay = document.createElement('div');
            scoreDisplay.id = 'score-display';

            // Append elements
            container.appendChild(problemDisplay);
            container.appendChild(answerInput);
            container.appendChild(submitButton);
            container.appendChild(scoreDisplay);
            document.body.appendChild(container);

            return {
                problemDisplay,
                answerInput,
                submitButton,
                scoreDisplay
            };
        }

        startGame() {
            const ui = this.createUI();
            this.nextProblem(ui);

            ui.submitButton.addEventListener('click', () => {
                this.checkAnswer(ui);
            });
        }

        nextProblem(ui) {
            const { problem, correctAnswer } = this.generateProblem();
            ui.problemDisplay.textContent = problem;
            ui.answerInput.value = '';
            ui.answerInput.focus();
            ui.submitButton.dataset.correctAnswer = correctAnswer;
        }

        checkAnswer(ui) {
            const userAnswer = parseInt(ui.answerInput.value);
            const correctAnswer = parseInt(ui.submitButton.dataset.correctAnswer);

            this.totalQuestions++;

            if (userAnswer === correctAnswer) {
                this.score++;
                ui.scoreDisplay.textContent = `Score: ${this.score}/${this.totalQuestions}`;
                this.nextProblem(ui);
            } else {
                ui.problemDisplay.textContent = `Wrong! Correct answer was ${correctAnswer}`;
                setTimeout(() => this.nextProblem(ui), 1500);
            }
        }
    }

    // Initialize the game when page loads
    window.addEventListener('load', () => {
        const tutor = new MathSpaceTutor();
        tutor.startGame();
    });
})();

