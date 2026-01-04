// ==UserScript==
// @name         Mathletics Auto Math Solver
// @namespace    / http://tampermonkey.net
// @version      5.1
// @description  Automatically solves Mathletics math problems when "A" is pressed (supports addition, subtraction, multiplication, and missing values).
// @author       nukerboss
// @match        https://*.mathletics.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/518584/Mathletics%20Auto%20Math%20Solver.user.js
// @updateURL https://update.greasyfork.org/scripts/518584/Mathletics%20Auto%20Math%20Solver.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to solve the equation (addition, subtraction, multiplication, and missing values)
    function solveEquation() {
        // Wait for the question text to be visible
        const questionElement = document.getElementsByClassName('questions-text-alignment whiteTextWithShadow question-size-v4')[0];
        
        if (!questionElement) {
            console.log("Math problem element not found!");
            return;
        }
        
        // Get the equation text
        let equation = questionElement.innerText.trim();
        console.log("Detected equation:", equation);  // For debugging

        let result;

        // Check if the equation is in the format: "X +  = Y"
        if (equation.includes("=")) {
            let parts = equation.split('=');
            let leftPart = parts[0].trim();
            let rightSide = parseInt(parts[1].trim());

            // Check for addition, subtraction, or multiplication with missing value
            if (leftPart.includes("+")) {
                let numbers = leftPart.split("+");
                let leftNumber = parseInt(numbers[0].trim());

                // If right side of the equation is missing, calculate the missing value
                result = rightSide - leftNumber;
            } 
            else if (leftPart.includes("-")) {
                let numbers = leftPart.split("-");
                let leftNumber = parseInt(numbers[0].trim());

                // If right side of the equation is missing, calculate the missing value
                result = leftNumber - rightSide;
            }
            else if (leftPart.includes("×")) {
                let numbers = leftPart.split("×");
                let leftNumber = parseInt(numbers[0].trim());

                // If right side of the equation is missing, calculate the missing value
                result = rightSide / leftNumber;
            }
        } else {
            console.log("Equation format not recognized.");
        }

        if (result !== undefined) {
            console.log("Calculated result:", result);  // For debugging
            // Enter the result into the answer box
            document.getElementsByClassName("questions-input-adjustment questions-input-width-v3")[0].value = result;
        }
    }

    // Event listener for the "A" key to solve the equation
    window.addEventListener("keydown", function(e) {
        if (e.key === "A" || e.key === "a") {
            solveEquation();
        }
    });
})();
