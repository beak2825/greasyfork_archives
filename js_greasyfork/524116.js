// ==UserScript==
// @name         Calculate Average Score
// @namespace    https://gist.github.com/ve3xone/93ee59086618b9e3925bc4376f0feec0
// @version      2025-01-17-v1.02
// @description  Данный скрипт позволяет считать средний балл в БРС и также менять баллы чтоб посчитать приблизительно какой может быть ваш средний балл
// @author       Vladislav Startsev (aka ve3xone)
// @match        https://istudent.urfu.ru/s/servis-informirovaniya-studenta-o-ballah-brs*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=urfu.ru
// @grant        none
// @license      GNU-GPLV3
// @downloadURL https://update.greasyfork.org/scripts/524116/Calculate%20Average%20Score.user.js
// @updateURL https://update.greasyfork.org/scripts/524116/Calculate%20Average%20Score.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const originalScores = new Map();
    let includeHidden = false;

    // Make scores editable
    function makeScoresEditable() {
        const disciplineContainer = document.querySelector("#disciplines");
        if (!disciplineContainer) {
            console.log("No disciplines found.");
            return;
        }

        const disciplineElements = disciplineContainer.querySelectorAll(".rating-discipline-outer-container");

        disciplineElements.forEach((element) => {
            const scoreElement = element.querySelector(".td-1");
            const disciplineId = element.querySelector(".rating-discipline")?.getAttribute("data-discipline-id");

            if (scoreElement && disciplineId) {
                const scoreText = scoreElement.textContent.trim();

                // Load saved score if available
                const savedScore = localStorage.getItem(`score_${disciplineId}`);
                if (savedScore) {
                    scoreElement.textContent = savedScore;
                    scoreElement.style.color = "blue";
                }

                // Save the original score
                if (!originalScores.has(scoreElement)) {
                    originalScores.set(scoreElement, scoreText);
                }

                // Make the score editable
                scoreElement.contentEditable = true;
                scoreElement.style.border = "1px dashed #000";
                scoreElement.style.backgroundColor = "#f9f9f9";
                scoreElement.addEventListener("input", () => {
                    scoreElement.style.color = "blue"; // Highlight changed scores
                    localStorage.setItem(`score_${disciplineId}`, scoreElement.textContent.trim()); // Save score locally with discipline ID
                    updateAverageScore(); // Recalculate average on change
                });
            }
        });
    }

    // Calculate the average score
    function calculateAverage() {
        const disciplineContainer = document.querySelector("#disciplines");
        if (!disciplineContainer) {
            console.log("No disciplines found.");
            return 0;
        }

        const disciplineElements = disciplineContainer.querySelectorAll(includeHidden
            ? ".rating-discipline-outer-container"
            : ".rating-discipline-outer-container:not(.hidden)");

        let totalScore = 0;
        let count = 0;

        disciplineElements.forEach((element) => {
            const scoreElement = element.querySelector(".td-1");
            if (scoreElement) {
                const scoreText = scoreElement.textContent.trim();
                const score = parseFloat(scoreText);

                // Include only valid numerical scores
                // && score > 0
                if (!isNaN(score) ) {
                    totalScore += score;
                    count++;
                }
            }
        });

        return count > 0 ? totalScore / count : 0;
    }

    // Update the average score display
    function updateAverageScore() {
        const averageScore = calculateAverage();
        const professionElement = document.querySelector(".education-service-info");

        if (professionElement) {
            let averageDisplay = professionElement.querySelector(".average-score-display");

            if (!averageDisplay) {
                averageDisplay = document.createElement("span");
                averageDisplay.className = "average-score-display";
                averageDisplay.style.marginLeft = "10px";
                averageDisplay.style.fontWeight = "bold";
                professionElement.appendChild(averageDisplay);
            }

            averageDisplay.textContent = `Средний балл: ${averageScore.toFixed(2)}`;
        }
    }

    // Toggle hidden disciplines
    function toggleHiddenDisciplines() {
        includeHidden = !includeHidden;
        updateAverageScore();
    }

    // Reset scores to their original values
    function resetScores() {
        originalScores.forEach((originalValue, element) => {
            element.textContent = originalValue;
            element.style.color = ""; // Remove highlight
        });

        // Clear local storage
        localStorage.clear();

        updateAverageScore();

        console.log("Сброс выполнен.");
        alert("Все изменения сброшены.");
    }

    // Add controls to the page
    function addControls() {
        const professionElement = document.querySelector(".education-service-info");

        if (professionElement) {
            const toggleCheckbox = document.createElement("input");
            toggleCheckbox.type = "checkbox";
            toggleCheckbox.style.marginLeft = "10px";
            toggleCheckbox.addEventListener("change", toggleHiddenDisciplines);

            const label = document.createElement("label");
            label.textContent = "Включать скрытые дисциплины";
            label.style.marginLeft = "5px";
            label.style.fontSize = "14px";
            label.appendChild(toggleCheckbox);

            professionElement.appendChild(label);
        }

        const resetButton = document.createElement("button");
        resetButton.textContent = "Сбросить изменения";
        resetButton.style = buttonStyle();
        resetButton.style.bottom = "10px";
        resetButton.addEventListener("click", resetScores);
        document.body.appendChild(resetButton);
    }

    // Button style function
    function buttonStyle() {
        return `
            position: fixed;
            right: 10px;
            padding: 10px 20px;
            background-color: #007bff;
            color: #fff;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            z-index: 1000;
        `;
    }

    // Initialize the script
    function init() {
        makeScoresEditable();
        addControls();
        updateAverageScore(); // Update average score on page load
    }

    init();
})();