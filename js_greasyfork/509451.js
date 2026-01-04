// ==UserScript==
// @name         Comprehensive Word Problem Calculator
// @namespace    http://tampermonkey.net/
// @version      4.5
// @description  A versatile word problem calculator that handles various equations and unknowns
// @author       Your Name
// @match        https://easybridge-dashboard-web.savvaseasybridge.com/dashboard/student?ssoLogin=true
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/509451/Comprehensive%20Word%20Problem%20Calculator.user.js
// @updateURL https://update.greasyfork.org/scripts/509451/Comprehensive%20Word%20Problem%20Calculator.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function wordProblemCalculator() {
        const problem = prompt("Enter a word problem (e.g., 'What number is 100 less than 765?'). You can also type 'div' for division:").toLowerCase();
        let result;

        // Normalize "div" to "divided by"
        const normalizedProblem = problem.replace(/\bdiv\b/g, 'divided by');

        // Handle "What number is X less than Y"
        if (problem.includes("what number is") && problem.includes("less than")) {
            const numbers = problem.match(/\d+/g);
            if (numbers && numbers.length >= 2) {
                const lessAmount = parseFloat(numbers[0]); // The amount to subtract
                const total = parseFloat(numbers[1]); // The number to subtract from
                result = total - lessAmount; // Perform the subtraction
            } else {
                alert("Could not find enough numbers.");
                return;
            }
        } 
        // Handle missing value (e.g., 10 + 30 = ?)
        else if (normalizedProblem.includes("=") || normalizedProblem.includes("?")) {
            const parts = normalizedProblem.split('=');
            const leftSide = parts[0].trim();
            const rightSide = parts[1] ? parts[1].trim() : '';

            // Check for unknown value on the left side
            if (rightSide === '?' || rightSide === '') {
                const matches = leftSide.match(/(\d+)\s*([-+x*/]|divided by)\s*(\d+)/);
                if (matches) {
                    const num1 = parseFloat(matches[1]);
                    const operation = matches[2];
                    const num2 = parseFloat(matches[3]);

                    switch (operation) {
                        case "+":
                            result = num1 + num2;
                            break;
                        case "-":
                            result = num1 - num2;
                            break;
                        case "x":
                        case "*":
                            result = num1 * num2;
                            break;
                        case "divided by":
                        case "/":
                            if (num2 !== 0) {
                                result = num1 / num2;
                            } else {
                                alert("Cannot divide by zero.");
                                return;
                            }
                            break;
                        default:
                            alert("Could not understand the operation.");
                            return;
                    }
                } else {
                    alert("Could not understand the equation.");
                    return;
                }
            }
            // Check for unknown value on the right side
            else if (leftSide.includes("?")) {
                const matches = rightSide.match(/(\d+)/);
                if (matches) {
                    const total = parseFloat(matches[1]);

                    const operation = leftSide.includes('+') ? '+'
                                    : leftSide.includes('-') ? '-'
                                    : leftSide.includes('*') ? '*'
                                    : leftSide.includes('/') ? '/'
                                    : leftSide.includes('divided by') ? 'divided by'
                                    : null;

                    const numMatches = leftSide.match(/(\d+)/g);
                    if (numMatches && numMatches.length === 2) {
                        const num1 = parseFloat(numMatches[0]);
                        const num2 = parseFloat(numMatches[1]);

                        switch (operation) {
                            case "+":
                                result = total - num1; // Solve for "?"
                                break;
                            case "-":
                                result = num1 - total; // Solve for "?"
                                break;
                            case "*":
                                result = total / num1; // Solve for "?"
                                break;
                            case "/":
                            case "divided by":
                                result = num1 * total; // Solve for "?"
                                break;
                            default:
                                alert("Could not understand the operation for unknown value.");
                                return;
                        }
                    }
                } else {
                    alert("Could not find enough numbers for the equation.");
                    return;
                }
            }
            else {
                alert("Could not understand the equation format.");
                return;
            }
        } 
        // Handle standard operations (basic arithmetic)
        else {
            const matches = normalizedProblem.match(/(\d+)\s*([-+x*/]|divided by)\s*(\d+)/);
            if (matches) {
                const num1 = parseFloat(matches[1]);
                const operation = matches[2];
                const num2 = parseFloat(matches[3]);

                switch (operation) {
                    case "+":
                        result = num1 + num2;
                        break;
                    case "-":
                        result = num1 - num2;
                        break;
                    case "x":
                    case "*":
                        result = num1 * num2;
                        break;
                    case "divided by":
                    case "/":
                        if (num2 !== 0) {
                            result = num1 / num2;
                        } else {
                            alert("Cannot divide by zero.");
                            return;
                        }
                        break;
                    default:
                        alert("Could not understand the operation.");
                        return;
                }
            } else {
                alert("Could not understand the word problem.");
                return;
            }
        }

        alert(`The result of the problem is: ${result}`);
    }

    // Run the calculator
    wordProblemCalculator();
})();
