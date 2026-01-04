// ==UserScript==
// @name         Mathspace Auto Solver (Debug Version)
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Fetches and displays correct answers in Mathspace (Debugging Enabled)
// @author       You
// @match        *://*.mathspace.co/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/526738/Mathspace%20Auto%20Solver%20%28Debug%20Version%29.user.js
// @updateURL https://update.greasyfork.org/scripts/526738/Mathspace%20Auto%20Solver%20%28Debug%20Version%29.meta.js
// ==/UserScript==

var MathspaceSolver = {};

MathspaceSolver.getAnswers = function() {
    console.log("MathspaceSolver: Searching for questions...");

    // Observe the page for questions
    Sahin.observeElements("div, span, p", function(elements) {
        elements.forEach(element => {
            let text = element.innerText.trim();
            if (!text) return;

            console.log("Found Potential Question:", text);

            // Simulated fetching answer
            MathspaceSolver.fetchAnswer(text, function(answer) {
                if (answer) {
                    MathspaceSolver.displayAnswer(element, answer);
                }
            });
        });
    });
};

MathspaceSolver.fetchAnswer = function(question, callback) {
    let fakeAnswer = "42"; // Placeholder answer
    console.log(`Fetching answer for: "${question}" → ${fakeAnswer}`);
    callback(fakeAnswer);
};

MathspaceSolver.displayAnswer = function(element, answer) {
    if (element.querySelector(".mathspace-answer-box")) return;

    let answerBox = document.createElement("div");
    answerBox.className = "mathspace-answer-box";
    answerBox.style.background = "#fffa65";
    answerBox.style.border = "2px solid #f39c12";
    answerBox.style.padding = "10px";
    answerBox.style.marginTop = "10px";
    answerBox.style.fontSize = "18px";
    answerBox.style.fontWeight = "bold";
    answerBox.style.color = "#333";
    answerBox.innerText = `Answer: ${answer}`;

    element.appendChild(answerBox);
    console.log("Displayed Answer:", answer);
};

// Start script
MathspaceSolver.getAnswers();

Sahin.injectFunctionsToPage(MathspaceSolver);


