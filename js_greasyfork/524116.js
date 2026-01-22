// ==UserScript==
// @name         Calculate Average Score URFU BRS
// @name:zh-CN   计算平均得分URFU BRS
// @namespace    https://gist.github.com/ve3xone/93ee59086618b9e3925bc4376f0feec0
// @version      2026-01-22-v1.09
// @description  Данный скрипт позволяет считать средний балл в БРС и также менять баллы чтоб посчитать приблизительно какой может быть ваш средний балл
// @description:zh-CN 该脚本允许您在 BRS 系统中计算平均分，并支持临时修改分数以预测您的最终平均成绩。
// @author       Vladislav Startsev (aka ve3xone)
// @match        https://istudent.urfu.ru/s/servis-informirovaniya-studenta-o-ballah-brs*
// @match        https://istudent.urfu.ru/s/http-urfu-ru-ru-students-study-brs*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=urfu.ru
// @grant        none
// @license      GNU-GPLV3
// @downloadURL https://update.greasyfork.org/scripts/524116/Calculate%20Average%20Score%20URFU%20BRS.user.js
// @updateURL https://update.greasyfork.org/scripts/524116/Calculate%20Average%20Score%20URFU%20BRS.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const originalScores = new Map();
    let includeHidden = false;

    // Function to modify discipline-header style
    function modifyDisciplineHeaderStyle() {
        const style = document.createElement('style');
        style.textContent = `
            .discipline-header {
                position: relative;
                width: 100%;
                display: flex;
                align-items: center;
                color: var(--color-dark-blue);
                border: solid 4px #d6d6d6 !important;
                border-radius: 1rem !important;
                font-size: 0.95rem !important;
                padding: 0rem 0em 0rem 0rem !important;
            }

            /* Медиа-запрос для мобильных устройств */
            @media (max-width: 450px) {
                .average-score-display {
                    display: block !important;
                    margin-left: 0 !important;
                    margin-top: 10px !important;
                    width: 100% !important;
                    text-align: center !important;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // Make scores editable
    function makeScoresEditable() {
        const disciplineContainer = document.querySelector("#disciplines");
        if (!disciplineContainer) {
            console.log("No disciplines found.");
            return;
        }

        const disciplineElements = disciplineContainer.querySelectorAll(".discipline-outer-container:not(.hidden) .discipline");

        disciplineElements.forEach((element) => {
            const scoreElement = element.querySelector(".td-1");
            const disciplineId = element.getAttribute("data-id");

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
                // scoreElement.style.padding = "2px 4px";
                scoreElement.style.minWidth = "50px";
                scoreElement.style.display = "inline-block";

                // Prevent event bubbling when clicking on the score element
                scoreElement.addEventListener("click", (e) => {
                    e.stopPropagation();
                    e.stopImmediatePropagation();
                }, true);

                scoreElement.addEventListener("mousedown", (e) => {
                    e.stopPropagation();
                    e.stopImmediatePropagation();
                }, true);

                scoreElement.addEventListener("touchstart", (e) => {
                    e.stopPropagation();
                    e.stopImmediatePropagation();
                }, true);

                scoreElement.addEventListener("input", () => {
                    scoreElement.style.color = "blue";
                    localStorage.setItem(`score_${disciplineId}`, scoreElement.textContent.trim());
                    updateAverageScore();
                });

                // Prevent Enter key from creating new line
                scoreElement.addEventListener("keydown", (e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        scoreElement.blur();
                    }
                });

                // Add focus/blur events for better UX
                scoreElement.addEventListener("focus", (e) => {
                    e.stopPropagation();
                    scoreElement.style.backgroundColor = "#fff";
                    scoreElement.style.border = "1px solid #007bff";
                });

                scoreElement.addEventListener("blur", () => {
                    scoreElement.style.backgroundColor = "#f9f9f9";
                    scoreElement.style.border = "1px dashed #000";

                    // Validate input on blur
                    const value = parseFloat(scoreElement.textContent.trim());
                    if (isNaN(value) || value < 0 || value > 100) {
                        scoreElement.textContent = originalScores.get(scoreElement) || "0.00";
                        scoreElement.style.color = "red";
                        setTimeout(() => {
                            if (scoreElement.style.color === "red") {
                                scoreElement.style.color = "blue";
                            }
                        }, 1000);
                    }
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
            ? ".discipline-outer-container .discipline"
            : ".discipline-outer-container:not(.hidden) .discipline");

        let totalScore = 0;
        let count = 0;

        disciplineElements.forEach((element) => {
            const scoreElement = element.querySelector(".td-1");
            if (scoreElement) {
                const scoreText = scoreElement.textContent.trim();
                const score = parseFloat(scoreText);

                // Include only valid numerical scores
                if (!isNaN(score)) {
                    totalScore += score;
                    count++;
                }
            }
        });

        return count > 0 ? totalScore / count : 0;
    }

    // Function to update average score display with responsive check
    function updateAverageScoreDisplay() {
        const averageScore = calculateAverage();
        const professionElement = document.querySelector(".education-service-info");

        if (professionElement) {
            let averageDisplay = professionElement.querySelector(".average-score-display");

            if (!averageDisplay) {
                averageDisplay = document.createElement("span");
                averageDisplay.className = "average-score-display";
                averageDisplay.style.marginLeft = "20px";
                averageDisplay.style.fontWeight = "bold";
                averageDisplay.style.color = "#007bff";
                averageDisplay.style.fontSize = "16px";
                professionElement.appendChild(averageDisplay);
            }

            averageDisplay.textContent = `Средний балл: ${averageScore.toFixed(2)}`;

            // Apply responsive styles immediately
            applyResponsiveStyles();
        }
    }

    // Function to apply responsive styles based on screen width
    function applyResponsiveStyles() {
        const averageDisplay = document.querySelector(".average-score-display");
        if (!averageDisplay) return;

        if (window.innerWidth <= 450) {
            // Mobile styles
            averageDisplay.style.display = "block";
            averageDisplay.style.marginLeft = "0";
            averageDisplay.style.marginTop = "10px";
            averageDisplay.style.width = "100%";
            averageDisplay.style.textAlign = "center";
        } else {
            // Desktop styles
            averageDisplay.style.display = "inline";
            averageDisplay.style.marginLeft = "20px";
            averageDisplay.style.marginTop = "";
            averageDisplay.style.width = "";
            averageDisplay.style.textAlign = "";
        }
    }

    // Update the average score
    function updateAverageScore() {
        updateAverageScoreDisplay();
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
            element.style.color = "";
        });

        // Clear local storage
        const keysToRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith('score_')) {
                keysToRemove.push(key);
            }
        }
        keysToRemove.forEach(key => localStorage.removeItem(key));

        updateAverageScore();

        console.log("Сброс выполнен.");
        alert("Все изменения сброшены.");
    }

    // Add controls to the page
    function addControls() {
        // Add checkbox for including hidden disciplines
        const selectionBlock = document.querySelector(".selection-block");

        if (selectionBlock) {
            const controlContainer = document.createElement("div");
            controlContainer.style.marginTop = "15px";
            controlContainer.style.padding = "10px";
            controlContainer.style.backgroundColor = "#f8f9fa";
            controlContainer.style.borderRadius = "5px";
            controlContainer.style.border = "1px solid #dee2e6";

            const toggleLabel = document.createElement("label");
            toggleLabel.style.marginRight = "10px";
            toggleLabel.style.cursor = "pointer";

            const toggleCheckbox = document.createElement("input");
            toggleCheckbox.type = "checkbox";
            toggleCheckbox.style.marginRight = "5px";
            toggleCheckbox.style.cursor = "pointer";
            toggleCheckbox.addEventListener("change", toggleHiddenDisciplines);

            toggleLabel.appendChild(toggleCheckbox);
            toggleLabel.appendChild(document.createTextNode("Включать скрытые дисциплины"));

            controlContainer.appendChild(toggleLabel);
            selectionBlock.appendChild(controlContainer);
        }

        // Add reset button
        const resetButton = document.createElement("button");
        resetButton.textContent = "Сбросить изменения баллов";
        resetButton.style = `
            position: fixed;
            right: 20px;
            bottom: 20px;
            padding: 10px 20px;
            background-color: #dc3545;
            color: #fff;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            z-index: 1000;
            font-size: 14px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        `;
        resetButton.addEventListener("mouseover", () => {
            resetButton.style.backgroundColor = "#c82333";
        });
        resetButton.addEventListener("mouseout", () => {
            resetButton.style.backgroundColor = "#dc3545";
        });
        resetButton.addEventListener("click", resetScores);
        document.body.appendChild(resetButton);
    }

    // Initialize the script
    function init() {
        // Modify discipline header style first
        modifyDisciplineHeaderStyle();

        // Add resize listener for responsive design
        window.addEventListener('resize', applyResponsiveStyles);

        // Wait for page to load completely
        setTimeout(() => {
            makeScoresEditable();
            addControls();
            updateAverageScore();

            // Re-run when filters change
            const hideNotSelected = document.querySelector("#hide-not-selected");
            const hideNotActual = document.querySelector("#hide-not-actual");

            if (hideNotSelected) {
                hideNotSelected.addEventListener("change", () => {
                    setTimeout(() => {
                        makeScoresEditable();
                        updateAverageScore();
                    }, 100);
                });
            }

            if (hideNotActual) {
                hideNotActual.addEventListener("change", () => {
                    setTimeout(() => {
                        makeScoresEditable();
                        updateAverageScore();
                    }, 100);
                });
            }

            // Re-run when semester/year changes
            const linkSelects = document.querySelectorAll(".link-select");
            linkSelects.forEach(select => {
                select.addEventListener("change", () => {
                    setTimeout(() => {
                        originalScores.clear();
                        makeScoresEditable();
                        addControls();
                        updateAverageScore();
                    }, 500);
                });
            });
        }, 1000);
    }

    // Start the script
    init();
})();