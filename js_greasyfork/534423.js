// ==UserScript==
// @name         Sparx Maths Auto Solver
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Automatically solves Sparx Maths homework questions using WolframAlpha
// @author       Grok
// @match        https://www.sparxmaths.uk/student/homework
// @grant        GM_xmlhttpRequest
// @connect      api.wolframalpha.com
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/534423/Sparx%20Maths%20Auto%20Solver.user.js
// @updateURL https://update.greasyfork.org/scripts/534423/Sparx%20Maths%20Auto%20Solver.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Replace with your own WolframAlpha API key (you need to sign up for one)
    const WOLFRAM_API_KEY = "HE7YG7-8885673JP7";

    // Function to fetch solution from WolframAlpha
    function getMathSolution(question, callback) {
        const query = encodeURIComponent(question);
        const apiUrl = `https://api.wolframalpha.com/v2/query?input=${query}&format=plaintext&output=JSON&appid=${WOLFRAM_API_KEY}`;

        GM_xmlhttpRequest({
            method: "GET",
            url: apiUrl,
            onload: function(response) {
                try {
                    const data = JSON.parse(response.responseText);
                    if (data.queryresult.success) {
                        const answer = (data.queryresult.pods && data.queryresult.pods[1] && 
                                       data.queryresult.pods[1].subpods && 
                                       data.queryresult.pods[1].subpods[0] && 
                                       data.queryresult.pods[1].subpods[0].plaintext) || "No answer found";
                        callback(answer);
                    } else {
                        callback("WolframAlpha couldn't solve this.");
                    }
                } catch (error) {
                    callback("Error fetching the solution.");
                }
            },
            onerror: function() {
                callback("Network error while fetching solution.");
            }
        });
    }

    // Function to find and solve math questions
    function solveQuestions() {
        // Adjust selector based on Sparx Maths' current DOM structure
        const questions = document.querySelectorAll(".question-content, .question-text, [data-question-content]");
        
        if (questions.length === 0) {
            console.log("No questions found. Retrying in 3 seconds...");
            setTimeout(solveQuestions, 3000);
            return;
        }

        questions.forEach((questionElement, index) => {
            const questionText = questionElement.innerText.trim();
            if (!questionText) return;

            console.log(`Processing question ${index + 1}: ${questionText}`);

            getMathSolution(questionText, function(answer) {
                // Create a div to display the answer
                let answerDiv = questionElement.querySelector(".auto-answer");
                if (!answerDiv) {
                    answerDiv = document.createElement("div");
                    answerDiv.className = "auto-answer";
                    answerDiv.style.color = "green";
                    answerDiv.style.fontWeight = "bold";
                    answerDiv.style.marginTop = "10px";
                    questionElement.appendChild(answerDiv);
                }
                answerDiv.innerText = `Answer: ${answer}`;

                // Attempt to auto-fill the answer input (adjust selector as needed)
                const inputField = questionElement.closest(".question-container")?.querySelector("input[type='text'], textarea");
                if (inputField && answer !== "No answer found" && answer !== "WolframAlpha couldn't solve this." && answer !== "Error fetching the solution.") {
                    inputField.value = answer;
                    inputField.dispatchEvent(new Event("input", { bubbles: true }));
                    inputField.dispatchEvent(new Event("change", { bubbles: true }));
                }
            });
        });
    }

    // Wait for the page to load and start solving
    function init() {
        console.log("Sparx Maths Auto Solver initialized.");
        setTimeout(solveQuestions, 3000); // Adjust delay if needed
        // Re-run every 10 seconds to catch new questions
        setInterval(solveQuestions, 10000);
    }

    // Start the script
    init();
})();