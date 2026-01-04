// ==UserScript==
// @name         MathsSpace AI Solver
// @namespace    http://mathsspace.co/
// @version      1.0
// @description  Uses AI to solve math problems on MathsSpace.co and display step-by-step solutions.
// @author       CodeCopilot
// @match        *://*.mathsspace.co/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/526759/MathsSpace%20AI%20Solver.user.js
// @updateURL https://update.greasyfork.org/scripts/526759/MathsSpace%20AI%20Solver.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const OPENAI_API_KEY = "YOUR_OPENAI_API_KEY"; // Replace with your API key

    console.log("[MathsSpace AI Solver] Script Loaded ✅");

    function findMathQuestions() {
        let questionNodes = document.querySelectorAll("p, span, div");
        let mathPattern = /(solve|calculate|what is|find the value of)\s*([\d+\-*/().^%]+)/i;

        questionNodes.forEach(node => {
            let text = node.innerText.trim();
            let match = text.match(mathPattern);

            if (match) {
                let expression = match[2];
                solveWithAI(expression, node);
            }
        });
    }

    async function solveWithAI(expression, questionNode) {
        if (questionNode.querySelector(".math-answer")) return; // Prevent duplicate answers

        let answerBox = document.createElement("div");
        answerBox.className = "math-answer";
        answerBox.style.background = "#2196F3";
        answerBox.style.color = "#fff";
        answerBox.style.padding = "8px";
        answerBox.style.marginTop = "5px";
        answerBox.style.borderRadius = "5px";
        answerBox.style.fontWeight = "bold";
        answerBox.innerText = "Solving...";

        questionNode.appendChild(answerBox);

        let response = await fetch("https://api.openai.com/v1/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-4",
                prompt: `Solve this math problem step-by-step: ${expression}`,
                max_tokens: 100,
                temperature: 0
            })
        });

        let data = await response.json();
        let solution = data.choices[0].text.trim();

        answerBox.innerText = "Solution: " + solution;
    }

    function observeChanges() {
        let observer = new MutationObserver(() => findMathQuestions());
        observer.observe(document.body, { childList: true, subtree: true });
        console.log("[MathsSpace AI Solver] Watching for changes...");
    }

    findMathQuestions();
    observeChanges();
})();


