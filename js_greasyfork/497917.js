// ==UserScript==
// @name         ExamTopic Print
// @namespace    http://tampermonkey.net/
// @version      2024-09-19
// @description  Print function for ExamTopics
// @author       You
// @icon         https://cdn-icons-png.flaticon.com/512/839/839184.png
// @match        https://www.examtopics.com/*
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/497917/ExamTopic%20Print.user.js
// @updateURL https://update.greasyfork.org/scripts/497917/ExamTopic%20Print.meta.js
// ==/UserScript==

function getVoteSummary(element) {
    var voteBars = element.getElementsByClassName("vote-bar");
    var summary = {};
    var totalVotes = 0;

    for (var i = 0; i < voteBars.length; i++) {
        var voteBar = voteBars[i];
        var tooltipText = voteBar.getAttribute("data-original-title");
        var votes;

        if (tooltipText.includes("%")) {
            var percentage = parseFloat(tooltipText);
            votes = Math.round((percentage / 100) * totalVotes);
        } else {
            votes = parseInt(tooltipText);
        }

        if (!isNaN(votes)) {
            var option = voteBar.textContent.trim();
            summary[option] = votes;
            totalVotes += votes;
        }
    }

    return {
        total: totalVotes,
        votes: summary,
    };
}

function extractQuestionNumber(str) {
    const match = str.match(/question (\d+)/);
    if (match) {
        return "question_" + match[1];
    } else {
        return "something_wrong_in_parse_title";
    }
}

function createWindow(clonedElement) {
    var mywindow = window.open("", "PRINT", "height=1754,width=1240");

    var commonStyles = `
        <style type="text/css">
            .discussion-header-container {
                font-family: Arial !important;
            }
            .comments-container .comment-content{
                font-family: Arial !important;
            }
            @media print {
                @page {
                    margin-left: 1.25in;
                    margin-right: 1.25in;
                }
            }
        </style>`;

    mywindow.document.write(`
          <html>
          <head>
          <title>${extractQuestionNumber(document.title)}</title>
          ${commonStyles}`);

    Array.prototype.forEach.call(document.styleSheets, function (sheet) {
        mywindow.document.write(
            `<link rel="stylesheet" href="${sheet.href}" type="text/css" />`
    );
  });

    mywindow.document.write(`
          </head>
          <body>
          ${clonedElement.innerHTML}
          </body>
          </html>`);
    return mywindow;
}

function printFunction() {
    var selectedElement = document.querySelectorAll(".col-12")[1];
    var clonedElement = selectedElement.cloneNode(true);

    // calculate vote
    const voteSummary = getVoteSummary(clonedElement);

    console.log(voteSummary);

    let voteSummaryDiv = document.createElement("div");

    // Create HTML content
    let voteSummaryHTML = `<b>Total: ${voteSummary.total}</b><ul>`;
    for (let voteType in voteSummary.votes) {
        voteSummaryHTML += `<li>${voteType}: ${voteSummary.votes[voteType]}</li>`;
    }
    voteSummaryHTML += "</ul>";

    // Set the HTML content to the new div
    voteSummaryDiv.innerHTML = voteSummaryHTML;

    // Append the new div to the last element with class 'question-answer'
    let questionAnswerElements =
        clonedElement.getElementsByClassName("question-answer");
    let lastQuestionAnswerElement =
        questionAnswerElements[questionAnswerElements.length - 1];
    lastQuestionAnswerElement.appendChild(voteSummaryDiv);

    var listItemElements = clonedElement.querySelectorAll("li");
    listItemElements.forEach(function (listItem) {
        listItem.className = "multi-choice-item";
    });

    var garbege = [
        ".all-questions-link",
        ".correct-answer-box",
        ".disclaimer-box",
        "span.badge.badge-success.most-voted-answer-badge",
        ".correct-answer",
        ".vote-answer-button",
        ".voting-summary",
    ];

    garbege.forEach(function (selector) {
        var elements = clonedElement.querySelectorAll(selector);
        elements.forEach(function (element) {
            element.parentNode.removeChild(element);
        });
    });


    var mywindow = createWindow(clonedElement);
    mywindow.print();
}

function createButton() {
    var printButton = document.createElement("button");
    printButton.innerHTML = "Print";
    printButton.style.marginLeft = "10px";
    printButton.onclick = printFunction;

    var correctAnswerBox = document.querySelector(".correct-answer-box br");
    correctAnswerBox.parentNode.insertBefore(printButton, correctAnswerBox);
}

(function () {
    "use strict";
    window.addEventListener("load", createButton, false);
})();
