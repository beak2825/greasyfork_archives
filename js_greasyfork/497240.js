// ==UserScript==
// @name         W101 Trivia
// @namespace    https://github.com/Jan-Fcloud/W101-TriviaAnswers
// @version      1.0
// @description  Highlight the correct answer in the Wizard101 Trivia game
// @author       Jan-FCloud
// @match        https://www.wizard101.com/quiz/trivia/game*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @require      https://code.jquery.com/jquery-3.7.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/497240/W101%20Trivia.user.js
// @updateURL https://update.greasyfork.org/scripts/497240/W101%20Trivia.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Override the .fadeIn css animation to last 0 seconds
    $("<style type='text/css'> .fadeIn { animation: fadeIn 0s; } </style>").appendTo("head");

    // Append the class fadeIn to each .answer element, and add visibility: visible to each elements style
    $(".answer").each(function (index, element) {
        $(element).addClass("fadeIn");
        $(element).css("visibility", "visible");
    });

    // Add the class fadeIn and kiaccountsbuttongreen to the #nextQuestion element, and add visibility: visible to the elements style
    $("#nextQuestion").addClass("fadeIn");
    $("#nextQuestion").addClass("kiaccountsbuttongreen");
    $("#nextQuestion").css("visibility", "visible");

    // Fetch and Parse the JSON from https://raw.githubusercontent.com/Jan-Fcloud/W101-TriviaAnswers/main/answers.json

    $.getJSON("https://raw.githubusercontent.com/Jan-Fcloud/W101-TriviaAnswers/main/answers.json", function (data) {
        console.log(data);

        let triviaPages = [
            "https://www.wizard101.com/quiz/trivia/game/english-trivia",
            "https://www.wizard101.com/quiz/trivia/game/kingsisle-trivia",
            "https://www.wizard101.com/quiz/trivia/game/educational-trivia",
            "https://www.wizard101.com/quiz/trivia/game/fun-trivia",
            "https://www.wizard101.com/game/trivia"
        ];

        // Check if the current href is one of the triviaPages

        if (window.location.href === triviaPages[0] || window.location.href === triviaPages[1] || window.location.href === triviaPages[2] || window.location.href === triviaPages[3] || window.location.href === triviaPages[4]) {
            // Get all text from the table .darkerparchment_header and get the text from the H2 of each 2nd td element
            let quizTitles = $(".darkerparchment_header").find("td:nth-child(2) h2");

            // Loop through all the quizTitles and check if the title is in the quizData

            quizTitles.each(function (index, element) {
                let quizTitle = $(element).text().trim();
                console.log(quizTitle.replace("Trivia", ""));

                // Find the quizTitle in the quizData, if found, highlight the tittle with green
                if (data[quizTitle.replace("Trivia", "").trim()]) {
                    $(element).css("background-color", "green");
                }
            });

        } else {
            // Next get the Quiz title from the website url which is after "https://www.wizard101.com/quiz/trivia/game/"
            let quizTitle = window.location.href.split("https://www.wizard101.com/quiz/trivia/game/")[1];

            // remove every minus sign from the quiz title
            quizTitle = quizTitle.replace(/-/g, " ");

            // remove the word trivia from the quiz title
            quizTitle = quizTitle.replace("trivia", "");

            // Change all starts of words in title to uppercase
            quizTitle = quizTitle.replace(/\b\w/g, l => l.toUpperCase());

            // Remove any spaces at the end of the quiz title
            quizTitle = quizTitle.trim();

            // Get the trivia question from the div .quizQuestion
            let question = $(".quizQuestion").text();

            let answer = "";

            // Find the question in the quizData
            data[quizTitle].forEach(qElement => {
                if (qElement[0].toUpperCase() === question.toUpperCase() || qElement[0].toUpperCase() === question.toUpperCase() + "?") {
                    console.log(qElement);

                    // Find the found answer in the answers on the website
                    let answers = $(".answerText");
                    console.log(answers);

                    answers.each(function (index, element) {
                        var elementText = $(element).text().trim();
                        console.log(elementText);
                        if (elementText === qElement[1].trim()) {
                            console.log("Found answer");
                            $(element).css("background-color", "green");

                            return true;
                        } else {
                            console.log("Not answer");
                            console.log("qElement: " + qElement[1]);
                            console.log("element: " + elementText);
                        }
                    });

                }
            });
        }

    });


})();
