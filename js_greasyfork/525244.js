// ==UserScript==
// @name         Spark Maths Auto Solver
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Solves Spark Maths questions using WolframAlpha
// @author       Your Name
// @match        *://*.sparkmaths.com/*  // Adjust if needed
// @grant        GM_xmlhttpRequest
// @connect      api.wolframalpha.com
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/525244/Spark%20Maths%20Auto%20Solver.user.js
// @updateURL https://update.greasyfork.org/scripts/525244/Spark%20Maths%20Auto%20Solver.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const WOLFRAM_API_KEY = "EP3QKE-3YL22GEG55";  // Your API key

    function getMathSolution(question, callback) {
        const query = encodeURIComponent(question);
        const apiUrl = "https://api.wolframalpha.com/v2/query?input=" + query + 
                       "&format=plaintext&output=JSON&appid=" + WOLFRAM_API_KEY;

        GM_xmlhttpRequest({
            method: "GET",
            url: apiUrl,
            onload: function(response) {
                try {
                    var data = JSON.parse(response.responseText);
                    if (data.queryresult.success) {
                        var answer = (data.queryresult.pods && data.queryresult.pods[1] &&
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
            }
        });
    }

    function findMathQuestions() {
        var questions = document.querySelectorAll(".question-text"); // Adjust selector if needed
        questions.forEach(function(questionElement) {
            var questionText = questionElement.innerText.trim();
            getMathSolution(questionText, function(answer) {
                var answerDiv = document.createElement("div");
                answerDiv.style.color = "green";
                answerDiv.style.fontWeight = "bold";
                answerDiv.innerText = "Answer: " + answer;
                questionElement.appendChild(answerDiv);
            });
        });
    }

    setTimeout(findMathQuestions, 3000); // Wait for page to load
})();
