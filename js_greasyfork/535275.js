// ==UserScript==
// @name         Mathspace Solver (Auto-fill Answers)
// @namespace    http://yourdomain.com/mathspace-solver/
// @version      3.0
// @description  Solves Mathspace problems and auto-fills the answer boxes
// @author       You
// @match        https://mathspace.co/*  // This matches all Mathspace pages
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/535275/Mathspace%20Solver%20%28Auto-fill%20Answers%29.user.js
// @updateURL https://update.greasyfork.org/scripts/535275/Mathspace%20Solver%20%28Auto-fill%20Answers%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Log to check if the script is running
    console.log('Mathspace Solver script loaded');

    // Include the math.js library for solving problems
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/mathjs/10.0.0/math.js';
    script.onload = () => {
        console.log('math.js library loaded');
    };
    document.body.appendChild(script);

    // Function to solve math problems
    function solveMathProblem(problem) {
        console.log(`Solving problem: ${problem}`);
        try {
            // Clean the problem text by removing non-essential words
            let cleanedProblem = problem.replace(/solve|simplify|evaluate|find/g, '').trim();
            console.log(`Cleaned Problem: ${cleanedProblem}`);

            // Solve equations (like 2x + 3 = 7)
            if (cleanedProblem.includes("=")) {
                let [lhs, rhs] = cleanedProblem.split("=");
                lhs = lhs.trim();
                rhs = rhs.trim();
                console.log(`LHS: ${lhs}, RHS: ${rhs}`);

                // Create an equation and solve it
                let equation = math.parse(lhs + '-' + rhs);  // Ensure it is in a solvable form
                let solution = math.solve(equation, 'x');  // Solve for x
                console.log(`Solution: ${solution[0]}`);
                return solution[0]; // Return the first solution
            } else {
                // Handle other types of problems like simplification
                let simplified = math.simplify(cleanedProblem);
                console.log(`Simplified: ${simplified}`);
                return simplified.toString();
            }
        } catch (e) {
            console.log(`Error solving the problem: ${e}`);
            return `Error: ${e}`;
        }
    }

    // Function to fill the Mathspace answer box
    function fillMathspaceAnswerBox(answer) {
        console.log('Attempting to fill answer box...');
        const answerBox = document.querySelector('input[type="text"], textarea');  // Assuming input boxes are <input> or <textarea>
        
        // Check if the answer box exists and fill it
        if (answerBox) {
            answerBox.value = answer;  // Fill the answer box with the solution
            answerBox.dispatchEvent(new Event('input'));  // Trigger input event to notify the page of the change
            console.log(`Filled the answer box with: ${answer}`);
        } else {
            console.log("Answer box not found.");
        }
    }

    // Function to detect and solve the problem
    function solveCurrentProblem() {
        console.log('Checking for problem text...');
        const problemText = document.querySelector('.problem-text');  // Find the problem text element (adjust class/ID)
        
        if (problemText) {
            const problem = problemText.innerText || problemText.textContent; // Get the problem text
            console.log(`Problem detected: ${problem}`);

            // Solve the problem
            const answer = solveMathProblem(problem);

            // Fill the answer box with the solution
            fillMathspaceAnswerBox(answer);
        } else {
            console.log("Problem text not found.");
        }
    }

    // Wait until Mathspace content is fully loaded before running the script
    window.addEventListener('load', function() {
        console.log('Page fully loaded, running the solver script...');
        setTimeout(solveCurrentProblem, 1000); // Add delay to ensure content is fully rendered
    });

})();
