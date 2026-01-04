// ==UserScript==
// @name         Mathspace Tutor Box
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  Adds a tutor box to Mathspace with a number-only calculator UI (no functionality yet)
// @author       Your Name
// @match        *://*.mathspace.co/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/526854/Mathspace%20Tutor%20Box.user.js
// @updateURL https://update.greasyfork.org/scripts/526854/Mathspace%20Tutor%20Box.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function createTutorBox() {
        // Remove existing box if it already exists
        let existingBox = document.getElementById("mathspace-tutor");
        if (existingBox) existingBox.remove();

        // Create the floating box
        let tutorBox = document.createElement("div");
        tutorBox.id = "mathspace-tutor";
        tutorBox.style.position = "fixed";
        tutorBox.style.bottom = "20px";
        tutorBox.style.right = "20px";
        tutorBox.style.background = "#0073e6";
        tutorBox.style.color = "white";
        tutorBox.style.padding = "15px";
        tutorBox.style.borderRadius = "8px";
        tutorBox.style.boxShadow = "0px 0px 10px rgba(0,0,0,0.2)";
        tutorBox.style.cursor = "pointer";
        tutorBox.style.zIndex = "1000";
        tutorBox.style.fontSize = "16px";
        tutorBox.style.fontWeight = "bold";
        tutorBox.innerText = "Mathematical Tutor";

        // Add click event
        tutorBox.addEventListener("click", function() {
            tutorBox.innerText = "Analysing...";
            setTimeout(() => {
                tutorBox.innerText = "Analysing the Question...";
                setTimeout(() => {
                    tutorBox.innerText = "Fetching tools...";
                    setTimeout(() => {
                        tutorBox.innerText = "IF YOU WANT TO WRITE THE QUESTION, PLEASE HOLD AND THEN WRITE...";
                        setTimeout(() => {
                            tutorBox.innerText = "Did you know the creator was a 13-year-old kid?";
                            setTimeout(() => {
                                captureProblem(tutorBox); // Move to the next step
                            }, 2000);
                        }, 2000);
                    }, 2000);
                }, 2000);
            }, 2000);
        });

        // Add to the page
        document.body.appendChild(tutorBox);
    }

    function captureProblem(tutorBox) {
        let problemText = getMathProblem();

        // If problem isn't found, immediately ask for manual input
        if (problemText === "Problem not found!") {
            manualProblemInput(tutorBox);
            return;
        }

        // Otherwise, ask if the detected problem is correct
        tutorBox.style.width = "350px";
        tutorBox.style.height = "auto";
        tutorBox.style.padding = "20px";
        tutorBox.innerHTML = `
            <b>Is this the correct problem?</b><br><br>
            <i>${problemText}</i><br><br>
            <button id="confirmProblem" style="margin-right: 10px; background: green; color: white; padding: 5px; border: none; cursor: pointer;">Yes, it is right</button>
            <button id="editProblem" style="background: red; color: white; padding: 5px; border: none; cursor: pointer;">No, let me type it in</button>
            <div id="manualInput" style="margin-top: 10px; display: none;">
                <input type="text" id="manualProblem" style="width: 90%;" placeholder="Type the problem here...">
                <button id="submitProblem" style="background: blue; color: white; padding: 5px; border: none; cursor: pointer;">Submit</button>
            </div>
        `;

        document.getElementById("confirmProblem").addEventListener("click", () => {
            showLoadingScreen(tutorBox);
        });

        document.getElementById("editProblem").addEventListener("click", () => {
            document.getElementById("manualInput").style.display = "block";
        });

        document.getElementById("submitProblem").addEventListener("click", () => {
            let userInput = document.getElementById("manualProblem").value;
            if (userInput.trim() === "") return; // Prevent empty input

            tutorBox.innerHTML = `<b>Question received:</b> <br><br> <i>${userInput}</i>`;
            setTimeout(() => {
                showLoadingScreen(tutorBox);
            }, 2000);
        });
    }

    function manualProblemInput(tutorBox) {
        tutorBox.style.width = "350px";
        tutorBox.style.height = "auto";
        tutorBox.style.padding = "20px";
        tutorBox.innerHTML = `
            <b>Type the problem:</b><br><br>
            <input type="text" id="manualProblem" style="width: 90%;" placeholder="Type the problem here...">
            <button id="submitProblem" style="background: blue; color: white; padding: 5px; border: none; cursor: pointer;">Submit</button>
        `;

        document.getElementById("submitProblem").addEventListener("click", () => {
            let userInput = document.getElementById("manualProblem").value;
            if (userInput.trim() === "") return; // Prevent empty input

            tutorBox.innerHTML = `<b>Question received:</b> <br><br> <i>${userInput}</i>`;
            setTimeout(() => {
                showLoadingScreen(tutorBox);
            }, 2000);
        });
    }

    function showLoadingScreen(tutorBox) {
        tutorBox.innerText = "Loading and wait for your math tutor to destroy those fails and get more A's";
        setTimeout(() => {
            showNumberButtons(tutorBox);
        }, 3000);
    }

    function showNumberButtons(tutorBox) {
        tutorBox.innerHTML = `
            <b>Number Selection</b><br><br>
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 5px;">
                <button class="numBtn">1</button>
                <button class="numBtn">2</button>
                <button class="numBtn">3</button>
                <button class="numBtn">4</button>
                <button class="numBtn">5</button>
                <button class="numBtn">6</button>
                <button class="numBtn">7</button>
                <button class="numBtn">8</button>
                <button class="numBtn">9</button>
                <button class="numBtn">0</button>
            </div>
        `;

        // Buttons do nothing for now
        document.querySelectorAll(".numBtn").forEach(button => {
            button.addEventListener("click", () => {
                console.log("Number pressed: " + button.innerText);
            });
        });
    }

    function getMathProblem() {
        let problemElement = document.querySelector('[data-testid="question-content"]'); // Change this selector if needed
        return problemElement ? problemElement.innerText.trim() : "Problem not found!";
    }

    // Ensure the script runs when the page is fully loaded
    window.addEventListener("load", createTutorBox);
})();


